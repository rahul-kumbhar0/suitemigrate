import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Chrome, AlertTriangle, History, FileCode2, TrendingUp } from "lucide-react"

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = { plan: "free", conversions_used: 0, conversions_limit: 5 as number | null }
  if (user) {
    try {
      const { data } = await supabase
        .from("users").select("plan,conversions_used,conversions_limit")
        .eq("id", user.id).maybeSingle()
      if (data) profile = data
    } catch { /* use defaults */ }
  }

  const name     = user?.user_metadata?.name || user?.email?.split("@")[0] || "there"
  const first    = name.split(" ")[0]
  const used     = profile.conversions_used
  const limit    = profile.conversions_limit
  const plan     = profile.plan
  const pct      = limit ? Math.min((used / limit) * 100, 100) : 0
  const daysLeft = Math.ceil((new Date("2028-06-01").getTime() - Date.now()) / 86_400_000) // TODO: update to confirmed 2028.2 release date when Oracle announces it
  const planLabels: Record<string, string> = { free: "Free", pro: "Pro", lifetime: "Lifetime", team: "Team" }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(22px,4vw,36px)", letterSpacing: "-0.025em", color: "var(--ink)", marginBottom: 4, lineHeight: 1.1 }}>
            Welcome back, {first}.
          </h1>
          <p style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)" }}>
            {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>
        <span style={{
          fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".13em",
          padding: "5px 11px", borderRadius: 3,
          background: plan === "free" ? "rgba(15,23,42,.07)" : "rgba(217,74,31,.10)",
          color: plan === "free" ? "var(--ink-mute)" : "var(--clay)",
          border: "1px solid var(--rule)", whiteSpace: "nowrap",
        }}>
          {planLabels[plan] ?? "Free"}
          {plan === "free" && limit && ` · ${Math.max(limit - used, 0)} left`}
        </span>
      </div>

      {/* Install banner */}
      <div style={{ border: "1px solid var(--rule)", borderRadius: 6, padding: "20px 22px", marginBottom: 24, background: "rgba(217,74,31,.03)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--clay)", marginBottom: 6 }}>
              Get started
            </p>
            <h3 style={{ fontFamily: "var(--f-head)", fontWeight: 400, fontSize: 18, letterSpacing: "-0.01em", color: "var(--ink)", marginBottom: 6 }}>
              Install the Chrome extension to start scanning
            </h3>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.6 }}>
              Reads your existing NetSuite session — no credentials required. Open NetSuite, click the extension, and your full script inventory appears.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
            <a href="#" className="btn-pill" style={{ fontSize: 13, padding: "10px 20px" }}>
              <Chrome size={14} />
              Install free
            </a>
            {[
              { n: "01", t: "Install from Chrome Web Store" },
              { n: "02", t: "Open NetSuite tab" },
              { n: "03", t: "Scan & convert" },
            ].map(s => (
              <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: "var(--ink-mute)", width: 18, flexShrink: 0 }}>{s.n}</span>
                <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{s.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="dash-stat-grid" style={{ marginBottom: 24 }}>
        {[
          { label: "Conversions used",  value: limit ? `${used} / ${limit}` : `${used}`, sub: plan === "free" ? "free tier" : "unlimited" },
          { label: "Scripts scanned",   value: "0",                sub: "all accounts" },
          { label: "Accounts linked",   value: "0",                sub: "environments" },
          { label: "Days to 2028.2",    value: daysLeft.toString(), sub: "hard cutoff deadline" },
        ].map((s, i) => (
          <div key={s.label} style={{ background: "var(--paper)", padding: "18px 16px" }}>
            <p style={{ fontFamily: "var(--f-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)", marginBottom: 8 }}>{s.label}</p>
            <p style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(22px,3vw,32px)", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 3, color: i === 3 && daysLeft < 365 ? "var(--clay)" : "var(--ink)" }}>{s.value}</p>
            <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: "var(--ink-mute)" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Two-col */}
      <div className="dash-two-col">

        {/* Conversions */}
        <div style={{ border: "1px solid var(--rule)", borderRadius: 6, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid var(--rule)" }}>
            <div>
              <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)", marginBottom: 2 }}>Recent</p>
              <h3 style={{ fontFamily: "var(--f-head)", fontWeight: 400, fontSize: 16, color: "var(--ink)" }}>Conversions</h3>
            </div>
            <Link href="/dashboard/conversions" style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, color: "var(--ink-mute)", textDecoration: "none" }}
              className="view-all-link">
              View all →
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 20px", textAlign: "center" }}>
            <div style={{ width: 44, height: 44, border: "1px solid var(--rule)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <History size={20} style={{ color: "var(--ink-mute)" }} />
            </div>
            <p style={{ fontFamily: "var(--f-head)", fontWeight: 400, fontSize: 15, color: "var(--ink)", marginBottom: 5 }}>No conversions yet</p>
            <p style={{ fontSize: 12.5, color: "var(--ink-soft)", maxWidth: 280, lineHeight: 1.6, marginBottom: 18 }}>
              Install the extension and convert your first script.
            </p>
            <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 999, border: "1px solid var(--rule)", fontSize: 12.5, color: "var(--ink-soft)", textDecoration: "none" }}
              className="ghost-btn">
              <Chrome size={13} /> Get the extension
            </a>
          </div>
        </div>

        {/* Right cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Plan */}
          <div style={{ border: "1px solid var(--rule)", borderRadius: 6, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--rule)", background: "rgba(15,23,42,.03)" }}>
              <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)" }}>Your plan</p>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                <span style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: 28, letterSpacing: "-0.02em", color: "var(--ink)" }}>
                  {planLabels[plan] ?? "Free"}
                </span>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, color: "var(--ink-mute)" }}>
                  {limit ? `${used} / ${limit}` : `${used} / ∞`}
                </span>
              </div>
              {limit && (
                <div style={{ height: 2, background: "rgba(15,23,42,.08)", borderRadius: 999, marginBottom: 14, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: pct > 80 ? "var(--clay)" : "var(--ink)", borderRadius: 999, transition: "width .3s" }} />
                </div>
              )}
              {plan === "free" && (
                <div style={{ borderTop: "1px solid var(--rule)", paddingTop: 12 }}>
                  <p style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.55, marginBottom: 10 }}>
                    Pro: $29/month or <strong style={{ color: "var(--ink)" }}>$299 lifetime</strong>. Unlimited conversions.
                  </p>
                  <Link href="/dashboard/billing" className="btn-pill" style={{ fontSize: 11.5, padding: "8px 16px", display: "flex", justifyContent: "center" }}>
                    Upgrade →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Deadlines */}
          <div style={{ border: "1px solid var(--rule)", borderRadius: 6, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--rule)", background: "rgba(15,23,42,.03)", display: "flex", alignItems: "center", gap: 7 }}>
              <AlertTriangle size={12} style={{ color: "var(--clay)" }} />
              <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)" }}>Deadlines</p>
            </div>
            <div style={{ padding: "8px 10px" }}>
              {[
                { date: "2027.1", label: "SS 1.0 limited support",            color: "#b45309" },
                { date: "2028.1", label: "SS 2.0/2.x run as 2.1 by default", color: "#c2410c" },
                { date: "2028.2", label: "Hard cutoff — scripts must be 2.1", color: "var(--clay)" },
              ].map(d => (
                <div key={d.date} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 8px", borderBottom: "1px solid var(--rule)" }}>
                  <span style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{d.label}</span>
                  <span style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, fontWeight: 500, color: d.color }}>{d.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ border: "1px solid var(--rule)", borderRadius: 6, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--rule)", background: "rgba(15,23,42,.03)" }}>
              <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)" }}>Quick actions</p>
            </div>
            <div style={{ padding: "4px 8px" }}>
              {[
                { icon: FileCode2,     label: "Convert a script",   href: "/dashboard/conversions" },
                { icon: TrendingUp,    label: "View history",        href: "/dashboard/conversions" },
                { icon: AlertTriangle, label: "Billing & plans",     href: "/dashboard/billing" },
                { icon: Chrome,        label: "Get the extension",   href: "#" },
              ].map(a => (
                <Link key={a.label} href={a.href} className="dash-action-link"
                  style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 8px", borderBottom: "1px solid var(--rule)", fontSize: 13, color: "var(--ink-soft)", textDecoration: "none" }}>
                  <a.icon size={13} style={{ flexShrink: 0 }} />
                  {a.label}
                  <span style={{ marginLeft: "auto", fontFamily: "var(--f-mono)", fontSize: 11 }}>→</span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .view-all-link:hover  { color: var(--clay) !important; }
        .ghost-btn:hover      { border-color: var(--ink) !important; color: var(--ink) !important; }
        .dash-action-link:hover { color: var(--clay) !important; background: var(--paper-warm) !important; }
      `}</style>
    </div>
  )
}
