import Link from "next/link"

export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--rule)", padding: "56px 0 36px", background: "var(--paper)" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 40px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 56,
          marginBottom: 56,
          paddingBottom: 56,
          borderBottom: "1px solid var(--rule)",
        }} className="footer-grid">

          {/* Brand */}
          <div>
            <Link href="/" className="footer-brand-link" style={{ display: "inline-flex", alignItems: "center", gap: 9, textDecoration: "none", marginBottom: 14 }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--clay)", display: "inline-block" }} />
              <span style={{ fontFamily: "var(--f-head)", fontSize: 21, fontWeight: 400, letterSpacing: "-0.02em", color: "var(--ink)" }}>
                SuiteMigrate
              </span>
            </Link>
            {/* §11.1 Oracle disclaimer */}
            <p style={{ fontSize: 13, color: "var(--ink-soft)", maxWidth: 250, lineHeight: 1.65, marginBottom: 14 }}>
              Find every legacy SuiteScript before the 2028.2 deadline.
              Not affiliated with or endorsed by Oracle Corporation or NetSuite.
            </p>
            <p style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, color: "var(--ink-mute)", lineHeight: 1.7 }}>
              Support:{" "}
              <a
                href="mailto:support@suitemigrate.com"
                style={{ color: "var(--ink-soft)", textDecoration: "none" }}
                className="footer-link"
              >
                support@suitemigrate.com
              </a>
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 style={{ fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".18em", color: "var(--ink-mute)", marginBottom: 18, fontWeight: 500 }}>
              Product
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 9 }}>
              {[
                { label: "Features",       href: "/#features" },
                { label: "How it works",   href: "/#how-it-works" },
                { label: "Pricing",        href: "/#pricing" },
                { label: "Security",       href: "/#security" },
                { label: "FAQ",            href: "/#faq" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="footer-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 style={{ fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".18em", color: "var(--ink-mute)", marginBottom: 18, fontWeight: 500 }}>
              Account
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 9 }}>
              {[
                { label: "Sign up free", href: "/signup" },
                { label: "Sign in",      href: "/login" },
                { label: "Dashboard",    href: "/dashboard" },
                { label: "Billing",      href: "/dashboard/billing" },
                { label: "Settings",     href: "/dashboard/settings" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="footer-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal — §11.2 Refund Policy added */}
          <div>
            <h4 style={{ fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".18em", color: "var(--ink-mute)", marginBottom: 18, fontWeight: 500 }}>
              Legal
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 9 }}>
              {[
                { label: "Privacy Policy",   href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                {
                  
                  label: "Refund Policy",
                  href: "/refund",
                },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="footer-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar — §11.1: "local-first" removed, Oracle disclaimer kept */}
        <div style={{
          display: "flex", justifyContent: "space-between", flexWrap: "wrap",
          gap: 10, fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--ink-mute)",
        }}>
          <span>© {new Date().getFullYear()} SuiteMigrate</span>
          {/* §11.1 Oracle disclaimer */}
          <span>Not affiliated with Oracle Corporation or NetSuite · v1.0</span>
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
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 28px !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}
