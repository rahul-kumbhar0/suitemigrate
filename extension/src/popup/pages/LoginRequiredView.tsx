import { useState } from "react"
import { Zap, Chrome, ArrowRight, RefreshCw } from "lucide-react"
import { getLoginUrl, getSignupUrl, fetchCurrentUser } from "../../lib/auth"
import { useStore } from "../../lib/store"
import { getAllAccounts } from "../../lib/storage"

export default function LoginRequiredView() {
  const { setUser, setView, setAccounts } = useStore()
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState("")

  const openSignup = () => chrome.tabs.create({ url: getSignupUrl() })
  const openLogin  = () => chrome.tabs.create({ url: getLoginUrl() })

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
      setError("Still not signed in. Make sure you're logged into localhost:3000 in this browser.")
    }
    setChecking(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[420px] px-6 text-center gap-4">
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

      {/* Already signed in on website */}
      <div className="w-full border-t border-[#1e3a5f] pt-3">
        <p className="text-[10px] text-slate-600 mb-2">Already signed in on the website?</p>
        <button
          onClick={handleRefresh}
          disabled={checking}
          className="btn-outline w-full justify-center text-[11px] h-7"
        >
          {checking ? (
            <><div className="spinner !h-3 !w-3" /> Checking session...</>
          ) : (
            <><RefreshCw className="h-3 w-3" /> Refresh Session</>
          )}
        </button>
        {error && (
          <p className="text-[10px] text-red-400 mt-2 leading-relaxed">{error}</p>
        )}
      </div>

      <div className="space-y-1.5 text-left w-full">
        {[
          "2 free conversions — no credit card",
          "Scans your account automatically",
          "Works on all NetSuite script types",
        ].map((t) => (
          <div key={t} className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-emerald-500">✓</span>
            {t}
          </div>
        ))}
      </div>
    </div>
  )
}
