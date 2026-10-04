import { useState } from "react"
import { ArrowRight, ExternalLink, RefreshCw } from "lucide-react"
import { getLoginUrl, getSignupUrl, fetchCurrentUser } from "../../lib/auth"
import { useStore } from "../../lib/store"
import { getAllAccounts } from "../../lib/storage"

export default function LoginRequiredView() {
  const { setUser, setView, setAccounts } = useStore()
  const [checking, setChecking] = useState(false)
  const [error, setError]       = useState("")

  const openSignup    = () => chrome.tabs.create({ url: getSignupUrl() })
  const openLogin     = () => chrome.tabs.create({ url: getLoginUrl() })
  const openDashboard = () => {
    const url = import.meta.env.VITE_APP_URL || "https://suitemigrate.vercel.app"
    chrome.tabs.create({ url: `${url}/dashboard` })
  }

  const handleRefresh = async () => {
    setChecking(true); setError("")
    const user = await fetchCurrentUser()
    if (user) {
      setUser(user)
      const accounts = await getAllAccounts()
      setAccounts(accounts)
      setView("dashboard")
    } else {
      setError("Session not found. Make sure you're signed in on the website, then try again.")
    }
    setChecking(false)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "28px 20px", gap: 20, minHeight: 460 }} className="fade-up">
      {/* Brand */}
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--clay)", display: "inline-block" }} />
          <span style={{ fontFamily: "var(--f-head)", fontSize: 18, fontWeight: 400, letterSpacing: "-0.01em", color: "var(--ink)" }}>SuiteMigrate</span>
        </div>
        <p className="eyebrow" style={{ marginBottom: 0 }}>NetSuite SuiteScript 2.1 migration</p>
      </div>

      {/* Headline */}
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: 22, letterSpacing: "-0.02em", color: "var(--ink)", lineHeight: 1.15, marginBottom: 8 }}>
          Scan your scripts.<br />
          <span style={{ color: "var(--clay)", fontStyle: "italic" }}>Beat the deadline.</span>
        </h1>
        <p style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.65 }}>
          Sign in to scan your NetSuite account and convert SuiteScript 1.0/2.0 to 2.1.
        </p>
      </div>

      {/* Auth buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button onClick={openSignup} className="btn-primary" style={{ justifyContent: "center", width: "100%", padding: "10px 20px" }}>
          Create free account
          <ArrowRight size={13} />
        </button>
        <button onClick={openLogin} className="btn-outline" style={{ justifyContent: "center", width: "100%" }}>
          Sign in
        </button>
      </div>

      {/* Already signed in */}
      <div style={{ border: "1px solid var(--rule)", borderRadius: 4, padding: "14px 16px" }}>
        <p className="eyebrow" style={{ marginBottom: 10 }}>Already have an account?</p>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
          {[
            "Open the SuiteMigrate website",
            "Sign in to your account",
            "Come back and click Refresh below",
          ].map((step, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", border: "1px solid var(--rule)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 8, color: "var(--ink-mute)" }}>{i + 1}</span>
              </div>
              <span style={{ fontSize: 11.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>{step}</span>
            </li>
          ))}
        </ol>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={openDashboard} className="btn-outline" style={{ flex: 1, justifyContent: "center", fontSize: 11 }}>
            <ExternalLink size={11} /> Open website
          </button>
          <button onClick={handleRefresh} disabled={checking} className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 11 }}>
            {checking ? <><div className="spinner" style={{ width: 11, height: 11 }} /> Checking...</> : <><RefreshCw size={11} /> Refresh</>}
          </button>
        </div>
        {error && <p style={{ fontSize: 11, color: "var(--clay)", marginTop: 8, lineHeight: 1.5 }}>{error}</p>}
      </div>

      {/* Trust line */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {["5 free conversions — no credit card", "Read-only · Never writes to NetSuite"].map(t => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--ink-mute)" }}>
            <span style={{ color: "var(--clay)", fontSize: 11 }}>—</span>{t}
          </div>
        ))}
      </div>
    </div>
  )
}
