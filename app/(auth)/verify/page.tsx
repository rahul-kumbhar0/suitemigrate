import Link from "next/link"
import { Mail } from "lucide-react"

export default function VerifyPage() {
  return (
    <div style={{ width: "100%", maxWidth: 400 }}>
      <div style={{ border: "1px solid var(--rule)", borderRadius: 6, background: "var(--paper)", padding: "48px 32px", textAlign: "center" }}>
        <div style={{ width: 52, height: 52, border: "1px solid var(--rule)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <Mail size={24} style={{ color: "var(--clay)" }} />
        </div>

        <h1 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: 28, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: 10 }}>
          Verify your email.
        </h1>
        <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.65, marginBottom: 28 }}>
          We&apos;ve sent a verification link to your email address.
          Click it to activate your account and get your 5 free conversions.
        </p>

        <div style={{ border: "1px solid var(--rule)", borderRadius: 4, overflow: "hidden", marginBottom: 28, textAlign: "left" }}>
          <div style={{ padding: "10px 16px", background: "rgba(15,23,42,.04)", borderBottom: "1px solid var(--rule)" }}>
            <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)" }}>
              Didn&apos;t receive the email?
            </p>
          </div>
          {[
            "Check your spam or junk folder",
            "Make sure you used the correct email address",
            "Allow a few minutes for the email to arrive",
          ].map((tip, i) => (
            <div key={i} style={{ padding: "10px 16px", borderBottom: i < 2 ? "1px solid var(--rule)" : "none", display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span style={{ color: "var(--ink-mute)", flexShrink: 0, fontFamily: "var(--f-mono)", fontSize: 11 }}>—</span>
              <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>{tip}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Link href="/signup" style={{ display: "block", textAlign: "center", padding: "10px 20px", borderRadius: 4, border: "1px solid var(--rule)", fontSize: 13.5, color: "var(--ink)", textDecoration: "none", transition: "background .14s" }}
            className="verify-btn">
            Try a different email
          </Link>
          <Link href="/login" style={{ display: "block", textAlign: "center", padding: "10px 20px", borderRadius: 4, fontSize: 13.5, color: "var(--ink-soft)", textDecoration: "none" }}>
            Back to Sign in
          </Link>
        </div>
      </div>
      <style>{`.verify-btn:hover { background: var(--paper-warm) !important; }`}</style>
    </div>
  )
}
