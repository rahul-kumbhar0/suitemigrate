"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard, History, CreditCard,
  Settings, Menu, X,
} from "lucide-react"

const navItems = [
  { label: "Overview",    href: "/dashboard",             icon: LayoutDashboard, exact: true },
  { label: "Conversions", href: "/dashboard/conversions", icon: History },
  { label: "Billing",     href: "/dashboard/billing",     icon: CreditCard },
  { label: "Settings",    href: "/dashboard/settings",    icon: Settings },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const isActive = (item: (typeof navItems)[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Nav links */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map((item) => {
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 4,
                fontSize: 14,
                fontFamily: "var(--f-sans)",
                textDecoration: "none",
                color: active ? "var(--ink)" : "var(--ink-soft)",
                fontWeight: active ? 500 : 400,
                background: active ? "rgba(15,23,42,.07)" : "transparent",
                borderLeft: active ? "2px solid var(--clay)" : "2px solid transparent",
                transition: "background .14s, color .14s",
              }}
              onMouseEnter={e => {
                if (!active) (e.currentTarget as HTMLElement).style.background = "var(--paper-warm)"
              }}
              onMouseLeave={e => {
                if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"
              }}
            >
              <item.icon
                size={15}
                style={{ flexShrink: 0, color: active ? "var(--clay)" : "var(--ink-mute)" }}
              />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

    </div>
  )
}

/* ── Mobile trigger + drawer ── */
export function MobileSidebarTrigger() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-soft)", display: "flex", padding: 4, borderRadius: 4 }}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(15,23,42,.35)", backdropFilter: "blur(3px)" }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
        width: 240, background: "var(--paper)",
        borderRight: "1px solid var(--rule)",
        display: "flex", flexDirection: "column",
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform .2s ease",
      }}>
        {/* Drawer header */}
        <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--rule)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" onClick={() => setOpen(false)} style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--clay)", display: "inline-block" }} />
            <span style={{ fontFamily: "var(--f-head)", fontSize: 17, fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.01em" }}>
              SuiteMigrate
            </span>
          </Link>
          <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-mute)", display: "flex", borderRadius: 4 }}>
            <X size={18} />
          </button>
        </div>
        <SidebarContent onNavigate={() => setOpen(false)} />
      </div>
    </>
  )
}

/* ── Desktop sidebar ── */
export function DashboardSidebar() {
  return (
    <aside style={{
      width: 220, flexShrink: 0,
      borderRight: "1px solid var(--rule)",
      background: "var(--paper)",
      display: "flex", flexDirection: "column",
    }}>
      {/* Logo */}
      <div style={{ padding: "18px 18px 16px", borderBottom: "1px solid var(--rule)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--clay)", display: "inline-block" }} />
          <span style={{ fontFamily: "var(--f-head)", fontSize: 18, fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.01em" }}>
            SuiteMigrate
          </span>
        </Link>
      </div>
      <SidebarContent />
    </aside>
  )
}
