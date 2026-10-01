import { useStore } from "../../lib/store"

const steps = [
  "Analysing script structure",
  "Mapping deprecated APIs",
  "Applying 2.1 patterns",
  "Calculating confidence score",
]

export default function ConvertingView() {
  const { selectedScript } = useStore()

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, padding: "0 24px", textAlign: "center", gap: 20 }}>
      {/* Brand mark */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--clay)", animation: "pulse 1.4s ease-in-out infinite", display: "inline-block" }} />
        <span style={{ fontFamily: "var(--f-head)", fontSize: 15, fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.01em" }}>Converting…</span>
      </div>

      {selectedScript && (
        <div>
          <p style={{ fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)", marginBottom: 4 }}>Script</p>
          <p style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedScript.name}</p>
        </div>
      )}

      <p style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.65, maxWidth: 260 }}>
        Gemini AI is analyzing your script and converting it to SuiteScript 2.1...
      </p>

      {/* Steps */}
      <div style={{ width: "100%", maxWidth: 240, display: "flex", flexDirection: "column", gap: 8 }}>
        {steps.map((step, i) => (
          <div key={step} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", border: i === 0 ? "none" : "1px solid var(--rule)", background: i === 0 ? "var(--clay)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {i === 0 ? (
                <div style={{ width: 8, height: 8, border: "1.5px solid rgba(255,255,255,.6)", borderTopColor: "white", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
              ) : (
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 7.5, color: "var(--ink-mute)" }}>{i + 1}</span>
              )}
            </div>
            <span style={{ fontSize: 11.5, color: i === 0 ? "var(--ink)" : "var(--ink-mute)" }}>{step}</span>
          </div>
        ))}
      </div>

      <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".12em", color: "var(--ink-mute)" }}>
        Usually 5–15 seconds
      </p>

      <style>{`
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.3; } }
        @keyframes spin  { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
