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
        .from("users")
        .select("plan,conversions_used,conversions_limit")
        .eq("id", user.id)
        .maybeSingle()
      if (data) profile = data
    } catch {
      // use defaults
    }
  }

  const name     = user?.user_metadata?.name || user?.email?.split("@")[0] || "there"
  const first    = name.split(" ")[0]
  const used     = profile.conversions_used
  const limit    = profile.conversions_limit
  const plan     = profile.plan
  const pct      = limit ? Math.min((used / limit) * 100, 100) : 0
  const daysLeft = Math.ceil((new Date("2028-01-01").getTime() - Date.now()) / 86_400_000)

  const planLabels: Record<string, string> = { free: "Free", pro: "Pro", lifetime: "Lifetime", team: "Team" }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>

      {/* Page header */}
      <div style={{ marginBottom: 40, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(28px,4vw,42px)", letterSpacing: "-0.025em", color: "var(--ink)", lineHeight: 1.1, marginBottom: 6 }}>
            Welcome back, {first}.
          </h1>
          <p style={{ fontFamily: "var(--f-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)" }}>
            SuiteMigrate dashboard · {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>
        <span className={`db-plan-badge ${plan !== "free" ? "db-plan-badge--paid" : ""}`}>
          {planLabels[plan] ?? "Free"} plan
          {plan === "free" && limit && ` · ${Math.max(limit - used, 0)} conversions left`}
        </span>
      </div>

      {/* Install banner */}
      <div className="db-card" style={{ padding: "28px 30px", marginBottom: 32, background: "rgba(217,74,31,.03)", display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <p style={{ fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--clay)", marginBottom: 8 }}>Get started</p>
          <h3 style={{ fontFamily: "var(--f-head)", fontWeight: 400, fontSize: 20, letterSpacing: "-0.015em", color: "var(--ink)", marginBottom: 8 }}>
            Install the Chrome extension to start scanning
          </h3>
          <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.65 }}>
            The extension reads your existing NetSuite browser session — no credentials required.
            Open NetSuite, click the extension, and your full script inventory appears in 60 seconds.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, flexShrink: 0 }}>
          <a href="#" className="btn-pill" style={{ fontSize: 13 }}>
            <Chrome size={14} />
            Install free on Chrome
          </a>
          {[
            { n: "01", t: "Install from Chrome Web Store" },
            { n: "02", t: "Open NetSuite — scans automatically" },
            { n: "03", t: "Convert and download results" },
          ].map(s => (
            <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: "var(--ink-mute)", width: 20, flexShrink: 0 }}>{s.n}</span>
              <span style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{s.t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: "var(--rule)", border: "1px solid var(--rule)", borderRadius: 6, overflow: "hidden", marginBottom: 32 }}>
        {[
          { label: "Conversions used", value: limit ? `${used} / ${limit}` : `${used}`, sub: plan === "free" ? "free tier" : "unlimited", warn: false },
          { label: "Scripts scanned",  value: "0",               sub: "across all accounts",    warn: false },
          { label: "Accounts linked",  value: "0",               sub: "NetSuite environments",  warn: false },
          { label: "Days to 2028.1",   value: daysLeft.toString(), sub: "hard deadline",         warn: daysLeft < 365 },
        ].map((s) => (
          <div key={s.label} style={{ background: "var(--paper)", padding: "24px 22px" }}>
            <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)", marginBottom: 10 }}>{s.label}</p>
            <p style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: 34, letterSpacing: "-0.025em", lineHeight: 1, marginBottom: 4, color: s.warn ? "var(--clay)" : "var(--ink)" }}>{s.value}</p>
            <p style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--ink-mute)", letterSpacing: ".06em" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Main 2-col */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>

        {/* Recent conversions */}
        <div className="db-card" style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid var(--rule)" }}>
            <div>
              <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)", marginBottom: 3 }}>Recent</p>
              <h3 style={{ fontFamily: "var(--f-head)", fontWeight: 400, fontSize: 17, letterSpacing: "-0.015em", color: "var(--ink)" }}>Conversions</h3>
            </div>
            <Link href="/dashboard/conversions" className="db-meta-link">View all →</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "56px 24px", textAlign: "center" }}>
            <div style={{ width: 48, height: 48, border: "1px solid var(--rule)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
              <History size={22} style={{ color: "var(--ink-mute)" }} />
            </div>
            <p style={{ fontFamily: "var(--f-head)", fontWeight: 400, fontSize: 16, color: "var(--ink)", marginBottom: 6 }}>No conversions yet</p>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", maxWidth: 300, lineHeight: 1.6, marginBottom: 20 }}>
              Install the Chrome extension, open NetSuite, and your first conversion will appear here.
            </p>
            <a href="#" className="db-ghost-btn">
              <Chrome size={13} /> Get the extension
            </a>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Plan card */}
          <div className="db-card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--rule)" }}>
              <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)" }}>Your plan</p>
            </div>
            <div style={{ padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                <span style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: 32, letterSpacing: "-0.025em", color: "var(--ink)" }}>
                  {planLabels[plan] ?? "Free"}
                </span>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--ink-mute)" }}>
                  {limit ? `${used} / ${limit}` : `${used} / ∞`}
                </span>
              </div>
              {limit && (
                <div style={{ height: 3, background: "rgba(15,23,42,.08)", borderRadius: 999, marginBottom: 16, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: pct > 80 ? "var(--clay)" : "var(--ink)", borderRadius: 999, transition: "width .3s" }} />
                </div>
              )}
              {plan === "free" && (
                <div style={{ borderTop: "1px solid var(--rule)", paddingTop: 14 }}>
                  <p style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.55, marginBottom: 12 }}>
                    Upgrade to Pro for unlimited conversions — $29/mo or <strong style={{ color: "var(--ink)" }}>$299 lifetime.</strong>
                  </p>
                  <Link href="/dashboard/billing" className="db-pill-link">Upgrade plan →</Link>
                </div>
              )}
            </div>
          </div>

          {/* Deadlines */}
          <div className="db-card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--rule)", display: "flex", alignItems: "center", gap: 8 }}>
              <AlertTriangle size={13} style={{ color: "var(--clay)", flexShrink: 0 }} />
              <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)" }}>Migration deadlines</p>
            </div>
            <div style={{ padding: "6px 10px" }}>
              {[
                { date: "2027.1", label: "SS 1.0 limited support", color: "#b45309" },
                { date: "2028.1", label: "2.1 runs by default",     color: "#c2410c" },
                { date: "2028.2", label: "Hard cutoff",             color: "var(--clay)" },
              ].map((d) => (
                <div key={d.date} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 8px", borderBottom: "1px solid var(--rule)" }}>
                  <span style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{d.label}</span>
                  <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, fontWeight: 500, color: d.color }}>{d.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="db-card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--rule)" }}>
              <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)" }}>Quick actions</p>
            </div>
            <div style={{ padding: "6px 10px" }}>
              {[
                { icon: FileCode2,     label: "Convert a script",   href: "/dashboard/conversions" },
                { icon: TrendingUp,    label: "View history",        href: "/dashboard/conversions" },
                { icon: Chrome,        label: "Get the extension",   href: "#" },
                { icon: AlertTriangle, label: "Manage billing",      href: "/dashboard/billing" },
              ].map((a) => (
                <Link key={a.label} href={a.href} className="db-action-link">
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
        .db-card {
          border: 1px solid var(--rule);
          border-radius: 6px;
          background: var(--paper);
        }
        .db-plan-badge {
          font-family: var(--f-mono);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: .14em;
          padding: 6px 12px;
          border-radius: 3px;
          background: rgba(15,23,42,.07);
          color: var(--ink-mute);
          border: 1px solid var(--rule);
        }
        .db-plan-badge--paid {
          background: rgba(217,74,31,.10);
          color: var(--clay);
        }
        .db-meta-link {
          font-size: 12px;
          font-family: var(--f-mono);
          color: var(--ink-mute);
          text-decoration: none;
          letter-spacing: .04em;
          transition: color .18s;
        }
        .db-meta-link:hover { color: var(--clay); }
        .db-ghost-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          border-radius: 999px;
          border: 1px solid var(--rule);
          font-size: 12.5px;
          font-family: var(--f-sans);
          color: var(--ink-soft);
          text-decoration: none;
          transition: border-color .2s, color .2s;
        }
        .db-ghost-btn:hover { border-color: var(--ink); color: var(--ink); }
        .db-pill-link {
          display: block;
          text-align: center;
          width: 100%;
          padding: 10px 16px;
          border-radius: 999px;
          background: var(--ink);
          color: var(--paper);
          font-size: 12.5px;
          font-family: var(--f-sans);
          font-weight: 500;
          text-decoration: none;
          transition: background .2s;
        }
        .db-pill-link:hover { background: var(--clay); }
        .db-action-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 8px;
          border-bottom: 1px solid var(--rule);
          font-size: 13px;
          color: var(--ink-soft);
          text-decoration: none;
          transition: color .14s;
        }
        .db-action-link:hover { color: var(--clay); }
      `}</style>
    </div>
  )
}
