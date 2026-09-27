import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Crown, Lock, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function TeamPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Team</h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage your team members and shared conversion history.
        </p>
      </div>

      {/* Locked state for non-team users */}
      <Card className="border-slate-800">
        <CardContent className="p-12 flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6">
            <Users className="h-8 w-8 text-purple-400" />
          </div>
          <Badge variant="outline" className="mb-4 gap-1">
            <Lock className="h-3 w-3" />
            Team Plan Required
          </Badge>
          <h2 className="text-xl font-bold text-white mb-3">
            Collaborate with your team
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-md mb-8">
            The Team plan gives you up to 5 seats so your whole team can
            scan, convert, and share migration history across all client accounts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-sm mb-8">
            {[
              "Up to 5 team members",
              "Shared conversion history",
              "Team management dashboard",
              "Bulk export all accounts",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-400 shrink-0" />
                {f}
              </div>
            ))}
          </div>

          <Link href="/dashboard/billing">
            <Button variant="gradient" className="gap-2">
              <Crown className="h-4 w-4" />
              Upgrade to Team — $15/mo
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
