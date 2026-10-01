import Link from "next/link"

export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--rule)", padding: "56px 0 36px", background: "var(--paper)" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 56, marginBottom: 56, paddingBottom: 56, borderBottom: "1px solid var(--rule)" }}>

          {/* Brand */}
          <div>
            <Link href="/" className="footer-brand-link" style={{ display: "inline-flex", alignItems: "center", gap: 9, textDecoration: "none", marginBottom: 14 }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--clay)", display: "inline-block" }} />
              <span style={{ fontFamily: "var(--f-head)", fontSize: 21, fontWeight: 400, letterSpacing: "-0.02em", color: "var(--ink)" }}>
                SuiteMigrate
              </span>
            </Link>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", maxWidth: 250, lineHeight: 1.65 }}>
              The fastest way to migrate NetSuite SuiteScript 1.0/2.0 to 2.1 before the 2028 deadline.
              Not affiliated with or endorsed by Oracle.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 style={{ fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".18em", color: "var(--ink-mute)", marginBottom: 18, fontWeight: 500 }}>Product</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 9 }}>
              {[
                { label: "Features",     href: "/#how-it-works" },
                { label: "How it works", href: "/#how-it-works" },
                { label: "Pricing",      href: "/#pricing" },
                { label: "FAQ",          href: "/#faq" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="footer-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 style={{ fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".18em", color: "var(--ink-mute)", marginBottom: 18, fontWeight: 500 }}>Account</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 9 }}>
              {[
                { label: "Sign up free", href: "/signup" },
                { label: "Sign in",      href: "/login" },
                { label: "Dashboard",    href: "/dashboard" },
                { label: "Billing",      href: "/dashboard/billing" },
                { label: "Settings",     href: "/dashboard/settings" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="footer-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".18em", color: "var(--ink-mute)", marginBottom: 18, fontWeight: 500 }}>Legal</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 9 }}>
              {[
                { label: "Privacy Policy",   href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="footer-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--ink-mute)" }}>
          <span>© {new Date().getFullYear()} SuiteMigrate — migrate before the deadline</span>
          <span>v1.0 · read-only · local-first · not affiliated with Oracle</span>
        </div>
      </div>

      <style>{`
        .footer-link {
          font-size: 14px;
          color: var(--ink);
          text-decoration: none;
          transition: color .18s;
        }
        .footer-link:hover { color: var(--clay); }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </footer>
  )
}
