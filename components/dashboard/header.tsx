"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { MobileSidebarTrigger } from "@/components/dashboard/sidebar"
import { LogOut, User, ChevronDown, Zap, Crown } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import Link from "next/link"

const PLAN_CONFIG: Record<string, { label: string; cls: string }> = {
  free:     { label: "Free Plan",  cls: "border-[#2A3650] text-[#6B7A99]" },
  pro:      { label: "Pro",        cls: "border-[#F6C430]/30 text-[#F6C430] bg-[#F6C430]/8" },
  lifetime: { label: "Lifetime",   cls: "border-[#F6C430]/50 text-[#F6C430] bg-[#F6C430]/10" },
  team:     { label: "Team",       cls: "border-[#A78BFA]/30 text-[#A78BFA] bg-[#7C5CFC]/8" },
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

  const name = user.user_metadata?.name || user.email?.split("@")[0] || "User"
  const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
  const cfg = PLAN_CONFIG[plan] ?? PLAN_CONFIG.free

  return (
    <header className="border-b border-[#1F2A3C] bg-[#0A0E1A] px-4 lg:px-6 py-3.5 flex items-center justify-between shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        <MobileSidebarTrigger />
        <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
          <div className="h-7 w-7 rounded-lg bg-[#F6C430] flex items-center justify-center">
            <Zap className="h-3.5 w-3.5 text-[#0A0E1A]" />
          </div>
          <span className="font-bold text-white text-sm">SuiteMigrate</span>
        </Link>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Plan badge */}
        <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${cfg.cls}`}>
          <Crown className="h-3 w-3" />
          {cfg.label}
        </span>

        {/* Upgrade button — free only */}
        {plan === "free" && (
          <Link href="/dashboard/billing">
            <button className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#F6C430] hover:bg-[#FFD24D] text-[#0A0E1A] text-xs font-bold transition-all shadow-sm">
              <Zap className="h-3 w-3" />
              Upgrade
            </button>
          </Link>
        )}

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 pl-1 pr-2 py-1.5 rounded-xl hover:bg-[#141926] transition-all"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#F6C430] to-[#7C5CFC] flex items-center justify-center text-[11px] font-black text-[#0A0E1A] shrink-0">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-white leading-none">{name}</p>
              <p className="text-[11px] text-[#6B7A99] mt-0.5 truncate max-w-[130px]">{user.email}</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-[#434E66] hidden sm:block" />
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-[#2A3650] bg-[#0F1420] shadow-2xl z-20 overflow-hidden">
                <div className="p-4 border-b border-[#1F2A3C]">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#F6C430] to-[#7C5CFC] flex items-center justify-center text-sm font-black text-[#0A0E1A] shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{name}</p>
                      <p className="text-[11px] text-[#6B7A99] truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-[#A8B4CC] hover:text-white hover:bg-[#141926] rounded-xl transition-all"
                  >
                    <User className="h-4 w-4" />
                    Account Settings
                  </Link>
                  <Link
                    href="/dashboard/billing"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-[#A8B4CC] hover:text-white hover:bg-[#141926] rounded-xl transition-all"
                  >
                    <Crown className="h-4 w-4" />
                    Billing &amp; Plans
                  </Link>
                  <div className="my-1 border-t border-[#1F2A3C]" />
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
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
