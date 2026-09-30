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
  { label: "Overview",    href: "/dashboard",              icon: LayoutDashboard, exact: true },
  { label: "Conversions", href: "/dashboard/conversions",  icon: History },
  { label: "Billing",     href: "/dashboard/billing",      icon: CreditCard },
  { label: "Team",        href: "/dashboard/team",         icon: Users },
  { label: "Settings",    href: "/dashboard/settings",     icon: Settings },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const isActive = (item: (typeof navItems)[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  return (
    <>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
              isActive(item)
                ? "bg-[#2C1A0E] text-[#F7F3EE] font-medium shadow-sm"
                : "text-[#6B5344] hover:text-[#2C1A0E] hover:bg-[#EDE7DE] font-normal"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Extension CTA */}
      <div className="px-3 pb-4">
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-[#D5C9BB] bg-[#EDE7DE]/60 text-sm text-[#6B5344] hover:bg-[#EDE7DE] transition-colors group"
        >
          <Chrome className="h-4 w-4 shrink-0 text-amber-600" />
          <span className="flex-1 text-[#2C1A0E] font-medium">Chrome Extension</span>
          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity" />
        </a>
      </div>
    </>
  )
}

export function MobileSidebarTrigger() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button className="lg:hidden text-[#6B5344] hover:text-[#2C1A0E] p-1" onClick={() => setOpen(true)}>
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-40 bg-[#2C1A0E]/40 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />
      )}

      <div className={cn(
        "fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#F7F3EE] border-r border-[#D5C9BB] flex flex-col transition-transform duration-200 lg:hidden",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="px-5 py-4 border-b border-[#EDE7DE] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <div className="h-7 w-7 rounded-md bg-[#2C1A0E] flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-[#F7F3EE]" />
            </div>
            <span className="font-serif text-[#2C1A0E]">Suite<span className="gradient-text">Migrate</span></span>
          </Link>
          <button onClick={() => setOpen(false)} className="text-[#9B7B6A] hover:text-[#2C1A0E]">
            <X className="h-5 w-5" />
          </button>
        </div>
        <NavLinks onNavigate={() => setOpen(false)} />
      </div>
    </>
  )
}

export function DashboardSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-60 border-r border-[#D5C9BB] bg-[#FDFAF6] shrink-0">
      <div className="px-5 py-5 border-b border-[#EDE7DE]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-[#2C1A0E] flex items-center justify-center">
            <Zap className="h-4 w-4 text-[#F7F3EE]" />
          </div>
          <span className="font-serif text-[#2C1A0E] text-lg">
            Suite<span className="gradient-text">Migrate</span>
          </span>
        </Link>
      </div>
      <NavLinks />
    </aside>
  )
}
