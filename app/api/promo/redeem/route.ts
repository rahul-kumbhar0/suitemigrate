import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"

// Promo codes (in production, store these in database)
const PROMO_CODES: Record<string, { plan: string; conversionsLimit: number | null }> = {
  "FOUNDER2026": { plan: "lifetime", conversionsLimit: null }, // Unlimited
  "PRO30": { plan: "pro", conversionsLimit: null }, // Unlimited for 30 days
  "BETA100": { plan: "pro", conversionsLimit: 100 }, // 100 conversions
  "TESTPRO": { plan: "pro", conversionsLimit: null }, // Your personal test code
}

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
      return NextResponse.json(
        { error: "Promo code is required" },
        { status: 400 }
      )
    }

    // Check if code is valid
    const promoData = PROMO_CODES[code.toUpperCase()]
    if (!promoData) {
      return NextResponse.json(
        { error: "Invalid promo code" },
        { status: 400 }
      )
    }

    // Update user plan
    const admin = createAdminClient()
    const { error: updateError } = await admin
      .from("users")
      .update({
        plan: promoData.plan,
        conversions_limit: promoData.conversionsLimit,
        // Reset usage count
        conversions_used: 0,
      })
      .eq("id", user.id)

    if (updateError) {
      console.error("[/api/promo/redeem]", updateError)
      return NextResponse.json(
        { error: "Failed to apply promo code" },
        { status: 500 }
      )
    }

    // Log promo code redemption (optional - add promo_codes table later)
    await admin.from("conversions").insert({
      user_id: user.id,
      script_name: `Promo Code Redeemed: ${code}`,
      original_version: "1.0",
      script_type: "System",
      original_code: `Promo code: ${code}`,
      converted_code: `Plan upgraded to: ${promoData.plan}`,
      confidence_score: 100,
      changes_log: [`Redeemed promo code: ${code}`, `Upgraded to ${promoData.plan} plan`],
      manual_review_lines: [],
      ns_account_id: "promo",
    }).select().single()

    return NextResponse.json({
      success: true,
      message: `Promo code applied! You now have ${promoData.plan} plan.`,
      plan: promoData.plan,
      conversionsLimit: promoData.conversionsLimit,
    })

  } catch (err: unknown) {
    console.error("[/api/promo/redeem]", err)
    const message = err instanceof Error ? err.message : "Failed to redeem promo code"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
