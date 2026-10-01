import { Users, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function TeamPage() {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(24px,3.5vw,38px)", letterSpacing: "-0.025em", color: "var(--ink)", marginBottom: 6 }}>
          Team
        </h1>
        <p style={{ fontFamily: "var(--f-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)" }}>
          Manage team members and shared conversion history
        </p>
      </div>

      {/* Locked state */}
      <div style={{ border: "1px solid var(--rule)", borderRadius: 6, padding: "64px 40px", textAlign: "center", background: "var(--paper)" }}>
        <div style={{ width: 52, height: 52, border: "1px solid var(--rule)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <Users size={24} style={{ color: "var(--ink-mute)" }} />
        </div>

        <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)", marginBottom: 16, display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", border: "1px solid var(--rule)", borderRadius: 3 }}>
          Team Plan Required
        </div>

        <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(24px,3vw,36px)", letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: 12, lineHeight: 1.1 }}>
          Collaborate with your{" "}
          <span style={{ color: "var(--clay)", fontStyle: "italic" }}>whole team.</span>
        </h2>

        <p style={{ fontSize: 14, color: "var(--ink-soft)", maxWidth: 420, margin: "0 auto 32px", lineHeight: 1.7 }}>
          The Team plan gives your entire team shared access to scan, convert, and export
          migration history across all client NetSuite accounts.
        </p>

        {/* Features */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--rule)", border: "1px solid var(--rule)", maxWidth: 420, margin: "0 auto 32px", textAlign: "left" }}>
          {[
            "Unlimited team seats",
            "Shared conversion history",
            "Team management dashboard",
            "Bulk export all accounts",
            "Client account management",
            "Dedicated support",
          ].map(f => (
            <div key={f} style={{ background: "var(--paper)", padding: "12px 16px", fontSize: 13.5, color: "var(--ink-soft)", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "var(--clay)", fontFamily: "var(--f-mono)", fontSize: 11, flexShrink: 0 }}>✓</span>
              {f}
            </div>
          ))}
        </div>

        <Link href="/dashboard/billing" className="btn-pill" style={{ display: "inline-flex", fontSize: 14 }}>
          Upgrade to Team — $99/mo
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}
