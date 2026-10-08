"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Loader2, Eye, EyeOff } from "lucide-react"

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", borderRadius: 4,
  border: "1px solid var(--rule)", background: "var(--paper)",
  fontSize: 14, color: "var(--ink)", outline: "none",
  fontFamily: "var(--f-sans)", transition: "border-color .15s",
}

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromExtension = searchParams.get("from") === "extension"
  const nextPath = fromExtension ? "/extension-connect" : "/dashboard"
  const [form, setForm]           = useState({ email: "", password: "" })
  const [showPass, setShowPass]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [gLoading, setGLoading]   = useState(false)
  const [error, setError]         = useState("")
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
      if (error) throw error
      router.push(nextPath); router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong."
      setError(msg === "Invalid login credentials" ? "Incorrect email or password." : msg)
    } finally { setLoading(false) }
  }

  const handleGoogle = async () => {
    setGLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}` },
    })
    if (error) { setError(error.message); setGLoading(false) }
  }

  return (
    <div style={{ width: "100%", maxWidth: 400 }}>
      {/* Card */}
      <div style={{ border: "1px solid var(--rule)", borderRadius: 6, background: "var(--paper)", padding: "36px 32px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: 32, letterSpacing: "-0.025em", color: "var(--ink)", lineHeight: 1.1, marginBottom: 6 }}>
            Welcome back.
          </h1>
          <p style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>
            Sign in to your SuiteMigrate account.
          </p>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={gLoading}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
            padding: "10px 16px", borderRadius: 4, border: "1px solid var(--rule)",
            background: "var(--paper)", fontSize: 13.5, fontFamily: "var(--f-sans)",
            color: "var(--ink)", cursor: "pointer", marginBottom: 20,
            transition: "background .14s, border-color .14s",
          }}
          className="auth-google-btn"
        >
          {gLoading ? <Loader2 size={15} style={{ animation: "spin .7s linear infinite" }} /> : <GoogleIcon />}
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{ position: "relative", marginBottom: 20 }}>
          <div style={{ position: "absolute", inset: "50% 0 auto", height: 1, background: "var(--rule)" }} />
          <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
            <span style={{ background: "var(--paper)", padding: "0 12px", fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)" }}>
              or sign in with email
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 500, color: "var(--ink)", marginBottom: 5 }}>Email</label>
            <input
              type="email" required autoComplete="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = "var(--ink)")}
              onBlur={e => (e.target.style.borderColor = "var(--rule)")}
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
              <label style={{ fontSize: 12.5, fontWeight: 500, color: "var(--ink)" }}>Password</label>
              <Link href="/forgot-password" style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, color: "var(--ink-mute)", textDecoration: "none" }} className="auth-link">
                Forgot password?
              </Link>
            </div>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"} required autoComplete="current-password"
                placeholder="Your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{ ...inputStyle, paddingRight: 40 }}
                onFocus={e => (e.target.style.borderColor = "var(--ink)")}
                onBlur={e => (e.target.style.borderColor = "var(--rule)")}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--ink-mute)", display: "flex" }}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ padding: "10px 14px", borderRadius: 4, background: "rgba(220,38,38,.06)", border: "1px solid rgba(220,38,38,.2)", fontSize: 13, color: "#dc2626" }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-pill"
            style={{ justifyContent: "center", opacity: loading ? .6 : 1, cursor: loading ? "not-allowed" : "pointer", marginTop: 4 }}>
            {loading ? <><Loader2 size={14} style={{ animation: "spin .7s linear infinite" }} /> Signing in...</> : "Sign in"}
          </button>
        </form>

        <p style={{ marginTop: 22, textAlign: "center", fontSize: 13, color: "var(--ink-soft)" }}>
          Don&apos;t have an account?{" "}
          <Link href={fromExtension ? "/signup?from=extension" : "/signup"} style={{ color: "var(--clay)", textDecoration: "none", fontWeight: 500 }} className="auth-link">
            Sign up free
          </Link>
        </p>
      </div>

      {/* Trust line */}
      <p style={{ textAlign: "center", fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".06em", color: "var(--ink-mute)", marginTop: 20 }}>
        5 free conversions · No credit card · Read-only
      </p>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .auth-google-btn:hover { background: var(--paper-warm) !important; border-color: rgba(15,23,42,.2) !important; }
        .auth-link:hover { color: var(--ink) !important; }
      `}</style>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ width: "100%", maxWidth: 400 }} />}>
      <LoginPageContent />
    </Suspense>
  )
}

export const dynamic = "force-dynamic"
