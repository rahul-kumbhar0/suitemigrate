export default function LoadingView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, gap: 16 }}>
      {/* Clay dot brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--clay)", display: "inline-block" }} />
        <span style={{ fontFamily: "var(--f-head)", fontSize: 16, fontWeight: 400, letterSpacing: "-0.01em", color: "var(--ink)" }}>SuiteMigrate</span>
      </div>
      <div className="spinner" />
      <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)" }}>
        Loading...
      </p>
    </div>
  )
}
