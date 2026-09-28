"use client"

import { useState } from "react"
import { X, Download, Copy, CheckCircle, AlertTriangle, FileCode, ListChecks } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Conversion {
  id: string
  script_name: string
  original_version: string
  script_type: string
  original_code: string
  converted_code: string
  confidence_score: number
  changes_log: string[]
  manual_review_lines: number[]
  created_at: string
}

interface ConversionDetailModalProps {
  conversion: Conversion | null
  onClose: () => void
}

export default function ConversionDetailModal({ conversion, onClose }: ConversionDetailModalProps) {
  const [copied, setCopied] = useState(false)
  const [tab, setTab] = useState<"converted" | "changes" | "inline">("converted")

  if (!conversion) return null

  const handleCopy = async () => {
    await navigator.clipboard.writeText(conversion.converted_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const header = `/**
 * ═══════════════════════════════════════════════════════════════
 * 🎯 SuiteMigrate — Automated Conversion Report
 * ═══════════════════════════════════════════════════════════════
 * 
 * Original Script: ${conversion.script_name}
 * Converted: ${new Date(conversion.created_at).toLocaleString()}
 * Tool: SuiteMigrate (suitemigrate.com)
 * 
 * WHAT CHANGED:
${conversion.changes_log.map(c => ` * ✓ ${c}`).join('\n')}
 * 
 * NEXT STEPS:
 * 1. Review all lines with "// MIGRATED:" comments
 * 2. Test in NetSuite sandbox environment
 * 3. Check lines marked "// TODO: MANUAL REVIEW"
 * 4. Deploy to production after validation
 * 
 * ═══════════════════════════════════════════════════════════════
 */

`
    const fullCode = header + conversion.converted_code
    const safeName = conversion.script_name.replace(/[^a-z0-9_-]/gi, "_").toLowerCase()
    const blob = new Blob([fullCode], { type: "text/javascript" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${safeName}_2.1.js`
    a.click()
    URL.revokeObjectURL(url)
  }

  const confidenceColor =
    conversion.confidence_score >= 90 ? "text-emerald-400" :
    conversion.confidence_score >= 70 ? "text-amber-400" : "text-red-400"

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0a1628] border border-[#1e3a5f] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#1e3a5f] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{conversion.script_name}</h2>
            <p className="text-sm text-slate-400 mt-1">
              SS {conversion.original_version} → 2.1 · {conversion.script_type}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-6 border-b border-[#1e3a5f]">
          <div className="text-center">
            <div className={`text-3xl font-bold ${confidenceColor}`}>
              {conversion.confidence_score}%
            </div>
            <div className="text-xs text-slate-500 mt-1">Confidence</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">
              {conversion.changes_log.length}
            </div>
            <div className="text-xs text-slate-500 mt-1">Changes</div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${conversion.manual_review_lines.length > 0 ? "text-amber-400" : "text-emerald-400"}`}>
              {conversion.manual_review_lines.length}
            </div>
            <div className="text-xs text-slate-500 mt-1">Review Lines</div>
          </div>
        </div>

        {/* Manual review warning */}
        {conversion.manual_review_lines.length > 0 && (
          <div className="mx-6 mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-400">Lines needing manual review</p>
                <p className="text-xs text-slate-400 mt-1">
                  Lines: {conversion.manual_review_lines.join(", ")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab navigation */}
        <div className="flex gap-2 px-6 pt-4">
          <button
            onClick={() => setTab("converted")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "converted"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FileCode className="h-4 w-4" />
            Converted Code
          </button>
          <button
            onClick={() => setTab("changes")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "changes"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <ListChecks className="h-4 w-4" />
            Changes ({conversion.changes_log.length})
          </button>
          <button
            onClick={() => setTab("inline")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "inline"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <CheckCircle className="h-4 w-4" />
            Inline Comments
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Converted code tab */}
          {tab === "converted" && (
            <pre className="bg-black/40 border border-[#1e3a5f] rounded-lg p-4 text-xs text-slate-300 overflow-x-auto font-mono">
              {conversion.converted_code}
            </pre>
          )}

          {/* Changes tab */}
          {tab === "changes" && (
            <div className="space-y-2">
              {conversion.changes_log.length === 0 ? (
                <p className="text-sm text-slate-500">No changes logged</p>
              ) : (
                conversion.changes_log.map((change, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-black/40 border border-[#1e3a5f] rounded-lg">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">{change}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Inline comments tab */}
          {tab === "inline" && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <p className="text-sm font-semibold text-amber-400 mb-2">
                  💡 Inline Comments Show What Changed
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Look for <code className="text-emerald-400 bg-black/40 px-1 py-0.5 rounded">// MIGRATED:</code> comments 
                  in the code below. These explain every change made during conversion.
                </p>
              </div>

              <pre className="bg-black/40 border border-[#1e3a5f] rounded-lg p-4 text-xs font-mono overflow-x-auto">
                {conversion.converted_code.split('\n').map((line, i) => {
                  const hasMigratedComment = 
                    line.includes('// MIGRATED:') || 
                    line.includes('// CHANGED:') || 
                    line.includes('// TODO: MANUAL REVIEW')
                  
                  return (
                    <div 
                      key={i} 
                      className={hasMigratedComment ? "bg-emerald-500/10 border-l-2 border-emerald-500 pl-2 -ml-4 pr-2" : ""}
                    >
                      <span className="text-slate-600 mr-4 select-none">{String(i + 1).padStart(4, ' ')}</span>
                      <span className={hasMigratedComment ? "text-emerald-300" : "text-slate-400"}>
                        {line || ' '}
                      </span>
                    </div>
                  )
                })}
              </pre>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-[#1e3a5f] flex gap-3">
          <Button onClick={handleDownload} variant="gradient" className="gap-2 flex-1">
            <Download className="h-4 w-4" />
            Download with Header
          </Button>
          <Button onClick={handleCopy} variant="outline" className="gap-2">
            <Copy className="h-4 w-4" />
            {copied ? "Copied!" : "Copy Code"}
          </Button>
        </div>
      </div>
    </div>
  )
}
