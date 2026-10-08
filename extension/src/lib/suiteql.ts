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
export async function fetchScriptCode(scriptId: string): Promise<{
  code: string
  error?: string
  access: "readable" | "no_file" | "restricted" | "protected" | "unknown"
}> {
  try {
    const numericId = Number(scriptId)
    if (!Number.isFinite(numericId)) return { code: "", error: "Invalid script id.", access: "restricted" }

    const { protocol, hostname, origin } = window.location
    const restBase = `${protocol}//${hostname}/services/rest`

    const looksLikeSource = (text: string) => {
      const sample = text.slice(0, 12000)
      return (
        /@NApiVersion|@NScriptType|\bnlapi[A-Z]|\bdefine\s*\(|\brequire\s*\(|\bfunction\s+[A-Za-z_$]/.test(sample) ||
        (/\bconst\b|\blet\b|\bvar\b/.test(sample) && /[;{}]/.test(sample))
      )
    }

    const extractSourceFromHtml = (html: string): string => {
      try {
        const doc = new DOMParser().parseFromString(html, "text/html")
        const candidates = Array.from(doc.querySelectorAll("textarea, pre, code"))
          .map((el) => (el.textContent || "").trim())
          .filter((text) => text.length >= 30)
          .sort((a, b) => b.length - a.length)
        return candidates.find(looksLikeSource) || ""
      } catch {
        return ""
      }
    }

    const classifyHtml = (html: string): "restricted" | "protected" => {
      const sample = html.slice(0, 20000).toLowerCase()
      if (/insufficient permission|permission violation|access denied|not authorized|not authorised|you do not have permission|privilege/.test(sample)) {
        return "restricted"
      }
      return "protected"
    }

    const readResponse = async (res: Response) => {
      const text = await res.text()
      const contentType = (res.headers.get("content-type") || "").toLowerCase()
      const isHtml = contentType.includes("text/html") || /^\s*<!doctype html|^\s*<html/i.test(text)
      if (res.ok && text.trim() && !isHtml) {
        // A successful HTTP response can still be a NetSuite error payload.
        if (!contentType.includes("json") && looksLikeSource(text)) {
          return { code: text, access: "readable" as const }
        }
        return { code: "", access: classifyHtml(text) }
      }
      if (res.ok && isHtml) {
        const embedded = extractSourceFromHtml(text)
        if (embedded) return { code: embedded, access: "readable" as const }
        return { code: "", access: classifyHtml(text) }
      }
      if (res.status === 401 || res.status === 403) return { code: "", access: "restricted" as const }
      if (res.status === 429 || res.status >= 500) return { code: "", access: "unknown" as const }
      return { code: "", access: "protected" as const }
    }

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

    const queryRes = await fetch(`${restBase}/query/v1/suiteql?limit=1&offset=0`, {
      method: "POST", headers: { "Content-Type": "application/json", prefer: "transient" }, credentials: "include",
      body: JSON.stringify({ q: metadataQuery }),
    })

    if (queryRes.ok) {
      const queryData = await queryRes.json()
      const row = queryData?.items?.[0]
      fileId = row?.fileid ?? row?.scriptfile ?? null
      fileUrl = typeof row?.fileurl === "string" ? row.fileurl.trim() : ""
    } else {
      const fallbackQuery = await fetch(`${restBase}/query/v1/suiteql?limit=1&offset=0`, {
        method: "POST", headers: { "Content-Type": "application/json", prefer: "transient" }, credentials: "include",
        body: JSON.stringify({ q: `SELECT scriptfile FROM script WHERE id = ${numericId}` }),
      })
      if (!fallbackQuery.ok) {
        return { code: "", access: fallbackQuery.status === 401 || fallbackQuery.status === 403 ? "restricted" : "unknown", error: `NetSuite could not read script metadata (HTTP ${fallbackQuery.status}).` }
      }
      const data = await fallbackQuery.json()
      fileId = data?.items?.[0]?.scriptfile ?? null
    }

    if (!fileId) return { code: "", error: "This script has no attached source file.", access: "no_file" }

    if (fileUrl) {
      try {
        const resolved = new URL(fileUrl, origin)
        if (resolved.hostname === hostname || resolved.hostname.endsWith(".netsuite.com")) {
          const fileRes = await fetch(resolved.toString(), { credentials: "include", headers: { Accept: "text/plain, application/javascript, */*" } })
          const read = await readResponse(fileRes)
          if (read.code) return read
          if (read.access === "restricted") return { code: "", access: "restricted", error: `NetSuite denied access to source file ${fileId}. Try an authorized role or paste authorized source manually.` }
        }
      } catch {}
    }

    try {
      const recordPage = await fetch(`${origin}/app/common/media/mediaitem.nl?id=${encodeURIComponent(String(fileId))}`, { credentials: "include" })
      if (recordPage.ok) {
        const html = await recordPage.text()
        const embedded = extractSourceFromHtml(html)
        if (embedded) return { code: embedded, access: "readable" }
        const doc = new DOMParser().parseFromString(html, "text/html")
        const mediaLink = Array.from(doc.querySelectorAll<HTMLElement>("[href], [src]"))
          .map((el) => el.getAttribute("href") || el.getAttribute("src") || "")
          .find((value) => value.includes("/core/media/media.nl?"))
        if (mediaLink) {
          const resolvedMedia = new URL(mediaLink, origin)
          if (resolvedMedia.hostname === hostname || resolvedMedia.hostname.endsWith(".netsuite.com")) {
            const resolvedRes = await fetch(resolvedMedia.toString(), { credentials: "include", headers: { Accept: "text/plain, application/javascript, */*" } })
            const read = await readResponse(resolvedRes)
            if (read.code) return read
            if (read.access === "restricted") return { code: "", access: "restricted", error: `NetSuite denied access to source file ${fileId}. Try an authorized role or paste authorized source manually.` }
          }
        }
        if (classifyHtml(html) === "restricted") return { code: "", access: "restricted", error: `The current NetSuite role cannot read source file ${fileId}. Try an authorized role or paste authorized source manually.` }
      }
    } catch {}

    const mediaRes = await fetch(`${origin}/core/media/media.nl?id=${encodeURIComponent(String(fileId))}`, {
      credentials: "include", headers: { Accept: "text/plain, application/javascript, */*" },
    })
    const read = await readResponse(mediaRes)
    if (read.code) return read
    if (read.access === "restricted") return { code: "", access: "restricted", error: `The current NetSuite role cannot read source file ${fileId}. Try an authorized role or paste authorized source manually.` }

    return {
      code: "",
      access: "protected",
      error: `Source file ${fileId} is present but NetSuite returned a protected/inaccessible page instead of JavaScript. This can happen with vendor-hidden SuiteBundle/SuiteApp source or other File Cabinet restrictions. SuiteMigrate will not bypass source protection. Use an authorized source copy, request a 2.1 update from the vendor, or keep this script as a migration blocker.`,
    }
  } catch (err) {
    return { code: "", access: "unknown", error: err instanceof Error ? err.message : "Could not retrieve script source." }
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
      sourceAccess: row.scriptfile ? "unknown" : "no_file",
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
