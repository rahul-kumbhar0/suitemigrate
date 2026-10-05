import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function POST() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json(
    {
      error: "feature_not_available",
      message: "PDF export is not available in this release. Use the HTML migration audit report in the Chrome extension.",
    },
    { status: 501 }
  )
}
