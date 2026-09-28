"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, Shield, Trash2, Gift, CheckCircle, XCircle, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [userPlan, setUserPlan] = useState("free")
  const [promoCode, setPromoCode] = useState("")
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoMessage, setPromoMessage] = useState<{ type: "success" | "error", text: string } | null>(null)

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      setUser(authUser)

      if (authUser) {
        // Fetch plan from API
        const res = await fetch("/api/user")
        if (res.ok) {
          const data = await res.json()
          setUserPlan(data.plan || "free")
        }
      }
    }
    loadUser()
  }, [])

  const handleRedeemPromo = async () => {
    if (!promoCode.trim()) return
    
    setPromoLoading(true)
    setPromoMessage(null)

    try {
      const res = await fetch("/api/promo/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setPromoMessage({ type: "error", text: data.error || "Invalid promo code" })
      } else {
        setPromoMessage({ type: "success", text: data.message })
        setPromoCode("")
        setUserPlan(data.plan)
        // Refresh page after 2 seconds to show new plan
        setTimeout(() => window.location.reload(), 2000)
      }
    } catch (err) {
      setPromoMessage({ type: "error", text: "Failed to redeem promo code" })
    } finally {
      setPromoLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  const name = user.user_metadata?.name || ""
  const email = user.email || ""
  const provider = user.app_metadata?.provider || "email"

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Account Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your profile and account preferences.</p>
      </div>

      {/* Current Plan */}
      <Card className="border-emerald-500/30 bg-emerald-500/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Badge 
                variant={userPlan === "free" ? "secondary" : "default"} 
                className="capitalize text-sm mb-2"
              >
                {userPlan} Plan
              </Badge>
              <p className="text-sm text-slate-400">
                {userPlan === "free" && "5 free conversions"}
                {userPlan === "pro" && "Unlimited conversions"}
                {userPlan === "lifetime" && "Lifetime unlimited conversions"}
                {userPlan === "team" && "Team plan with unlimited conversions"}
              </p>
            </div>
            {userPlan === "free" && (
              <Button variant="gradient" size="sm">
                Upgrade to Pro
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Promo Code */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Gift className="h-4 w-4 text-purple-400" />
            Promo Code
          </CardTitle>
          <CardDescription>Have a promo code? Redeem it here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input 
              placeholder="Enter promo code" 
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleRedeemPromo()}
              className="flex-1"
            />
            <Button 
              onClick={handleRedeemPromo} 
              disabled={!promoCode.trim() || promoLoading}
              variant="default"
            >
              {promoLoading ? "Redeeming..." : "Redeem"}
            </Button>
          </div>

          {/* Promo message */}
          {promoMessage && (
            <div className={`p-3 rounded-lg border flex items-start gap-2 ${
              promoMessage.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}>
              {promoMessage.type === "success" ? (
                <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
              )}
              <p className="text-sm">{promoMessage.text}</p>
            </div>
          )}

          {/* Available promo codes hint */}
          <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
            <p className="text-xs text-slate-400">
              💡 <strong className="text-slate-300">Try these codes:</strong><br/>
              <code className="text-emerald-400">TESTPRO</code> — Unlimited conversions for testing<br/>
              <code className="text-purple-400">FOUNDER2026</code> — Lifetime unlimited access
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-emerald-400" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Full name</Label>
            <Input defaultValue={name} placeholder="Your full name" />
          </div>
          <div className="space-y-1.5">
            <Label>Email address</Label>
            <div className="flex gap-2">
              <Input defaultValue={email} disabled className="flex-1 opacity-60" />
              {provider !== "email" && (
                <Badge variant="secondary" className="self-center capitalize shrink-0">{provider}</Badge>
              )}
            </div>
            <p className="text-xs text-slate-600">Email cannot be changed.</p>
          </div>
          <Button variant="default" size="sm">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-400" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {provider === "email" ? (
            <>
              <div className="space-y-1.5">
                <Label>New password</Label>
                <Input type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-1.5">
                <Label>Confirm new password</Label>
                <Input type="password" placeholder="Confirm new password" />
              </div>
              <Button variant="default" size="sm">Update Password</Button>
            </>
          ) : (
            <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-4">
              <p className="text-sm text-slate-400">
                You signed in with <span className="text-white capitalize font-medium">{provider}</span>.
                Password management is handled by your sign-in provider.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-red-500/20">
        <CardHeader>
          <CardTitle className="text-base text-red-400 flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Danger Zone
          </CardTitle>
          <CardDescription>These actions are irreversible. Proceed with caution.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-lg border border-red-500/20 bg-red-500/5">
            <div>
              <p className="text-sm font-medium text-white">Delete account</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Permanently deletes your account and all data. Cannot be undone.
              </p>
            </div>
            <Button variant="destructive" size="sm" className="shrink-0">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
