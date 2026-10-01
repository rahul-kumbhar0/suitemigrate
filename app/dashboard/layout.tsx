import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  let plan = "free"
  if (user) {
    try {
      const { data: profile } = await supabase
        .from("users")
        .select("plan")
        .eq("id", user.id)
        .maybeSingle()
      if (profile) plan = profile.plan

      // Auto-create user row if it doesn't exist (trigger may have failed)
      if (!profile) {
        await supabase.from("users").upsert({
          id: user.id,
          email: user.email ?? "",
          name: user.user_metadata?.name ?? null,
          plan: "free",
          conversions_used: 0,
          conversions_limit: 5,
        }, { onConflict: "id", ignoreDuplicates: true })
      }
    } catch {
      // silently continue with plan = "free"
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", display: "flex" }}>
      <DashboardSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <DashboardHeader user={user} plan={plan} />
        <main style={{ flex: 1, padding: "40px 32px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  )
}
