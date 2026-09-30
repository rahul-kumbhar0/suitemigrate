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
    <div className="min-h-screen bg-[#0A0E1A] flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader user={user} plan={plan} />
        <main className="flex-1 p-5 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
