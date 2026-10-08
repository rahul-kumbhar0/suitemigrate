/**
 * Automatic source accessibility audit for scanned legacy NetSuite scripts.
 *
 * A single user action starts a conservative, sequential read-only check.
 * Progress and labels persist in chrome.storage.local. Script source is
 * discarded immediately and is never stored or uploaded during this audit.
 */
import { fetchScriptCode } from "../lib/suiteql"
import { isNetSuiteUrl } from "../lib/netsuite-tab"
import type { NSAccount, NSScript } from "../lib/types"
import type { AccessAuditState } from "../lib/storage"

const running = new Set<string>()
const stopping = new Set<string>()
const WAIT_MS = 300

function wait(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}

async function readAudit(accountId: string): Promise<AccessAuditState | undefined> {
  const data = await chrome.storage.local.get("accessAudits")
  return (data.accessAudits as Record<string, AccessAuditState> | undefined)?.[accountId]
}

async function saveAudit(accountId: string, patch: Partial<AccessAuditState>): Promise<void> {
  const data = await chrome.storage.local.get("accessAudits")
  const audits: Record<string, AccessAuditState> = data.accessAudits || {}
  audits[accountId] = {
    ...audits[accountId],
    ...patch,
    updatedAt: new Date().toISOString(),
  } as AccessAuditState
  await chrome.storage.local.set({ accessAudits: audits })
}

async function resolveAccount(accountId: string): Promise<NSAccount | null> {
  const data = await chrome.storage.local.get("accounts")
  return (data.accounts as Record<string, NSAccount> | undefined)?.[accountId] || null
}

async function updateScriptAccess(
  accountId: string,
  scriptId: string,
  status: NonNullable<NSScript["sourceAccess"]>,
  note: string
): Promise<void> {
  const data = await chrome.storage.local.get("accounts")
  const accounts: Record<string, NSAccount> = data.accounts || {}
  const account = accounts[accountId]
  if (!account) throw new Error("Saved NetSuite scan not found.")

  accounts[accountId] = {
    ...account,
    scripts: account.scripts.map(script =>
      script.id === scriptId
        ? { ...script, sourceAccess: status, sourceAccessNote: note }
        : script
    ),
  }
  await chrome.storage.local.set({ accounts })
}

export async function startSourceAudit(accountId: string, tabId: number): Promise<void> {
  if (running.has(accountId)) return
  running.add(accountId)
  stopping.delete(accountId)

  try {
    const tab = await chrome.tabs.get(tabId)
    if (!isNetSuiteUrl(tab.url)) {
      throw new Error("Open your NetSuite tab and rescan before checking source access.")
    }

    // Never use the existing saved account from a different NetSuite tenant.
    const hostAccountId = new URL(tab.url!).hostname.split(".")[0].toLowerCase()
    if (hostAccountId !== accountId.toLowerCase()) {
      throw new Error("The scanned account and active NetSuite tab do not match.")
    }

    const account = await resolveAccount(accountId)
    if (!account) throw new Error("Scan the NetSuite account first.")

    const candidates = account.scripts.filter(script =>
      script.needsMigration &&
      script.sourceAccess !== "readable" &&
      script.sourceAccess !== "protected" &&
      script.sourceAccess !== "restricted" &&
      script.sourceAccess !== "manual" &&
      script.sourceAccess !== "no_file"
    )
    const total = account.scripts.filter(script => script.needsMigration && script.hasFile !== false).length
    const checked = Math.max(0, total - candidates.length)
    await saveAudit(accountId, {
      state: "running", checked, total, tabId,
      lastError: undefined,
    })

    let inspected = 0
    let consecutiveTransientFailures = 0
    for (const script of candidates) {
      if (stopping.has(accountId)) {
        await saveAudit(accountId, { state: "paused", lastError: "Audit paused. Resume when ready." })
        return
      }

      // Revalidate the tenant and tab before each attempt, including after
      // extension service-worker restarts or NetSuite navigation.
      const currentTab = await chrome.tabs.get(tabId)
      if (!isNetSuiteUrl(currentTab.url) ||
          new URL(currentTab.url!).hostname.split(".")[0].toLowerCase() !== accountId.toLowerCase()) {
        throw new Error("NetSuite tab changed. Return to the scanned account and resume.")
      }

      let access: NonNullable<NSScript["sourceAccess"]> = "unknown"
      let note = "Source access could not be verified."
      try {
        const response = await chrome.scripting.executeScript({
          target: { tabId },
          func: fetchScriptCode,
          args: [script.id],
        })
        const result = response?.[0]?.result as Awaited<ReturnType<typeof fetchScriptCode>> | null
        if (!result) throw new Error("NetSuite did not return a source response.")

        access = result.code ? "readable" : result.access
        note = access === "readable" ? "Source verified using your current NetSuite role." :
          (result.error || "NetSuite did not return readable JavaScript source.")
      } catch (error) {
        note = error instanceof Error ? error.message : "NetSuite source check failed."
      }

      await updateScriptAccess(accountId, script.id, access, note)
      inspected += 1
      await saveAudit(accountId, { checked: checked + inspected, total })

      if (access === "unknown") {
        consecutiveTransientFailures += 1
        // Stop when a session has expired or NetSuite is refusing repeated
        // checks; do not hammer the API or declare unknown scripts locked.
        if (consecutiveTransientFailures >= 5) {
          await saveAudit(accountId, {
            state: "paused",
            lastError: "Several source checks could not be verified. Recheck your NetSuite session, then resume.",
          })
          return
        }
        await wait(900)
      } else {
        consecutiveTransientFailures = 0
        await wait(WAIT_MS)
      }
    }

    await saveAudit(accountId, { state: "complete", checked: total, total })
  } catch (error) {
    await saveAudit(accountId, {
      state: "paused",
      lastError: error instanceof Error ? error.message : "Source audit interrupted. Resume to continue.",
    })
  } finally {
    running.delete(accountId)
    stopping.delete(accountId)
  }
}

export function pauseSourceAudit(accountId: string): void {
  stopping.add(accountId)
}
