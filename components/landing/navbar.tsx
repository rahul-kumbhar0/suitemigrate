"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Zap, LayoutDashboard } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session)
    })

    // Keep in sync with auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/60 bg-[#050d1a]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">
              Suite<span className="gradient-text">Migrate</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</Link>
            <Link href="/#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors">How it works</Link>
            <Link href="/pricing" className="text-sm text-slate-400 hover:text-white transition-colors">Pricing</Link>
            <Link href="/#faq" className="text-sm text-slate-400 hover:text-white transition-colors">FAQ</Link>
          </div>

          {/* CTA — changes based on auth state */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button size="sm" variant="gradient" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" variant="gradient">Get Started Free</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden py-4 border-t border-slate-800 space-y-3">
            <Link href="/#features" className="block py-2 text-sm text-slate-400 hover:text-white" onClick={() => setOpen(false)}>Features</Link>
            <Link href="/#how-it-works" className="block py-2 text-sm text-slate-400 hover:text-white" onClick={() => setOpen(false)}>How it works</Link>
            <Link href="/pricing" className="block py-2 text-sm text-slate-400 hover:text-white" onClick={() => setOpen(false)}>Pricing</Link>
            <Link href="/#faq" className="block py-2 text-sm text-slate-400 hover:text-white" onClick={() => setOpen(false)}>FAQ</Link>
            <div className="flex flex-col gap-2 pt-2">
              {isLoggedIn ? (
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  <Button variant="gradient" className="w-full gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login"><Button variant="outline" className="w-full">Sign in</Button></Link>
                  <Link href="/signup"><Button variant="gradient" className="w-full">Get Started Free</Button></Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
