import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getCorsHeaders, corsOptions } from "@/lib/cors"
import type { Plan } from "@/types"

export const dynamic = "force-dynamic"

export async function OPTIONS(request: Request) {
  return corsOptions(request)
}

export async function GET(request: Request) {
  const origin  = request.headers.get("origin")
  const headers = getCorsHeaders(origin)

  try {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ authenticated: false }, { status: 401, headers })
    }

    const admin = createAdminClient()
    let { data: profile } = await admin
      .from("users")
      .select("plan, conversions_used, conversions_limit, name")
      .eq("id", user.id)
      .maybeSingle()

    if (!profile) {
      await admin.from("users").upsert({
        id: user.id, email: user.email,
        name: user.user_metadata?.name || null,
        plan: "free", conversions_used: 0, conversions_limit: 5,
      }, { onConflict: "id", ignoreDuplicates: true })
      profile = { plan: "free", conversions_used: 0, conversions_limit: 5, name: user.user_metadata?.name || null }
    } else if (profile.plan === "free" && profile.conversions_limit === 2) {
      // Auto-heal stale limit from before the 2→5 fix
      await admin.from("users").update({ conversions_limit: 5 }).eq("id", user.id)
      profile = { ...profile, conversions_limit: 5 }
    }

    const plan      = (profile.plan as Plan) || "free"
    const used      = profile.conversions_used || 0
    const limit     = profile.conversions_limit ?? 5
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
    return NextResponse.json({ authenticated: false }, { status: 500, headers })
  }
}
