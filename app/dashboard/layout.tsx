import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  let plan = "free"
  const { data: profile } = await supabase.from("users").select("plan").eq("id", user.id).single()
  if (profile) plan = profile.plan

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
