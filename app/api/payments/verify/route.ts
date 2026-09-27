import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import crypto from "crypto"
import type { Plan } from "@/types"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      razorpay_subscription_id,
      plan,
    } = body

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET!
    let isValid = false

    if (razorpay_order_id) {
      // One-time payment verification
      const payload = `${razorpay_order_id}|${razorpay_payment_id}`
      const expectedSig = crypto
        .createHmac("sha256", secret)
        .update(payload)
        .digest("hex")
      isValid = expectedSig === razorpay_signature
    } else if (razorpay_subscription_id) {
      // Subscription verification
      const payload = `${razorpay_payment_id}|${razorpay_subscription_id}`
      const expectedSig = crypto
        .createHmac("sha256", secret)
        .update(payload)
        .digest("hex")
      isValid = expectedSig === razorpay_signature
    }

    if (!isValid && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    // Upgrade user plan
    const admin = createAdminClient()
    const newPlan: Plan = plan as Plan
    const newLimit = newPlan === "free" ? 2 : null

    await admin
      .from("users")
      .update({
        plan: newPlan,
        conversions_limit: newLimit,
      })
      .eq("id", user.id)

    // Save payment record
    await admin.from("payments").insert({
      user_id: user.id,
      razorpay_payment_id: razorpay_payment_id || null,
      plan: newPlan,
      amount: body.amount || 0,
      currency: "USD",
      status: "paid",
    })

    return NextResponse.json({ success: true, plan: newPlan })
  } catch (err: unknown) {
    console.error("[/api/payments/verify]", err)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
