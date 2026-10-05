/**
 * SuiteQL scanner — reads scripts from active NetSuite session
 *
 * fetchScriptCode runs inside the active NetSuite tab and prefers the
 * authenticated File Cabinet URL returned by NetSuite itself.
 *
 * Item 4 fix: runSuiteQL now paginates with offset until no more rows.
 *
 * Item 4 fix: needsMigration rule is now centralised in isLegacyVersion().
 *   Only "2.1" is done; "1.0", "2.0", "2.x" and anything else needs migration.
 *   The inconsistent "2" special-case is removed.
 */

import type { NSScript } from "./types"

// ── Helpers ──────────────────────────────────────────────────────────────────

export function detectAccountId(): string | null {
  const host = window.location.hostname
  const match = host.match(/^([a-z0-9_-]+)\.(?:app\.)?netsuite\.com/i)
  return match ? match[1] : host.split(".")[0] || null
}

export function detectAccountName(): string {
  const el = document.querySelector('[data-componentid="ns_header_company_name"]')
  if (el?.textContent) return el.textContent.trim()
  return document.title.split(" - ")[0] || "My NetSuite Account"
}

function getRestBase(): string {
  const { protocol, hostname } = window.location
  return `${protocol}//${hostname}/services/rest`
}

/**
 * Item 4: Centralised version check.
 * "2.1" is the only version that does NOT need migration.
 * "1.0", "2.0", "2.x", "" or any unknown version needs migration.
 */
export function isLegacyVersion(apiVersion: string): boolean {
  const v = (apiVersion || "").trim()
  return v !== "2.1"
}

export function getRiskLevel(apiVersion: string): NSScript["riskLevel"] {
  const v = (apiVersion || "").trim()
  if (v === "1.0" || v === "1") return "HIGH"
  if (v.startsWith("2.0") || v.startsWith("2.x")) return "MEDIUM"
  if (v === "2.1") return "NONE"
  // Unknown / empty — treat as high risk
  return "HIGH"
}

// ── SuiteQL runner with pagination ───────────────────────────────────────────

const PAGE_SIZE = 1000

/**
 * Item 4: Paginated SuiteQL runner.
 * Fetches pages until the response contains fewer rows than PAGE_SIZE.
 */
async function runSuiteQL(baseQuery: string): Promise<Record<string, string>[]> {
  const url = `${getRestBase()}/query/v1/suiteql`
  const all: Record<string, string>[] = []
  let offset = 0

  while (true) {
    const res = await fetch(`${url}?limit=${PAGE_SIZE}&offset=${offset}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", prefer: "transient" },
      credentials: "include",
      body: JSON.stringify({ q: baseQuery }),
    })

    if (!res.ok) {
      throw new Error(`SuiteQL error: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    const items: Record<string, string>[] = data.items || []
    all.push(...items)

    // Stop when we got fewer rows than the page size
    if (items.length < PAGE_SIZE) break
    offset += PAGE_SIZE
  }

  return all
}

// ── Script code fetcher ───────────────────────────────────────────────────────

/**
 * Item 3 fix: fetch the source code for a script record.
 *
 * Strategy:
 *   1. SuiteQL: read scriptfile and the File Cabinet URL returned by NetSuite
 *   2. Fetch NetSuite's own authenticated file URL in the active NetSuite tab
 *   3. Fall back to the same-origin media.nl route only when necessary
 *
 * This avoids constructing the REST document-service URL on the UI host.
 */
export async function fetchScriptCode(scriptId: string): Promise<{ code: string; error?: string }> {
  // IMPORTANT: this function is passed to chrome.scripting.executeScript.
  // It must remain completely self-contained: no imports or outer-scope helpers.
  try {
    const numericId = Number(scriptId)
    if (!Number.isFinite(numericId)) {
      return { code: "", error: "Invalid script id." }
    }

    const { protocol, hostname, origin } = window.location
    const restBase = `${protocol}//${hostname}/services/rest`

    // Prefer the File Cabinet URL NetSuite returns for the attached script file.
    // This avoids guessing a REST document-service URL on the UI host.
    const metadataQuery = `
      SELECT
        s.scriptfile AS fileid,
        f.name AS filename,
        f.url AS fileurl
      FROM script s
      LEFT JOIN File f ON f.id = s.scriptfile
      WHERE s.id = ${numericId}
    `

    let fileId: string | number | null = null
    let fileUrl = ""
    let metadataStatus = 0

    const queryRes = await fetch(`${restBase}/query/v1/suiteql?limit=1&offset=0`, {
      method: "POST",
      headers: { "Content-Type": "application/json", prefer: "transient" },
      credentials: "include",
      body: JSON.stringify({ q: metadataQuery }),
    })

    metadataStatus = queryRes.status

    if (queryRes.ok) {
      const queryData = await queryRes.json()
      const row = queryData?.items?.[0]
      fileId = row?.fileid ?? row?.scriptfile ?? null
      fileUrl = typeof row?.fileurl === "string" ? row.fileurl.trim() : ""
    } else {
      // Some roles may not expose the File join. Fall back to scriptfile only.
      const fallbackQuery = await fetch(`${restBase}/query/v1/suiteql?limit=1&offset=0`, {
        method: "POST",
        headers: { "Content-Type": "application/json", prefer: "transient" },
        credentials: "include",
        body: JSON.stringify({
          q: `SELECT scriptfile FROM script WHERE id = ${numericId}`,
        }),
      })

      metadataStatus = fallbackQuery.status
      if (!fallbackQuery.ok) {
        return {
          code: "",
          error: `NetSuite could not read script metadata (HTTP ${fallbackQuery.status}). Check SuiteAnalytics/SuiteQL access for the current role.`,
        }
      }

      const data = await fallbackQuery.json()
      fileId = data?.items?.[0]?.scriptfile ?? null
    }

    if (!fileId) {
      return { code: "", error: "This script has no attached source file." }
    }

    const looksLikeLoginOrErrorHtml = (text: string) =>
      /^\s*<!doctype html|^\s*<html/i.test(text) ||
      /page not found|login|session timed out/i.test(text.slice(0, 1200))

    // 1) Best path: use the URL NetSuite itself provides for the File Cabinet item.
    if (fileUrl) {
      try {
        const resolved = new URL(fileUrl, origin)
        if (resolved.hostname === hostname || resolved.hostname.endsWith(".netsuite.com")) {
          const fileRes = await fetch(resolved.toString(), {
            credentials: "include",
            headers: { Accept: "text/plain, application/javascript, */*" },
          })
          const text = await fileRes.text()
          if (fileRes.ok && text.trim() && !looksLikeLoginOrErrorHtml(text)) {
            return { code: text }
          }

          if (fileRes.status === 401 || fileRes.status === 403) {
            return {
              code: "",
              error: `NetSuite denied access to source file ${fileId} (HTTP ${fileRes.status}). Use a role with access to the script\'s File Cabinet folder.`,
            }
          }
        }
      } catch {
        // Continue to the same-origin media fallback below.
      }
    }

    // 2) Resolve the authenticated File Cabinet record page. NetSuite often
    // renders the real media URL here with account/hash parameters.
    try {
      const recordPage = await fetch(
        `${origin}/app/common/media/mediaitem.nl?id=${encodeURIComponent(String(fileId))}`,
        { credentials: "include" }
      )

      if (recordPage.ok) {
        const html = await recordPage.text()
        const doc = new DOMParser().parseFromString(html, "text/html")
        const mediaLink = Array.from(doc.querySelectorAll<HTMLElement>("[href], [src]"))
          .map((el) => el.getAttribute("href") || el.getAttribute("src") || "")
          .find((value) => value.includes("/core/media/media.nl?"))

        if (mediaLink) {
          const resolvedMedia = new URL(mediaLink, origin)
          if (resolvedMedia.hostname === hostname || resolvedMedia.hostname.endsWith(".netsuite.com")) {
            const resolvedRes = await fetch(resolvedMedia.toString(), {
              credentials: "include",
              headers: { Accept: "text/plain, application/javascript, */*" },
            })
            const resolvedText = await resolvedRes.text()

            if (resolvedRes.ok && resolvedText.trim() && !looksLikeLoginOrErrorHtml(resolvedText)) {
              return { code: resolvedText }
            }

            if (resolvedRes.status === 401 || resolvedRes.status === 403) {
              return {
                code: "",
                error: `NetSuite denied access to source file ${fileId} (HTTP ${resolvedRes.status}). Use a role with access to the script's File Cabinet folder.`,
              }
            }
          }
        }
      }
    } catch {
      // Continue to the simple same-origin fallback below.
    }

    // 3) Same-origin fallback for accounts where media.nl works without a hash.
    const mediaUrl = `${origin}/core/media/media.nl?id=${encodeURIComponent(String(fileId))}`
    const mediaRes = await fetch(mediaUrl, {
      credentials: "include",
      headers: { Accept: "text/plain, application/javascript, */*" },
    })
    const mediaText = await mediaRes.text()

    if (mediaRes.ok && mediaText.trim() && !looksLikeLoginOrErrorHtml(mediaText)) {
      return { code: mediaText }
    }

    if (mediaRes.status === 404) {
      return {
        code: "",
        error:
          `NetSuite returned HTTP 404 for source file ${fileId}. ` +
          "The script record points to a file, but the current role/account did not provide a usable authenticated File Cabinet URL. " +
          "Open the script file in NetSuite with the same role to confirm access, then try again.",
      }
    }

    return {
      code: "",
      error:
        `Could not retrieve NetSuite source file ${fileId} ` +
        `(metadata HTTP ${metadataStatus}, file HTTP ${mediaRes.status}). ` +
        "Check the current role\'s File Cabinet access and try again.",
    }
  } catch (err) {
    return {
      code: "",
      error: err instanceof Error ? err.message : "Could not retrieve script source.",
    }
  }
}

// ── Main scanner ──────────────────────────────────────────────────────────────

export async function scanScripts(): Promise<NSScript[]> {
  // Item 4: include scriptfile so we know which scripts have code to fetch
  const query = `
    SELECT
      s.id,
      s.name,
      s.scripttype,
      s.apiversion,
      s.description,
      s.scriptfile
    FROM script s
    WHERE s.isinactive = 'F'
    ORDER BY s.name, s.id
  `

  const rows = await runSuiteQL(query)

  return rows.map((row): NSScript => {
    const apiVersion = (row.apiversion || "1.0").trim()
    return {
      id: row.id,
      name: row.name || "Unnamed Script",
      scriptType: formatScriptType(row.scripttype || ""),
      apiVersion,
      description: row.description || "",
      riskLevel: getRiskLevel(apiVersion),
      // Item 4: single consistent rule — only "2.1" is done
      needsMigration: isLegacyVersion(apiVersion),
      hasFile: !!row.scriptfile,
    }
  })
}

function formatScriptType(raw: string): string {
  const map: Record<string, string> = {
    USEREVENT: "UserEvent",
    SUITELET: "Suitelet",
    SCHEDULED: "ScheduledScript",
    MAPREDUCE: "MapReduce",
    CLIENT: "ClientScript",
    RESTLET: "RESTlet",
    PORTLET: "Portlet",
    MASSUPDATE: "MassUpdate",
    CUSTOMGLLINES: "GL Lines",
    WORKFLOW: "Workflow Action",
    BUNDLEINSTALLATION: "Bundle Install",
  }
  return map[raw.toUpperCase()] || raw
}
