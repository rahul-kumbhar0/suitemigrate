import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getRemainingConversions, isUnlimited } from "@/lib/plans"
import { getCorsHeaders, corsOptions } from "@/lib/cors"
import type { Plan } from "@/types"

export const dynamic = "force-dynamic"

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

export async function GET(request: Request) {
  const origin = request.headers.get("origin")
  const headers = getCorsHeaders(origin)

  try {
    const user = await getUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers })
    }

    const admin = createAdminClient()
    let { data: profile } = await admin
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single()

    if (!profile) {
      const { data: newProfile } = await admin
        .from("users")
        .upsert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || null,
          plan: "free",
          conversions_used: 0,
          conversions_limit: 5, // matches PLAN_LIMITS.free in lib/plans.ts
        })
        .select("*")
        .single()
      profile = newProfile
    }

    if (profile?.entitlement_expires_at && new Date(profile.entitlement_expires_at).getTime() <= Date.now()) {
      await admin.from("users").update({
        plan: "free",
        conversions_limit: 5,
        entitlement_expires_at: null,
      }).eq("id", user.id)
      profile = { ...profile, plan: "free", conversions_limit: 5, entitlement_expires_at: null }
    }

    const plan = (profile?.plan as Plan) || "free"
    const { count: completedCount, error: countError } = await admin
      .from("conversions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
    if (countError) throw countError
    const used = completedCount ?? 0
    const remaining = getRemainingConversions(plan, used)

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: profile?.name || user.user_metadata?.name,
      plan,
      conversionsUsed: used,
      conversionsLimit: isUnlimited(plan) ? null : 5,
      conversionsRemaining: remaining === Infinity ? null : remaining,
      unlimited: isUnlimited(plan),
      teamId: profile?.team_id || null,
    }, { headers })

  } catch (err: unknown) {
    console.error("[/api/user]", err)
    const origin2 = request.headers.get("origin")
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: getCorsHeaders(origin2) }
    )
  }
}

export async function PATCH(request: Request) {
  const origin = request.headers.get("origin")
  const headers = getCorsHeaders(origin)

  try {
    const user = await getUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers })
    }

    const body = await request.json()
    const { name } = body
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "name is required" }, { status: 400, headers })
    }

    const admin = createAdminClient()
    await admin.from("users").update({ name }).eq("id", user.id)

    const { createClient } = await import("@/lib/supabase/server")
    const supabase = createClient()
    await supabase.auth.updateUser({ data: { name } })

    return NextResponse.json({ success: true }, { headers })

  } catch (err: unknown) {
    console.error("[/api/user PATCH]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers })
  }
}
