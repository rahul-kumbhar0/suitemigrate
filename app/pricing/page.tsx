import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { CheckCircle, Shield, CreditCard } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    id: "free", name: "Free", price: "$0", period: "forever", dark: false,
    desc: "Scan your account and see exactly what needs migrating.",
    features: ["Full account scan — unlimited", "Risk score for every script", "5 full AI conversions", "Inline comments + diff view", "PDF audit report"],
    cta: "Start free — no card", href: "/signup",
  },
  {
    id: "pro", name: "Pro", price: "$29", period: "/ month", dark: true,
    alt: "or $299 lifetime · pay once, own forever",
    desc: "Unlimited conversions. Full history. Professional exports.",
    features: ["Everything in Free", "Unlimited conversions", "Full conversion history", "ZIP export all scripts", "Priority queue"],
    cta: "Get Pro", href: "/signup?plan=pro",
  },
  {
    id: "lifetime", name: "Lifetime", price: "$299", period: "one time", dark: false,
    alt: "Pay once — use forever. Best value.",
    desc: "Every Pro feature, no renewals, all future updates included.",
    features: ["Everything in Pro", "Lifetime access — no renewals", "All future features included", "Priority conversion queue"],
    cta: "Buy Lifetime — $299", href: "/signup?plan=lifetime",
  },
  {
    id: "team", name: "Team", price: "$99", period: "/ month", dark: false,
    desc: "For consultants managing multiple client NetSuite accounts.",
    features: ["Everything in Pro", "Unlimited team seats", "Shared conversion history", "Client account management", "Bulk export across accounts"],
    cta: "Get Team", href: "/signup?plan=team",
  },
]

const compRows = [
  { f: "Full account scan",        free: "✓", pro: "✓", lt: "✓", team: "✓" },
  { f: "Risk scoring",             free: "✓", pro: "✓", lt: "✓", team: "✓" },
  { f: "Audit report PDF",         free: "✓", pro: "✓", lt: "✓", team: "✓" },
  { f: "Script conversions",       free: "5", pro: "Unlimited", lt: "Unlimited", team: "Unlimited" },
  { f: "Inline comments + diff",   free: "✓", pro: "✓", lt: "✓", team: "✓" },
  { f: "Confidence score",         free: "✓", pro: "✓", lt: "✓", team: "✓" },
  { f: "Conversion history",       free: "—", pro: "✓", lt: "✓", team: "✓" },
  { f: "ZIP export",               free: "—", pro: "✓", lt: "✓", team: "✓" },
  { f: "Team seats",               free: "—", pro: "—", lt: "—", team: "Unlimited" },
  { f: "Shared team history",      free: "—", pro: "—", lt: "—", team: "✓" },
  { f: "Priority queue",           free: "—", pro: "✓", lt: "✓", team: "✓" },
]

export default function PricingPage() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ paddingTop: 112, paddingBottom: 96 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p style={{ fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".18em", color: "var(--ink-mute)", marginBottom: 14 }}>Pricing</p>
            <h1 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(32px,5vw,60px)", letterSpacing: "-0.025em", color: "var(--ink)", marginBottom: 14, lineHeight: 1.04 }}>
              Simple, honest pricing.
            </h1>
            <p style={{ fontSize: 17, color: "var(--ink-soft)", maxWidth: 480, margin: "0 auto", lineHeight: 1.65 }}>
              Start free with 5 conversions. Upgrade to Pro for unlimited.
              The $299 lifetime deal is genuinely the best value.
            </p>
          </div>

          {/* Plan cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14, marginBottom: 72 }}>
            {plans.map(plan => (
              <div key={plan.id} style={{ padding: "32px 28px", border: `1px solid ${plan.dark ? "var(--ink)" : "var(--rule)"}`, borderRadius: 5, background: plan.dark ? "var(--ink)" : "var(--paper)", display: "flex", flexDirection: "column" }}>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: ".15em", color: plan.dark ? "rgba(250,250,249,.45)" : "var(--ink-mute)", marginBottom: 16 }}>{plan.name}</div>
                <div style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(32px,4vw,48px)", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 4, color: plan.dark ? "var(--paper)" : "var(--ink)" }}>{plan.price}</div>
                <div style={{ fontSize: 13, color: plan.dark ? "rgba(250,250,249,.5)" : "var(--ink-soft)", marginBottom: plan.alt ? 4 : 16 }}>{plan.period}</div>
                {plan.alt && <div style={{ fontSize: 12, color: "var(--clay)", marginBottom: 16 }}>{plan.alt}</div>}
                <p style={{ fontSize: 13.5, color: plan.dark ? "rgba(250,250,249,.6)" : "var(--ink-soft)", lineHeight: 1.6, marginBottom: 18 }}>{plan.desc}</p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7, flex: 1, marginBottom: 22 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13.5, color: plan.dark ? "rgba(250,250,249,.65)" : "var(--ink-soft)" }}>
                      <span style={{ color: plan.dark ? "var(--clay)" : "var(--ink-mute)", flexShrink: 0, fontFamily: "var(--f-mono)", fontSize: 11 }}>{plan.dark ? "✓" : "—"}</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} style={{ display: "block", textAlign: "center", padding: "11px 16px", borderRadius: 4, fontSize: 13.5, fontWeight: 500, textDecoration: "none", background: plan.dark ? "var(--clay)" : "transparent", color: plan.dark ? "var(--paper)" : "var(--ink)", border: `1px solid ${plan.dark ? "var(--clay)" : "var(--rule)"}`, transition: "all .18s" }} className={plan.dark ? "plan-cta-dark" : "plan-cta-light"}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div style={{ marginBottom: 72 }}>
            <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(24px,4vw,40px)", letterSpacing: "-0.02em", textAlign: "center", marginBottom: 32, color: "var(--ink)" }}>
              Full comparison
            </h2>
            <div style={{ overflowX: "auto", border: "1px solid var(--rule)", borderRadius: 5 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--rule)", background: "rgba(15,23,42,.04)" }}>
                    <th style={{ textAlign: "left", padding: "12px 18px", fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)", fontWeight: 500 }}>Feature</th>
                    {["Free","Pro","Lifetime","Team"].map(h => (
                      <th key={h} style={{ padding: "12px 14px", textAlign: "center", fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink)", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compRows.map((row, i) => (
                    <tr key={row.f} style={{ borderBottom: "1px solid var(--rule)", background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,.02)" }}>
                      <td style={{ padding: "10px 18px", fontSize: 13.5, color: "var(--ink-soft)" }}>{row.f}</td>
                      {[row.free, row.pro, row.lt, row.team].map((v, j) => (
                        <td key={j} style={{ padding: "10px 14px", textAlign: "center", fontSize: 13, color: v === "✓" ? "var(--clay)" : v === "—" ? "var(--ink-mute)" : "var(--ink)", fontFamily: (v === "✓" || v === "—") ? "var(--f-mono)" : "var(--f-sans)", fontWeight: v === "✓" ? 600 : 400 }}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div style={{ maxWidth: 680, margin: "0 auto", marginBottom: 60 }}>
            <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(22px,3.5vw,36px)", letterSpacing: "-0.02em", textAlign: "center", marginBottom: 28, color: "var(--ink)" }}>Pricing FAQ</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "var(--rule)", border: "1px solid var(--rule)" }}>
              {[
                { q: "What payment methods are accepted?", a: "All major credit/debit cards, UPI, net banking, and digital wallets via Razorpay." },
                { q: "Can I cancel my monthly subscription?", a: "Yes, cancel anytime from your dashboard. You keep access until the end of your billing period." },
                { q: "Is the Lifetime deal really lifetime?", a: "Yes — one payment of $299 gives you unlimited Pro access forever, including all future features." },
                { q: "Do I need a credit card for the free plan?", a: "No credit card required. Sign up with email or Google and get 5 free conversions instantly." },
                { q: "What counts as one conversion?", a: "Converting one NetSuite script file = one conversion. Re-converting the same script doesn't use an additional conversion." },
              ].map(f => (
                <div key={f.q} style={{ background: "var(--paper)", padding: "22px 24px" }}>
                  <h3 style={{ fontSize: 14.5, fontWeight: 500, color: "var(--ink)", marginBottom: 8, letterSpacing: "-0.01em" }}>{f.q}</h3>
                  <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.7 }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trust */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 28, paddingTop: 24, borderTop: "1px solid var(--rule)" }}>
            {[
              { icon: Shield,      text: "Secured by Razorpay" },
              { icon: CreditCard,  text: "Cards · UPI · Net Banking" },
              { icon: CheckCircle, text: "Cancel anytime (monthly plans)" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "var(--ink-soft)" }}>
                <Icon size={15} style={{ color: "var(--ink-mute)" }} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />

      <style>{`
        .plan-cta-light:hover { background: var(--ink) !important; color: var(--paper) !important; border-color: var(--ink) !important; transform: translateY(-1px); }
        .plan-cta-dark:hover  { background: #c23d15 !important; }
      `}</style>
    </div>
  )
}
