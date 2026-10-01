import { ArrowRight } from "lucide-react"
import { useStore } from "../../lib/store"
import { getUpgradeUrl } from "../../lib/api"
import Header from "../components/Header"

const plans = [
  {
    id: "lifetime",
    name: "Lifetime",
    price: "$299",
    period: "one time",
    alt: "Pay once — use forever",
    desc: "Every feature, no renewals.",
    features: ["Unlimited conversions", "All pro features", "All future updates"],
    dark: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "/month",
    alt: "Cancel anytime",
    desc: "For active migration projects.",
    features: ["Unlimited conversions", "Diff view + history", "ZIP export"],
    dark: false,
  },
]

export default function UpgradeView() {
  const { setView } = useStore()

  const handleUpgrade = (planId: string) => chrome.tabs.create({ url: getUpgradeUrl(planId) })

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Header showBack onBack={() => setView("script_list")} title="Upgrade Plan" />

      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Limit notice */}
        <div className="card" style={{ padding: "10px 12px", borderColor: "rgba(217,74,31,.25)", background: "rgba(217,74,31,.04)", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".12em", color: "var(--clay)", marginBottom: 4 }}>Free conversions used</p>
          <p style={{ fontSize: 11.5, color: "var(--ink-soft)", lineHeight: 1.55 }}>
            Upgrade to continue migrating your NetSuite scripts.
          </p>
        </div>

        {/* Plan cards */}
        {plans.map(plan => (
          <div key={plan.id} style={{
            border: `1px solid ${plan.dark ? "var(--ink)" : "var(--rule)"}`,
            borderRadius: 4, padding: "14px 16px",
            background: plan.dark ? "var(--ink)" : "var(--paper)",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".14em", color: plan.dark ? "rgba(250,250,249,.45)" : "var(--ink-mute)", marginBottom: 4 }}>
                  {plan.name}
                </p>
                <p style={{ fontSize: 12, color: plan.dark ? "rgba(250,250,249,.6)" : "var(--ink-soft)" }}>{plan.desc}</p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: 24, letterSpacing: "-0.02em", color: plan.dark ? "var(--paper)" : "var(--ink)" }}>{plan.price}</span>
                <span style={{ fontSize: 10.5, color: plan.dark ? "rgba(250,250,249,.45)" : "var(--ink-mute)", marginLeft: 3 }}>{plan.period}</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
              {plan.features.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11.5, color: plan.dark ? "rgba(250,250,249,.65)" : "var(--ink-soft)" }}>
                  <span style={{ color: plan.dark ? "var(--clay)" : "var(--ink-mute)", fontFamily: "var(--f-mono)", fontSize: 10 }}>{plan.dark ? "✓" : "—"}</span>
                  {f}
                </div>
              ))}
            </div>

            <button onClick={() => handleUpgrade(plan.id)}
              style={{
                width: "100%", padding: "8px 14px", borderRadius: 999,
                background: plan.dark ? "var(--clay)" : "transparent",
                color: plan.dark ? "var(--paper)" : "var(--ink)",
                border: `1px solid ${plan.dark ? "var(--clay)" : "var(--rule)"}`,
                fontSize: 12, fontWeight: 500, fontFamily: "var(--f-sans)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                transition: "background .2s",
              }}
              className={plan.dark ? "upgrade-btn-dark" : "upgrade-btn-light"}>
              {plan.id === "lifetime" ? "Buy Lifetime — $299" : "Get Pro"} <ArrowRight size={12} />
            </button>
          </div>
        ))}

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
