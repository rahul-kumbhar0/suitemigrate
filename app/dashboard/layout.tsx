import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  let plan = "free"
  try {
    const { data: profile } = await supabase
      .from("users").select("plan").eq("id", user.id).maybeSingle()
    if (profile) plan = profile.plan

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
  } catch { /* use default free */ }

  return (
    <div className="dash-layout">
      {/* Desktop sidebar — hidden on mobile via CSS */}
      <DashboardSidebar />
      {/* Main column */}
      <div className="dash-main">
        <DashboardHeader user={user} plan={plan} />
        <main className="dash-content">
          {children}
        </main>
      </div>
    </div>
  )
}
