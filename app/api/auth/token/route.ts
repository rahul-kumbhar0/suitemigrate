import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// CORS for extension
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-suitemigrate-token",
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

export async function GET(request: Request) {
  const headers = corsHeaders()

  // Accept token passed as header or query param from extension
  const url = new URL(request.url)
  const token = url.searchParams.get("token") ||
    request.headers.get("x-suitemigrate-token")

  if (!token) {
    return NextResponse.json({ error: "No token" }, { status: 400, headers })
  }

  try {
    // Verify the token directly with Supabase admin
    const { createClient: createAdmin } = await import("@supabase/supabase-js")
    const admin = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: { user }, error } = await admin.auth.getUser(token)

    if (error || !user) {
      return NextResponse.json({ authenticated: false }, { status: 401, headers })
    }

    // Get profile
    const { data: profile } = await admin
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
    }

    const plan = profile?.plan || "free"
    const used = profile?.conversions_used || 0
    const unlimited = plan !== "free"

    return NextResponse.json({
      authenticated: true,
      id: user.id,
      email: user.email,
      name: profile?.name || user.user_metadata?.name || null,
      plan,
      conversionsUsed: used,
      conversionsLimit: unlimited ? null : 2,
      conversionsRemaining: unlimited ? null : Math.max(0, 2 - used),
      unlimited,
    }, { headers })

  } catch (err) {
    console.error("[/api/auth/token]", err)
    return NextResponse.json({ authenticated: false }, { status: 500, headers })
  }
}
