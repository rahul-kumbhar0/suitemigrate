import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Zap, Crown, Users, Shield, CreditCard, X } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Scan your account and see exactly what needs migrating.",
    icon: Zap,
    iconColor: "text-slate-400",
    iconBg: "bg-slate-700",
    features: [
      { text: "Full NetSuite account scan", included: true },
      { text: "Risk scoring for all scripts", included: true },
      { text: "Audit report export (PDF)", included: true },
      { text: "2 full pro script conversions", included: true },
      { text: "Multi-account support", included: true },
      { text: "Unlimited conversions", included: false },
      { text: "Conversion history", included: false },
      { text: "Team seats", included: false },
    ],
    cta: "Start Free",
    href: "/signup",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$4",
    period: "per month",
    description: "For developers with scripts to migrate now.",
    icon: Zap,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    badge: "Most Popular",
    features: [
      { text: "Everything in Free", included: true },
      { text: "Unlimited script conversions", included: true },
      { text: "Side-by-side diff view", included: true },
      { text: "Confidence score + change log", included: true },
      { text: "ZIP export of all scripts", included: true },
      { text: "Full conversion history", included: true },
      { text: "All future features", included: true },
      { text: "Team seats", included: false },
    ],
    cta: "Get Pro",
    href: "/signup?plan=pro",
    highlighted: false,
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: "$10",
    period: "one time",
    description: "Pay once. Use forever. No renewals, no surprises.",
    icon: Crown,
    iconColor: "text-yellow-400",
    iconBg: "bg-yellow-500/10",
    badge: "Best Value",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Lifetime access — no renewals", included: true },
      { text: "All future features included", included: true },
      { text: "Priority conversion queue", included: true },
      { text: "Early access to new features", included: true },
      { text: "Full conversion history", included: true },
      { text: "All future features", included: true },
      { text: "Team seats", included: false },
    ],
    cta: "Buy Lifetime — $10",
    href: "/signup?plan=lifetime",
    highlighted: true,
  },
  {
    id: "team",
    name: "Team",
    price: "$15",
    period: "per month",
    description: "For consultants managing multiple clients.",
    icon: Users,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10",
    features: [
      { text: "Everything in Lifetime", included: true },
      { text: "Up to 5 team seats", included: true },
      { text: "Shared conversion history", included: true },
      { text: "Team management dashboard", included: true },
      { text: "Bulk export all accounts", included: true },
      { text: "Unlimited conversions per seat", included: true },
      { text: "Priority support", included: true },
      { text: "Custom onboarding call", included: true },
    ],
    cta: "Get Team",
    href: "/signup?plan=team",
    highlighted: false,
  },
]

const comparisonRows = [
  { feature: "Full account scan", free: true, pro: true, lifetime: true, team: true },
  { feature: "Risk scoring", free: true, pro: true, lifetime: true, team: true },
  { feature: "Audit report PDF", free: true, pro: true, lifetime: true, team: true },
  { feature: "Multi-account", free: true, pro: true, lifetime: true, team: true },
  { feature: "Script conversions", free: "2 only", pro: "Unlimited", lifetime: "Unlimited", team: "Unlimited" },
  { feature: "Diff view", free: false, pro: true, lifetime: true, team: true },
  { feature: "Confidence score", free: false, pro: true, lifetime: true, team: true },
  { feature: "ZIP export", free: false, pro: true, lifetime: true, team: true },
  { feature: "Conversion history", free: false, pro: true, lifetime: true, team: true },
  { feature: "Team seats", free: false, pro: false, lifetime: false, team: "Up to 5" },
  { feature: "Shared team history", free: false, pro: false, lifetime: false, team: true },
]

function CellValue({ value }: { value: boolean | string }) {
  if (value === true) return <CheckCircle className="h-4 w-4 text-emerald-500 mx-auto" />
  if (value === false) return <X className="h-4 w-4 text-slate-700 mx-auto" />
  return <span className="text-xs text-slate-300 font-medium">{value}</span>
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#050d1a]">
      <Navbar />

      <div className="pt-28 pb-24 px-4">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Simple, honest pricing
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Start free with 5 free conversions. Upgrade when you&apos;re ready.
              The $10 lifetime deal is genuinely the best value here.
            </p>
          </div>

          {/* Plan cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-xl border p-6 flex flex-col ${
                  plan.highlighted
                    ? "border-emerald-500/50 bg-emerald-500/5 shadow-xl shadow-emerald-500/10"
                    : "border-slate-800 bg-slate-900/50"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant={plan.highlighted ? "pro" : "default"} className="px-3 text-xs">
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <div className="mb-5">
                  <div className={`h-10 w-10 rounded-xl ${plan.iconBg} flex items-center justify-center mb-3`}>
                    <plan.icon className={`h-5 w-5 ${plan.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <div className="flex items-end gap-1 my-1.5">
                    <span className="text-3xl font-black text-white">{plan.price}</span>
                    <span className="text-slate-500 text-sm mb-1">/ {plan.period}</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{plan.description}</p>
                </div>

                <ul className="space-y-2.5 flex-1 mb-5">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2">
                      {f.included ? (
                        <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-slate-700 mt-0.5 shrink-0" />
                      )}
                      <span className={`text-sm ${f.included ? "text-slate-300" : "text-slate-600"}`}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.href}>
                  <Button
                    variant={plan.highlighted ? "gradient" : plan.id === "free" ? "secondary" : "outline"}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Full feature comparison
            </h2>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80">
                    <th className="text-left px-5 py-4 text-slate-400 font-medium">Feature</th>
                    {["Free", "Pro", "Lifetime", "Team"].map((h) => (
                      <th key={h} className="px-4 py-4 text-center text-white font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={`border-b border-slate-800/50 ${i % 2 === 0 ? "bg-transparent" : "bg-slate-900/20"}`}
                    >
                      <td className="px-5 py-3.5 text-slate-300">{row.feature}</td>
                      <td className="px-4 py-3.5 text-center"><CellValue value={row.free} /></td>
                      <td className="px-4 py-3.5 text-center"><CellValue value={row.pro} /></td>
                      <td className="px-4 py-3.5 text-center bg-emerald-500/3"><CellValue value={row.lifetime} /></td>
                      <td className="px-4 py-3.5 text-center"><CellValue value={row.team} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Pricing FAQ</h2>
            <div className="space-y-4">
              {[
                {
                  q: "What payment methods are accepted?",
                  a: "All major credit/debit cards, UPI, net banking, and digital wallets via Razorpay. Secure and instant.",
                },
                {
                  q: "Can I cancel my monthly subscription?",
                  a: "Yes, cancel anytime from your dashboard. You keep access until the end of your billing period.",
                },
                {
                  q: "Is the Lifetime deal really lifetime?",
                  a: "Yes. One payment of $10 gives you Pro access forever, including all future features we add.",
                },
                {
                  q: "Do I need a credit card for the free plan?",
                  a: "No credit card required for the free plan. Sign up with email or Google and get started instantly.",
                },
                {
                  q: "What counts as one conversion?",
                  a: "Converting one NetSuite script file = one conversion. Re-converting the same script doesn't use an additional conversion.",
                },
              ].map((faq, i) => (
                <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                  <h3 className="text-sm font-semibold text-white mb-2">{faq.q}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trust */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Shield className="h-4 w-4 text-emerald-600" />
              Secured by Razorpay
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <CreditCard className="h-4 w-4 text-slate-600" />
              UPI · Cards · Net Banking
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <CheckCircle className="h-4 w-4 text-slate-600" />
              Cancel anytime
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
