"use client"

import { useState, useEffect } from "react"
import { User, Shield, Trash2, Gift, CheckCircle, XCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function SettingsPage() {
  const [user, setUser]             = useState<any>(null)
  const [userPlan, setUserPlan]     = useState("free")
  const [promoCode, setPromoCode]   = useState("")
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoMessage, setPromoMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      setUser(u)
      if (u) {
        try {
          const res = await fetch("/api/user")
          if (res.ok) { const d = await res.json(); setUserPlan(d.plan || "free") }
        } catch { /* use default free */ }
      }
    }
    load()
  }, [])

  const handleRedeemPromo = async () => {
    if (!promoCode.trim()) return
    setPromoLoading(true)
    setPromoMessage(null)
    try {
      const res = await fetch("/api/promo/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setPromoMessage({ type: "error", text: data.error || "Invalid promo code" })
      } else {
        setPromoMessage({ type: "success", text: data.message })
        setPromoCode("")
        setUserPlan(data.plan)
        setTimeout(() => window.location.reload(), 2000)
      }
    } catch {
      setPromoMessage({ type: "error", text: "Failed to redeem promo code" })
    } finally {
      setPromoLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleting) return
    const confirmed = window.confirm(
      "Delete your SuiteMigrate account and conversion history? This cannot be undone."
    )
    if (!confirmed) return

    setDeleting(true)
    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: "DELETE" }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        window.alert(data.error || "Could not delete account.")
        return
      }

      const supabase = createClient()
      await supabase.auth.signOut()
      window.location.href = "/"
    } catch {
      window.alert("Could not delete account.")
    } finally {
      setDeleting(false)
    }
  }

  if (!user) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
      <div style={{ width: 24, height: 24, border: "2px solid var(--rule)", borderTopColor: "var(--clay)", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  const name     = user.user_metadata?.name || ""
  const email    = user.email || ""
  const provider = user.app_metadata?.provider || "email"
  const planLabels: Record<string, string> = { free: "Free", pro: "Pro", lifetime: "Lifetime", team: "Team" }

  const Section = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div style={{ border: "1px solid var(--rule)", borderRadius: 6, overflow: "hidden", marginBottom: 20 }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--rule)", background: "rgba(15,23,42,.03)" }}>
        <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)" }}>{label}</p>
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  )

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12.5, fontWeight: 500, color: "var(--ink)", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  )

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px", borderRadius: 4,
    border: "1px solid var(--rule)", background: "var(--paper)",
    fontSize: 13.5, color: "var(--ink)", outline: "none",
    fontFamily: "var(--f-sans)",
    transition: "border-color .15s",
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(24px,3.5vw,38px)", letterSpacing: "-0.025em", color: "var(--ink)", marginBottom: 6 }}>
          Account Settings
        </h1>
        <p style={{ fontFamily: "var(--f-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)" }}>
          Profile and account preferences
        </p>
      </div>

      {/* Current plan */}
      <Section label="Current Plan">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <span style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: 32, letterSpacing: "-0.025em", color: "var(--ink)" }}>
              {planLabels[userPlan] ?? "Free"}
            </span>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 4 }}>
              {userPlan === "free" && "5 free conversions"}
              {userPlan === "pro" && "Unlimited conversions"}
              {userPlan === "lifetime" && "Lifetime unlimited conversions"}
              {userPlan === "team" && "Team plan — unlimited conversions"}
            </p>
          </div>
          {userPlan === "free" && (
            <a href="/dashboard/billing" className="btn-pill" style={{ fontSize: 12 }}>Upgrade plan →</a>
          )}
        </div>
      </Section>

      {/* Promo code */}
      <Section label="Promo Code">
        <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 14, lineHeight: 1.6 }}>
          Have a promo code? Redeem it here to upgrade your plan.
        </p>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input
            style={{ ...inputStyle, flex: 1, textTransform: "uppercase", letterSpacing: ".05em", fontFamily: "var(--f-mono)" }}
            placeholder="ENTER CODE"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleRedeemPromo()}
          />
          <button
            onClick={handleRedeemPromo}
            disabled={!promoCode.trim() || promoLoading}
            className="btn-pill"
            style={{ fontSize: 12, padding: "9px 18px", opacity: (!promoCode.trim() || promoLoading) ? .5 : 1, cursor: (!promoCode.trim() || promoLoading) ? "not-allowed" : "pointer" }}
          >
            {promoLoading ? "Redeeming..." : "Redeem"}
          </button>
        </div>

        {promoMessage && (
          <div style={{
            padding: "10px 14px", borderRadius: 4, display: "flex", alignItems: "flex-start", gap: 8,
            background: promoMessage.type === "success" ? "rgba(22,163,74,.06)" : "rgba(220,38,38,.06)",
            border: `1px solid ${promoMessage.type === "success" ? "rgba(22,163,74,.2)" : "rgba(220,38,38,.2)"}`,
          }}>
            {promoMessage.type === "success"
              ? <CheckCircle size={14} style={{ color: "#16a34a", flexShrink: 0, marginTop: 1 }} />
              : <XCircle size={14} style={{ color: "#dc2626", flexShrink: 0, marginTop: 1 }} />}
            <p style={{ fontSize: 13, color: promoMessage.type === "success" ? "#16a34a" : "#dc2626" }}>
              {promoMessage.text}
            </p>
          </div>
        )}

        <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 4, background: "rgba(15,23,42,.04)", border: "1px solid var(--rule)" }}>
          <p style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, color: "var(--ink-soft)", lineHeight: 1.8 }}>
            Enter a valid promo code above. Codes are case-insensitive.
          </p>
        </div>
      </Section>

      {/* Profile */}
      <Section label="Profile">
        <Field label="Full name">
          <input defaultValue={name} placeholder="Your full name" style={inputStyle}
            onFocus={e => (e.target.style.borderColor = "var(--ink)")}
            onBlur={e => (e.target.style.borderColor = "var(--rule)")} />
        </Field>
        <Field label="Email address">
          <div style={{ display: "flex", gap: 8 }}>
            <input defaultValue={email} disabled style={{ ...inputStyle, flex: 1, opacity: .55, cursor: "not-allowed" }} />
            {provider !== "email" && (
              <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", padding: "0 10px", border: "1px solid var(--rule)", borderRadius: 3, display: "flex", alignItems: "center", color: "var(--ink-mute)", flexShrink: 0 }}>
                {provider}
              </span>
            )}
          </div>
          <p style={{ fontSize: 11.5, color: "var(--ink-mute)", marginTop: 5 }}>Email cannot be changed.</p>
        </Field>
        <button className="btn-pill" style={{ fontSize: 12, padding: "9px 18px" }}>Save Changes</button>
      </Section>

      {/* Security */}
      <Section label="Security">
        {provider === "email" ? (
          <>
            <Field label="New password">
              <input type="password" placeholder="Enter new password" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = "var(--ink)")}
                onBlur={e => (e.target.style.borderColor = "var(--rule)")} />
            </Field>
            <Field label="Confirm new password">
              <input type="password" placeholder="Confirm new password" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = "var(--ink)")}
                onBlur={e => (e.target.style.borderColor = "var(--rule)")} />
            </Field>
            <button className="btn-pill" style={{ fontSize: 12, padding: "9px 18px" }}>Update Password</button>
          </>
        ) : (
          <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.65 }}>
            You signed in with <strong style={{ color: "var(--ink)", textTransform: "capitalize" }}>{provider}</strong>.
            Password management is handled by your sign-in provider.
          </p>
        )}
      </Section>

      {/* Danger zone */}
      <div style={{ border: "1px solid rgba(220,38,38,.2)", borderRadius: 6, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(220,38,38,.15)", background: "rgba(220,38,38,.03)" }}>
          <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".14em", color: "#dc2626" }}>Danger Zone</p>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, padding: "14px 16px", border: "1px solid rgba(220,38,38,.15)", borderRadius: 4, background: "rgba(220,38,38,.03)" }}>
            <div>
              <p style={{ fontSize: 13.5, fontWeight: 500, color: "var(--ink)", marginBottom: 3 }}>Delete account</p>
              <p style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>Permanently deletes your account and all data. Cannot be undone.</p>
            </div>
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              style={{
                padding: "9px 18px", borderRadius: 4, background: "transparent",
                border: "1px solid rgba(220,38,38,.3)", color: "#dc2626",
                fontSize: 13, fontFamily: "var(--f-sans)", cursor: deleting ? "not-allowed" : "pointer",
                transition: "background .15s", opacity: deleting ? .6 : 1,
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(220,38,38,.07)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              {deleting ? "Deleting…" : "Delete Account"}
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
