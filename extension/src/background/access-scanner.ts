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
const WAIT_MS = 350
const BATCH_SIZE = 15
export const AUDIT_ALARM = "suitemigrate:source-audit"

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
  // A repeating Chrome alarm wakes the MV3 service worker if Chrome
  // suspends a long scan. Completed/paused scans clear the alarm.
  await chrome.alarms.create(AUDIT_ALARM, { periodInMinutes: 1 })

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

    let classified = checked
    let consecutiveTransientFailures = 0
    for (const script of candidates.slice(0, BATCH_SIZE)) {
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
      if (access !== "unknown") classified += 1
      await saveAudit(accountId, { checked: classified, total })

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

    // Continue the next batch on the next alarm. No popup has to remain open.
    if (candidates.length > BATCH_SIZE) {
      await saveAudit(accountId, { state: "running", checked: classified, total })
      return
    }

    const finishedAccount = await resolveAccount(accountId)
    const stillUnknown = finishedAccount?.scripts.filter(script =>
      script.needsMigration && (!script.sourceAccess || script.sourceAccess === "unknown")
    ).length ?? 0

    if (stillUnknown > 0) {
      await saveAudit(accountId, {
        state: "paused",
        checked: classified,
        total,
        lastError: `${stillUnknown} scripts could not be verified. Retry when your NetSuite session is ready.`,
      })
    } else {
      await saveAudit(accountId, { state: "complete", checked: total, total, lastError: undefined })
    }
  } catch (error) {
    await saveAudit(accountId, {
      state: "paused",
      lastError: error instanceof Error ? error.message : "Source audit interrupted. Resume to continue.",
    })
  } finally {
    running.delete(accountId)
    stopping.delete(accountId)
    const latest = await readAudit(accountId)
    if (latest?.state !== "running") {
      await chrome.alarms.clear(AUDIT_ALARM)
    }
  }
}

/** Wake pending work after an MV3 service worker restart. */
export async function resumeRunningAudits(): Promise<void> {
  const saved = await chrome.storage.local.get("accessAudits")
  const audits = (saved.accessAudits || {}) as Record<string, AccessAuditState>
  for (const [accountId, state] of Object.entries(audits)) {
    if (state.state === "running" && Number.isInteger(state.tabId)) {
      await startSourceAudit(accountId, state.tabId)
    }
  }
}

export async function pauseSourceAudit(accountId: string): Promise<void> {
  stopping.add(accountId)
  await saveAudit(accountId, {
    state: "paused",
    lastError: "Source check paused. Resume when you are ready.",
  })
  await chrome.alarms.clear(AUDIT_ALARM)
}
