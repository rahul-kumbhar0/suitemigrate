import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Zap, Crown, Users, CreditCard, Shield } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    id: "pro",
    name: "Pro",
    price: "$4",
    period: "/ month",
    description: "For developers actively migrating scripts.",
    features: [
      "Unlimited script conversions",
      "Side-by-side diff view",
      "Confidence score + change log",
      "ZIP export of converted scripts",
      "Full conversion history",
      "All future features",
    ],
    cta: "Get Pro",
    icon: Zap,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    highlighted: false,
  },
  {
    id: "lifetime",
    name: "Lifetime Pro",
    price: "$10",
    period: "one time",
    description: "Pay once, use forever. Best value.",
    features: [
      "Everything in Pro",
      "Lifetime access — no renewals",
      "All future features included",
      "Priority conversion queue",
    ],
    cta: "Buy Lifetime — $10",
    icon: Crown,
    iconColor: "text-yellow-400",
    iconBg: "bg-yellow-500/10",
    highlighted: true,
    badge: "Best Value",
  },
  {
    id: "team",
    name: "Team",
    price: "$15",
    period: "/ month",
    description: "For consultants and agencies.",
    features: [
      "Everything in Lifetime",
      "Up to 5 team seats",
      "Shared conversion history",
      "Team management dashboard",
      "Bulk export across accounts",
    ],
    cta: "Get Team",
    icon: Users,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10",
    highlighted: false,
  },
]

export default async function BillingPage() {
  const supabase = createClient()
  await supabase.auth.getUser()

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Billing & Plans</h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage your subscription and payment details.
        </p>
      </div>

      {/* Current plan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Current Plan</CardTitle>
          <CardDescription>You are currently on the Free plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-700 flex items-center justify-center">
                <Zap className="h-5 w-5 text-slate-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Free Plan</p>
                <p className="text-sm text-slate-400">2 conversions included · No credit card</p>
              </div>
            </div>
            <Badge variant="secondary">Active</Badge>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Conversions used</p>
              <p className="text-white font-medium mt-0.5">0 / 2</p>
            </div>
            <div>
              <p className="text-slate-500">Renewal</p>
              <p className="text-white font-medium mt-0.5">—</p>
            </div>
            <div>
              <p className="text-slate-500">Payment method</p>
              <p className="text-white font-medium mt-0.5">None</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade plans */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Upgrade your plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-xl border p-6 flex flex-col ${
                plan.highlighted
                  ? "border-emerald-500/50 bg-emerald-500/5 shadow-lg shadow-emerald-500/10"
                  : "border-slate-800 bg-slate-900/50"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="pro" className="px-3 text-xs">{plan.badge}</Badge>
                </div>
              )}

              <div className="mb-4">
                <div className={`h-10 w-10 rounded-xl ${plan.iconBg} flex items-center justify-center mb-3`}>
                  <plan.icon className={`h-5 w-5 ${plan.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <div className="flex items-end gap-1 my-1">
                  <span className="text-3xl font-black text-white">{plan.price}</span>
                  <span className="text-slate-500 text-sm mb-1">{plan.period}</span>
                </div>
                <p className="text-sm text-slate-400">{plan.description}</p>
              </div>

              <ul className="space-y-2.5 flex-1 mb-5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-slate-300">{f}</span>
                  </li>
                ))}
              </ul>

              {/* Razorpay payment button */}
              <Button
                variant={plan.highlighted ? "gradient" : "outline"}
                className="w-full"
                asChild
              >
                <Link href={`/api/payments/checkout?plan=${plan.id}`}>
                  {plan.cta}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap items-center justify-center gap-6 py-4 border-t border-slate-800">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Shield className="h-4 w-4 text-emerald-600" />
          Secured by Razorpay
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <CreditCard className="h-4 w-4 text-slate-600" />
          Cards, UPI, Net Banking accepted
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <CheckCircle className="h-4 w-4 text-slate-600" />
          Cancel anytime (monthly plans)
        </div>
      </div>
    </div>
  )
}
