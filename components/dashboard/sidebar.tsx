"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Zap, LayoutDashboard, History, CreditCard,
  Users, Settings, Chrome, ExternalLink, Menu, X,
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
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all",
              isActive(item)
                ? "bg-[#F6C430]/10 text-[#F6C430] border border-[#F6C430]/20 shadow-sm"
                : "text-[#6B7A99] hover:text-white hover:bg-[#141926]"
            )}
          >
            <item.icon className={cn("h-4 w-4 shrink-0", isActive(item) ? "text-[#F6C430]" : "text-[#434E66]")} />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Extension CTA */}
      <div className="px-3 pb-5">
        <div className="rounded-xl border border-[#2A3650] bg-[#0F1420] p-3 mb-3">
          <p className="text-xs font-semibold text-white mb-1">Chrome Extension</p>
          <p className="text-[10px] text-[#6B7A99] mb-2.5 leading-relaxed">
            Install to scan NetSuite scripts directly from your browser.
          </p>
          <a
            href="#"
            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-[#F6C430] hover:bg-[#FFD24D] text-[#0A0E1A] text-xs font-bold transition-all"
          >
            <Chrome className="h-3.5 w-3.5" />
            Install Extension
            <ExternalLink className="h-3 w-3" />
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
        className="lg:hidden p-2 rounded-lg text-[#6B7A99] hover:text-white hover:bg-[#141926] transition-all"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className={cn(
        "fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0A0E1A] border-r border-[#1F2A3C] flex flex-col transition-transform duration-200 lg:hidden",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="px-5 py-4 border-b border-[#1F2A3C] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <div className="h-7 w-7 rounded-lg bg-[#F6C430] flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-[#0A0E1A]" />
            </div>
            <span className="font-bold text-white text-sm">Suite<span className="gradient-text">Migrate</span></span>
          </Link>
          <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-[#6B7A99] hover:text-white hover:bg-[#141926]">
            <X className="h-4 w-4" />
          </button>
        </div>
        <NavLinks onNavigate={() => setOpen(false)} />
      </div>
    </>
  )
}

export function DashboardSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-60 border-r border-[#1F2A3C] bg-[#0A0E1A] shrink-0">
      <div className="px-5 py-5 border-b border-[#1F2A3C]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-[#F6C430] flex items-center justify-center shadow-sm">
            <Zap className="h-4 w-4 text-[#0A0E1A]" />
          </div>
          <span className="font-bold text-white tracking-tight">
            Suite<span className="gradient-text">Migrate</span>
          </span>
        </Link>
      </div>
      <NavLinks />
    </aside>
  )
}
