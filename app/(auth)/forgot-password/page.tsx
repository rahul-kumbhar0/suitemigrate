"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react"

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", borderRadius: 4,
  border: "1px solid var(--rule)", background: "var(--paper)",
  fontSize: 14, color: "var(--ink)", outline: "none",
  fontFamily: "var(--f-sans)", transition: "border-color .15s",
}

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState("")
  const supabase = createClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      })
      if (error) throw error
      setSent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally { setLoading(false) }
  }

  return (
    <div style={{ width: "100%", maxWidth: 400 }}>
      <div style={{ border: "1px solid var(--rule)", borderRadius: 6, background: "var(--paper)", padding: "36px 32px" }}>

        {sent ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 52, height: 52, border: "1px solid var(--rule)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
              <CheckCircle size={24} style={{ color: "var(--clay)" }} />
            </div>
            <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: 28, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: 10 }}>
              Email sent.
            </h2>
            <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.65, marginBottom: 28 }}>
              We sent a reset link to <strong style={{ color: "var(--ink)" }}>{email}</strong>.
              Check your inbox and click the link to reset your password.
            </p>
            <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 4, border: "1px solid var(--rule)", fontSize: 13.5, color: "var(--ink)", textDecoration: "none", transition: "background .14s" }} className="auth-back-btn">
              <ArrowLeft size={14} /> Back to Sign in
            </Link>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: 32, letterSpacing: "-0.025em", color: "var(--ink)", lineHeight: 1.1, marginBottom: 6 }}>
                Reset your password.
              </h1>
              <p style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 500, color: "var(--ink)", marginBottom: 5 }}>Email address</label>
                <input type="email" required autoFocus placeholder="you@company.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = "var(--ink)")}
                  onBlur={e => (e.target.style.borderColor = "var(--rule)")} />
              </div>

              {error && (
                <div style={{ padding: "10px 14px", borderRadius: 4, background: "rgba(220,38,38,.06)", border: "1px solid rgba(220,38,38,.2)", fontSize: 13, color: "#dc2626" }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-pill"
                style={{ justifyContent: "center", opacity: loading ? .6 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? <><Loader2 size={14} style={{ animation: "spin .7s linear infinite" }} /> Sending...</> : "Send Reset Link"}
              </button>
            </form>

            <div style={{ marginTop: 22, textAlign: "center" }}>
              <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--ink-mute)", textDecoration: "none" }} className="auth-back-link">
                <ArrowLeft size={13} /> Back to Sign in
              </Link>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .auth-back-btn:hover  { background: var(--paper-warm) !important; }
        .auth-back-link:hover { color: var(--ink) !important; }
      `}</style>
    </div>
  )
}

export const dynamic = "force-dynamic"
