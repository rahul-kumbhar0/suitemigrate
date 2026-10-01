"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export function Navbar() {
  const [open, setOpen]         = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => setLoggedIn(!!session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setLoggedIn(!!s))
    return () => subscription.unsubscribe()
  }, [])

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        background: "rgba(246,244,239,.82)",
        borderBottom: "1px solid rgba(15,23,42,0.10)",
      }}>
        <div style={{
          maxWidth: 1240, margin: "0 auto",
          padding: "18px 40px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20,
        }}>
          {/* Brand */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--clay)", flexShrink: 0, display: "inline-block" }} />
            <span style={{
              fontFamily: "var(--f-head)", fontSize: 21, fontWeight: 400,
              letterSpacing: "-0.02em", color: "var(--ink)",
            }}>
              SuiteMigrate
            </span>
          </Link>

          {/* Desktop links */}
          <ul style={{ display: "flex", gap: 34, listStyle: "none", margin: 0, padding: 0 }} className="nav-links-desktop">
            {[
              { label: "Who it&apos;s for", href: "/#who" },
              { label: "Features",          href: "/#how-it-works" },
              { label: "How it works",      href: "/#how-it-works" },
              { label: "Pricing",           href: "/#pricing" },
              { label: "FAQ",               href: "/#faq" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} style={{ fontSize: 14, color: "var(--ink-soft)", transition: "color .2s", textDecoration: "none" }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = "var(--ink)")}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = "var(--ink-soft)")}>
                  {l.label.replace(/&apos;/g, "'")}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }} className="nav-cta-desktop">
            {loggedIn ? (
              <Link href="/dashboard" className="btn-pill" style={{ padding: "9px 20px", fontSize: 13 }}>
                Dashboard →
              </Link>
            ) : (
              <>
                <Link href="/login" style={{ fontSize: 14, color: "var(--ink-soft)", textDecoration: "none" }}>
                  Sign in
                </Link>
                <Link href="/signup" className="btn-pill" style={{ padding: "9px 20px", fontSize: 13 }}>
                  Install free →
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "var(--ink-soft)", padding: 4 }}
            className="nav-mobile-toggle"
            aria-label="Menu"
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div style={{ borderTop: "1px solid rgba(15,23,42,.1)", padding: "16px 22px 20px", display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { label: "Who it's for",  href: "/#who" },
              { label: "Features",      href: "/#how-it-works" },
              { label: "How it works",  href: "/#how-it-works" },
              { label: "Pricing",       href: "/#pricing" },
              { label: "FAQ",           href: "/#faq" },
            ].map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                style={{ fontSize: 14, color: "var(--ink-soft)", padding: "10px 0", textDecoration: "none", borderBottom: "1px solid rgba(15,23,42,.06)" }}>
                {l.label}
              </Link>
            ))}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
              {loggedIn ? (
                <Link href="/dashboard" className="btn-pill" style={{ justifyContent: "center", fontSize: 14 }}>
                  Dashboard →
                </Link>
              ) : (
                <>
                  <Link href="/login" style={{ fontSize: 14, color: "var(--ink-soft)", textAlign: "center", padding: "11px 0", border: "1px solid rgba(15,23,42,.15)", borderRadius: 999, textDecoration: "none" }}>
                    Sign in
                  </Link>
                  <Link href="/signup" className="btn-pill" style={{ justifyContent: "center", fontSize: 14 }}>
                    Install free →
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .nav-cta-desktop   { display: none !important; }
          .nav-mobile-toggle { display: block !important; }
        }
      `}</style>
    </>
  )
}
