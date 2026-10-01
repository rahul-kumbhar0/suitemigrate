"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard, History, CreditCard,
  Users, Settings, Chrome, Menu, X,
} from "lucide-react"

const navItems = [
  { label: "Overview",    href: "/dashboard",             icon: LayoutDashboard, exact: true },
  { label: "Conversions", href: "/dashboard/conversions", icon: History },
  { label: "Billing",     href: "/dashboard/billing",     icon: CreditCard },
  { label: "Team",        href: "/dashboard/team",        icon: Users },
  { label: "Settings",    href: "/dashboard/settings",    icon: Settings },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const isActive = (item: (typeof navItems)[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  return (
    <>
      <nav style={{ flex: 1, padding: "20px 16px", display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map((item) => {
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 4,
                fontSize: 14, fontFamily: "var(--f-sans)",
                textDecoration: "none", transition: "background .14s, color .14s",
                background: active ? "rgba(15,23,42,.07)" : "transparent",
                color: active ? "var(--ink)" : "var(--ink-soft)",
                fontWeight: active ? 500 : 400,
                borderLeft: active ? "2px solid var(--clay)" : "2px solid transparent",
              }}
            >
              <item.icon size={15} style={{ flexShrink: 0, color: active ? "var(--clay)" : "var(--ink-mute)" }} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Extension CTA */}
      <div style={{ padding: "0 16px 24px" }}>
        <div style={{
          border: "1px solid var(--rule)",
          borderRadius: 6,
          padding: "14px 16px",
          background: "rgba(217,74,31,.04)",
        }}>
          <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".12em", color: "var(--ink-mute)", marginBottom: 6 }}>
            Chrome Extension
          </p>
          <p style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.5, marginBottom: 10 }}>
            Install to scan NetSuite scripts from your browser.
          </p>
          <a
            href="#"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              width: "100%", padding: "8px 12px", borderRadius: 999,
              background: "var(--ink)", color: "var(--paper)",
              fontSize: 12, fontFamily: "var(--f-sans)", fontWeight: 500,
              textDecoration: "none", transition: "background .2s",
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--clay)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "var(--ink)")}
          >
            <Chrome size={13} />
            Install free
          </a>
        </div>
      </div>
    </>
  )
}

export function MobileSidebarTrigger() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "var(--ink-soft)", padding: 4 }}
        className="mobile-trigger"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(15,23,42,.4)", backdropFilter: "blur(4px)" }}
        />
      )}

      <div style={{
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
        width: 240, background: "var(--paper)",
        borderRight: "1px solid var(--rule)",
        display: "flex", flexDirection: "column",
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform .2s ease",
      }}>
        <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--rule)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" onClick={() => setOpen(false)} style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--clay)", display: "inline-block" }} />
            <span style={{ fontFamily: "var(--f-head)", fontSize: 17, fontWeight: 400, letterSpacing: "-0.02em", color: "var(--ink)" }}>
              SuiteMigrate
            </span>
          </Link>
          <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-mute)" }}>
            <X size={18} />
          </button>
        </div>
        <NavLinks onNavigate={() => setOpen(false)} />
      </div>

      <style>{`.mobile-trigger { display: block !important; }`}</style>
    </>
  )
}

export function DashboardSidebar() {
  return (
    <aside style={{
      width: 220, flexShrink: 0,
      borderRight: "1px solid var(--rule)",
      background: "var(--paper)",
      display: "flex", flexDirection: "column",
    }} className="dash-sidebar">
      {/* Logo */}
      <div style={{ padding: "20px 20px 18px", borderBottom: "1px solid var(--rule)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--clay)", display: "inline-block" }} />
          <span style={{ fontFamily: "var(--f-head)", fontSize: 18, fontWeight: 400, letterSpacing: "-0.02em", color: "var(--ink)" }}>
            SuiteMigrate
          </span>
        </Link>
      </div>

      <NavLinks />

      <style>{`
        @media (max-width: 768px) { .dash-sidebar { display: none !important; } }
      `}</style>
    </aside>
  )
}
