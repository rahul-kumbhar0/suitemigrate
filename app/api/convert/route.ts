import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { convertScript } from "@/lib/conversion-engine/gemini"
import { canConvert } from "@/lib/plans"
import { getCorsHeaders, corsOptions } from "@/lib/cors"
import type { Plan } from "@/types"

export const dynamic = "force-dynamic"

/** Authenticate via Bearer token (extension) or session cookie (website) */
async function getUser(request: Request) {
  const admin = createAdminClient()

  // Try Bearer token first (from extension)
  const authHeader = request.headers.get("authorization")
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7)
    const { data: { user }, error } = await admin.auth.getUser(token)
    if (!error && user) return user
  }

  // Fallback to session cookie (from website)
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
    // ── Auth ────────────────────────────────────────────────────────
    const user = await getUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers })
    }

    // ── Parse body ──────────────────────────────────────────────────
    const body = await request.json()
    const { code, scriptName, nsAccountId } = body

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "code is required" }, { status: 400, headers })
    }
    
    // Size limits (Gemini 2.0 Flash: 1M token context, ~750k words, ~900k tokens safe limit)
    const MAX_SIZE_BYTES = 500_000 // 500KB (~125k tokens)
    const MAX_LINES = 10_000 // Reasonable limit for single script
    
    if (code.length > MAX_SIZE_BYTES) {
      return NextResponse.json({ 
        error: `Script too large: ${Math.round(code.length / 1024)}KB (max 500KB). Consider breaking into smaller modules.`,
        size: code.length,
        maxSize: MAX_SIZE_BYTES
      }, { status: 400, headers })
    }
    
    const lineCount = code.split('\n').length
    if (lineCount > MAX_LINES) {
      return NextResponse.json({ 
        error: `Script too large: ${lineCount.toLocaleString()} lines (max ${MAX_LINES.toLocaleString()}). Consider breaking into modules.`,
        lines: lineCount,
        maxLines: MAX_LINES
      }, { status: 400, headers })
    }

    // ── Get user plan & usage ───────────────────────────────────────
    const admin = createAdminClient()
    const { data: profile, error: profileError } = await admin
      .from("users")
      .select("plan, conversions_used, conversions_limit")
      .eq("id", user.id)
      .single()

    let userPlan: Plan = "free"
    let conversionsUsed = 0

    if (profileError || !profile) {
      await admin.from("users").upsert({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || null,
        plan: "free",
        conversions_used: 0,
        conversions_limit: 2,
      })
    } else {
      userPlan = (profile.plan as Plan) || "free"
      conversionsUsed = profile.conversions_used || 0
    }

    // ── Plan enforcement ────────────────────────────────────────────
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

    // ── Run conversion ──────────────────────────────────────────────
    const result = await convertScript({ code, scriptName })

    // ── Save to DB ──────────────────────────────────────────────────
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

    // ── Increment usage ─────────────────────────────────────────────
    await admin
      .from("users")
      .update({ conversions_used: conversionsUsed + 1 })
      .eq("id", user.id)

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
    console.error("[/api/convert]", err)
    const message = err instanceof Error ? err.message : "Conversion failed"
    if (message.includes("API key")) {
      return NextResponse.json(
        { error: "AI service configuration error." },
        { status: 500, headers }
      )
    }
    return NextResponse.json({ error: message }, { status: 500, headers })
  }
}
