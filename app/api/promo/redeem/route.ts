import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { checkPromoRateLimit, getClientIp } from "@/lib/ratelimit"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const ip = getClientIp(request)

  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // ── Rate limit: 5 attempts/user/hour + 10/IP/hour ────────────────
    const rl = await checkPromoRateLimit(user.id, ip)
    if (rl.limited) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later.", retryAfter: rl.resetIn },
        { status: 429, headers: { "Retry-After": String(rl.resetIn) } }
      )
    }

    const body = await request.json()
    const { code } = body

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Promo code is required" }, { status: 400 })
    }

    const normalised = code.trim().toUpperCase()
    const admin = createAdminClient()

    const { data: promoRow, error: promoError } = await admin
      .from("promo_codes")
      .select("code, plan, conversions, duration_days, expires_at, active")
      .eq("code", normalised)
      .eq("active", true)
      .maybeSingle()

    if (promoError) {
      console.error("[/api/promo/redeem] DB error:", promoError)
      return NextResponse.json({ error: "Failed to validate promo code" }, { status: 500 })
    }

    if (!promoRow) {
      return NextResponse.json({ error: "Invalid or expired promo code" }, { status: 400 })
    }

    if (promoRow.expires_at && new Date(promoRow.expires_at) < new Date()) {
      return NextResponse.json({ error: "This promo code has expired" }, { status: 400 })
    }

    const { error: updateError } = await admin
      .from("users")
      .update({ plan: promoRow.plan, conversions_limit: promoRow.conversions ?? null, conversions_used: 0 })
      .eq("id", user.id)

    if (updateError) {
      console.error("[/api/promo/redeem] update error:", updateError)
      return NextResponse.json({ error: "Failed to apply promo code" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Promo code applied! You now have the ${promoRow.plan} plan.`,
      plan: promoRow.plan,
      conversionsLimit: promoRow.conversions ?? null,
    })

  } catch (err: unknown) {
    console.error("[/api/promo/redeem]", err)
    return NextResponse.json(
      { error: "Failed to redeem promo code" },
      { status: 500 }
    )
  }
}
