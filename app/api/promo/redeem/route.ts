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

    const rl = await checkPromoRateLimit(user.id, ip)
    if (rl.limited) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later.", retryAfter: rl.resetIn },
        { status: 429, headers: { "Retry-After": String(rl.resetIn) } }
      )
    }

    const body = await request.json()
    const code = typeof body?.code === "string" ? body.code.trim().toUpperCase() : ""
    if (!code) {
      return NextResponse.json({ error: "Promo code is required" }, { status: 400 })
    }

    const admin = createAdminClient()
    const { data: promoRow, error: promoError } = await admin
      .from("promo_codes")
      .select("code, plan, conversions, duration_days, expires_at, active")
      .eq("code", code)
      .eq("active", true)
      .maybeSingle()

    if (promoError) {
      console.error("[/api/promo/redeem] lookup:", promoError)
      return NextResponse.json({ error: "Failed to validate promo code" }, { status: 500 })
    }

    if (!promoRow || (promoRow.expires_at && new Date(promoRow.expires_at).getTime() <= Date.now())) {
      return NextResponse.json({ error: "Invalid or expired promo code" }, { status: 400 })
    }

    if (promoRow.conversions != null) {
      console.error("[/api/promo/redeem] unsupported finite conversion promo:", promoRow.code)
      return NextResponse.json({ error: "This promo code configuration is no longer supported" }, { status: 400 })
    }

    const { data: existing } = await admin
      .from("promo_redemptions")
      .select("id")
      .eq("promo_code", promoRow.code)
      .eq("user_id", user.id)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: "This promo code has already been used on your account" }, { status: 409 })
    }

    const entitlementExpiresAt = promoRow.duration_days
      ? new Date(Date.now() + Number(promoRow.duration_days) * 86_400_000).toISOString()
      : null

    const { error: redemptionError } = await admin
      .from("promo_redemptions")
      .insert({ promo_code: promoRow.code, user_id: user.id })

    if (redemptionError) {
      if ((redemptionError as { code?: string }).code === "23505") {
        return NextResponse.json({ error: "This promo code has already been used on your account" }, { status: 409 })
      }
      console.error("[/api/promo/redeem] redemption:", redemptionError)
      return NextResponse.json({ error: "Failed to apply promo code" }, { status: 500 })
    }

    const { error: updateError } = await admin
      .from("users")
      .update({
        plan: promoRow.plan,
        conversions_limit: null,
        entitlement_expires_at: entitlementExpiresAt,
      })
      .eq("id", user.id)

    if (updateError) {
      await admin
        .from("promo_redemptions")
        .delete()
        .eq("promo_code", promoRow.code)
        .eq("user_id", user.id)

      console.error("[/api/promo/redeem] user update:", updateError)
      return NextResponse.json({ error: "Failed to apply promo code" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: entitlementExpiresAt
        ? `Promo applied. ${promoRow.plan} access is active until ${new Date(entitlementExpiresAt).toLocaleDateString("en-US")}.`
        : `Promo applied. Your account now has ${promoRow.plan} access.`,
      plan: promoRow.plan,
      entitlementExpiresAt,
    })
  } catch (err: unknown) {
    console.error("[/api/promo/redeem]", err)
    return NextResponse.json({ error: "Failed to redeem promo code" }, { status: 500 })
  }
}
