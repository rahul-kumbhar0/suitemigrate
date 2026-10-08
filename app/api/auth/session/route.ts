import { NextResponse } from "next/server"
import { getCorsHeaders, corsOptions } from "@/lib/cors"
import { getRequestSupabase } from "@/lib/supabase/request"
import type { Plan } from "@/types"

export const dynamic = "force-dynamic"

export async function OPTIONS(request: Request) {
  return corsOptions(request)
}

export async function GET(request: Request) {
  const origin  = request.headers.get("origin")
  const headers = getCorsHeaders(origin)

  try {
    const { supabase, user } = await getRequestSupabase(request)

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401, headers })
    }

    const [{ data: profile }, { count: completedCount, error: countError }] = await Promise.all([
      supabase
        .from("users")
        .select("plan, conversions_limit, entitlement_expires_at, name")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("conversions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
    ])

    if (countError) {
      console.error("[/api/auth/session] conversion count:", countError)
    }

    const expired = Boolean(
      profile?.entitlement_expires_at &&
      new Date(profile.entitlement_expires_at).getTime() <= Date.now()
    )

    const plan = (expired ? "free" : ((profile?.plan as Plan) || "free")) as Plan
    const used = completedCount ?? 0
    const limit = plan === "free" ? 5 : null
    const unlimited = plan !== "free"

    return NextResponse.json(
      {
        authenticated: true,
        id: user.id,
        email: user.email,
        name: profile?.name || user.user_metadata?.name || null,
        plan,
        conversionsUsed: used,
        conversionsLimit: limit,
        conversionsRemaining: unlimited ? null : Math.max(0, 5 - used),
        unlimited,
      },
      { headers: { ...headers, "Cache-Control": "no-store" } }
    )
  } catch (err) {
    console.error("[/api/auth/session]", err)
    return NextResponse.json({ authenticated: false }, { status: 500, headers })
  }
}
