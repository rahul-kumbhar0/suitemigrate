import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"

export async function GET() {
  const admin = createAdminClient()

  let quotaRpcReady = false
  let quotaRpcError: string | null = null

  try {
    // A zero UUID cannot match a real auth user; release is therefore a no-op.
    // It still proves the v2 RPC exists, is executable by service_role, and is visible to PostgREST.
    const { error } = await admin.rpc("release_conversion_slot_v2", {
      p_user_id: "00000000-0000-0000-0000-000000000000",
    })
    quotaRpcReady = !error
    quotaRpcError = error ? (error.code || error.message || "rpc_error") : null
  } catch (err) {
    quotaRpcError = err instanceof Error ? err.message : "rpc_error"
  }

  const aiConfigured = Boolean(process.env.GEMINI_API_KEY)
  const rateLimitConfigured = Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  )

  const status = quotaRpcReady && aiConfigured ? "ok" : "degraded"

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
