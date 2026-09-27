import { useState } from "react"
import { Zap, Chrome, ArrowRight, RefreshCw, ExternalLink } from "lucide-react"
import { getLoginUrl, getSignupUrl, fetchCurrentUser } from "../../lib/auth"
import { useStore } from "../../lib/store"
import { getAllAccounts } from "../../lib/storage"

export default function LoginRequiredView() {
  const { setUser, setView, setAccounts } = useStore()
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState("")

  const openSignup = () => chrome.tabs.create({ url: getSignupUrl() })
  const openLogin  = () => chrome.tabs.create({ url: getLoginUrl() })
  const openDashboard = () => {
    const appUrl = import.meta.env.VITE_APP_URL || "http://localhost:3000"
    chrome.tabs.create({ url: `${appUrl}/dashboard` })
  }

  const handleRefresh = async () => {
    setChecking(true)
    setError("")
    const user = await fetchCurrentUser()
    if (user) {
      setUser(user)
      const accounts = await getAllAccounts()
      setAccounts(accounts)
      setView("dashboard")
    } else {
      setError("Could not detect your session. Follow the steps below.")
    }
    setChecking(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[460px] px-5 text-center gap-4">
      {/* Logo */}
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500">
        <Zap className="h-7 w-7 text-white" />
      </div>

      <div>
        <h1 className="text-lg font-bold text-white mb-1">
          Suite<span className="gradient-text">Migrate</span>
        </h1>
        <p className="text-slate-400 text-xs leading-relaxed max-w-[260px]">
          Sign in to scan your NetSuite account and convert scripts to SuiteScript 2.1
        </p>
      </div>

      {/* Auth buttons */}
      <div className="w-full space-y-2">
        <button onClick={openSignup} className="btn-primary w-full justify-center">
          <Chrome className="h-3.5 w-3.5" />
          Create Free Account
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
        <button onClick={openLogin} className="btn-outline w-full justify-center">
          Sign In
        </button>
      </div>

      {/* Already signed in section */}
      <div className="w-full border border-[#1e3a5f] rounded-lg p-3 space-y-2.5">
        <p className="text-[11px] text-slate-400 font-medium">Already have an account?</p>

        {/* Step instructions */}
        <div className="space-y-1.5 text-left">
          {[
            "Open the SuiteMigrate website in this browser",
            "Sign in to your account",
            "Come back here and click Refresh below",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="h-4 w-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[8px] font-bold text-emerald-400">{i + 1}</span>
              </div>
              <span className="text-[10px] text-slate-400 leading-tight">{step}</span>
            </div>
          ))}
        </div>

        <button
          onClick={openDashboard}
          className="btn-outline w-full justify-center text-[11px] h-7"
        >
          <ExternalLink className="h-3 w-3" />
          Open SuiteMigrate Website
        </button>

        <button
          onClick={handleRefresh}
          disabled={checking}
          className="btn-primary w-full justify-center text-[11px] h-7"
        >
          {checking ? (
            <><div className="spinner !h-3 !w-3" /> Checking...</>
          ) : (
            <><RefreshCw className="h-3 w-3" /> Refresh Session</>
          )}
        </button>

        {error && (
          <p className="text-[10px] text-red-400 leading-relaxed">{error}</p>
        )}
      </div>

      {/* Trust signals */}
      <div className="space-y-1 text-left w-full">
        {["5 free conversions — no credit card", "Works on all NetSuite accounts"].map((t) => (
          <div key={t} className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="text-emerald-500">✓</span>{t}
          </div>
        ))}
      </div>
    </div>
  )
}
