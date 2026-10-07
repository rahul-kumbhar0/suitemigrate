import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import Link from "next/link"

export default function SupportPage() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Navbar />
      <main style={{ padding: "112px 24px 96px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".18em", color: "var(--ink-mute)", marginBottom: 14 }}>
            Support
          </p>
          <h1 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(34px,5vw,54px)", letterSpacing: "-0.025em", color: "var(--ink)", marginBottom: 14 }}>
            SuiteMigrate support
          </h1>
          <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.75, marginBottom: 32 }}>
            If a scan or conversion does not behave as expected, send the exact error message and the steps that produced it. Do not send passwords, session tokens, API keys, or confidential source code by email.
          </p>

          <div style={{ display: "grid", gap: 1, background: "var(--rule)", border: "1px solid var(--rule)", marginBottom: 32 }}>
            {[
              ["Email", "support@suitemigrate.com"],
              ["Include", "SuiteMigrate version, Chrome version, NetSuite Sandbox/Production, exact error text, and reproduction steps"],
              ["Do not include", "NetSuite passwords, session tokens, private API keys, or confidential script source"],
            ].map(([label, value]) => (
              <div key={label} style={{ background: "var(--paper)", padding: "20px 22px" }}>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)", marginBottom: 7 }}>{label}</div>
                <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.7 }}>
                  {label === "Email" ? <a href="mailto:support@suitemigrate.com" style={{ color: "var(--clay)", textDecoration: "none" }}>{value}</a> : value}
                </div>
              </div>
            ))}
          </div>

          <div style={{ border: "1px solid var(--rule)", borderRadius: 5, padding: "22px 24px", background: "rgba(15,23,42,.025)" }}>
            <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 400, fontSize: 19, marginBottom: 10 }}>Before contacting support</h2>
            <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.75 }}>
              Confirm that you are signed in to SuiteMigrate, the intended NetSuite account is open in the active tab, and the current NetSuite role can read the selected script's File Cabinet source. Converted code should always be reviewed and tested in NetSuite Sandbox before production deployment.
            </p>
          </div>

          <p style={{ marginTop: 28, fontSize: 13, color: "var(--ink-mute)" }}>
            See also <Link href="/privacy" style={{ color: "var(--clay)", textDecoration: "none" }}>Privacy Policy</Link> and{" "}
            <Link href="/terms" style={{ color: "var(--clay)", textDecoration: "none" }}>Terms of Service</Link>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
