import Link from "next/link"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function VerifyPage() {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm p-8 shadow-2xl text-center">
        <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
          <Mail className="h-8 w-8 text-emerald-400" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">Verify your email</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          We&apos;ve sent a verification link to your email address.
          Click the link to activate your account and get your 2 free conversions.
        </p>

        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-left space-y-3 mb-8">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Didn&apos;t receive the email?</p>
          <ul className="space-y-1.5 text-sm text-slate-400">
            <li className="flex items-start gap-2"><span className="text-slate-600 mt-0.5">•</span>Check your spam or junk folder</li>
            <li className="flex items-start gap-2"><span className="text-slate-600 mt-0.5">•</span>Make sure you used the correct email address</li>
            <li className="flex items-start gap-2"><span className="text-slate-600 mt-0.5">•</span>Allow a few minutes for the email to arrive</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link href="/signup">
            <Button variant="outline" className="w-full">Try a different email</Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" className="w-full">Back to Sign in</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
