import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import type { Plan } from "@/types"

export const dynamic = "force-dynamic"

// Allow Chrome extension to call this endpoint
function corsHeaders(origin: string | null) {
  // Allow localhost and chrome-extension origins
  const allowed =
    !origin ||
    origin.startsWith("chrome-extension://") ||
    origin.startsWith("http://localhost") ||
    origin.startsWith("https://suitemigrate.com") ||
    origin.startsWith("https://suitemigrate.vercel.app")

  return {
    "Access-Control-Allow-Origin": allowed ? (origin ?? "*") : "null",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin")
  return new Response(null, { status: 204, headers: corsHeaders(origin) })
}

export async function GET(request: Request) {
  const origin = request.headers.get("origin")
  const headers = corsHeaders(origin)

  try {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401, headers }
      )
    }

    // Get or create user profile
    const admin = createAdminClient()
    let { data: profile } = await admin
      .from("users")
      .select("plan, conversions_used, conversions_limit, name")
      .eq("id", user.id)
      .single()

    if (!profile) {
      await admin.from("users").upsert({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || null,
        plan: "free",
        conversions_used: 0,
        conversions_limit: 2,
      })
      profile = {
        plan: "free",
        conversions_used: 0,
        conversions_limit: 2,
        name: user.user_metadata?.name || null,
      }
    }

    const plan = (profile.plan as Plan) || "free"
    const used = profile.conversions_used || 0
    const limit = profile.conversions_limit ?? 2
    const unlimited = plan !== "free"

    return NextResponse.json(
      {
        authenticated: true,
        id: user.id,
        email: user.email,
        name: profile.name || user.user_metadata?.name || null,
        plan,
        conversionsUsed: used,
        conversionsLimit: unlimited ? null : limit,
        conversionsRemaining: unlimited ? null : Math.max(0, limit - used),
        unlimited,
      },
      { headers }
    )
  } catch (err) {
    console.error("[/api/auth/session]", err)
    return NextResponse.json(
      { authenticated: false },
      { status: 500, headers }
    )
  }
}
