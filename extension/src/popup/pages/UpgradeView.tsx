import { Crown, Zap, Users, CheckCircle, X, ArrowLeft } from "lucide-react"
import { useStore } from "../../lib/store"
import { getUpgradeUrl } from "../../lib/api"
import Header from "../components/Header"

const plans = [
  {
    id: "lifetime",
    name: "Lifetime Pro",
    price: "$10",
    period: "one time",
    description: "Pay once, convert forever",
    icon: Crown,
    iconColor: "text-yellow-400",
    iconBg: "bg-yellow-500/10 border-yellow-500/20",
    features: ["Unlimited conversions", "All pro features", "All future updates", "Priority queue"],
    highlight: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$4",
    period: "/month",
    description: "For active migration projects",
    icon: Zap,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    features: ["Unlimited conversions", "Diff view", "ZIP export", "History"],
    highlight: false,
  },
  {
    id: "team",
    name: "Team",
    price: "$15",
    period: "/month",
    description: "For consultants & agencies",
    icon: Users,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10 border-purple-500/20",
    features: ["Up to 5 team seats", "Shared history", "Bulk export", "All Pro features"],
    highlight: false,
  },
]

export default function UpgradeView() {
  const { setView, conversions, user } = useStore()

  const handleUpgrade = (planId: string) => {
    const url = getUpgradeUrl(planId)
    chrome.tabs.create({ url })
  }

  return (
    <div className="flex flex-col">
      <Header showBack onBack={() => setView("script_list")} title="Upgrade Plan" />

      <div className="p-4 space-y-4">
        {/* Limit reached message */}
        <div className="card p-3 border-amber-500/30 bg-amber-500/5 text-center">
          <p className="text-xs font-semibold text-amber-400 mb-1">
            🔒 Free conversions used
          </p>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            You&apos;ve used your 2 free conversions. Upgrade to continue migrating — from just $10 lifetime.
          </p>
        </div>

        {/* Plan cards */}
        <div className="space-y-2">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`card p-3 ${plan.highlight ? "border-emerald-500/40 bg-emerald-500/5" : ""}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`h-7 w-7 rounded-lg border flex items-center justify-center ${plan.iconBg}`}>
                    <plan.icon className={`h-3.5 w-3.5 ${plan.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{plan.name}</p>
                    <p className="text-[10px] text-slate-500">{plan.description}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-black text-white">{plan.price}</span>
                  <span className="text-[10px] text-slate-500 ml-0.5">{plan.period}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 mb-2.5">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-1 text-[10px] text-slate-300">
                    <CheckCircle className="h-2.5 w-2.5 text-emerald-500 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleUpgrade(plan.id)}
                className={`w-full text-[11px] h-7 rounded-lg font-semibold transition-colors ${
                  plan.highlight
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:opacity-90"
                    : "bg-[#1e3a5f] text-slate-300 hover:bg-[#2a4a6f] hover:text-white"
                }`}
              >
                {plan.id === "lifetime" ? "Buy Lifetime — $10" : `Get ${plan.name}`}
              </button>
            </div>
          ))}
        </div>

        <p className="text-[9px] text-slate-600 text-center">
          Secured by Razorpay · UPI, Cards, Net Banking accepted
        </p>
      </div>
    </div>
  )
}
