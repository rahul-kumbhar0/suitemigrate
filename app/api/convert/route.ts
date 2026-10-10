import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { convertScript } from "@/lib/conversion-engine/engine"
import { getCorsHeaders, corsOptions } from "@/lib/cors"
import { checkConvertRateLimit, getClientIp } from "@/lib/ratelimit"
import type { Plan } from "@/types"

export const dynamic = "force-dynamic"

function isObviousNonSourcePayload(code: string): boolean {
  const text = code.trim()
  const sample = text.slice(0, 20000)

  if (/^<!doctype\s+html/i.test(sample) || /^<html[\s>]/i.test(sample) || /<body[\s>]/i.test(sample)) {
    return true
  }

  if (text.startsWith("{") || text.startsWith("[")) {
    try {
      JSON.parse(text)
      return true
    } catch {
      // JavaScript object/array syntax that is not valid JSON can still be source.
    }
  }

  return false
}

async function getUser(request: Request) {
  const admin = createAdminClient()

  const authHeader = request.headers.get("authorization")
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7)
    const { data: { user }, error } = await admin.auth.getUser(token)
    if (!error && user) return user
  }

  const { createClient } = await import("@/lib/supabase/server")
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user ?? null
}

export async function OPTIONS(request: Request) {
  return corsOptions(request)
}

export async function POST(request: Request) {
  const origin  = request.headers.get("origin")
  const headers = getCorsHeaders(origin)
  const ip      = getClientIp(request)
  const admin   = createAdminClient()

  let reservedUserId: string | null = null

  try {
    const user = await getUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers })
    }

    const rl = await checkConvertRateLimit(user.id, ip)
    if (rl.limited) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before trying again.", retryAfter: rl.resetIn },
        { status: 429, headers: { ...headers, "Retry-After": String(rl.resetIn) } }
      )
    }

    const body = await request.json()
    const { code, scriptName, nsAccountId } = body

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "code is required" }, { status: 400, headers })
    }

    if (body.batch === true) {
      return NextResponse.json(
        { error: "feature_not_available", message: "Batch conversion is not available yet." },
        { status: 400, headers }
      )
    }

    const MAX_SIZE_BYTES = 500_000
    const MAX_LINES = 10_000

    if (new TextEncoder().encode(code).length > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Script too large (max 500KB). Consider splitting it into smaller modules." },
        { status: 400, headers }
      )
    }

    const lineCount = code.split("\n").length
    if (lineCount > MAX_LINES) {
      return NextResponse.json(
        { error: `Script too large: ${lineCount.toLocaleString()} lines (max ${MAX_LINES.toLocaleString()}).` },
        { status: 400, headers }
      )
    }

    // Reject NetSuite HTML/JSON error payloads before reserving quota.
    // This is a backend safety net in addition to the extension source classifier.
    if (isObviousNonSourcePayload(code)) {
      return NextResponse.json(
        {
          error: "source_not_javascript",
          message: "NetSuite did not return readable JavaScript source. No conversion was charged.",
          supportCode: "SOURCE_UNREADABLE",
        },
        { status: 422, headers }
      )
    }

    let { data: profile } = await admin
      .from("users")
      .select("plan, conversions_used, conversions_limit, entitlement_expires_at")
      .eq("id", user.id)
      .maybeSingle()

    if (!profile) {
      await admin.from("users").upsert({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || null,
        plan: "free",
        conversions_used: 0,
        conversions_limit: 5,
        entitlement_expires_at: null,
      }, { onConflict: "id", ignoreDuplicates: true })

      profile = {
        plan: "free",
        conversions_used: 0,
        conversions_limit: 5,
        entitlement_expires_at: null,
      }
    }

    if (
      profile.entitlement_expires_at &&
      new Date(profile.entitlement_expires_at).getTime() <= Date.now()
    ) {
      await admin.from("users").update({
        plan: "free",
        conversions_limit: 5,
        entitlement_expires_at: null,
      }).eq("id", user.id)
    }

    const { data: reservation, error: reserveError } = await admin.rpc(
      "reserve_conversion_slot_v2",
      { p_user_id: user.id }
    )

    if (reserveError) {
      console.error("[/api/convert] reserve slot:", reserveError)
      const reserveMessage = String(reserveError.message || "")
      const missingRpc =
        reserveError.code === "PGRST202" ||
        /reserve_conversion_slot_v2|function.*does not exist|schema cache/i.test(reserveMessage)

      return NextResponse.json(
        missingRpc
          ? {
              error: "backend_setup_incomplete",
              message: "SuiteMigrate database setup is incomplete. Apply the production security migration and retry.",
              supportCode: "DB_QUOTA_RPC_MISSING",
            }
          : {
              error: "conversion_backend_unavailable",
              message: "SuiteMigrate could not reserve a conversion slot. Please retry shortly.",
              supportCode: "DB_QUOTA_UNAVAILABLE",
            },
        { status: 503, headers }
      )
    }

    const slot = reservation as {
      allowed?: boolean
      plan?: Plan
      used?: number
      limit?: number | null
    } | null

    if (!slot?.allowed) {
      return NextResponse.json(
        {
          error: "conversion_limit_reached",
          message: "You have used all 5 free conversions. Upgrade to continue.",
          plan: (slot?.plan as Plan) || "free",
          conversionsUsed: slot?.used ?? 5,
        },
        { status: 402, headers }
      )
    }

    reservedUserId = user.id

    const result = await convertScript({ code, scriptName, userId: user.id })

    // A structurally invalid migration is not a completed conversion.
    // Human review and NetSuite Sandbox testing are still required even when valid.
    if (!result.isValid || !result.convertedCode.trim()) {
      console.warn("[/api/convert] output failed structural checks", {
        validationErrors: result.validationErrors,
      })
      throw new Error("conversion_validation_failed")
    }

    const { data: saved, error: saveError } = await admin
      .from("conversions")
      .insert({
        user_id: user.id,
        ns_account_id: nsAccountId || "unknown",
        script_name: scriptName || "Untitled Script",
        original_version: result.originalVersion,
        script_type: result.scriptType,
        original_code: null,
        converted_code: result.convertedCode,
        confidence_score: result.confidenceScore,
        changes_log: result.changeLog,
        manual_review_lines: result.manualReviewLines,
      })
      .select("id")
      .single()

    if (saveError || !saved?.id) {
      console.error("[/api/convert] save conversion:", saveError)
      throw new Error("conversion_persistence_failed")
    }

    reservedUserId = null

    const { count: completedCount } = await admin
      .from("conversions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)

    return NextResponse.json({
      success: true,
      conversionId: saved.id,
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
      usage: {
        used: completedCount ?? slot.used ?? 0,
        plan: (slot.plan as Plan) || "free",
      },
    }, { headers })

  } catch (err: unknown) {
    if (reservedUserId) {
      const { error: releaseError } = await admin.rpc(
        "release_conversion_slot_v2",
        { p_user_id: reservedUserId }
      )
      if (releaseError) {
        console.error("[/api/convert] release slot:", releaseError)
      }
    }

    const raw = err instanceof Error ? err.message : String(err)
    console.error("[/api/convert] internal error:", raw)

    if (raw.includes("Script too large") || raw.includes("tokens")) {
      return NextResponse.json({ error: raw }, { status: 400, headers })
    }

    if (/AI service configuration error|API_KEY|api key/i.test(raw)) {
      return NextResponse.json(
        {
          error: "conversion_backend_not_ready",
          message: "SuiteMigrate AI is not configured correctly in production.",
          supportCode: "AI_CONFIG",
        },
        { status: 503, headers }
      )
    }

    if (/404|model.*not found|not found.*model/i.test(raw)) {
      return NextResponse.json(
        {
          error: "conversion_backend_not_ready",
          message: "The configured AI model is unavailable. Please contact SuiteMigrate support.",
          supportCode: "AI_MODEL",
        },
        { status: 503, headers }
      )
    }

    if (/429|quota|rate limit|high demand/i.test(raw)) {
      return NextResponse.json(
        {
          error: "conversion_capacity",
          message: "The AI service is rate-limited or has reached its available API capacity/quota. Retrying may help; persistent errors require the service owner to check upstream usage and billing.",
          supportCode: "AI_CAPACITY",
          retryable: true,
        },
        { status: 503, headers }
      )
    }

    if (raw.includes("conversion_validation_failed")) {
      return NextResponse.json(
        {
          error: "conversion_validation_failed",
          message: "The AI response failed migration structure checks and was not saved as a successful conversion.",
          supportCode: "AI_OUTPUT_REVIEW",
          retryable: true,
        },
        { status: 503, headers }
      )
    }

    if (raw.includes("conversion_persistence_failed")) {
      return NextResponse.json(
        {
          error: "conversion_save_failed",
          message: "The conversion completed but could not be saved. Your conversion slot was released.",
          supportCode: "DB_SAVE",
          retryable: true,
        },
        { status: 503, headers }
      )
    }

    return NextResponse.json(
      {
        error: "conversion_service_unavailable",
        message: "Conversion could not start or complete. Please retry and include support code CONVERSION_UNKNOWN if it continues.",
        supportCode: "CONVERSION_UNKNOWN",
        retryable: true,
      },
      { status: 503, headers }
    )
  }
}
