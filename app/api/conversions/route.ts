import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { getCorsHeaders, corsOptions } from "@/lib/cors"

export const dynamic = "force-dynamic"

export async function OPTIONS(request: Request) {
  return corsOptions(request)
}

export async function GET(request: Request) {
  const origin = request.headers.get("origin")
  const headers = getCorsHeaders(origin)

  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers })
    }

    const admin = createAdminClient()
    const { data: conversions, error } = await admin
      .from("conversions")
      .select("id, script_name, original_version, script_type, converted_code, confidence_score, changes_log, manual_review_lines, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("[/api/conversions]", error)
      return NextResponse.json({ error: "Failed to fetch conversions" }, { status: 500, headers })
    }

    return NextResponse.json({ conversions: conversions ?? [] }, { headers })
  } catch (err: unknown) {
    console.error("[/api/conversions]", err)
    return NextResponse.json({ error: "Failed to fetch conversions" }, { status: 500, headers })
  }
}
