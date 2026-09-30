"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Zap } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function Navbar() {
  const [open, setOpen]       = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => setLoggedIn(!!session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setLoggedIn(!!s))
    return () => subscription.unsubscribe()
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1F2A3C] bg-[#0A0E1A]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-[#F6C430] flex items-center justify-center shadow-sm">
              <Zap className="h-4 w-4 text-[#0A0E1A]" />
            </div>
            <span className="text-base font-bold text-white tracking-tight">
              Suite<span className="gradient-text">Migrate</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: "Features", href: "/#how-it-works" },
              { label: "Pricing",  href: "/#pricing" },
              { label: "FAQ",      href: "/#faq" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3.5 py-2 rounded-lg text-sm text-[#A8B4CC] hover:text-white hover:bg-[#141926] transition-all"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {loggedIn ? (
              <Link href="/dashboard">
                <button className="px-4 py-2 rounded-lg bg-[#F6C430] hover:bg-[#FFD24D] text-[#0A0E1A] text-sm font-semibold transition-all shadow-sm">
                  Dashboard →
                </button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <button className="px-4 py-2 rounded-lg text-sm text-[#A8B4CC] hover:text-white hover:bg-[#141926] transition-all">
                    Sign in
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="px-4 py-2 rounded-lg bg-[#F6C430] hover:bg-[#FFD24D] text-[#0A0E1A] text-sm font-semibold transition-all shadow-sm hover:shadow-[0_0_16px_rgba(246,196,48,0.3)]">
                    Get started free
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-[#A8B4CC] hover:text-white hover:bg-[#141926] transition-all"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden py-4 border-t border-[#1F2A3C] space-y-1">
            {[
              { label: "Features", href: "/#how-it-works" },
              { label: "Pricing",  href: "/#pricing" },
              { label: "FAQ",      href: "/#faq" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm text-[#A8B4CC] hover:text-white hover:bg-[#141926] transition-all"
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-3 space-y-2 border-t border-[#1F2A3C] mt-2">
              {loggedIn ? (
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  <button className="w-full py-2.5 rounded-xl bg-[#F6C430] text-[#0A0E1A] text-sm font-bold">
                    Dashboard →
                  </button>
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <button className="w-full py-2.5 rounded-xl border border-[#2A3650] text-[#A8B4CC] text-sm">
                      Sign in
                    </button>
                  </Link>
                  <Link href="/signup" onClick={() => setOpen(false)}>
                    <button className="w-full py-2.5 rounded-xl bg-[#F6C430] text-[#0A0E1A] text-sm font-bold">
                      Get started free
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
