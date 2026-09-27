import Link from "next/link"
import { Zap } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#050d1a] bg-grid flex flex-col">
      {/* Top glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="relative z-10 p-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white">
            Suite<span className="gradient-text">Migrate</span>
          </span>
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </div>

      {/* Footer */}
      <div className="relative z-10 p-6 text-center">
        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} SuiteMigrate ·{" "}
          <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
          {" · "}
          <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms</Link>
        </p>
      </div>
    </div>
  )
}
