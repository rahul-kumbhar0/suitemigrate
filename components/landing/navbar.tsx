"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
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

  const links = [
    { label: "Features",    href: "/#how-it-works" },
    { label: "Pricing",     href: "/#pricing" },
    { label: "FAQ",         href: "/#faq" },
  ]

  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", background: "rgba(250,250,249,.88)", borderBottom: "1px solid var(--rule)" }}>
        <div className="auth-nav-inner" style={{ maxWidth: 1240, margin: "0 auto" }}>

          {/* Brand */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--clay)", display: "inline-block" }} />
            <span style={{ fontFamily: "var(--f-head)", fontSize: 19, fontWeight: 400, letterSpacing: "-0.02em", color: "var(--ink)" }}>
              SuiteMigrate
            </span>
          </Link>

          {/* Desktop nav */}
          <ul style={{ display: "flex", gap: 28, listStyle: "none", margin: 0, padding: 0 }} className="nav-desktop-links">
            {links.map(l => (
              <li key={l.href}>
                <Link href={l.href} className="nav-link" style={{ fontSize: 14, color: "var(--ink-soft)", textDecoration: "none", transition: "color .2s" }}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }} className="nav-desktop-cta">
            {loggedIn ? (
              <Link href="/dashboard" className="btn-pill" style={{ padding: "8px 18px", fontSize: 13 }}>Dashboard →</Link>
            ) : (
              <>
                <Link href="/login" className="nav-link" style={{ fontSize: 14, color: "var(--ink-soft)", textDecoration: "none" }}>Sign in</Link>
                <Link href="/signup" className="btn-pill" style={{ padding: "8px 18px", fontSize: 13 }}>Get started free</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="nav-mobile-toggle"
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-soft)", display: "none", padding: 4 }}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div style={{ borderTop: "1px solid var(--rule)", padding: "14px 20px 20px", display: "flex", flexDirection: "column", gap: 2 }}>
            {links.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                style={{ padding: "10px 4px", fontSize: 14, color: "var(--ink-soft)", textDecoration: "none", borderBottom: "1px solid rgba(15,23,42,.06)" }}>
                {l.label}
              </Link>
            ))}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
              {loggedIn ? (
                <Link href="/dashboard" onClick={() => setOpen(false)} className="btn-pill" style={{ justifyContent: "center", fontSize: 14 }}>Dashboard →</Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} style={{ textAlign: "center", padding: "10px", borderRadius: 999, border: "1px solid var(--rule)", fontSize: 14, color: "var(--ink-soft)", textDecoration: "none" }}>Sign in</Link>
                  <Link href="/signup" onClick={() => setOpen(false)} className="btn-pill" style={{ justifyContent: "center", fontSize: 14 }}>Get started free</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <style>{`
        .nav-link:hover { color: var(--ink) !important; }
        @media (max-width: 768px) {
          .nav-desktop-links  { display: none !important; }
          .nav-desktop-cta    { display: none !important; }
          .nav-mobile-toggle  { display: block !important; }
        }
      `}</style>
    </>
  )
}
