import { CheckCircle, AlertTriangle, Download, Copy, ArrowLeft, XCircle, FileCode, ListChecks } from "lucide-react"
import { useState } from "react"
import Header from "../components/Header"
import { useStore } from "../../lib/store"
import { downloadScript } from "../../lib/export"

export default function ConversionResultView() {
  const { conversionResult, conversionError, setView } = useStore()
  const [copied, setCopied] = useState(false)
  const [tab, setTab]       = useState<"converted" | "changes" | "comments">("converted")

  if (conversionError) {
    const setupError = /DB_QUOTA_RPC_MISSING|AI_CONFIG|AI_MODEL/.test(conversionError)
    const capacityError = /AI_CAPACITY/.test(conversionError)
    const outputError = /AI_OUTPUT_REVIEW/.test(conversionError)
    const supportCode = conversionError.match(/\[([A-Z0-9_]+)\]/)?.[1]

    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Header showBack onBack={() => setView("script_list")} title="Conversion Failed" />
        <div style={{ padding: "22px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 13, textAlign: "center" }}>
          <div style={{ width: 44, height: 44, border: "1px solid rgba(217,74,31,.3)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <XCircle size={22} style={{ color: "var(--clay)" }} />
          </div>
          <div>
            <p style={{ fontSize: 13.5, fontWeight: 500, color: "var(--ink)", marginBottom: 6 }}>
              {setupError ? "Service setup needs attention" : capacityError ? "AI service capacity or quota limit" : outputError ? "Generated code needs reprocessing" : "Conversion could not complete"}
            </p>
            <p style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.6 }}>{conversionError.replace(/\s*\[[A-Z0-9_]+\]\s*$/, "")}</p>
            {supportCode && (
              <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: "var(--clay)", marginTop: 7 }}>
                Support code: {supportCode}
              </p>
            )}
            <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: "var(--ink-mute)", lineHeight: 1.55, marginTop: 8 }}>
              The conversion is not recorded as completed when processing fails. {capacityError ? "If this persists, contact support so the service quota can be checked." : "Your NetSuite script stays unchanged."}
            </p>
          </div>
          <button onClick={() => setView("script_list")} className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: 11 }}>
            Back to scripts
          </button>
          <button
            onClick={() => window.open("https://suitemigrate.vercel.app/support", "_blank")}
            className="btn-outline"
            style={{ width: "100%", justifyContent: "center", fontSize: 11 }}
          >
            Open support
          </button>
        </div>
      </div>
    )
  }

  if (!conversionResult) { setView("script_list"); return null }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(conversionResult.convertedCode)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const confColor = conversionResult.confidenceScore >= 90 ? "var(--clay)" : conversionResult.confidenceScore >= 70 ? "#b45309" : "#dc2626"

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Header showBack onBack={() => setView("script_list")} title="Conversion Generated" />

      <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 8 }}>

        {/* Summary card */}
        <div className="card" style={{ padding: "12px 14px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
            <CheckCircle size={14} style={{ color: "var(--clay)", flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12.5, fontWeight: 500, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {conversionResult.scriptName}
              </p>
              <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: "var(--ink-mute)", marginTop: 2 }}>
                SS {conversionResult.originalVersion} → 2.1 · {conversionResult.scriptType}
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "var(--rule)", border: "1px solid var(--rule)", borderRadius: 3, overflow: "hidden" }}>
            {[
              { label: "Review score*", value: `${conversionResult.confidenceScore}%`, color: confColor },
              { label: "Changes",    value: conversionResult.changeLog.length,       color: "var(--ink)" },
              { label: "Review",     value: conversionResult.manualReviewLines.length, color: conversionResult.manualReviewLines.length > 0 ? "#b45309" : "#15803d" },
            ].map(s => (
              <div key={s.label} style={{ background: "var(--paper)", padding: "8px 4px", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: 20, letterSpacing: "-0.02em", color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div className="eyebrow" style={{ marginTop: 3, fontSize: 8 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 10, color: "var(--ink-mute)", lineHeight: 1.6 }}>
          *Heuristic score, not a measured probability of correctness. Structural checks
          do not verify NetSuite business logic. Review all changes and test in a NetSuite
          Sandbox before deployment. SuiteMigrate never deploys the converted script.
        </p>

        {/* Manual review warning */}
        {conversionResult.manualReviewLines.length > 0 && (
          <div className="card" style={{ padding: "8px 12px", borderColor: "rgba(180,83,9,.25)", background: "rgba(180,83,9,.04)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
              <AlertTriangle size={12} style={{ color: "#b45309", flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 11, color: "var(--ink-soft)", lineHeight: 1.5 }}>
                Lines {conversionResult.manualReviewLines.join(", ")} need manual review
              </p>
            </div>
          </div>
        )}

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 3 }}>
          {(["converted", "changes", "comments"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={tab === t ? "tab-active" : "tab-inactive"}
              style={{ flex: 1, padding: "5px 4px", borderRadius: 3, fontSize: 9.5, fontFamily: "var(--f-mono)", textTransform: "uppercase", letterSpacing: ".08em", cursor: "pointer" }}>
              {t === "converted" ? "Code" : t === "changes" ? `Changes (${conversionResult.changeLog.length})` : "Inline"}
            </button>
          ))}
        </div>

        {/* Code */}
        {tab === "converted" && (
          <div className="code-block">
            {conversionResult.convertedCode.slice(0, 1500)}
            {conversionResult.convertedCode.length > 1500 && "\n\n// ... (truncated — download for full code)"}
          </div>
        )}

        {/* Changes */}
        {tab === "changes" && (
          <div style={{ border: "1px solid var(--rule)", borderRadius: 4, maxHeight: 180, overflowY: "auto" }}>
            {conversionResult.changeLog.length === 0 ? (
              <p style={{ padding: "12px 14px", fontSize: 11.5, color: "var(--ink-mute)" }}>No changes logged</p>
            ) : conversionResult.changeLog.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 12px", borderBottom: "1px solid var(--rule)", fontSize: 11 }}>
                <span style={{ color: "var(--clay)", flexShrink: 0, fontFamily: "var(--f-mono)" }}>—</span>
                <span style={{ color: "var(--ink-soft)", lineHeight: 1.5 }}>{c}</span>
              </div>
            ))}
          </div>
        )}

        {/* Inline comments */}
        {tab === "comments" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div className="card" style={{ padding: "8px 12px" }}>
              <p style={{ fontSize: 11, color: "var(--ink-soft)", lineHeight: 1.6 }}>
                Look for <code style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--clay)" }}>// MIGRATED:</code> comments in the code — they explain every change made.
              </p>
            </div>
            <div className="code-block" style={{ maxHeight: 180, fontSize: 10, overflowY: "auto" }}>
              {conversionResult.convertedCode.split("\n").slice(0, 40).map((line, i) => {
                const isMigrated = line.includes("// MIGRATED:") || line.includes("// CHANGED:") || line.includes("// TODO: MANUAL REVIEW")
                return (
                  <div key={i} style={{ display: "flex", gap: 6, background: isMigrated ? "rgba(217,74,31,.06)" : "transparent", borderLeft: isMigrated ? "2px solid var(--clay)" : "2px solid transparent", paddingLeft: isMigrated ? 4 : 2 }}>
                    <span style={{ color: "var(--ink-mute)", width: 18, flexShrink: 0, textAlign: "right" }}>{i + 1}</span>
                    <span style={{ color: isMigrated ? "var(--clay)" : "var(--ink-soft)" }}>{line || " "}</span>
                  </div>
                )
              })}
              <div style={{ textAlign: "center", padding: "8px 0", fontFamily: "var(--f-mono)", fontSize: 9.5, color: "var(--ink-mute)" }}>
                — download for full file —
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          <button onClick={() => downloadScript(conversionResult.scriptName, conversionResult.convertedCode, conversionResult.changeLog)} className="btn-primary" style={{ justifyContent: "center", fontSize: 11 }}>
            <Download size={12} /> Download
          </button>
          <button onClick={handleCopy} className="btn-outline" style={{ justifyContent: "center", fontSize: 11 }}>
            <Copy size={12} /> {copied ? "Copied!" : "Copy Code"}
          </button>
        </div>

        <button onClick={() => setView("script_list")} className="btn-outline" style={{ width: "100%", justifyContent: "center", fontSize: 11 }}>
          <ArrowLeft size={11} /> Convert Another Script
        </button>
      </div>
    </div>
  )
}
