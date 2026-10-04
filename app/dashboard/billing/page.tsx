import { createClient } from "@/lib/supabase/server"
import { CheckCircle, Shield, CreditCard } from "lucide-react"
import Link from "next/link"

// E13: Only show plans that exist. Team card removed until Team features are implemented.
// Features listed match what is actually gated server-side.
// [OWNER TO CONFIRM] prices before launch.
const plans = [
  {
    id: "pro",
    name: "Pro",
    price: "$29",              // [OWNER TO CONFIRM]
    period: "/ month",
    alt: "or one-time Migration Pass · [OWNER TO CONFIRM price]",
    altClay: true,
    desc: "One developer, one migration. Unlimited conversions.",
    features: [
      "Unlimited script conversions",
      "Batch conversion (whole account at once)",
      "HTML audit report export",
      "Conversion history",
      "Priority conversion queue",
    ],
    cta: "Get Pro",
    dark: false,
  },
  {
    id: "lifetime",
    name: "Early-adopter Lifetime",
    price: "[OWNER TO CONFIRM]",  // [OWNER TO CONFIRM] price and availability
    period: "one time",
    alt: "Pay once — use forever · limited availability [OWNER TO CONFIRM end date]",
    altClay: false,
    desc: "Every Pro feature, no renewals, all future updates.",
    features: [
      "Everything in Pro",
      "Lifetime access — no renewals",
      "All future features included",
      "Priority conversion queue",
    ],
    cta: "Get Lifetime Deal",
    dark: true,
  },
]

export default async function BillingPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = { plan: "free", conversions_used: 0, conversions_limit: 5 as number | null }
  if (user) {
    try {
      const { data } = await supabase
        .from("users")
        .select("plan,conversions_used,conversions_limit")
        .eq("id", user.id)
        .maybeSingle()
      if (data) profile = data
    } catch {
      // use defaults
    }
  }

  const planLabels: Record<string, string> = { free: "Free", pro: "Pro", lifetime: "Lifetime", team: "Team" }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(24px,3.5vw,38px)", letterSpacing: "-0.025em", color: "var(--ink)", marginBottom: 6 }}>
          Billing &amp; Plans
        </h1>
        <p style={{ fontFamily: "var(--f-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)" }}>
          Manage your subscription
        </p>
      </div>

      {/* Current plan */}
      <div style={{ border: "1px solid var(--rule)", borderRadius: 6, padding: "24px 28px", marginBottom: 40, background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)", marginBottom: 8 }}>Current plan</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: 36, letterSpacing: "-0.025em", color: "var(--ink)" }}>
              {planLabels[profile.plan] ?? "Free"}
            </span>
            <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--ink-mute)" }}>
              {profile.conversions_limit
                ? `${profile.conversions_used} / ${profile.conversions_limit} conversions`
                : `${profile.conversions_used} conversions · unlimited`}
            </span>
          </div>
        </div>
        <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".14em", padding: "6px 14px", borderRadius: 3, background: profile.plan === "free" ? "rgba(15,23,42,.07)" : "rgba(217,74,31,.10)", color: profile.plan === "free" ? "var(--ink-mute)" : "var(--clay)", border: "1px solid var(--rule)" }}>
          Active
        </span>
      </div>

      {/* Section label */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2.2fr", gap: 60, marginBottom: 40, alignItems: "flex-end" }}>
        <div className="section-num">Upgrade your plan</div>
        <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(24px,3vw,40px)", letterSpacing: "-0.025em", color: "var(--ink)", lineHeight: 1.04 }}>
          Unlimited conversions.{" "}
          <span style={{ color: "var(--clay)", fontStyle: "italic" }}>No limits.</span>
        </h2>
      </div>

      {/* Plan cards — 2 col max since Team card removed pending Team features */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 40, maxWidth: 640 }}>
        {plans.map((plan) => (
          <div key={plan.id} style={{
            padding: 32, borderRadius: 6,
            background: plan.dark ? "var(--ink)" : "var(--paper)",
            border: `1px solid ${plan.dark ? "var(--ink)" : "var(--rule)"}`,
            display: "flex", flexDirection: "column",
            transition: "transform .18s",
          }}>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: ".15em", color: plan.dark ? "rgba(250,250,249,.5)" : "var(--ink-mute)", marginBottom: 18 }}>
              {plan.name}
            </div>
            <div style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: 48, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 4, color: plan.dark ? "var(--paper)" : "var(--ink)" }}>
              {plan.price}
            </div>
            <div style={{ fontSize: 13, color: plan.dark ? "rgba(250,250,249,.5)" : "var(--ink-soft)", marginBottom: 4 }}>{plan.period}</div>
            <div style={{ fontSize: 12.5, color: plan.altClay ? "var(--clay)" : plan.dark ? "rgba(250,250,249,.4)" : "var(--ink-mute)", marginBottom: 20 }}>{plan.alt}</div>
            <p style={{ fontSize: 13.5, color: plan.dark ? "rgba(250,250,249,.6)" : "var(--ink-soft)", lineHeight: 1.6, marginBottom: 20 }}>{plan.desc}</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8, flex: 1, marginBottom: 24 }}>
              {plan.features.map(f => (
                <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13.5, color: plan.dark ? "rgba(250,250,249,.65)" : "var(--ink-soft)" }}>
                  <span style={{ color: plan.dark ? "var(--clay)" : "var(--ink-mute)", flexShrink: 0, fontFamily: "var(--f-mono)" }}>
                    {plan.dark ? "✓" : "—"}
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href={`/api/payments/checkout?plan=${plan.id}`} style={{
              display: "block", textAlign: "center", padding: "12px 20px", borderRadius: 4,
              fontSize: 13.5, fontWeight: 500, fontFamily: "var(--f-sans)", textDecoration: "none",
              background: plan.dark ? "var(--clay)" : "transparent",
              color: plan.dark ? "var(--paper)" : "var(--ink)",
              border: `1px solid ${plan.dark ? "var(--clay)" : "var(--rule)"}`,
              transition: "background .18s, color .18s, transform .16s",
            }} className={`billing-cta${plan.dark ? " billing-cta--dark" : ""}`}>
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Trust row */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 28, paddingTop: 20, borderTop: "1px solid var(--rule)" }}>
        {[
          { icon: Shield,      text: "Secured by Razorpay" },
          { icon: CreditCard,  text: "Cards · UPI · Net Banking" },
          { icon: CheckCircle, text: "Cancel anytime (monthly plans)" },
        ].map(({ icon: Icon, text }) => (
          <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink-soft)" }}>
            <Icon size={14} style={{ color: "var(--ink-mute)" }} />
            {text}
          </div>
        ))}
      </div>

      <style>{`
        .billing-cta:hover { background: var(--ink) !important; color: var(--paper) !important; border-color: var(--ink) !important; transform: translateY(-1px); }
        .billing-cta--dark:hover { background: #c23d15 !important; }
      `}</style>
    </div>
  )
}
