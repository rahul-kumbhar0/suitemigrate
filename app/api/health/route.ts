import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { selectGeminiCredential } from "@/lib/conversion-engine/model-routing"

export const dynamic = "force-dynamic"

export async function GET() {
  let quotaRpcReady = false
  let quotaRpcError: string | null = null

  try {
    // A zero UUID cannot match a real auth user; release is therefore a no-op.
    // It still proves the v2 RPC exists, is executable by service_role, and is visible to PostgREST.
    const admin = createAdminClient()
    const { error } = await admin.rpc("release_conversion_slot_v2", {
      p_user_id: "00000000-0000-0000-0000-000000000000",
    })
    // Probe reservation without a real user: P0002 is the expected no-write response.
    const { error: reserveError } = await admin.rpc("reserve_conversion_slot_v2", {
      p_user_id: "00000000-0000-0000-0000-000000000000",
    })
    quotaRpcReady = !error && reserveError?.code === "P0002"
    quotaRpcError = error ? (error.code || "rpc_error") : quotaRpcReady ? null : (reserveError?.code || "unexpected_rpc_response")
  } catch {
    quotaRpcError = "rpc_error"
  }

  const aiConfigured = Boolean(selectGeminiCredential(process.env))
  const rateLimitConfigured = Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  )

  const status = quotaRpcReady && aiConfigured && rateLimitConfigured ? "ok" : "degraded"

  return NextResponse.json({
    status,
    service: "suitemigrate",
    release: "1.1.4",
    readyForConversions: status === "ok",
    checks: {
      quotaRpc: quotaRpcReady ? "ok" : "missing_or_unavailable",
      ai: aiConfigured ? "configured" : "missing",
      rateLimit: rateLimitConfigured ? "configured" : "not_configured",
    },
    supportCode: quotaRpcReady ? null : quotaRpcError,
    timestamp: new Date().toISOString(),
  }, {
    status: status === "ok" ? 200 : 503,
    headers: { "Cache-Control": "no-store" },
  })
}
