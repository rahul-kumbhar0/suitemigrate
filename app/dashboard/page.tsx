import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import {
  Zap, FileSearch, Clock, History, Chrome,
  ArrowRight, AlertTriangle, CheckCircle, FileCode2,
} from "lucide-react"

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Load user profile from DB
  let profile: { plan: string; conversions_used: number; conversions_limit: number | null } = {
    plan: "free",
    conversions_used: 0,
    conversions_limit: 5,
  }
  if (user) {
    const { data } = await supabase.from("users").select("plan,conversions_used,conversions_limit").eq("id", user.id).single()
    if (data) profile = data
  }

  const name  = user?.user_metadata?.name || user?.email?.split("@")[0] || "there"
  const first = name.split(" ")[0]
  const used  = profile.conversions_used
  const limit = profile.conversions_limit
  const pct   = limit ? Math.min((used / limit) * 100, 100) : 0
  const plan  = profile.plan

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-2">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#2C1A0E]">
            Good to see you, {first}.
          </h1>
          <p className="text-[#9B7B6A] text-sm mt-1">
            Here&apos;s where your migration stands.
          </p>
        </div>

        <span className={`self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${
          plan === "free"     ? "bg-[#EDE7DE] text-[#6B5344] border-[#D5C9BB]" :
          plan === "pro"      ? "bg-amber-100 text-amber-800 border-amber-200" :
          plan === "lifetime" ? "bg-[#2C1A0E] text-[#F7F3EE] border-[#2C1A0E]" :
                                "bg-orange-100 text-orange-800 border-orange-200"
        }`}>
          <Zap className="h-3 w-3" />
          {plan === "free" ? "Free Plan" : plan === "pro" ? "Pro" : plan === "lifetime" ? "Lifetime" : "Team"}
          {plan === "free" && ` — ${limit && limit - used > 0 ? limit - used : 0} conversions left`}
        </span>
      </div>

      {/* ── Onboarding banner ── */}
      <div className="rounded-2xl border border-[#D5C9BB] bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="h-12 w-12 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
            <Chrome className="h-6 w-6 text-amber-700" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[#2C1A0E] mb-1">
              Install the Chrome extension to get started
            </h3>
            <p className="text-sm text-[#6B5344]">
              The extension scans your NetSuite account from your existing browser session.
              Install it, open NetSuite, and your scripts appear here automatically.
            </p>
          </div>
          <a href="#" className="shrink-0">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2C1A0E] text-[#F7F3EE] text-sm font-medium hover:bg-[#3D2518] transition-colors whitespace-nowrap">
              <Chrome className="h-4 w-4" />
              Install Extension
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </a>
        </div>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { step: "1", label: "Install from Chrome Web Store" },
            { step: "2", label: "Open NetSuite — scans automatically" },
            { step: "3", label: "Convert scripts & export results" },
          ].map((s) => (
            <div key={s.step} className="flex items-start gap-2.5">
              <div className="h-5 w-5 rounded-full bg-[#EDE7DE] border border-[#D5C9BB] flex items-center justify-center shrink-0 mt-0.5 text-xs font-semibold text-[#6B5344]">
                {s.step}
              </div>
              <span className="text-xs text-[#6B5344]">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Conversions Used",
            value: limit ? `${used} / ${limit}` : `${used} / ∞`,
            sub: plan === "free" ? "Free tier" : "Unlimited",
            icon: Zap,
            iconBg: "bg-amber-100",
            iconColor: "text-amber-700",
          },
          {
            label: "Scripts Scanned",
            value: "0",
            sub: "Across all accounts",
            icon: FileSearch,
            iconBg: "bg-[#EDE7DE]",
            iconColor: "text-[#6B5344]",
          },
          {
            label: "Accounts Linked",
            value: "0",
            sub: "NetSuite environments",
            icon: Chrome,
            iconBg: "bg-[#EDE7DE]",
            iconColor: "text-[#6B5344]",
          },
          {
            label: "Days to 2028.1",
            value: Math.ceil((new Date("2028-01-01").getTime() - Date.now()) / 86400000).toString(),
            sub: "Hard deadline",
            icon: Clock,
            iconBg: "bg-red-50",
            iconColor: "text-red-600",
          },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-[#D5C9BB] bg-white p-5 shadow-sm">
            <div className={`h-9 w-9 rounded-lg ${s.iconBg} flex items-center justify-center mb-3`}>
              <s.icon className={`h-4 w-4 ${s.iconColor}`} />
            </div>
            <p className="font-serif text-2xl text-[#2C1A0E]">{s.value}</p>
            <p className="text-xs text-[#9B7B6A] mt-1">{s.label}</p>
            <p className="text-xs text-[#BEB4AB] mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Main 2-col grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent conversions */}
        <div className="lg:col-span-2 rounded-2xl border border-[#D5C9BB] bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE7DE]">
            <div>
              <h2 className="font-semibold text-[#2C1A0E] text-sm">Recent Conversions</h2>
              <p className="text-xs text-[#9B7B6A] mt-0.5">Your last converted scripts</p>
            </div>
            <Link href="/dashboard/conversions" className="flex items-center gap-1 text-xs text-[#6B5344] hover:text-[#2C1A0E] transition-colors">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {/* Empty state */}
          <div className="flex flex-col items-center justify-center py-14 text-center px-6">
            <div className="h-12 w-12 rounded-2xl bg-[#EDE7DE] flex items-center justify-center mb-4">
              <History className="h-6 w-6 text-[#9B7B6A]" />
            </div>
            <p className="font-medium text-[#2C1A0E] text-sm mb-1">No conversions yet</p>
            <p className="text-xs text-[#9B7B6A] max-w-xs leading-relaxed mb-5">
              Install the Chrome extension, open NetSuite, and your first conversion will appear here.
            </p>
            <a href="#">
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#D5C9BB] text-[#2C1A0E] text-sm hover:bg-[#EDE7DE] transition-colors">
                <Chrome className="h-3.5 w-3.5" />
                Get the Extension
              </button>
            </a>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* Plan card */}
          <div className="rounded-2xl border border-[#D5C9BB] bg-white shadow-sm p-5">
            <h3 className="font-semibold text-[#2C1A0E] text-sm mb-4">Your Plan</h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-[#9B7B6A]">Plan</span>
                <span className="font-medium text-[#2C1A0E] capitalize">{plan}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#9B7B6A]">Conversions</span>
                <span className="font-medium text-[#2C1A0E]">
                  {limit ? `${used} / ${limit}` : `${used} / ∞`}
                </span>
              </div>
              {limit && (
                <div className="w-full bg-[#EDE7DE] rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )}
            </div>

            {plan === "free" && (
              <div className="rounded-xl bg-[#2C1A0E] p-4 space-y-2">
                <p className="text-sm font-semibold text-[#F7F3EE]">Unlock unlimited conversions</p>
                <p className="text-xs text-[#9B7B6A] leading-relaxed">
                  Pro plan — $29/mo or $299 lifetime. Convert every script, forever.
                </p>
                <Link href="/dashboard/billing">
                  <button className="w-full mt-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-white text-xs font-semibold transition-colors">
                    Upgrade to Pro
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Deadline tracker */}
          <div className="rounded-2xl border border-[#D5C9BB] bg-white shadow-sm p-5">
            <h3 className="font-semibold text-[#2C1A0E] text-sm mb-4 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Migration Deadlines
            </h3>
            <div className="space-y-3">
              {[
                { date: "2027.1", label: "SS 1.0 limited support",    dot: "bg-amber-500" },
                { date: "2028.1", label: "2.1 runs by default",        dot: "bg-orange-500" },
                { date: "2028.2", label: "Hard cutoff — must be 2.1",  dot: "bg-red-500" },
              ].map((d) => (
                <div key={d.date} className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${d.dot} shrink-0`} />
                  <div className="flex-1 flex items-center justify-between gap-2">
                    <span className="text-xs text-[#9B7B6A]">{d.label}</span>
                    <span className="text-xs font-mono font-semibold text-[#2C1A0E]">{d.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick tips */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h3 className="font-semibold text-amber-900 text-sm mb-3 flex items-center gap-2">
              <FileCode2 className="h-4 w-4" />
              Quick Start
            </h3>
            <ul className="space-y-2">
              {[
                "Install the Chrome extension",
                "Open NetSuite in any tab",
                "Click Convert on any SS 1.0 script",
                "Review inline comments",
                "Download and deploy",
              ].map((tip, i) => (
                <li key={tip} className="flex items-start gap-2 text-xs text-amber-800">
                  <CheckCircle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  )
}
