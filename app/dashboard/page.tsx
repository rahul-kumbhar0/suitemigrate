import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import {
  Zap,
  FileSearch,
  AlertTriangle,
  ArrowRight,
  Chrome,
  Clock,
  History,
} from "lucide-react"

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const name = user?.user_metadata?.name || user?.email?.split("@")[0] || "there"

  // Placeholder stats — will be live data once NS accounts are scanned
  const stats = {
    conversionsUsed: 0,
    conversionsLimit: 2,
    plan: "free",
    scriptsScanned: 0,
    accountsLinked: 0,
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {name.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Here&apos;s what&apos;s happening with your migration.
          </p>
        </div>
        <Badge variant="default" className="self-start sm:self-auto text-sm px-3 py-1.5">
          <Zap className="h-3.5 w-3.5 mr-1.5" />
          Free Plan — {stats.conversionsLimit - stats.conversionsUsed} conversions left
        </Badge>
      </div>

      {/* Onboarding banner (shown when no accounts linked) */}
      {stats.accountsLinked === 0 && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Chrome className="h-6 w-6 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-white mb-1">
                Install the Chrome extension to get started
              </h3>
              <p className="text-sm text-slate-400">
                The extension scans your NetSuite account directly from your browser session.
                Install it, open NetSuite, and your scripts will appear here.
              </p>
            </div>
            <a href="#" className="shrink-0">
              <Button variant="gradient" className="gap-2 whitespace-nowrap">
                <Chrome className="h-4 w-4" />
                Install Extension
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </div>
          {/* Steps */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { step: "1", label: "Install extension from Chrome Web Store", done: false },
              { step: "2", label: "Open NetSuite — extension scans automatically", done: false },
              { step: "3", label: "Convert scripts and export results", done: false },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-2">
                <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${s.done ? "bg-emerald-500 text-white" : "bg-slate-700 text-slate-400"}`}>
                  {s.done ? "✓" : s.step}
                </div>
                <span className="text-xs text-slate-400">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Conversions Used",
            value: `${stats.conversionsUsed} / ${stats.conversionsLimit}`,
            sub: stats.plan === "free" ? "Free tier" : "Unlimited",
            icon: Zap,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Scripts Scanned",
            value: stats.scriptsScanned.toString(),
            sub: "Across all accounts",
            icon: FileSearch,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
          },
          {
            label: "Accounts Linked",
            value: stats.accountsLinked.toString(),
            sub: "NetSuite environments",
            icon: Chrome,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
          },
          {
            label: "Days to Deadline",
            value: "487",
            sub: "Until 2028.1 rollout",
            icon: Clock,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className={`h-9 w-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
              <p className="text-xs text-slate-600 mt-0.5">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent conversions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Recent Conversions</CardTitle>
                <CardDescription>Your last converted scripts</CardDescription>
              </div>
              <Link href="/dashboard/conversions">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  View all <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {/* Empty state */}
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center mb-4">
                  <History className="h-6 w-6 text-slate-600" />
                </div>
                <p className="text-sm font-medium text-slate-400 mb-1">No conversions yet</p>
                <p className="text-xs text-slate-600 mb-4 max-w-xs">
                  Install the extension, open NetSuite, and your first conversion will appear here.
                </p>
                <a href="#">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Chrome className="h-3.5 w-3.5" />
                    Get the Extension
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Plan card */}
          <Card className="border-slate-800">
            <CardHeader>
              <CardTitle className="text-base">Your Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Current plan</span>
                <Badge variant="secondary" className="capitalize">{stats.plan}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Conversions</span>
                <span className="text-sm text-white font-medium">
                  {stats.conversionsUsed}/{stats.conversionsLimit} used
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${(stats.conversionsUsed / stats.conversionsLimit) * 100}%` }}
                />
              </div>

              <div className="rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 p-4 space-y-2">
                <p className="text-sm font-semibold text-white">Unlock unlimited conversions</p>
                <p className="text-xs text-slate-400">
                  Get Lifetime Pro for just $10 — convert all your scripts, forever.
                </p>
                <Link href="/dashboard/billing">
                  <Button variant="gradient" size="sm" className="w-full mt-1 gap-1">
                    <Zap className="h-3.5 w-3.5" />
                    Upgrade for $10
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Deadline tracker */}
          <Card className="border-slate-800">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                Migration Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { date: "2027.1", label: "SS 1.0 limited support", color: "text-amber-400", dotColor: "bg-amber-400" },
                { date: "2028.1", label: "2.1 runs by default", color: "text-orange-400", dotColor: "bg-orange-400" },
                { date: "2028.2", label: "Hard cutoff", color: "text-red-400", dotColor: "bg-red-400" },
              ].map((d) => (
                <div key={d.date} className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${d.dotColor} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm font-semibold ${d.color}`}>{d.date}</span>
                    <span className="text-xs text-slate-500 ml-2">{d.label}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
