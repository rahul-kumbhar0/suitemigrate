"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MobileSidebarTrigger } from "@/components/dashboard/sidebar"
import {
  LogOut,
  User,
  ChevronDown,
  Zap,
} from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import Link from "next/link"

export function DashboardHeader({ user }: { user: SupabaseUser }) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const name = user.user_metadata?.name || user.email?.split("@")[0] || "User"
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="border-b border-slate-800 bg-slate-900/50 px-4 lg:px-6 py-4 flex items-center justify-between shrink-0">
      {/* Left: mobile hamburger */}
      <div className="flex items-center gap-3">
        <MobileSidebarTrigger />
        {/* Mobile logo (shown next to hamburger on small screens) */}
        <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-base font-bold text-white">
            Suite<span className="gradient-text">Migrate</span>
          </span>
        </Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Plan badge */}
        <Badge variant="default" className="hidden sm:flex text-xs">
          <Zap className="h-3 w-3 mr-1" />
          Free Plan
        </Badge>

        <Link href="/dashboard/billing">
          <Button variant="gradient" size="sm" className="hidden sm:flex text-xs h-8">
            Upgrade
          </Button>
        </Link>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-white leading-none">{name}</p>
              <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[140px]">{user.email}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-500 hidden sm:block" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-slate-700 bg-slate-900 shadow-xl z-20 overflow-hidden">
                <div className="p-3 border-b border-slate-800">
                  <p className="text-sm font-medium text-white truncate">{name}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
                <div className="p-1">
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Account Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
