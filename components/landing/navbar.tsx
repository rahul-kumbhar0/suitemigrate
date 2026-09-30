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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#D5C9BB]/60 bg-[#F7F3EE]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#2C1A0E] flex items-center justify-center">
              <Zap className="h-4 w-4 text-[#F7F3EE]" />
            </div>
            <span className="font-serif text-[#2C1A0E] text-lg">
              Suite<span className="gradient-text">Migrate</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {[
              { label: "Features",     href: "/#how-it-works" },
              { label: "Pricing",      href: "/#pricing" },
              { label: "FAQ",          href: "/#faq" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="text-sm text-[#6B5344] hover:text-[#2C1A0E] transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {loggedIn ? (
              <Link href="/dashboard">
                <button className="px-4 py-2 rounded-xl bg-[#2C1A0E] text-[#F7F3EE] text-sm font-medium hover:bg-[#3D2518] transition-colors">
                  Dashboard
                </button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm text-[#6B5344] hover:text-[#2C1A0E] transition-colors px-3 py-2">
                  Sign in
                </Link>
                <Link href="/signup">
                  <button className="px-4 py-2 rounded-xl bg-[#2C1A0E] text-[#F7F3EE] text-sm font-medium hover:bg-[#3D2518] transition-colors shadow-sm">
                    Get Started Free
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-[#6B5344] hover:text-[#2C1A0E] p-1" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden py-4 border-t border-[#EDE7DE] space-y-1">
            {[
              { label: "Features",  href: "/#how-it-works" },
              { label: "Pricing",   href: "/#pricing" },
              { label: "FAQ",       href: "/#faq" },
            ].map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="block py-2.5 px-2 text-sm text-[#6B5344] hover:text-[#2C1A0E]">
                {l.label}
              </Link>
            ))}
            <div className="pt-3 space-y-2">
              {loggedIn ? (
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  <button className="w-full py-2.5 rounded-xl bg-[#2C1A0E] text-[#F7F3EE] text-sm font-medium">
                    Dashboard
                  </button>
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <button className="w-full py-2.5 rounded-xl border border-[#D5C9BB] text-[#2C1A0E] text-sm">
                      Sign in
                    </button>
                  </Link>
                  <Link href="/signup" onClick={() => setOpen(false)}>
                    <button className="w-full py-2.5 rounded-xl bg-[#2C1A0E] text-[#F7F3EE] text-sm font-medium">
                      Get Started Free
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
