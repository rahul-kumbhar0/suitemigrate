import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, Shield, Trash2 } from "lucide-react"

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const name = user?.user_metadata?.name || ""
  const email = user?.email || ""
  const provider = user?.app_metadata?.provider || "email"

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Account Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your profile and account preferences.</p>
      </div>

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
