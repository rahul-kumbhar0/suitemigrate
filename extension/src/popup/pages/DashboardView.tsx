import { useState, useEffect, useCallback } from "react"
import { AlertTriangle, RefreshCw, ChevronDown, FileSearch, Zap, XCircle } from "lucide-react"
import Header from "../components/Header"
import { useStore } from "../../lib/store"
import { getAllAccounts, saveAccount } from "../../lib/storage"
import type { NSAccount, NSScript } from "../../lib/types"

// Inline scanner function — injected directly into the NetSuite tab
// Must be self-contained (no imports, closure variables not accessible)
function inlineScanner() {
  // Detect account ID from URL — handles both numeric (12345) and named (tstdrv2804638) accounts
  const host = window.location.hostname
  // Match anything before .app.netsuite.com or .netsuite.com
  const match = host.match(/^([a-z0-9_-]+)\.(?:app\.)?netsuite\.com/i)
  const accountId = match ? match[1] : host.split(".")[0] || null

  if (!accountId) {
    return { error: "Could not detect NetSuite account ID from URL: " + host }
  }

  // Detect account name from DOM
  const nameEl = document.querySelector('[data-componentid="ns_header_company_name"]')
  const accountName = nameEl?.textContent?.trim() || document.title.split(" - ")[0] || "NetSuite Account"

  // Run SuiteQL query
  const base = `${window.location.protocol}//${window.location.hostname}/services/rest`

  return fetch(`${base}/query/v1/suiteql?limit=1000`, {
    method: "POST",
    headers: { "Content-Type": "application/json", prefer: "transient" },
    credentials: "include",
    body: JSON.stringify({
      q: `SELECT s.id, s.name, s.scripttype, s.apiversion, s.description FROM script s WHERE s.isinactive = 'F' ORDER BY s.name`,
    }),
  })
    .then((r) => {
      if (!r.ok) throw new Error(`SuiteQL failed: ${r.status} ${r.statusText}`)
      return r.json()
    })
    .then((data) => {
      const typeMap: Record<string, string> = {
        USEREVENT: "UserEvent", SUITELET: "Suitelet", SCHEDULED: "ScheduledScript",
        MAPREDUCE: "MapReduce", CLIENT: "ClientScript", RESTLET: "RESTlet",
        PORTLET: "Portlet", MASSUPDATE: "MassUpdate", CUSTOMGLLINES: "GL Lines",
        WORKFLOW: "Workflow Action",
      }

      const scripts: NSScript[] = (data.items || []).map((row: Record<string, string>): NSScript => {
        const apiVersion = row.apiversion || "1.0"
        const needsMigration = apiVersion !== "2.1"
        const riskLevel = apiVersion === "1.0" || apiVersion === "1"
          ? "HIGH" : apiVersion === "2.0" || apiVersion === "2"
          ? "MEDIUM" : "NONE"
        return {
          id: row.id,
          name: row.name || "Unnamed Script",
          scriptType: typeMap[(row.scripttype || "").toUpperCase()] || row.scripttype || "Unknown",
          apiVersion,
          description: row.description || "",
          riskLevel: riskLevel as NSScript["riskLevel"],
          needsMigration,
        }
      })

      return { accountId, accountName, scripts }
    })
    .catch((err: Error) => ({ error: err.message }))
}

export default function DashboardView() {
  const { user, accounts, activeAccount, setAccounts, setActiveAccount, setView, isScanning, setScanning, setScanError, scanError } = useStore()
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [isNetSuitePage, setIsNetSuitePage] = useState(false)
  const [activeTabId, setActiveTabId] = useState<number | null>(null)
  const [scanStatus, setScanStatus] = useState("")

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url || ""
      const tabId = tabs[0]?.id ?? null
      setActiveTabId(tabId)
      setIsNetSuitePage(
        url.includes("netsuite.com") || url.includes("suitetapp.com")
      )
    })
    getAllAccounts().then((a) => setAccounts(a))
  }, [setAccounts])

  const handleScan = useCallback(async () => {
    if (!isNetSuitePage || !activeTabId) return
    setScanning(true)
    setScanError(null)
    setScanStatus("Connecting to NetSuite...")

    try {
      setScanStatus("Running SuiteQL query...")

      // Inject scanner directly into the NetSuite tab — no message passing
      const results = await chrome.scripting.executeScript({
        target: { tabId: activeTabId },
        func: inlineScanner,
      })

      const result = results?.[0]?.result as
        | { accountId: string; accountName: string; scripts: NSScript[] }
        | { error: string }
        | null

      if (!result) {
        setScanError("No response from NetSuite tab. Make sure you are on a NetSuite page and try again.")
        return
      }

      if ("error" in result) {
        setScanError(result.error)
        return
      }

      setScanStatus("Processing results...")

      const account: NSAccount = {
        accountId: result.accountId,
        accountName: result.accountName,
        lastScannedAt: new Date().toISOString(),
        scripts: result.scripts,
        scriptsTotal: result.scripts.length,
        scriptsNeedingUpdate: result.scripts.filter((s) => s.needsMigration).length,
      }

      await saveAccount(account)
      setActiveAccount(account)
      const allAccounts = await getAllAccounts()
      setAccounts(allAccounts)
      setView("script_list")

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes("Cannot access")) {
        setScanError("Cannot access this page. Make sure you are on a NetSuite tab (e.g. system.netsuite.com).")
      } else if (msg.includes("No tab")) {
        setScanError("No active tab found. Close the extension and reopen it on a NetSuite page.")
      } else {
        setScanError(`Scan failed: ${msg}`)
      }
    } finally {
      setScanning(false)
      setScanStatus("")
    }
  }, [isNetSuitePage, activeTabId, setScanning, setScanError, setActiveAccount, setAccounts, setView])

  const displayAccount = activeAccount || accounts[0]
  const needsUpdate = displayAccount?.scripts.filter((s) => s.needsMigration).length || 0
  const onLatest = displayAccount?.scripts.filter((s) => !s.needsMigration).length || 0

  return (
    <div className="flex flex-col">
      <Header />

      <div className="p-4 space-y-3">

        {/* Account card */}
        <div className="card p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Active Account</p>
              {displayAccount ? (
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="flex items-center gap-1 text-sm font-medium text-white hover:text-emerald-400 transition-colors"
                >
                  <span className="truncate max-w-[160px]">{displayAccount.accountName}</span>
                  <span className="text-slate-500 text-xs">({displayAccount.accountId})</span>
                  {accounts.length > 1 && <ChevronDown className="h-3 w-3 shrink-0" />}
                </button>
              ) : (
                <p className="text-xs text-slate-500">
                  {isNetSuitePage ? "Ready to scan" : "Open NetSuite to scan"}
                </p>
              )}
            </div>
            <button
              onClick={handleScan}
              disabled={isScanning || !isNetSuitePage}
              className="btn-primary text-[11px] h-7 px-3 py-0 shrink-0"
            >
              {isScanning ? (
                <><div className="spinner !h-3 !w-3" /> Scanning...</>
              ) : (
                <><RefreshCw className="h-3 w-3" /> Scan</>
              )}
            </button>
          </div>

          {/* Scan status */}
          {isScanning && scanStatus && (
            <p className="mt-2 text-[10px] text-emerald-400 animate-pulse">{scanStatus}</p>
          )}

          {/* Account dropdown */}
          {showAccountMenu && accounts.length > 1 && (
            <div className="mt-2 pt-2 border-t border-[#1e3a5f] space-y-1">
              {accounts.map((acc) => (
                <button
                  key={acc.accountId}
                  onClick={() => { setActiveAccount(acc); setShowAccountMenu(false) }}
                  className="w-full text-left px-2 py-1.5 rounded text-xs text-slate-300 hover:bg-[#1e3a5f] transition-colors"
                >
                  {acc.accountName} ({acc.accountId})
                </button>
              ))}
            </div>
          )}

          {!isNetSuitePage && (
            <p className="mt-2 text-[10px] text-slate-600">
              Navigate to your NetSuite account tab first
            </p>
          )}
        </div>

        {/* Scan error */}
        {scanError && (
          <div className="card p-3 border-red-500/30 bg-red-500/5">
            <div className="flex items-start gap-2">
              <XCircle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-red-400 mb-0.5">Scan Error</p>
                <p className="text-[10px] text-slate-400 leading-relaxed">{scanError}</p>
              </div>
              <button
                onClick={() => setScanError(null)}
                className="text-slate-600 hover:text-slate-400 shrink-0"
              >×</button>
            </div>
          </div>
        )}

        {/* Stats */}
        {displayAccount ? (
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Total",       value: displayAccount.scriptsTotal,        color: "text-white" },
              { label: "Need Update", value: needsUpdate,                        color: "text-amber-400" },
              { label: "On 2.1",      value: onLatest,                           color: "text-emerald-400" },
            ].map((s) => (
              <div key={s.label} className="card p-3 text-center">
                <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-5 text-center">
            <FileSearch className="h-8 w-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400 mb-1">No scripts scanned yet</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isNetSuitePage
                ? 'Click "Scan" to discover all scripts in this account'
                : "Open your NetSuite account in this tab, then click Scan"}
            </p>
          </div>
        )}

        {/* View scripts CTA */}
        {displayAccount && needsUpdate > 0 && (
          <button
            onClick={() => { setActiveAccount(displayAccount); setView("script_list") }}
            className="btn-primary w-full justify-center"
          >
            <Zap className="h-3.5 w-3.5" />
            View {needsUpdate} Scripts to Migrate
          </button>
        )}

        {/* Plan status */}
        {user && (
          <div className="card p-3 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              {user.unlimited
                ? "Unlimited conversions"
                : `${user.conversionsUsed} / 2 free conversions used`}
            </p>
            {!user.unlimited && (
              <button
                onClick={() => setView("upgrade")}
                className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors font-semibold"
              >
                Upgrade $10 →
              </button>
            )}
          </div>
        )}

        {/* Deadline warning */}
        <div className="card p-3 border-amber-500/20 bg-amber-500/5">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-400 mb-1">Migration Deadlines</p>
              <div className="space-y-0.5 text-[10px] text-slate-500">
                <p><span className="text-amber-400 font-medium">2027.1</span> — SS 1.0 limited support</p>
                <p><span className="text-orange-400 font-medium">2028.1</span> — 2.1 runs by default</p>
                <p><span className="text-red-400 font-medium">2028.2</span> — Hard cutoff</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
