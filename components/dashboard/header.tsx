"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { MobileSidebarTrigger } from "@/components/dashboard/sidebar"
import { LogOut, User, ChevronDown, Zap } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import Link from "next/link"

export function DashboardHeader({ user, plan = "free" }: { user: SupabaseUser; plan?: string }) {
  const router   = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const name = user.user_metadata?.name || user.email?.split("@")[0] || "User"
  const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)

  const planLabel: Record<string, string> = {
    free:     "Free Plan",
    pro:      "Pro",
    lifetime: "Lifetime",
    team:     "Team",
  }
  const planColor: Record<string, string> = {
    free:     "bg-[#EDE7DE] text-[#6B5344] border-[#D5C9BB]",
    pro:      "bg-amber-100 text-amber-800 border-amber-200",
    lifetime: "bg-[#2C1A0E] text-[#F7F3EE] border-[#2C1A0E]",
    team:     "bg-orange-100 text-orange-800 border-orange-200",
  }

  return (
    <header className="border-b border-[#D5C9BB] bg-[#FDFAF6] px-4 lg:px-6 py-3.5 flex items-center justify-between shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        <MobileSidebarTrigger />
        <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
          <div className="h-7 w-7 rounded-md bg-[#2C1A0E] flex items-center justify-center">
            <Zap className="h-3.5 w-3.5 text-[#F7F3EE]" />
          </div>
          <span className="font-serif text-[#2C1A0E]">SuiteMigrate</span>
        </Link>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Plan badge */}
        <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${planColor[plan] ?? planColor.free}`}>
          <Zap className="h-3 w-3" />
          {planLabel[plan] ?? "Free Plan"}
        </span>

        {/* Upgrade CTA — only for free */}
        {plan === "free" && (
          <Link href="/dashboard/billing">
            <button className="hidden sm:block px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-white text-xs font-semibold transition-colors shadow-sm">
              Upgrade
            </button>
          </Link>
        )}

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-[#EDE7DE] transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-[#2C1A0E] flex items-center justify-center text-xs font-bold text-[#F7F3EE] shrink-0">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-[#2C1A0E] leading-none">{name}</p>
              <p className="text-xs text-[#9B7B6A] mt-0.5 truncate max-w-[130px]">{user.email}</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-[#9B7B6A] hidden sm:block" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-48 rounded-xl border border-[#D5C9BB] bg-white shadow-lg z-20 overflow-hidden">
                <div className="p-3 border-b border-[#EDE7DE]">
                  <p className="text-sm font-semibold text-[#2C1A0E] truncate">{name}</p>
                  <p className="text-xs text-[#9B7B6A] truncate">{user.email}</p>
                </div>
                <div className="p-1">
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-[#6B5344] hover:text-[#2C1A0E] hover:bg-[#EDE7DE] rounded-lg transition-colors"
                  >
                    <User className="h-4 w-4" />
                    Account Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
