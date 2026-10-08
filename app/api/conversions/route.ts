import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { getCorsHeaders, corsOptions } from "@/lib/cors"

export const dynamic = "force-dynamic"

async function getUser(request: Request) {
  const admin = createAdminClient()
  const authHeader = request.headers.get("authorization")

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7)
    const { data: { user }, error } = await admin.auth.getUser(token)
    if (!error && user) return user
  }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user ?? null
}

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
    const user = await getUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers })
    }

    const admin = createAdminClient()

    // Prefer the current schema, but gracefully read older production rows if
    // optional review-metadata columns have not yet been added there.
    let history = await admin
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
      const legacy = await admin
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
          supportCode: "HISTORY_DB",
        },
        { status: 503, headers }
      )
    }

    const { data: profile } = await admin
      .from("users")
      .select("plan")
      .eq("id", user.id)
      .maybeSingle()

    return NextResponse.json(
      {
        conversions: conversions ?? [],
        totalConversions: count ?? 0,
        plan: profile?.plan ?? "free",
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
