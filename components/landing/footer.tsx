import Link from "next/link"
import { Zap } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-[#D5C9BB] bg-[#EDE7DE]/60">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="h-8 w-8 rounded-lg bg-[#2C1A0E] flex items-center justify-center">
                <Zap className="h-4 w-4 text-[#F7F3EE]" />
              </div>
              <span className="font-serif text-[#2C1A0E] text-lg">
                Suite<span className="gradient-text">Migrate</span>
              </span>
            </Link>
            <p className="text-sm text-[#9B7B6A] leading-relaxed">
              The fastest way to migrate your NetSuite scripts to SuiteScript 2.1.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-[#2C1A0E] mb-4">Product</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Features",     href: "/#how-it-works" },
                { label: "Pricing",      href: "/#pricing" },
                { label: "How it works", href: "/#how-it-works" },
                { label: "FAQ",          href: "/#faq" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[#9B7B6A] hover:text-[#2C1A0E] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-semibold text-[#2C1A0E] mb-4">Account</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Sign up free", href: "/signup" },
                { label: "Sign in",      href: "/login" },
                { label: "Dashboard",    href: "/dashboard" },
                { label: "Billing",      href: "/dashboard/billing" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[#9B7B6A] hover:text-[#2C1A0E] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-[#2C1A0E] mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Privacy Policy",    href: "/privacy" },
                { label: "Terms of Service",  href: "/terms" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[#9B7B6A] hover:text-[#2C1A0E] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-[#D5C9BB] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#BEB4AB]">
            © {new Date().getFullYear()} SuiteMigrate. All rights reserved.
          </p>
          <p className="text-xs text-[#BEB4AB]">
            Built for NetSuite developers, by a NetSuite developer.
          </p>
        </div>
      </div>
    </footer>
  )
}
