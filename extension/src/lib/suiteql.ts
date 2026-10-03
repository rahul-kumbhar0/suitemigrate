/**
 * SuiteQL scanner — reads scripts from active NetSuite session
 *
 * Item 3 fix: fetchScriptCode now uses scripting.executeScript pattern
 *   (called from popup/DashboardView via inlined function, not content.js)
 *   and fetches file content via /core/media/media.nl?id=<fileId>
 *   with a REST fallback. [OWNER TO CONFIRM: test against real account — see E-1]
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
 *   1. SuiteQL: get the file internal ID from script.scriptfile
 *   2. Try /core/media/media.nl?id=<fileId>  (works with browser session)
 *   3. Fallback: /services/rest/platform/v1/record/file/<fileId>
 *
 * This function runs inside the NetSuite tab via scripting.executeScript,
 * so window.location is the active NetSuite page.
 * [OWNER TO CONFIRM] — see E-1 in CONTENT-TODO.md
 */
export async function fetchScriptCode(scriptId: string): Promise<{ code: string; error?: string }> {
  try {
    // Step 1: get file ID
    const rows = await runSuiteQL(
      `SELECT scriptfile FROM script WHERE id = ${Number(scriptId)}`
    )
    if (!rows.length || !rows[0].scriptfile) {
      return { code: "", error: "Script has no file attached (scriptfile is null)" }
    }

    const fileId = rows[0].scriptfile
    const { protocol, hostname } = window.location

    // Step 2: try media.nl (standard file cabinet download — works with cookie session)
    try {
      const mediaUrl = `${protocol}//${hostname}/core/media/media.nl?id=${fileId}&c=${detectAccountId()}&h=`
      const mediaRes = await fetch(mediaUrl, { credentials: "include" })
      if (mediaRes.ok) {
        const text = await mediaRes.text()
        if (text && !text.includes("<html")) {
          return { code: text }
        }
      }
    } catch {
      // Fall through to REST endpoint
    }

    // Step 3: REST record API fallback
    // [OWNER TO CONFIRM] this endpoint requires SuiteScript 2.1 record access
    const restUrl = `${getRestBase()}/platform/v1/record/file/${fileId}/content`
    const restRes = await fetch(restUrl, {
      credentials: "include",
      headers: { Accept: "text/plain, application/json" },
    })
    if (restRes.ok) {
      const text = await restRes.text()
      return { code: text }
    }

    return { code: "", error: `Could not fetch file ${fileId}: HTTP ${restRes.status}` }
  } catch (err) {
    return { code: "", error: String(err) }
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
    ORDER BY s.name
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
