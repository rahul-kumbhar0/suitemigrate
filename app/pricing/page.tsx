import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { CheckCircle, Shield, CreditCard } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    dark: false,
    desc: "Start with the migration inventory and five complete conversions.",
    features: [
      "Unlimited active-script scans",
      "Version-based migration priority",
      "5 AI-assisted conversions",
      "Code, Changes & Inline review",
      "Converted JavaScript downloads",
    ],
    cta: "Start free — no card",
    href: "/signup",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "/ month",
    dark: true,
    desc: "For an active SuiteScript migration project that needs unlimited conversions.",
    features: [
      "Everything in Free",
      "Unlimited script conversions",
      "Migration Readiness Report",
      "Conversion history",
      "Manual-review flags",
    ],
    cta: "Get Pro",
    href: "/signup?plan=pro",
  },
  {
    id: "annual",
    name: "Annual Pro",
    price: "$299",
    period: "/ year",
    dark: false,
    desc: "Twelve months of Pro access at a lower annual price.",
    features: [
      "Everything currently in Pro",
      "Unlimited script conversions",
      "Migration Readiness Report",
      "One annual payment",
    ],
    cta: "Get Annual",
    href: "/signup?plan=annual",
  },
]

const compRows = [
  { f: "Active-script scan", free: "✓", pro: "✓", lt: "✓" },
  { f: "Version-based migration priority", free: "✓", pro: "✓", lt: "✓" },
  { f: "Script conversions", free: "5", pro: "Unlimited", lt: "Unlimited" },
  { f: "Code / Changes / Inline review", free: "✓", pro: "✓", lt: "✓" },
  { f: "Converted JavaScript download", free: "✓", pro: "✓", lt: "✓" },
  { f: "Migration Readiness Report", free: "—", pro: "✓", lt: "✓" },
]

export default function PricingPage() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ paddingTop: 112, paddingBottom: 96 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p style={{ fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".18em", color: "var(--ink-mute)", marginBottom: 14 }}>Pricing</p>
            <h1 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(32px,5vw,60px)", letterSpacing: "-0.025em", color: "var(--ink)", marginBottom: 14, lineHeight: 1.04 }}>
              Simple migration pricing.
            </h1>
            <p style={{ fontSize: 17, color: "var(--ink-soft)", maxWidth: 560, margin: "0 auto", lineHeight: 1.65 }}>
              Start free with 5 conversions. Upgrade only when you need unlimited migration work or the Migration Readiness Report.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 14, marginBottom: 72 }}>
            {plans.map(plan => (
              <div key={plan.id} style={{ padding: "32px 28px", border: `1px solid ${plan.dark ? "var(--ink)" : "var(--rule)"}`, borderRadius: 5, background: plan.dark ? "var(--ink)" : "var(--paper)", display: "flex", flexDirection: "column" }}>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: ".15em", color: plan.dark ? "rgba(250,250,249,.45)" : "var(--ink-mute)", marginBottom: 16 }}>{plan.name}</div>
                <div style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(32px,4vw,48px)", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 4, color: plan.dark ? "var(--paper)" : "var(--ink)" }}>{plan.price}</div>
                <div style={{ fontSize: 13, color: plan.dark ? "rgba(250,250,249,.5)" : "var(--ink-soft)", marginBottom: 16 }}>{plan.period}</div>
                <p style={{ fontSize: 13.5, color: plan.dark ? "rgba(250,250,249,.6)" : "var(--ink-soft)", lineHeight: 1.6, marginBottom: 18 }}>{plan.desc}</p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7, flex: 1, marginBottom: 22, padding: 0 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13.5, color: plan.dark ? "rgba(250,250,249,.65)" : "var(--ink-soft)" }}>
                      <span style={{ color: "var(--clay)", flexShrink: 0, fontFamily: "var(--f-mono)", fontSize: 11 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} style={{ display: "block", textAlign: "center", padding: "11px 16px", borderRadius: 4, fontSize: 13.5, fontWeight: 500, textDecoration: "none", background: plan.dark ? "var(--clay)" : "transparent", color: plan.dark ? "var(--paper)" : "var(--ink)", border: `1px solid ${plan.dark ? "var(--clay)" : "var(--rule)"}` }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 72 }}>
            <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(24px,4vw,40px)", letterSpacing: "-0.02em", textAlign: "center", marginBottom: 32, color: "var(--ink)" }}>
              Compare plans
            </h2>
            <div style={{ overflowX: "auto", border: "1px solid var(--rule)", borderRadius: 5 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--rule)", background: "rgba(15,23,42,.04)" }}>
                    <th style={{ textAlign: "left", padding: "12px 18px", fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)", fontWeight: 500 }}>Feature</th>
                    {["Free","Pro","Annual"].map(h => (
                      <th key={h} style={{ padding: "12px 14px", textAlign: "center", fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink)", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compRows.map((row, i) => (
                    <tr key={row.f} style={{ borderBottom: "1px solid var(--rule)", background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,.02)" }}>
                      <td style={{ padding: "10px 18px", fontSize: 13.5, color: "var(--ink-soft)" }}>{row.f}</td>
                      {[row.free, row.pro, row.lt].map((v, j) => (
                        <td key={j} style={{ padding: "10px 14px", textAlign: "center", fontSize: 13, color: v === "✓" ? "var(--clay)" : v === "—" ? "var(--ink-mute)" : "var(--ink)" }}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ maxWidth: 680, margin: "0 auto 60px" }}>
            <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(22px,3.5vw,36px)", letterSpacing: "-0.02em", textAlign: "center", marginBottom: 28, color: "var(--ink)" }}>Pricing FAQ</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "var(--rule)", border: "1px solid var(--rule)" }}>
              {[
                { q: "Do I need a credit card for Free?", a: "No. Create an account and use the five included conversions." },
                { q: "Can I cancel Pro?", a: "Yes. You can cancel the monthly plan and keep access through the paid billing period." },
                { q: "What does Annual Pro mean?", a: "A $299 payment gives 12 months of Pro access. That is $49 less than paying $29 monthly for 12 months." },
                { q: "What counts as one conversion?", a: "Each successful AI conversion request counts toward the Free plan usage. Failed requests that do not complete processing are released from the quota." },
              ].map(f => (
                <div key={f.q} style={{ background: "var(--paper)", padding: "22px 24px" }}>
                  <h3 style={{ fontSize: 14.5, fontWeight: 500, color: "var(--ink)", marginBottom: 8 }}>{f.q}</h3>
                  <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.7 }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 28, paddingTop: 24, borderTop: "1px solid var(--rule)" }}>
            {[
              { icon: Shield, text: "Secured by Razorpay" },
              { icon: CreditCard, text: "Prices shown in USD" },
              { icon: CheckCircle, text: "7-day initial purchase refund policy" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "var(--ink-soft)" }}>
                <Icon size={15} style={{ color: "var(--ink-mute)" }} />{text}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
