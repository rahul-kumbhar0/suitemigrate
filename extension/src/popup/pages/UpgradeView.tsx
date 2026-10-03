/**
 * UpgradeView — Item 7 of extension fix brief
 *
 * Changes:
 * - Added Team plan card (placeholder price [OWNER TO CONFIRM])
 * - Features match what is actually gated server-side (PDF, batch, ZIP, history)
 * - "Diff view" removed — it exists but is NOT gated (available on free plan)
 * - Upgrade link goes to /dashboard/billing, not the raw checkout API
 */

import { ArrowRight } from "lucide-react"
import { useStore } from "../../lib/store"
import { getUpgradeUrl } from "../../lib/api"
import Header from "../components/Header"

const plans = [
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "/month",
    altLine: "or Migration Pass — one-time · [OWNER TO CONFIRM price]",
    audience: "One developer, one migration",
    desc: "Unlimited conversions and the full export toolkit.",
    dark: true,
    features: [
      "Unlimited conversions",
      "Batch conversion (whole account)",
      "ZIP export of all scripts",
      "PDF audit report",
      "Conversion history",
      "Priority queue",
    ],
  },
  {
    id: "team",
    name: "Team",
    price: "[OWNER TO CONFIRM]", // §7.6 placeholder
    period: "/month",
    altLine: "Multiple seats included",
    audience: "Consultants managing multiple clients",
    desc: "Everything in Pro, across multiple client accounts.",
    dark: false,
    features: [
      "Everything in Pro",
      "Multiple NetSuite accounts",
      "Shared conversion history",
      "Client-branded PDF reports",
      "Multiple seats",
    ],
  },
]

export default function UpgradeView() {
  const { setView } = useStore()

  const handleUpgrade = (planId: string) => {
    // Opens the billing page, not the raw checkout API
    chrome.tabs.create({ url: getUpgradeUrl(planId) })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Header showBack onBack={() => setView("script_list")} title="Upgrade Plan" />

      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>

        {/* Limit notice */}
        <div className="card" style={{ padding: "10px 12px", borderColor: "rgba(217,74,31,.25)", background: "rgba(217,74,31,.04)", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".12em", color: "var(--clay)", marginBottom: 4 }}>
            Free conversions used
          </p>
          <p style={{ fontSize: 11.5, color: "var(--ink-soft)", lineHeight: 1.55 }}>
            You&apos;ve used your 5 free conversions. Upgrade to continue migrating.
          </p>
        </div>

        {/* Plan cards */}
        {plans.map(plan => (
          <div key={plan.id} style={{
            border: `1px solid ${plan.dark ? "var(--ink)" : "var(--rule)"}`,
            borderRadius: 4, padding: "14px 16px",
            background: plan.dark ? "var(--ink)" : "var(--paper)",
          }}>
            {/* Plan header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
              <div>
                <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".14em", color: plan.dark ? "rgba(250,250,249,.45)" : "var(--ink-mute)", marginBottom: 2 }}>
                  {plan.name}
                </p>
                <p style={{ fontSize: 11, fontStyle: "italic", color: plan.dark ? "rgba(250,250,249,.5)" : "var(--ink-mute)" }}>
                  {plan.audience}
                </p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: 22, letterSpacing: "-0.02em", color: plan.dark ? "var(--paper)" : "var(--ink)" }}>
                  {plan.price}
                </span>
                <span style={{ fontSize: 10.5, color: plan.dark ? "rgba(250,250,249,.45)" : "var(--ink-mute)", marginLeft: 2 }}>
                  {plan.period}
                </span>
              </div>
            </div>

            {/* Alt line */}
            <p style={{ fontFamily: "var(--f-mono)", fontSize: 9, color: plan.dark ? "rgba(250,250,249,.35)" : "var(--ink-mute)", marginBottom: 10, letterSpacing: ".04em" }}>
              {plan.altLine}
            </p>

            {/* Features — only gated ones listed */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
              {plan.features.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11.5, color: plan.dark ? "rgba(250,250,249,.7)" : "var(--ink-soft)" }}>
                  <span style={{ color: plan.dark ? "var(--clay)" : "var(--clay)", fontFamily: "var(--f-mono)", fontSize: 10 }}>✓</span>
                  {f}
                </div>
              ))}
            </div>

            <button
              onClick={() => handleUpgrade(plan.id)}
              className={plan.dark ? "upgrade-btn-dark" : "upgrade-btn-light"}
              style={{
                width: "100%", padding: "8px 14px", borderRadius: 999,
                background: plan.dark ? "var(--clay)" : "transparent",
                color: plan.dark ? "var(--paper)" : "var(--ink)",
                border: `1px solid ${plan.dark ? "var(--clay)" : "var(--rule)"}`,
                fontSize: 12, fontWeight: 500, fontFamily: "var(--f-sans)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                transition: "background .2s",
              }}
            >
              Get {plan.name} <ArrowRight size={12} />
            </button>
          </div>
        ))}

        {/* Early-adopter lifetime note */}
        <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: "var(--ink-mute)", textAlign: "center", lineHeight: 1.6 }}>
          Lifetime deal also available on the website — [OWNER TO CONFIRM price &amp; end date]
        </p>

        <p style={{ fontFamily: "var(--f-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--ink-mute)", textAlign: "center" }}>
          Secured by Razorpay · UPI · Cards · Net Banking
        </p>
      </div>

      <style>{`
        .upgrade-btn-dark:hover  { background: #c23d15 !important; }
        .upgrade-btn-light:hover { background: var(--paper-warm) !important; }
      `}</style>
    </div>
  )
}
