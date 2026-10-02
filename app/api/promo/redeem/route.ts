import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"

// ---------------------------------------------------------------------------
// SECURITY NOTE
// ---------------------------------------------------------------------------
// Promo codes are server-validated here — never sent to the client.
// TESTPRO has been invalidated. Codes are now loaded from the database
// (promo_codes table) so they can be individually expired, revoked,
// or limited to a set number of uses without a code deployment.
//
// TODO (OWNER): Implement single-use tracking:
//   1. Add a "used_by" JSONB column or a separate "promo_redemptions" table.
//   2. On redemption, insert a row and reject if the code has already been used
//      by this user (or globally, for single-use codes).
//   3. Set an "expires_at" on each code in the database.
//   4. Review any URL-param or localStorage logic that might bypass billing.
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { code } = body

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Promo code is required" }, { status: 400 })
    }

    const normalised = code.trim().toUpperCase()

    // Look up the code in the database — never in client-visible source code.
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

    // Check expiry
    if (promoRow.expires_at && new Date(promoRow.expires_at) < new Date()) {
      return NextResponse.json({ error: "This promo code has expired" }, { status: 400 })
    }

    // Apply to user
    const { error: updateError } = await admin
      .from("users")
      .update({
        plan: promoRow.plan,
        conversions_limit: promoRow.conversions ?? null,
        conversions_used: 0,
      })
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
      { error: err instanceof Error ? err.message : "Failed to redeem promo code" },
      { status: 500 }
    )
  }
}
