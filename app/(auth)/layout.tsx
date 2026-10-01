import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", display: "flex", flexDirection: "column" }}>

      {/* Top nav */}
      <div style={{ padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--rule)" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--clay)", display: "inline-block" }} />
          <span style={{ fontFamily: "var(--f-head)", fontSize: 19, fontWeight: 400, letterSpacing: "-0.02em", color: "var(--ink)" }}>
            SuiteMigrate
          </span>
        </Link>
        <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)" }}>
          NetSuite SuiteScript 2.1 migration
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        {children}
      </div>

      {/* Footer */}
      <div style={{ padding: "18px 40px", borderTop: "1px solid var(--rule)", textAlign: "center", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, color: "var(--ink-mute)" }}>
          © {new Date().getFullYear()} SuiteMigrate
        </span>
        <div style={{ display: "flex", gap: 20 }}>
          {[
            { label: "Privacy", href: "/privacy" },
            { label: "Terms",   href: "/terms" },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, color: "var(--ink-mute)", textDecoration: "none", transition: "color .18s" }}
              className="auth-footer-link">{l.label}</Link>
          ))}
        </div>
      </div>

      <style>{`.auth-footer-link:hover { color: var(--clay) !important; }`}</style>
    </div>
  )
}
