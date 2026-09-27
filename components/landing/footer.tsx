import Link from "next/link"
import { Zap } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#050d1a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Suite<span className="gradient-text">Migrate</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              The fastest way to migrate your NetSuite scripts to SuiteScript 2.1.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/#features" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Pricing</Link></li>
              <li><Link href="/#how-it-works" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">How it works</Link></li>
              <li><Link href="/#faq" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Account</h4>
            <ul className="space-y-2">
              <li><Link href="/signup" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Sign up free</Link></li>
              <li><Link href="/login" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Sign in</Link></li>
              <li><Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Dashboard</Link></li>
              <li><Link href="/dashboard/billing" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Billing</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} SuiteMigrate. All rights reserved.
          </p>
          <p className="text-sm text-slate-600">
            Built for NetSuite developers, by NetSuite developer.
          </p>
        </div>
      </div>
    </footer>
  )
}
