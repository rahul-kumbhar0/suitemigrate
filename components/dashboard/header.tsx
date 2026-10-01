"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { MobileSidebarTrigger } from "@/components/dashboard/sidebar"
import { LogOut, User, ChevronDown } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import Link from "next/link"

const PLAN_LABELS: Record<string, string> = {
  free: "Free", pro: "Pro", lifetime: "Lifetime", team: "Team",
}

export function DashboardHeader({ user, plan = "free" }: { user: SupabaseUser; plan?: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const supabase = createClient()

  const logout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const name     = user.user_metadata?.name || user.email?.split("@")[0] || "User"
  const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
  const planLabel = PLAN_LABELS[plan] ?? "Free"

  return (
    <header style={{
      borderBottom: "1px solid var(--rule)",
      background: "rgba(250,250,249,.95)",
      backdropFilter: "blur(8px)",
      padding: "12px 24px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexShrink: 0,
    }}>
      {/* Left: mobile trigger */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <MobileSidebarTrigger />
        {/* Mobile logo */}
        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 7, textDecoration: "none" }} className="mobile-logo">
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--clay)", display: "inline-block" }} />
          <span style={{ fontFamily: "var(--f-head)", fontSize: 16, fontWeight: 400, color: "var(--ink)" }}>SuiteMigrate</span>
        </Link>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Plan badge */}
        <span style={{
          fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase",
          letterSpacing: ".14em", padding: "4px 10px", borderRadius: 3,
          background: plan === "free" ? "rgba(15,23,42,.07)" : "rgba(217,74,31,.10)",
          color: plan === "free" ? "var(--ink-mute)" : "var(--clay)",
        }}>
          {planLabel}
        </span>

        {/* Upgrade button — free only */}
        {plan === "free" && (
          <Link href="/dashboard/billing" className="btn-pill" style={{ padding: "7px 16px", fontSize: 12 }}>
            Upgrade
          </Link>
        )}

        {/* User menu */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setOpen(!open)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "none", border: "none", cursor: "pointer",
              padding: "5px 8px", borderRadius: 4,
              transition: "background .14s",
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(15,23,42,.06)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >
            {/* Avatar */}
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "var(--ink)", color: "var(--paper)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, fontFamily: "var(--f-mono)",
              flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ textAlign: "left" }} className="user-info-desktop">
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", lineHeight: 1.2, margin: 0 }}>{name}</p>
              <p style={{ fontSize: 11, color: "var(--ink-mute)", margin: 0, marginTop: 1, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
            </div>
            <ChevronDown size={14} style={{ color: "var(--ink-mute)" }} className="user-info-desktop" />
          </button>

          {open && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setOpen(false)} />
              <div style={{
                position: "absolute", right: 0, top: "calc(100% + 6px)",
                width: 200, borderRadius: 6,
                border: "1px solid var(--rule)", background: "var(--paper)",
                boxShadow: "0 8px 24px -4px rgba(15,23,42,.12)",
                zIndex: 20, overflow: "hidden",
              }}>
                <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--rule)" }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", margin: 0 }}>{name}</p>
                  <p style={{ fontSize: 11, color: "var(--ink-mute)", margin: 0, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
                </div>
                <div style={{ padding: "6px" }}>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setOpen(false)}
                    style={{
                      display: "flex", alignItems: "center", gap: 9,
                      padding: "8px 10px", borderRadius: 4,
                      fontSize: 13, color: "var(--ink-soft)", textDecoration: "none",
                      transition: "background .12s, color .12s",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(15,23,42,.06)"; (e.currentTarget as HTMLElement).style.color = "var(--ink)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--ink-soft)"; }}
                  >
                    <User size={14} />
                    Account Settings
                  </Link>
                  <div style={{ height: 1, background: "var(--rule)", margin: "4px 0" }} />
                  <button
                    onClick={logout}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 9,
                      padding: "8px 10px", borderRadius: 4,
                      fontSize: 13, color: "#dc2626",
                      background: "none", border: "none", cursor: "pointer",
                      transition: "background .12s",
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(220,38,38,.07)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                  >
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
        @media (max-width: 768px) {
          .user-info-desktop { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-logo { display: none !important; }
          .mobile-trigger { display: none !important; }
        }
      `}</style>
    </header>
  )
}
