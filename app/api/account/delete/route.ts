import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    if (body?.confirm !== "DELETE") {
      return NextResponse.json({ error: "Confirmation required" }, { status: 400 })
    }

    const admin = createAdminClient()
    const { error } = await admin.auth.admin.deleteUser(user.id)
    if (error) {
      console.error("[/api/account/delete]", error)
      return NextResponse.json({ error: "Could not delete account" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[/api/account/delete]", err)
    return NextResponse.json({ error: "Could not delete account" }, { status: 500 })
  }
}
