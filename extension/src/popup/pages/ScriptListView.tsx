import { useState } from "react"
import { Search, Download, Filter } from "lucide-react"
import Header from "../components/Header"
import { useStore } from "../../lib/store"
import { downloadAuditReport } from "../../lib/export"
import { convertScript } from "../../lib/api"
import { saveConversion } from "../../lib/storage"
import type { NSScript } from "../../lib/types"

export default function ScriptListView() {
  const {
    activeAccount, user,
    setView, setSelectedScript, setConverting,
    setConversionResult, setConversionError, addConversion
  } = useStore()

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "needs_update" | "done">("needs_update")

  if (!activeAccount) {
    setView("dashboard")
    return null
  }

  const filtered = activeAccount.scripts.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                        s.scriptType.toLowerCase().includes(search.toLowerCase())
    if (filter === "needs_update") return matchSearch && s.needsMigration
    if (filter === "done")         return matchSearch && !s.needsMigration
    return matchSearch
  })

  const handleConvert = async (script: NSScript) => {
    // Check plan limit
    if (!user?.unlimited && (user?.conversionsUsed ?? 0) >= 2) {
      setView("upgrade")
      return
    }

    setSelectedScript(script)
    setConverting(true)
    setConversionError(null)
    setView("converting")

    try {
      // Get script code from NetSuite
      const codeResult = await new Promise<{ code: string; error?: string }>((resolve) => {
        chrome.runtime.sendMessage(
          { type: "FETCH_SCRIPT_CODE", scriptId: script.id },
          resolve
        )
      })

      const code = codeResult.code || `// Script: ${script.name}\n// Could not fetch source code automatically.\n// Paste your script code here and convert.`

      const result = await convertScript({
        code,
        scriptName: script.name,
        nsAccountId: activeAccount.accountId,
      })

      const conversion = {
        conversionId: result.conversionId,
        scriptName: script.name,
        convertedCode: result.convertedCode,
        originalCode: code,
        confidenceScore: result.confidenceScore,
        changeLog: result.changeLog,
        manualReviewLines: result.manualReviewLines,
        isValid: result.isValid,
        validationErrors: result.validationErrors,
        scriptType: result.scriptType,
        originalVersion: result.originalVersion,
      }

      addConversion(conversion)
      await saveConversion(conversion)
      setConversionResult(conversion)
      setView("conversion_result")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Conversion failed"
      if (msg === "conversion_limit_reached") {
        setView("upgrade")
      } else {
        setConversionError(msg)
        setView("conversion_result")
      }
    } finally {
      setConverting(false)
    }
  }

  return (
    <div className="flex flex-col">
      <Header showBack onBack={() => setView("dashboard")} title="Scripts to Migrate" />

      <div className="p-3 space-y-2">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search scripts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0a1628] border border-[#1e3a5f] rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1">
          {(["needs_update", "all", "done"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-1.5 rounded text-[10px] font-medium transition-colors ${
                filter === f
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {f === "needs_update" ? `Needs Update (${activeAccount.scripts.filter((s) => s.needsMigration).length})`
               : f === "done" ? `Done (${activeAccount.scripts.filter((s) => !s.needsMigration).length})`
               : `All (${activeAccount.scripts.length})`}
            </button>
          ))}
        </div>

        {/* Export button */}
        <button
          onClick={() => downloadAuditReport(activeAccount)}
          className="btn-outline w-full text-[11px] h-7 justify-center"
        >
          <Download className="h-3 w-3" />
          Export Audit Report
        </button>
      </div>

      {/* Script list */}
      <div className="overflow-y-auto max-h-[320px] px-3 pb-3 space-y-1.5">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No scripts match your filter
          </div>
        ) : (
          filtered.map((script) => (
            <div key={script.id} className="card p-2.5 flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{script.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {script.scriptType} · SS {script.apiVersion}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`risk-${script.riskLevel.toLowerCase()}`}>
                  {script.riskLevel}
                </span>
                {script.needsMigration ? (
                  <button
                    onClick={() => handleConvert(script)}
                    className="btn-primary text-[10px] h-6 px-2 py-0"
                  >
                    Convert
                  </button>
                ) : (
                  <span className="text-[10px] text-emerald-500 font-medium">✓ 2.1</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
