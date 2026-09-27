import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Zap,
  Shield,
  BarChart3,
  Download,
  GitCompare,
  Clock,
  CheckCircle,
  AlertTriangle,
  Chrome,
  ArrowRight,
  FileSearch,
  Sparkles,
  X,
} from "lucide-react"

const features = [
  {
    icon: FileSearch,
    title: "One-Click Account Scan",
    description:
      "Opens on your active NetSuite tab and scans every script in seconds. No API tokens, no setup, no credentials — it reads your existing session.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: BarChart3,
    title: "Risk Score Every Script",
    description:
      "HIGH, MEDIUM, LOW — every script gets scored instantly. Know exactly what breaks first and what to migrate in which order.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Sparkles,
    title: "AI Conversion Engine",
    description:
      "50+ API mapping rules + Gemini AI converts your SS 1.0/2.0 scripts to clean 2.1 code. Context-aware — not just find and replace.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: GitCompare,
    title: "See Every Change Made",
    description:
      "Side-by-side diff shows exactly what changed and why. Every line has an inline comment explaining the migration. Full confidence.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    icon: Shield,
    title: "Confidence Score",
    description:
      "Each conversion gets a 0–100% confidence score. Lines needing manual review are flagged in red. You know exactly what to check.",
    color: "text-teal-400",
    bg: "bg-teal-500/10",
  },
  {
    icon: Download,
    title: "Deploy-Ready Export",
    description:
      "Download converted scripts ready to upload directly to NetSuite. Export your full audit report as PDF for stakeholders.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
]

const steps = [
  {
    step: "01",
    title: "Install in 30 seconds",
    description: "Add SuiteMigrate to Chrome. Create your free account — no credit card, no setup.",
    icon: Chrome,
  },
  {
    step: "02",
    title: "Open NetSuite & Scan",
    description: "Click the extension on any NetSuite page. It detects your account and scans every script automatically.",
    icon: FileSearch,
  },
  {
    step: "03",
    title: "Convert with one click",
    description: "Pick any script from the list. Click Convert. Get clean SuiteScript 2.1 code with a full change log in seconds.",
    icon: Sparkles,
  },
  {
    step: "04",
    title: "Download & Deploy",
    description: "Scripts come out ready to upload to NetSuite. Export your audit report. Migration done — before the deadline.",
    icon: Download,
  },
]

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to understand your migration scope.",
    features: [
      "Full account scan — unlimited",
      "Risk score for every script",
      "Audit report export (PDF)",
      "5 full AI conversions free",
      "Multi-account support",
    ],
    cta: "Start Free — No Card",
    href: "/signup",
    highlighted: false,
    badge: "Start Here",
  },
  {
    name: "Pro",
    price: "$4",
    period: "per month",
    description: "For developers actively migrating scripts.",
    features: [
      "Everything in Free",
      "Unlimited script conversions",
      "Side-by-side diff view",
      "Full change log + confidence score",
      "ZIP export of all converted scripts",
      "Conversion history",
    ],
    cta: "Get Pro",
    href: "/signup?plan=pro",
    highlighted: false,
  },
  {
    name: "Lifetime",
    price: "$10",
    period: "one time",
    description: "Pay once. Migrate everything. Done.",
    features: [
      "Everything in Pro",
      "Lifetime access — no renewals",
      "All future features included",
      "Priority conversion queue",
    ],
    cta: "Buy Lifetime — $10",
    href: "/signup?plan=lifetime",
    highlighted: true,
    badge: "Best Value",
  },
  {
    name: "Team",
    price: "$15",
    period: "per month",
    description: "For consultants managing multiple client accounts.",
    features: [
      "Everything in Pro",
      "Up to 5 team seats",
      "Shared conversion history",
      "Bulk export across accounts",
    ],
    cta: "Get Team",
    href: "/signup?plan=team",
    highlighted: false,
  },
]

const faqs = [
  {
    q: "Does this store my NetSuite login or credentials?",
    a: "Never. The extension runs on your existing browser session — the same session you use every day. We have no access to your NetSuite credentials, and nothing sensitive is sent to our servers.",
  },
  {
    q: "How accurate is the AI conversion?",
    a: "We use a hybrid approach: 50+ rule-based API mappings handle known patterns first, then Gemini AI handles context-aware logic. Each result shows a confidence score so you know exactly what to verify before deploying.",
  },
  {
    q: "What script types are supported?",
    a: "All of them — UserEvent, Suitelet, Scheduled, Map/Reduce, ClientScript, RESTlet, Portlet, MassUpdate. Both SS 1.0 → 2.1 and SS 2.0 → 2.1 conversions are supported.",
  },
  {
    q: "Why do I need to migrate to SuiteScript 2.1?",
    a: "Oracle NetSuite has set hard deadlines: SS 1.0 enters limited support in 2027.1, all scripts run as 2.1 by default from 2028.1, and 2028.2 is the cutoff where all custom scripts must be 2.1 or they stop working.",
  },
  {
    q: "What does the free tier include?",
    a: "The free plan includes unlimited account scanning, risk scoring for every script, a full audit report export, and 5 complete AI conversions with all pro features. No credit card required.",
  },
  {
    q: "Why is Lifetime only $10?",
    a: "We want every NetSuite developer to be able to migrate before the deadline — not just enterprise teams with big budgets. $10 is a no-brainer for a tool that saves days of work.",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050d1a]">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-grid">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-5xl text-center">
          <Badge variant="default" className="mb-6 px-4 py-1.5 text-xs font-medium">
            <Clock className="h-3 w-3 mr-1.5" />
            SuiteScript 2.1 is mandatory by 2028 — are your scripts ready?
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6 text-balance">
            Migrate Your NetSuite Scripts
            <br />
            <span className="gradient-text">Before the Deadline Hits.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-4 leading-relaxed">
            SuiteMigrate scans your entire NetSuite account, risk-scores every script, and converts SS 1.0/2.0 to SuiteScript 2.1 automatically — right from your browser.
          </p>

          <p className="text-base text-emerald-400 font-semibold mb-10">
            Free to start. 5 full conversions. No credit card.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/signup">
              <Button size="xl" variant="gradient" className="gap-2 w-full sm:w-auto text-base px-8">
                <Chrome className="h-5 w-5" />
                Install Free — Start Scanning
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/#how-it-works">
              <Button size="xl" variant="outline" className="w-full sm:w-auto">
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>No NetSuite credentials required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>Works on any NetSuite account</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>Built by a NetSuite developer</span>
            </div>
          </div>
        </div>

        {/* Deadline timeline */}
        <div className="relative mx-auto max-w-3xl mt-20">
          <div className="gradient-border rounded-xl p-6 glow-emerald-sm">
            <p className="text-center text-xs text-slate-500 uppercase tracking-widest mb-6 font-medium">
              ⚠️ NetSuite SuiteScript Migration Deadlines
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { date: "2027.1", label: "SS 1.0 enters limited support", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
                { date: "2028.1", label: "All scripts run as 2.1 by default", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
                { date: "2028.2", label: "Hard cutoff — scripts must be 2.1", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
              ].map((item) => (
                <div key={item.date} className={`rounded-lg border p-4 text-center ${item.bg}`}>
                  <div className={`text-2xl font-bold mb-1 ${item.color}`}>{item.date}</div>
                  <div className="text-xs text-slate-400 leading-relaxed">{item.label}</div>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-slate-600 mt-4">
              Source: Oracle NetSuite 2024 product roadmap announcements
            </p>
          </div>
        </div>
      </section>

      {/* ── PROBLEM / SOLUTION ── */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Problem */}
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-4">The Problem</p>
              <div className="space-y-3">
                {[
                  "You have dozens of custom scripts — maybe hundreds",
                  "No easy way to know which ones need migration",
                  "Manual migration takes hours per script",
                  "Oracle's 2028 deadline is non-negotiable",
                  "Consultants charge $150-300/hr to do this manually",
                ].map((p) => (
                  <div key={p} className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">{p}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* The Solution */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-4">SuiteMigrate Fixes This</p>
              <div className="space-y-3">
                {[
                  "Scans your entire account in under 60 seconds",
                  "Instantly shows every script that needs updating",
                  "AI converts each script in 5-15 seconds",
                  "You're done before the deadline — not scrambling",
                  "Free to start. $10 lifetime for unlimited access",
                ].map((p) => (
                  <div key={p} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Dead Simple</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              From zero to migrated in under an hour
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              No SuiteScript expertise needed for the tool itself. If you can open NetSuite, you can use SuiteMigrate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.step} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-slate-700 to-transparent z-10" />
                )}
                <Card className="gradient-border h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl font-black text-slate-800">{step.step}</span>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3">
                      <step.icon className="h-5 w-5 text-emerald-400" />
                    </div>
                    <CardTitle className="text-base">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-4 bg-slate-900/30">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Built for NetSuite Developers</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything the migration actually needs
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Not a generic code converter. Every feature was designed specifically for SuiteScript migration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:border-slate-700 transition-colors group">
                <CardHeader>
                  <div className={`h-11 w-11 rounded-xl ${feature.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`h-5 w-5 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXTENSION PREVIEW ── */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">Chrome Extension</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Lives in your browser.
                <br />
                <span className="gradient-text">Works on your NetSuite.</span>
              </h2>
              <p className="text-slate-400 mb-6 leading-relaxed">
                No separate app. No API keys to configure. Just install the extension, open NetSuite, and your entire script inventory appears — risk-scored and ready to convert.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Auto-detects any NetSuite account from the URL",
                  "SuiteQL scan runs in the background — no page refresh",
                  "Remembers all accounts and conversion history",
                  "Works on sandbox, dev, and production environments",
                  "Converts scripts and downloads them in one click",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button variant="gradient" size="lg" className="gap-2">
                  <Chrome className="h-4 w-4" />
                  Install Free Extension
                </Button>
              </Link>
            </div>

            {/* Extension mockup */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-[340px] rounded-2xl border border-slate-700 bg-slate-900 overflow-hidden shadow-2xl glow-emerald">
                {/* Extension header */}
                <div className="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <Zap className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-white">SuiteMigrate</span>
                  </div>
                  <Badge variant="default" className="text-xs py-0.5">Free</Badge>
                </div>

                {/* Account row */}
                <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
                  <div>
                    <p className="text-xs text-slate-500">Active Account</p>
                    <p className="text-sm font-medium text-white">ACME Corp (tstdrv12345)</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs h-7 px-2">Scan</Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 p-4 border-b border-slate-800">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">67</div>
                    <div className="text-xs text-slate-500">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-400">43</div>
                    <div className="text-xs text-slate-500">Need Update</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">24</div>
                    <div className="text-xs text-slate-500">On 2.1</div>
                  </div>
                </div>

                {/* Script list */}
                <div className="p-4 space-y-2">
                  {[
                    { name: "Invoice Auto Email", type: "UserEvent", ver: "1.0", risk: "HIGH", riskColor: "text-red-400 bg-red-500/10" },
                    { name: "PO Approval Flow", type: "Scheduled", ver: "2.0", risk: "MED", riskColor: "text-amber-400 bg-amber-500/10" },
                    { name: "Customer Sync", type: "MapReduce", ver: "1.0", risk: "HIGH", riskColor: "text-red-400 bg-red-500/10" },
                  ].map((script) => (
                    <div key={script.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-white truncate">{script.name}</p>
                        <p className="text-xs text-slate-500">{script.type} · SS {script.ver}</p>
                      </div>
                      <div className="flex items-center gap-1.5 ml-2">
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${script.riskColor}`}>{script.risk}</span>
                        <Button size="sm" variant="default" className="text-xs h-6 px-2">Convert</Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-4 pb-4">
                  <Button variant="outline" className="w-full text-xs h-8">
                    <Download className="h-3 w-3 mr-1" />
                    Export Audit Report
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-4 bg-slate-900/30">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-6">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Start free. Upgrade if you need more.
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              5 free conversions gets most solo developers through their migration.
              The $10 lifetime deal is there when you need more.
            </p>
          </div>

          {/* Free callout banner */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 mb-8 text-center max-w-2xl mx-auto">
            <p className="text-emerald-400 font-semibold text-sm mb-1">
              🎉 Launch offer — completely free to start
            </p>
            <p className="text-slate-400 text-xs">
              Full scan + risk scoring + 5 AI conversions. No credit card. No time limit.
              Paid plans available when you need unlimited.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-xl border p-6 flex flex-col ${
                  plan.highlighted
                    ? "border-emerald-500/50 bg-emerald-500/5 glow-emerald-sm"
                    : "border-slate-800 bg-slate-900/50"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant={plan.highlighted ? "pro" : "default"} className="px-3">
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <div className="mb-5">
                  <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-3xl font-black text-white">{plan.price}</span>
                    <span className="text-slate-500 text-sm mb-1">/ {plan.period}</span>
                  </div>
                  <p className="text-sm text-slate-400">{plan.description}</p>
                </div>

                <ul className="space-y-3 flex-1 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.href}>
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? "gradient" : plan.name === "Free" ? "secondary" : "outline"}
                    size="sm"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-slate-500 mt-8">
            All plans include multi-account support. Payments by Razorpay — UPI, cards, net banking accepted.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Common questions, straight answers
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                <h3 className="text-base font-semibold text-white mb-3 flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">Q.</span>
                  {faq.q}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed pl-5">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="gradient-border rounded-2xl p-12 glow-emerald">
            <AlertTriangle className="h-12 w-12 text-amber-400 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              The 2028 deadline is real.
            </h2>
            <p className="text-2xl font-bold gradient-text mb-6">
              Start your migration today — it&apos;s free.
            </p>
            <p className="text-slate-400 mb-8 leading-relaxed max-w-xl mx-auto">
              Scan your account in 60 seconds. See every script that needs work.
              Convert 5 scripts completely free — no credit card, no commitment.
            </p>
            <Link href="/signup">
              <Button size="xl" variant="gradient" className="gap-2">
                <Chrome className="h-5 w-5" />
                Scan My Account Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="text-xs text-slate-600 mt-4">
              5 free conversions · No credit card · Cancel anytime
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
