import { useState } from "react"
import { Search, Download } from "lucide-react"
import Header from "../components/Header"
import { useStore } from "../../lib/store"
import { downloadAuditReport } from "../../lib/export"
import { convertScript } from "../../lib/api"
import { saveConversion } from "../../lib/storage"
import type { NSScript } from "../../lib/types"

export default function ScriptListView() {
  const { activeAccount, user, setView, setSelectedScript, setConverting, setConversionResult, setConversionError, addConversion } = useStore()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "needs_update" | "done">("needs_update")

  if (!activeAccount) return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Header showBack onBack={() => setView("dashboard")} title="Scripts" />
      <div style={{ padding: 20, textAlign: "center", color: "var(--ink-mute)", fontSize: 12 }}>
        No account selected. Returning to dashboard...
      </div>
    </div>
  )

  const filtered = activeAccount.scripts.filter(s => {
    const m = s.name.toLowerCase().includes(search.toLowerCase()) || s.scriptType.toLowerCase().includes(search.toLowerCase())
    if (filter === "needs_update") return m && s.needsMigration
    if (filter === "done")         return m && !s.needsMigration
    return m
  })

  const handleConvert = async (script: NSScript) => {
    if (!user?.unlimited && (user?.conversionsUsed ?? 0) >= 5) { setView("upgrade"); return }
    setSelectedScript(script); setConverting(true); setConversionError(null); setView("converting")
    try {
      const codeResult = await new Promise<{ code: string; error?: string }>((resolve, reject) => {
        try {
          chrome.runtime.sendMessage({ type: "FETCH_SCRIPT_CODE", scriptId: script.id }, (response) => {
            if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message))
            else resolve(response)
          })
        } catch (err) { reject(err) }
      })
      const code = codeResult.code || `// Script: ${script.name}\n// Paste your script code here and convert.`
      const result = await convertScript({ code, scriptName: script.name, nsAccountId: activeAccount.accountId })
      const conversion = { conversionId: result.conversionId, scriptName: script.name, convertedCode: result.convertedCode, originalCode: code, confidenceScore: result.confidenceScore, changeLog: result.changeLog, manualReviewLines: result.manualReviewLines, isValid: result.isValid, validationErrors: result.validationErrors, scriptType: result.scriptType, originalVersion: result.originalVersion }
      addConversion(conversion); await saveConversion(conversion); setConversionResult(conversion); setView("conversion_result")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Conversion failed"
      if (msg === "conversion_limit_reached") setView("upgrade")
      else { setConversionError(msg); setView("conversion_result") }
    } finally { setConverting(false) }
  }

  const needs = activeAccount.scripts.filter(s => s.needsMigration).length
  const done  = activeAccount.scripts.filter(s => !s.needsMigration).length

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Header showBack onBack={() => setView("dashboard")} title="Scripts to Migrate" />

      <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Search */}
        <div style={{ position: "relative" }}>
          <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--ink-mute)" }} />
          <input type="text" placeholder="Search scripts..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", paddingLeft: 30, paddingRight: 10, paddingTop: 7, paddingBottom: 7, border: "1px solid var(--rule)", borderRadius: 4, background: "var(--paper)", fontSize: 12, color: "var(--ink)", outline: "none", fontFamily: "var(--f-sans)" }}
            onFocus={e => (e.target.style.borderColor = "var(--ink)")}
            onBlur={e => (e.target.style.borderColor = "var(--rule)")} />
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 4 }}>
          {(["needs_update", "all", "done"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={filter === f ? "tab-active" : "tab-inactive"}
              style={{ flex: 1, padding: "5px 4px", borderRadius: 3, fontSize: 10, fontFamily: "var(--f-mono)", textTransform: "uppercase", letterSpacing: ".08em", cursor: "pointer", fontWeight: 500 }}>
              {f === "needs_update" ? `Update (${needs})` : f === "done" ? `Done (${done})` : `All (${activeAccount.scripts.length})`}
            </button>
          ))}
        </div>

        {/* Export */}
        <button onClick={() => downloadAuditReport(activeAccount)} className="btn-outline" style={{ width: "100%", justifyContent: "center", fontSize: 11 }}>
          <Download size={11} /> Export Audit Report
        </button>
      </div>

      {/* Script list */}
      <div style={{ overflowY: "auto", maxHeight: 300, padding: "0 14px 14px", display: "flex", flexDirection: "column", gap: 4 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px 0", color: "var(--ink-mute)", fontSize: 11.5 }}>No scripts match your filter</div>
        ) : filtered.map(script => (
          <div key={script.id} className="card" style={{ padding: "8px 10px", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{script.name}</p>
              <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: "var(--ink-mute)", marginTop: 2 }}>{script.scriptType} · SS {script.apiVersion}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <span className={`risk-${script.riskLevel.toLowerCase()}`}>{script.riskLevel}</span>
              {script.needsMigration ? (
                <button onClick={() => handleConvert(script)} className="btn-primary" style={{ fontSize: 10, padding: "4px 10px" }}>Convert</button>
              ) : (
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "#15803d" }}>✓ 2.1</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
