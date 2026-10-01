"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { MobileSidebarTrigger } from "@/components/dashboard/sidebar"
import { LogOut, User, ChevronDown, Zap, Crown } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import Link from "next/link"

const PLAN_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  free:     { label: "Free",     bg: "rgba(15,23,42,.07)",   color: "var(--ink-mute)" },
  pro:      { label: "Pro",      bg: "rgba(217,74,31,.10)",  color: "var(--clay)" },
  lifetime: { label: "Lifetime", bg: "rgba(15,23,42,.90)",   color: "var(--paper)" },
  team:     { label: "Team",     bg: "rgba(217,74,31,.15)",  color: "var(--clay)" },
}

export function DashboardHeader({ user, plan = "free" }: { user: SupabaseUser; plan?: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const supabase = createClient()

  const logout = async () => {
    await supabase.auth.signOut()
    router.push("/"); router.refresh()
  }

  const name     = user.user_metadata?.name || user.email?.split("@")[0] || "User"
  const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
  const cfg      = PLAN_CONFIG[plan] ?? PLAN_CONFIG.free

  return (
    <header style={{
      borderBottom: "1px solid var(--rule)",
      background: "rgba(250,250,249,.97)",
      backdropFilter: "blur(8px)",
      padding: "0 20px",
      height: 56,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexShrink: 0, position: "sticky", top: 0, zIndex: 30,
    }}>
      {/* Left — mobile trigger + logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div className="dash-mobile-trigger">
          <MobileSidebarTrigger />
        </div>
        <Link href="/dashboard" className="dash-mobile-logo"
          style={{ display: "flex", alignItems: "center", gap: 7, textDecoration: "none" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--clay)", display: "inline-block" }} />
          <span style={{ fontFamily: "var(--f-head)", fontSize: 16, fontWeight: 400, color: "var(--ink)" }}>SuiteMigrate</span>
        </Link>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Plan badge */}
        <span style={{
          fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase",
          letterSpacing: ".13em", padding: "3px 9px", borderRadius: 3,
          background: cfg.bg, color: cfg.color, border: "1px solid var(--rule)",
          display: "none",
        }} className="header-plan-badge">
          {cfg.label}
        </span>

        {/* Upgrade — free only */}
        {plan === "free" && (
          <Link href="/dashboard/billing" className="btn-pill header-upgrade-btn"
            style={{ padding: "6px 14px", fontSize: 12, display: "none" }}>
            Upgrade
          </Link>
        )}

        {/* User dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setOpen(!open)}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: "4px 6px", borderRadius: 4, transition: "background .14s" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(15,23,42,.06)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "var(--ink)", color: "var(--paper)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, fontFamily: "var(--f-mono)", flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ textAlign: "left" }} className="header-user-info">
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", lineHeight: 1.2, margin: 0 }}>{name}</p>
              <p style={{ fontSize: 11, color: "var(--ink-mute)", margin: 0, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
            </div>
            <ChevronDown size={13} style={{ color: "var(--ink-mute)" }} className="header-user-info" />
          </button>

          {open && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setOpen(false)} />
              <div style={{
                position: "absolute", right: 0, top: "calc(100% + 6px)",
                width: 210, borderRadius: 6,
                border: "1px solid var(--rule)", background: "var(--paper)",
                boxShadow: "0 8px 24px -4px rgba(15,23,42,.12)",
                zIndex: 20, overflow: "hidden",
              }}>
                {/* User info in dropdown */}
                <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--rule)" }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", margin: 0 }}>{name}</p>
                  <p style={{ fontSize: 11, color: "var(--ink-mute)", margin: 0, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
                  {/* Plan badge inside dropdown */}
                  <span style={{ display: "inline-block", marginTop: 6, fontFamily: "var(--f-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: ".13em", padding: "2px 7px", borderRadius: 3, background: cfg.bg, color: cfg.color, border: "1px solid var(--rule)" }}>
                    {cfg.label}
                  </span>
                </div>
                <div style={{ padding: "6px" }}>
                  {plan === "free" && (
                    <Link href="/dashboard/billing" onClick={() => setOpen(false)}
                      style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 4, fontSize: 13, color: "var(--clay)", textDecoration: "none", fontWeight: 500 }}
                      className="dropdown-item">
                      <Zap size={14} />
                      Upgrade Plan
                    </Link>
                  )}
                  <Link href="/dashboard/settings" onClick={() => setOpen(false)}
                    style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 4, fontSize: 13, color: "var(--ink-soft)", textDecoration: "none" }}
                    className="dropdown-item">
                    <User size={14} />
                    Account Settings
                  </Link>
                  <div style={{ height: 1, background: "var(--rule)", margin: "4px 0" }} />
                  <button onClick={logout}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 4, fontSize: 13, color: "#dc2626", background: "none", border: "none", cursor: "pointer" }}
                    className="dropdown-item-danger">
                    <LogOut size={14} />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .header-plan-badge    { display: inline-flex !important; }
          .header-upgrade-btn   { display: inline-flex !important; }
          .header-user-info     { display: block !important; }
        }
        .dropdown-item:hover       { background: var(--paper-warm) !important; color: var(--ink) !important; }
        .dropdown-item-danger:hover { background: rgba(220,38,38,.07) !important; }
      `}</style>
    </header>
  )
}
