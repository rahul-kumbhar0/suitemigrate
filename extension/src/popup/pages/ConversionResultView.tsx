import { CheckCircle, AlertTriangle, Download, Copy, ArrowLeft, XCircle } from "lucide-react"
import { useState } from "react"
import Header from "../components/Header"
import { useStore } from "../../lib/store"
import { downloadScript } from "../../lib/export"

export default function ConversionResultView() {
  const { conversionResult, conversionError, setView, activeAccount } = useStore()
  const [copied, setCopied] = useState(false)
  const [tab, setTab] = useState<"converted" | "changes">("converted")

  if (conversionError) {
    return (
      <div className="flex flex-col">
        <Header showBack onBack={() => setView("script_list")} title="Conversion Failed" />
        <div className="p-4 flex flex-col items-center gap-4 text-center">
          <div className="h-12 w-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <XCircle className="h-6 w-6 text-red-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white mb-1">Conversion Error</p>
            <p className="text-xs text-slate-400 leading-relaxed">{conversionError}</p>
          </div>
          <button onClick={() => setView("script_list")} className="btn-outline">
            ← Back to Scripts
          </button>
        </div>
      </div>
    )
  }

  if (!conversionResult) {
    setView("script_list")
    return null
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(conversionResult.convertedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const confidenceColor =
    conversionResult.confidenceScore >= 90 ? "text-emerald-400" :
    conversionResult.confidenceScore >= 70 ? "text-amber-400" : "text-red-400"

  return (
    <div className="flex flex-col">
      <Header showBack onBack={() => setView("script_list")} title="Conversion Complete" />

      <div className="p-3 space-y-3">
        {/* Result summary */}
        <div className="card p-3">
          <div className="flex items-start gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{conversionResult.scriptName}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                SS {conversionResult.originalVersion} → 2.1 · {conversionResult.scriptType}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1e3a5f]">
            <div className="text-center">
              <p className={`text-lg font-bold ${confidenceColor}`}>
                {conversionResult.confidenceScore}%
              </p>
              <p className="text-[9px] text-slate-500">Confidence</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">{conversionResult.changeLog.length}</p>
              <p className="text-[9px] text-slate-500">Changes</p>
            </div>
            <div className="text-center">
              <p className={`text-lg font-bold ${conversionResult.manualReviewLines.length > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                {conversionResult.manualReviewLines.length}
              </p>
              <p className="text-[9px] text-slate-500">Review Lines</p>
            </div>
          </div>
        </div>

        {/* Validation errors */}
        {conversionResult.validationErrors.length > 0 && (
          <div className="card p-2.5 border-amber-500/30 bg-amber-500/5">
            <div className="flex items-start gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-semibold text-amber-400 mb-1">Needs Review</p>
                {conversionResult.validationErrors.map((e, i) => (
                  <p key={i} className="text-[10px] text-slate-400">• {e}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Manual review lines */}
        {conversionResult.manualReviewLines.length > 0 && (
          <div className="card p-2.5 border-amber-500/20">
            <p className="text-[10px] text-amber-400 font-semibold mb-1">Lines needing manual review</p>
            <p className="text-[10px] text-slate-400">
              Lines: {conversionResult.manualReviewLines.join(", ")}
            </p>
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex gap-1">
          {(["converted", "changes"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-1.5 rounded text-[10px] font-medium transition-colors ${
                tab === t
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {t === "converted" ? "Converted Code" : `Changes (${conversionResult.changeLog.length})`}
            </button>
          ))}
        </div>

        {/* Code view */}
        {tab === "converted" && (
          <div className="code-block text-[10px]">
            {conversionResult.convertedCode.slice(0, 1500)}
            {conversionResult.convertedCode.length > 1500 && "\n\n... (truncated — download for full code)"}
          </div>
        )}

        {/* Changes log */}
        {tab === "changes" && (
          <div className="card p-3 space-y-1.5 max-h-[180px] overflow-y-auto">
            {conversionResult.changeLog.length === 0 ? (
              <p className="text-xs text-slate-500">No changes logged</p>
            ) : conversionResult.changeLog.map((c, i) => (
              <div key={i} className="flex items-start gap-2 text-[10px]">
                <span className="text-emerald-500 shrink-0">•</span>
                <span className="text-slate-300">{c}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => downloadScript(conversionResult.scriptName, conversionResult.convertedCode)}
            className="btn-primary text-[11px] h-8 justify-center"
          >
            <Download className="h-3 w-3" />
            Download
          </button>
          <button onClick={handleCopy} className="btn-outline text-[11px] h-8 justify-center">
            <Copy className="h-3 w-3" />
            {copied ? "Copied!" : "Copy Code"}
          </button>
        </div>

        <button
          onClick={() => setView("script_list")}
          className="btn-outline w-full text-[11px] h-7 justify-center"
        >
          <ArrowLeft className="h-3 w-3" />
          Convert Another Script
        </button>
      </div>
    </div>
  )
}
