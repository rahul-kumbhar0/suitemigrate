import { NextResponse } from "next/server"
import { getCorsHeaders, corsOptions } from "@/lib/cors"
import { getRequestSupabase } from "@/lib/supabase/request"

export const dynamic = "force-dynamic"

function isMissingOptionalColumn(error: { code?: string; message?: string } | null) {
  if (!error) return false
  const message = error.message || ""
  return (
    error.code === "42703" ||
    error.code === "PGRST204" ||
    /changes_log|manual_review_lines/i.test(message)
  )
}

export async function OPTIONS(request: Request) {
  return corsOptions(request)
}

export async function GET(request: Request) {
  const origin = request.headers.get("origin")
  const headers = getCorsHeaders(origin)

  try {
    const { supabase, user } = await getRequestSupabase(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers })
    }

    // Query as the signed-in user so RLS protects history and this endpoint does
    // not depend on the production service-role key.
    let history = await supabase
      .from("conversions")
      .select(
        "id, script_name, original_version, script_type, converted_code, confidence_score, changes_log, manual_review_lines, created_at",
        { count: "exact" }
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)

    let conversions: any[] | null = history.data
    let count = history.count
    let error = history.error

    if (isMissingOptionalColumn(error)) {
      const legacy = await supabase
        .from("conversions")
        .select(
          "id, script_name, original_version, script_type, converted_code, confidence_score, created_at",
          { count: "exact" }
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50)

      conversions = (legacy.data ?? []).map((row) => ({
        ...row,
        changes_log: [],
        manual_review_lines: [],
      }))
      count = legacy.count
      error = legacy.error
    }

    if (error) {
      console.error("[/api/conversions]", error)
      return NextResponse.json(
        {
          error: "conversion_history_unavailable",
          message: "Conversion history is temporarily unavailable.",
          supportCode: "HISTORY_RLS",
        },
        { status: 503, headers }
      )
    }

    const { data: profileData } = await supabase
      .from("users")
      .select("plan, entitlement_expires_at")
      .eq("id", user.id)
      .maybeSingle()

    const profile = profileData as {
      plan?: string | null
      entitlement_expires_at?: string | null
    } | null

    const expired = Boolean(
      profile?.entitlement_expires_at &&
      new Date(profile.entitlement_expires_at).getTime() <= Date.now()
    )

    return NextResponse.json(
      {
        conversions: conversions ?? [],
        totalConversions: count ?? 0,
        plan: expired ? "free" : (profile?.plan ?? "free"),
      },
      { headers: { ...headers, "Cache-Control": "no-store" } }
    )
  } catch (err: unknown) {
    console.error("[/api/conversions]", err)
    return NextResponse.json(
      {
        error: "conversion_history_unavailable",
        message: "Conversion history is temporarily unavailable.",
        supportCode: "HISTORY_UNKNOWN",
      },
      { status: 503, headers }
    )
  }
}
