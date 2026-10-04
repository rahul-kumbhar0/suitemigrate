import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { convertScript } from "@/lib/conversion-engine/engine"
import { canConvert, canBatchConvert } from "@/lib/plans"
import { getCorsHeaders, corsOptions } from "@/lib/cors"
import type { Plan } from "@/types"

export const dynamic = "force-dynamic"

/** Authenticate via credentials:include cookie (extension + website) or Bearer token fallback */
async function getUser(request: Request) {
  const admin = createAdminClient()

  // Try Bearer token first (legacy extension builds)
  const authHeader = request.headers.get("authorization")
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7)
    const { data: { user }, error } = await admin.auth.getUser(token)
    if (!error && user) return user
  }

  // Session cookie (current extension + website — credentials:"include")
  const { createClient } = await import("@/lib/supabase/server")
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user ?? null
}

export async function OPTIONS(request: Request) {
  return corsOptions(request)
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin")
  const headers = getCorsHeaders(origin)

  try {
    // ── Auth ─────────────────────────────────────────────────────────
    const user = await getUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers })
    }

    // ── Parse body ───────────────────────────────────────────────────
    const body = await request.json()
    const { code, scriptName, nsAccountId } = body

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "code is required" }, { status: 400, headers })
    }

    // Size limits
    const MAX_SIZE_BYTES = 500_000
    const MAX_LINES = 10_000

    if (code.length > MAX_SIZE_BYTES) {
      return NextResponse.json({
        error: `Script too large: ${Math.round(code.length / 1024)}KB (max 500KB). Consider splitting into smaller modules.`,
        size: code.length,
        maxSize: MAX_SIZE_BYTES,
      }, { status: 400, headers })
    }

    const lineCount = code.split("\n").length
    if (lineCount > MAX_LINES) {
      return NextResponse.json({
        error: `Script too large: ${lineCount.toLocaleString()} lines (max ${MAX_LINES.toLocaleString()}). Consider splitting into modules.`,
        lines: lineCount,
        maxLines: MAX_LINES,
      }, { status: 400, headers })
    }

    // ── Get user plan & usage ────────────────────────────────────────
    const admin = createAdminClient()
    const { data: profile, error: profileError } = await admin
      .from("users")
      .select("plan, conversions_used, conversions_limit")
      .eq("id", user.id)
      .maybeSingle()

    let userPlan: Plan = "free"
    let conversionsUsed = 0

    if (profileError || !profile) {
      // Auto-create profile — correct limit is 5
      await admin.from("users").upsert({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || null,
        plan: "free",
        conversions_used: 0,
        conversions_limit: 5,
      }, { onConflict: "id", ignoreDuplicates: true })
    } else {
      userPlan = (profile.plan as Plan) || "free"
      conversionsUsed = profile.conversions_used || 0
    }

    // ── Conversion limit — SERVER enforces, popup count is UI hint only ──
    if (!canConvert(userPlan, conversionsUsed)) {
      return NextResponse.json(
        {
          error: "conversion_limit_reached",
          message: "You have used all your free conversions. Upgrade to continue.",
          plan: userPlan,
          conversionsUsed,
        },
        { status: 402, headers }
      )
    }

    // ── Batch gating — Pro/Lifetime/Team only ────────────────────────
    const isBatch = body.batch === true
    if (isBatch && !canBatchConvert(userPlan)) {
      return NextResponse.json(
        {
          error: "feature_not_available",
          message: "Batch conversion is available on Pro and Team plans.",
          plan: userPlan,
        },
        { status: 402, headers }
      )
    }

    // ── Run conversion ───────────────────────────────────────────────
    const result = await convertScript({ code, scriptName })

    // ── Persist ──────────────────────────────────────────────────────
    const { data: savedConversion } = await admin
      .from("conversions")
      .insert({
        user_id: user.id,
        ns_account_id: nsAccountId || "unknown",
        script_name: scriptName || "Untitled Script",
        original_version: result.originalVersion,
        script_type: result.scriptType,
        original_code: code,
        converted_code: result.convertedCode,
        confidence_score: result.confidenceScore,
        changes_log: result.changeLog,
        manual_review_lines: result.manualReviewLines,
      })
      .select("id")
      .single()

    // ── Increment usage ──────────────────────────────────────────────
    await admin
      .from("users")
      .update({ conversions_used: conversionsUsed + 1 })
      .eq("id", user.id)

    // D12: never return model/provider/engine fields in the response
    return NextResponse.json({
      success: true,
      conversionId: savedConversion?.id,
      convertedCode: result.convertedCode,
      originalVersion: result.originalVersion,
      scriptType: result.scriptType,
      confidenceScore: result.confidenceScore,
      changeLog: result.changeLog,
      manualReviewLines: result.manualReviewLines,
      isValid: result.isValid,
      validationErrors: result.validationErrors,
      requiredModules: result.requiredModules,
      detectedApiCalls: result.detectedApiCalls,
      usage: { used: conversionsUsed + 1, plan: userPlan },
    }, { headers })

  } catch (err: unknown) {
    // D12: map ALL upstream errors to generic messages — log real error server-side only
    const raw = err instanceof Error ? err.message : String(err)
    console.error("[/api/convert] internal error:", raw)

    // Caller-visible error — no provider name, no internal detail
    if (raw.includes("Script too large") || raw.includes("tokens")) {
      return NextResponse.json({ error: raw }, { status: 400, headers })
    }

    if (raw.includes("conversion_limit_reached")) {
      return NextResponse.json({ error: "conversion_limit_reached" }, { status: 402, headers })
    }

    // 503 / high demand / rate limit / quota / API key → all become the same generic message
    if (
      raw.includes("503") ||
      raw.includes("high demand") ||
      raw.includes("rate limit") ||
      raw.includes("quota") ||
      raw.includes("API key") ||
      raw.includes("429")
    ) {
      return NextResponse.json(
        { error: "Conversion service is busy. Please try again in a moment.", retryable: true },
        { status: 503, headers }
      )
    }

    return NextResponse.json(
      { error: "Conversion service is busy. Please try again in a moment.", retryable: true },
      { status: 500, headers }
    )
  }
}
