import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { canAccessHistory } from "@/lib/plans"
import { getCorsHeaders, corsOptions } from "@/lib/cors"
import type { Plan } from "@/types"

// ---------------------------------------------------------------------------
// §12.3 Conversion history — gated to Pro and Team (server-side)
// ---------------------------------------------------------------------------
// Free users can see their 5 conversions from the current session only.
// Stored history (beyond current session) requires Pro or Team.
// ---------------------------------------------------------------------------

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
    const { data: profile } = await admin
      .from("users")
      .select("plan")
      .eq("id", user.id)
      .maybeSingle()

    const plan = (profile?.plan as Plan) ?? "free"

    // §12.3 Free users: return only last 5 (matches their conversion limit)
    // Pro/Team users: return full history
    const limit = canAccessHistory(plan) ? 200 : 5

    const { data: conversions, error } = await admin
      .from("conversions")
      .select("id, script_name, original_version, script_type, confidence_score, changes_log, manual_review_lines, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("[/api/conversions]", error)
      return NextResponse.json({ error: "Failed to fetch conversions" }, { status: 500, headers })
    }

    return NextResponse.json(
      {
        conversions: conversions ?? [],
        plan,
        // Let the client know if history is gated
        historyGated: !canAccessHistory(plan),
        upgradeUrl: canAccessHistory(plan) ? null : "/dashboard/billing",
      },
      { headers }
    )

  } catch (err: unknown) {
    console.error("[/api/conversions]", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 500, headers }
    )
  }
}
