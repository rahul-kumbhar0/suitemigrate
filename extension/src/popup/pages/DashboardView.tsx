import { useState, useEffect, useCallback } from "react"
import { RefreshCw, ChevronDown, FileSearch, XCircle, Trash2 } from "lucide-react"
import Header from "../components/Header"
import { useStore } from "../../lib/store"
import { getAllAccounts, saveAccount, clearHistory } from "../../lib/storage"
import type { NSAccount, NSScript } from "../../lib/types"
import { isLegacyVersion, getRiskLevel } from "../../lib/suiteql"

// ── Inline scanner injected into the NetSuite tab ────────────────────────────
// Must be self-contained — no imports, no closure variables.
function inlineScanner() {
  const host = window.location.hostname
  const match = host.match(/^([a-z0-9_-]+)\.(?:app\.)?netsuite\.com/i)
  const accountId = match ? match[1] : host.split(".")[0] || null

  if (!accountId) {
    return { error: "Could not detect NetSuite account ID from URL: " + host }
  }

  const nameEl = document.querySelector('[data-componentid="ns_header_company_name"]')
  const accountName = nameEl?.textContent?.trim() || document.title.split(" - ")[0] || "NetSuite Account"
  const base = `${window.location.protocol}//${window.location.hostname}/services/rest`

  // Item 4: paginated SuiteQL, include scriptfile for code-fetch indicator
  async function fetchPage(offset: number): Promise<Record<string, string>[]> {
    const r = await fetch(`${base}/query/v1/suiteql?limit=1000&offset=${offset}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", prefer: "transient" },
      credentials: "include",
      body: JSON.stringify({
        q: `SELECT s.id, s.name, s.scripttype, s.apiversion, s.description, s.scriptfile FROM script s WHERE s.isinactive = 'F' ORDER BY s.name, s.id`,
      }),
    })
    if (!r.ok) throw new Error(`SuiteQL failed: ${r.status} ${r.statusText}`)
    const d = await r.json()
    return d.items || []
  }

  return (async () => {
    const typeMap: Record<string, string> = {
      USEREVENT: "UserEvent", SUITELET: "Suitelet", SCHEDULED: "ScheduledScript",
      MAPREDUCE: "MapReduce", CLIENT: "ClientScript", RESTLET: "RESTlet",
      PORTLET: "Portlet", MASSUPDATE: "MassUpdate", CUSTOMGLLINES: "GL Lines",
      WORKFLOW: "Workflow Action", BUNDLEINSTALLATION: "Bundle Install",
    }

    const all: Record<string, string>[] = []
    let offset = 0
    while (true) {
      const page = await fetchPage(offset)
      all.push(...page)
      if (page.length < 1000) break
      offset += 1000
    }

    const scripts = all.map((row) => {
      const apiVersion = (row.apiversion || "1.0").trim()
      // Item 4: consistent rule — only "2.1" is done
      const needsMigration = apiVersion !== "2.1"
      const riskLevel =
        apiVersion === "1.0" || apiVersion === "1" ? "HIGH" :
        apiVersion.startsWith("2.0") || apiVersion.startsWith("2.x") ? "MEDIUM" :
        apiVersion === "2.1" ? "NONE" : "HIGH"

      return {
        id: row.id,
        name: row.name || "Unnamed Script",
        scriptType: typeMap[(row.scripttype || "").toUpperCase()] || row.scripttype || "Unknown",
        apiVersion,
        description: row.description || "",
        riskLevel,
        needsMigration,
        hasFile: !!row.scriptfile,
        sourceAccess: row.scriptfile ? "unknown" : "no_file",
      }
    })

    return { accountId, accountName, scripts }
  })()
}

export default function DashboardView() {
  const { user, accounts, activeAccount, setAccounts, setActiveAccount, setView, isScanning, setScanning, setScanError, scanError } = useStore()
  const [showMenu, setShowMenu]         = useState(false)
  const [isNS, setIsNS]                 = useState(false)
  const [tabId, setTabId]               = useState<number | null>(null)
  const [scanStatus, setScanStatus]     = useState("")
  const [clearing, setClearing]         = useState(false)
  const [clearDone, setClearDone]       = useState(false)

  useEffect(() => {
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (chrome.runtime.lastError) return
        const url = tabs[0]?.url || ""
        setTabId(tabs[0]?.id ?? null)
        setIsNS(url.includes("netsuite.com") || url.includes("suitetapp.com"))
      })
    } catch {}
    getAllAccounts().then(a => setAccounts(a)).catch(() => {})
  }, [setAccounts])

  const handleScan = useCallback(async () => {
    if (!isNS || !tabId) return
    setScanning(true); setScanError(null); setScanStatus("Connecting…")

    try {
      setScanStatus("Running SuiteQL query…")
      const results = await chrome.scripting.executeScript({
        target: { tabId },
        func: inlineScanner,
      })

      const result = results?.[0]?.result as
        | { accountId: string; accountName: string; scripts: NSScript[] }
        | { error: string }
        | null

      if (!result)              { setScanError("No response from NetSuite tab."); return }
      if ("error" in result)    { setScanError(result.error); return }

      setScanStatus("Saving…")
      const account: NSAccount = {
        accountId: result.accountId,
        accountName: result.accountName,
        lastScannedAt: new Date().toISOString(),
        scripts: result.scripts,
        scriptsTotal: result.scripts.length,
        scriptsNeedingUpdate: result.scripts.filter(s => s.needsMigration).length,
      }
      await saveAccount(account)
      setActiveAccount(account)
      setAccounts(await getAllAccounts())
      setView("script_list")

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setScanError(msg.includes("Cannot access")
        ? "Cannot access this page. Make sure you are on a NetSuite tab."
        : `Scan failed: ${msg}`)
    } finally { setScanning(false); setScanStatus("") }
  }, [isNS, tabId, setScanning, setScanError, setActiveAccount, setAccounts, setView])

  // Item 6: Clear history
  const handleClearHistory = async () => {
    setClearing(true)
    await clearHistory()
    setAccounts([])
    setClearing(false)
    setClearDone(true)
    setTimeout(() => setClearDone(false), 2500)
  }

  const display  = activeAccount || accounts[0]
  const needsUpd = display?.scripts.filter(s => s.needsMigration).length || 0
  const blockers = display?.scripts.filter(s => ["no_file", "restricted", "protected"].includes(s.sourceAccess || "")).length || 0
  const onLatest = display?.scripts.filter(s => !s.needsMigration).length || 0

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Header />

      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>

        {/* Account card */}
        <div className="card" style={{ padding: "12px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p className="eyebrow" style={{ marginBottom: 3 }}>Active account</p>
              {display ? (
                <button onClick={() => setShowMenu(!showMenu)} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "var(--ink)", fontFamily: "var(--f-sans)", padding: 0 }}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>{display.accountName}</span>
                  <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--ink-mute)" }}>({display.accountId})</span>
                  {accounts.length > 1 && <ChevronDown size={12} style={{ color: "var(--ink-mute)", flexShrink: 0 }} />}
                </button>
              ) : (
                <p style={{ fontSize: 12, color: "var(--ink-soft)" }}>{isNS ? "Ready to scan" : "Open NetSuite to scan"}</p>
              )}
            </div>
            <button onClick={handleScan} disabled={isScanning || !isNS} className="btn-primary" style={{ fontSize: 11, padding: "6px 12px", flexShrink: 0 }}>
              {isScanning ? <><div className="spinner" style={{ width: 11, height: 11 }} /> Scanning…</> : <><RefreshCw size={11} /> Scan</>}
            </button>
          </div>

          {isScanning && scanStatus && (
            <p style={{ marginTop: 8, fontSize: 10.5, color: "var(--clay)", fontFamily: "var(--f-mono)" }}>{scanStatus}</p>
          )}

          {showMenu && accounts.length > 1 && (
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--rule)", display: "flex", flexDirection: "column", gap: 2 }}>
              {accounts.map(acc => (
                <button key={acc.accountId} onClick={() => { setActiveAccount(acc); setShowMenu(false) }}
                  style={{ width: "100%", textAlign: "left", padding: "6px 8px", borderRadius: 3, background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "var(--ink-soft)", fontFamily: "var(--f-sans)" }}>
                  {acc.accountName} ({acc.accountId})
                </button>
              ))}
            </div>
          )}

          {!isNS && (
            <p style={{ marginTop: 6, fontSize: 10.5, color: "var(--ink-mute)", fontFamily: "var(--f-mono)" }}>
              Navigate to a NetSuite tab first
            </p>
          )}
        </div>

        {/* Scan error */}
        {scanError && (
          <div className="card" style={{ padding: "10px 12px", borderColor: "rgba(217,74,31,.25)", background: "rgba(217,74,31,.04)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <XCircle size={13} style={{ color: "var(--clay)", flexShrink: 0, marginTop: 1 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--clay)", marginBottom: 3 }}>Scan Error</p>
                <p style={{ fontSize: 11, color: "var(--ink-soft)", lineHeight: 1.5 }}>{scanError}</p>
              </div>
              <button onClick={() => setScanError(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-mute)", fontSize: 16 }}>×</button>
            </div>
          </div>
        )}

        {/* Stats */}
        {display ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: "var(--rule)", border: "1px solid var(--rule)", borderRadius: 4, overflow: "hidden" }}>
            {[
              { label: "Total",       value: display.scriptsTotal, color: "var(--ink)" },
              { label: "Need Update", value: needsUpd,             color: "var(--clay)" },
              { label: "Blockers",    value: blockers,             color: blockers > 0 ? "#b45309" : "var(--ink-mute)" },
              { label: "On 2.1",      value: onLatest,             color: "#15803d" },
            ].map(s => (
              <div key={s.label} style={{ background: "var(--paper)", padding: "10px 0", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: 26, letterSpacing: "-0.02em", color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div className="eyebrow" style={{ marginTop: 4, fontSize: 8.5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ padding: "24px 16px", textAlign: "center" }}>
            <FileSearch size={24} style={{ color: "var(--ink-mute)", margin: "0 auto 10px" }} />
            <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 4 }}>No scripts scanned yet</p>
            <p style={{ fontSize: 11, color: "var(--ink-mute)", lineHeight: 1.55 }}>
              {isNS ? "Click Scan to discover active scripts in this account" : "Open NetSuite, then click Scan"}
            </p>
          </div>
        )}

        {/* CTA */}
        {display && needsUpd > 0 && (
          <button onClick={() => { setActiveAccount(display); setView("script_list") }} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
            View {needsUpd} script{needsUpd !== 1 ? "s" : ""} to migrate →
          </button>
        )}

        {/* Plan status */}
        {user && (
          <div className="card" style={{ padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>
              {user.unlimited ? "Unlimited conversions" : `${user.conversionsUsed} / 5 free conversions used`}
            </p>
            {!user.unlimited && (
              <button onClick={() => setView("upgrade")} style={{ fontFamily: "var(--f-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: ".1em", padding: "3px 9px", borderRadius: 3, background: "rgba(217,74,31,.10)", color: "var(--clay)", border: "1px solid rgba(217,74,31,.2)", cursor: "pointer" }}>
                Upgrade →
              </button>
            )}
          </div>
        )}

        {/* Deadlines */}
        <div className="card" style={{ padding: "10px 12px" }}>
          <p className="eyebrow" style={{ marginBottom: 8 }}>Migration deadlines</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {[
              { date: "2027.1", label: "SS 1.0 limited support", color: "#b45309" },
              { date: "2028.1", label: "2.1 runs by default",     color: "#c2410c" },
              { date: "2028.2", label: "Hard cutoff",             color: "var(--clay)" },
            ].map(d => (
              <div key={d.date} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>{d.label}</span>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, fontWeight: 500, color: d.color }}>{d.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Item 6: Clear history */}
        <button
          onClick={handleClearHistory}
          disabled={clearing}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            width: "100%", padding: "7px 12px", borderRadius: 999,
            background: "transparent", border: "1px solid var(--rule)",
            fontSize: 11, fontFamily: "var(--f-sans)", color: clearDone ? "#15803d" : "var(--ink-mute)",
            cursor: clearing ? "not-allowed" : "pointer", opacity: clearing ? .6 : 1,
            transition: "color .2s",
          }}
        >
          <Trash2 size={11} />
          {clearDone ? "History cleared" : clearing ? "Clearing…" : "Clear scan history & cache"}
        </button>

      </div>
    </div>
  )
}
