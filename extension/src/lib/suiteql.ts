/**
 * SuiteQL scanner — reads scripts from active NetSuite session
 * Uses NetSuite REST API with the browser's existing session cookies
 */

import type { NSScript } from "./types"

/** Extract account ID from current NetSuite URL */
export function detectAccountId(): string | null {
  const host = window.location.hostname
  const match = host.match(/^([a-z0-9_-]+)\.(?:app\.)?netsuite\.com/i)
  return match ? match[1] : host.split(".")[0] || null
}

/** Extract account name from page */
export function detectAccountName(): string {
  // Try the company name from NetSuite header
  const el = document.querySelector('[data-componentid="ns_header_company_name"]')
  if (el?.textContent) return el.textContent.trim()
  // Fallback to title
  return document.title.split(" - ")[0] || "My NetSuite Account"
}

/** Get NetSuite REST base URL */
function getRestBase(): string {
  const { protocol, hostname } = window.location
  return `${protocol}//${hostname}/services/rest`
}

/** Run a SuiteQL query against the active NetSuite session */
async function runSuiteQL(query: string): Promise<Record<string, string>[]> {
  const url = `${getRestBase()}/query/v1/suiteql?limit=1000`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "prefer": "transient",
    },
    credentials: "include",
    body: JSON.stringify({ q: query }),
  })

  if (!res.ok) {
    throw new Error(`SuiteQL error: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  return data.items || []
}

/** Determine risk level based on API version */
function getRiskLevel(apiVersion: string): NSScript["riskLevel"] {
  if (apiVersion === "1.0" || apiVersion === "1") return "HIGH"
  if (apiVersion === "2.0" || apiVersion === "2") return "MEDIUM"
  return "NONE"
}

/** Fetch script code for a specific script record */
export async function fetchScriptCode(scriptId: string): Promise<string> {
  try {
    // Get the file ID from the script record
    const rows = await runSuiteQL(
      `SELECT scriptfile FROM script WHERE id = ${scriptId}`
    )
    if (!rows.length || !rows[0].scriptfile) return ""

    const fileId = rows[0].scriptfile

    // Fetch the file content via REST
    const url = `${getRestBase()}/platform/v1/record/file/${fileId}`
    const res = await fetch(url, {
      credentials: "include",
      headers: { Accept: "application/json" },
    })
    if (!res.ok) return ""

    const fileData = await res.json()
    return fileData.content || ""
  } catch {
    return ""
  }
}

/** Main scanner — fetches all scripts needing migration */
export async function scanScripts(): Promise<NSScript[]> {
  const query = `
    SELECT
      s.id,
      s.name,
      s.scripttype,
      s.apiversion,
      s.description
    FROM script s
    WHERE s.isinactive = 'F'
    ORDER BY s.name
  `

  const rows = await runSuiteQL(query)

  return rows.map((row): NSScript => {
    const apiVersion = row.apiversion || "1.0"
    const needsMigration = apiVersion !== "2.1" && apiVersion !== "2"
    return {
      id: row.id,
      name: row.name || "Unnamed Script",
      scriptType: formatScriptType(row.scripttype || ""),
      apiVersion,
      description: row.description || "",
      riskLevel: getRiskLevel(apiVersion),
      needsMigration,
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
