import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import {
  Zap, FileSearch, Clock, History, Chrome,
  ArrowRight, AlertTriangle, CheckCircle,
  Crown, TrendingUp, FileCode2, Sparkles,
} from "lucide-react"

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = { plan: "free", conversions_used: 0, conversions_limit: 5 as number | null }
  if (user) {
    const { data } = await supabase
      .from("users")
      .select("plan,conversions_used,conversions_limit")
      .eq("id", user.id)
      .single()
    if (data) profile = data
  }

  const name   = user?.user_metadata?.name || user?.email?.split("@")[0] || "there"
  const first  = name.split(" ")[0]
  const used   = profile.conversions_used
  const limit  = profile.conversions_limit
  const plan   = profile.plan
  const pct    = limit ? Math.min((used / limit) * 100, 100) : 0
  const daysLeft = Math.ceil((new Date("2028-01-01").getTime() - Date.now()) / 86_400_000)

  const planBadge = {
    free:     { label: "Free Plan",  cls: "border-[#2A3650] text-[#6B7A99]" },
    pro:      { label: "Pro",        cls: "border-[#F6C430]/30 text-[#F6C430] bg-[#F6C430]/8" },
    lifetime: { label: "Lifetime",   cls: "border-[#F6C430]/50 text-[#F6C430] bg-[#F6C430]/10" },
    team:     { label: "Team",       cls: "border-[#A78BFA]/30 text-[#A78BFA] bg-[#7C5CFC]/8" },
  }
  const badge = planBadge[plan as keyof typeof planBadge] ?? planBadge.free

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {first} 👋
          </h1>
          <p className="text-[#6B7A99] text-sm mt-1">
            Here&apos;s your migration overview.
          </p>
        </div>
        <span className={`self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${badge.cls}`}>
          <Crown className="h-3 w-3" />
          {badge.label}
          {plan === "free" && limit && ` — ${Math.max(limit - used, 0)} conversions left`}
        </span>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Zap,
            label: "Conversions Used",
            value: limit ? `${used} / ${limit}` : `${used} / ∞`,
            sub: plan === "free" ? "Free tier" : "Unlimited",
            iconCls: "bg-[#F6C430]/10 text-[#F6C430]",
          },
          {
            icon: FileSearch,
            label: "Scripts Scanned",
            value: "0",
            sub: "Across all accounts",
            iconCls: "bg-[#7C5CFC]/10 text-[#A78BFA]",
          },
          {
            icon: Chrome,
            label: "Accounts Linked",
            value: "0",
            sub: "NetSuite environments",
            iconCls: "bg-[#1F2A3C] text-[#6B7A99]",
          },
          {
            icon: Clock,
            label: "Days to 2028.1",
            value: daysLeft.toString(),
            sub: "Hard migration deadline",
            iconCls: "bg-red-500/10 text-red-400",
          },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-[#1F2A3C] bg-[#0F1420] p-5">
            <div className={`h-9 w-9 rounded-xl ${s.iconCls} flex items-center justify-center mb-4`}>
              <s.icon className="h-4 w-4" />
            </div>
            <p className="text-2xl font-extrabold text-white tracking-tight">{s.value}</p>
            <p className="text-xs text-[#6B7A99] mt-1 font-medium">{s.label}</p>
            <p className="text-xs text-[#434E66] mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Install banner ── */}
      <div className="rounded-2xl border border-[#2A3650] bg-[#0F1420] p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F6C430]/3 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="h-12 w-12 rounded-2xl bg-[#F6C430]/10 border border-[#F6C430]/20 flex items-center justify-center shrink-0">
            <Chrome className="h-6 w-6 text-[#F6C430]" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white mb-1">
              Install the Chrome extension to start scanning
            </h3>
            <p className="text-sm text-[#6B7A99] leading-relaxed">
              The extension reads your existing NetSuite browser session — no API keys, no credentials.
              Open NetSuite, click the extension, and your scripts appear in seconds.
            </p>
          </div>
          <a href="#" className="shrink-0">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F6C430] hover:bg-[#FFD24D] text-[#0A0E1A] text-sm font-bold transition-all shadow-lg whitespace-nowrap">
              <Chrome className="h-4 w-4" />
              Install Extension
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </a>
        </div>
        <div className="relative mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { n: "1", text: "Install from Chrome Web Store" },
            { n: "2", text: "Open NetSuite — scans automatically" },
            { n: "3", text: "Convert scripts and download results" },
          ].map((s) => (
            <div key={s.n} className="flex items-center gap-3 p-3 rounded-xl border border-[#1F2A3C] bg-[#141926]">
              <div className="h-6 w-6 rounded-lg bg-[#F6C430]/10 border border-[#F6C430]/20 flex items-center justify-center text-xs font-bold text-[#F6C430] shrink-0">
                {s.n}
              </div>
              <span className="text-xs text-[#A8B4CC]">{s.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent conversions — 2/3 */}
        <div className="lg:col-span-2 rounded-2xl border border-[#1F2A3C] bg-[#0F1420] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1F2A3C]">
            <div>
              <h2 className="font-bold text-white text-sm">Recent Conversions</h2>
              <p className="text-xs text-[#6B7A99] mt-0.5">Your last converted scripts</p>
            </div>
            <Link
              href="/dashboard/conversions"
              className="flex items-center gap-1 text-xs text-[#6B7A99] hover:text-white transition-colors"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {/* Empty state */}
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="h-14 w-14 rounded-2xl border border-[#2A3650] bg-[#141926] flex items-center justify-center mb-5">
              <History className="h-6 w-6 text-[#434E66]" />
            </div>
            <p className="font-semibold text-white text-sm mb-1.5">No conversions yet</p>
            <p className="text-xs text-[#6B7A99] max-w-xs leading-relaxed mb-6">
              Install the extension, open NetSuite, and click Convert on any script.
              Your history will appear here.
            </p>
            <a href="#">
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#2A3650] text-sm text-[#A8B4CC] hover:text-white hover:border-[#394A66] transition-all">
                <Chrome className="h-3.5 w-3.5" />
                Get the Extension
              </button>
            </a>
          </div>
        </div>

        {/* Right column — 1/3 */}
        <div className="space-y-4">

          {/* Plan card */}
          <div className="rounded-2xl border border-[#1F2A3C] bg-[#0F1420] p-5">
            <h3 className="font-bold text-white text-sm mb-4">Your Plan</h3>
            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6B7A99]">Current plan</span>
                <span className="text-xs font-semibold text-white capitalize">{plan}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6B7A99]">Conversions</span>
                <span className="text-xs font-semibold text-white">
                  {limit ? `${used} / ${limit}` : `${used} / ∞`}
                </span>
              </div>
              {limit && (
                <div className="w-full bg-[#1F2A3C] rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-[#F6C430] to-[#7C5CFC] transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )}
            </div>

            {plan === "free" && (
              <div className="rounded-xl border border-[#F6C430]/20 bg-[#F6C430]/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-[#F6C430]" />
                  <p className="text-sm font-bold text-white">Go unlimited</p>
                </div>
                <p className="text-xs text-[#A8B4CC] leading-relaxed mb-3">
                  Pro — $29/mo or <strong className="text-[#F6C430]">$299 lifetime</strong>. Convert every script, forever.
                </p>
                <Link href="/dashboard/billing">
                  <button className="w-full py-2 rounded-lg bg-[#F6C430] hover:bg-[#FFD24D] text-[#0A0E1A] text-xs font-bold transition-all">
                    Upgrade to Pro →
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Deadline tracker */}
          <div className="rounded-2xl border border-[#1F2A3C] bg-[#0F1420] p-5">
            <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-[#F6C430]" />
              Migration Deadlines
            </h3>
            <div className="space-y-3">
              {[
                { date: "2027.1", label: "SS 1.0 limited support",  dot: "bg-[#F6C430]",  txt: "text-[#F6C430]" },
                { date: "2028.1", label: "2.1 runs by default",      dot: "bg-orange-500", txt: "text-orange-400" },
                { date: "2028.2", label: "Hard cutoff",              dot: "bg-red-500",    txt: "text-red-400" },
              ].map((d) => (
                <div key={d.date} className="flex items-center gap-3 p-3 rounded-xl border border-[#1F2A3C] bg-[#141926]">
                  <div className={`h-2 w-2 rounded-full ${d.dot} shrink-0`} />
                  <span className="flex-1 text-xs text-[#6B7A99]">{d.label}</span>
                  <span className={`text-xs font-bold font-mono ${d.txt}`}>{d.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="rounded-2xl border border-[#1F2A3C] bg-[#0F1420] p-5">
            <h3 className="font-bold text-white text-sm mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { icon: FileCode2,   label: "Convert a script",     href: "/dashboard/conversions", color: "text-[#F6C430]",  bg: "bg-[#F6C430]/10"  },
                { icon: TrendingUp,  label: "View history",          href: "/dashboard/conversions", color: "text-[#A78BFA]",  bg: "bg-[#7C5CFC]/10"  },
                { icon: Crown,       label: "Manage billing",         href: "/dashboard/billing",     color: "text-green-400",  bg: "bg-green-500/10"  },
                { icon: FileSearch,  label: "Account settings",      href: "/dashboard/settings",    color: "text-[#6B7A99]",  bg: "bg-[#1F2A3C]"     },
              ].map((a) => (
                <Link key={a.label} href={a.href}>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#141926] transition-all cursor-pointer group">
                    <div className={`h-7 w-7 rounded-lg ${a.bg} flex items-center justify-center shrink-0`}>
                      <a.icon className={`h-3.5 w-3.5 ${a.color}`} />
                    </div>
                    <span className="text-sm text-[#A8B4CC] group-hover:text-white transition-colors">{a.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#434E66] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
