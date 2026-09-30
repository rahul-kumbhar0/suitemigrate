import Link from "next/link"
import { Zap } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-[#1F2A3C] bg-[#0A0E1A]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="h-8 w-8 rounded-lg bg-[#F6C430] flex items-center justify-center">
                <Zap className="h-4 w-4 text-[#0A0E1A]" />
              </div>
              <span className="text-base font-bold text-white">
                Suite<span className="gradient-text">Migrate</span>
              </span>
            </Link>
            <p className="text-sm text-[#6B7A99] leading-relaxed">
              The fastest way to migrate your NetSuite scripts to SuiteScript 2.1 — before the deadline hits.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-widest mb-5">Product</h4>
            <ul className="space-y-3">
              {[
                { label: "Features",      href: "/#how-it-works" },
                { label: "Pricing",       href: "/#pricing" },
                { label: "How it works",  href: "/#how-it-works" },
                { label: "FAQ",           href: "/#faq" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[#6B7A99] hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-widest mb-5">Account</h4>
            <ul className="space-y-3">
              {[
                { label: "Sign up free", href: "/signup" },
                { label: "Sign in",      href: "/login" },
                { label: "Dashboard",    href: "/dashboard" },
                { label: "Billing",      href: "/dashboard/billing" },
                { label: "Settings",     href: "/dashboard/settings" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[#6B7A99] hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-widest mb-5">Legal</h4>
            <ul className="space-y-3">
              {[
                { label: "Privacy Policy",   href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[#6B7A99] hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#1F2A3C] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#434E66]">
            © {new Date().getFullYear()} SuiteMigrate. All rights reserved.
          </p>
          <p className="text-xs text-[#434E66]">
            Built for NetSuite developers, by a NetSuite developer.
          </p>
        </div>
      </div>
    </footer>
  )
}
