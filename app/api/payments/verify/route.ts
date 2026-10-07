import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import Razorpay from "razorpay"
import crypto from "crypto"
import type { Plan } from "@/types"

export const dynamic = "force-dynamic"

function signaturesMatch(expected: string, actual: string): boolean {
  const a = Buffer.from(expected, "utf8")
  const b = Buffer.from(actual || "", "utf8")
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!keyId || !secret) {
      return NextResponse.json({ error: "Payment verification is not configured" }, { status: 503 })
    }

    const body = await request.json()
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      razorpay_subscription_id,
    } = body

    if (!razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment verification data" }, { status: 400 })
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: secret })

    let plan: Plan
    let expectedAmount: number

    if (razorpay_order_id) {
      const payload = `${razorpay_order_id}|${razorpay_payment_id}`
      const expectedSig = crypto.createHmac("sha256", secret).update(payload).digest("hex")
      if (!signaturesMatch(expectedSig, razorpay_signature)) {
        return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
      }

      const [order, payment] = await Promise.all([
        razorpay.orders.fetch(razorpay_order_id) as Promise<any>,
        razorpay.payments.fetch(razorpay_payment_id) as Promise<any>,
      ])

      if (
        String(order?.notes?.user_id || "") !== user.id ||
        String(order?.notes?.plan || "") !== "annual" ||
        Number(order?.amount) !== 29900 ||
        String(order?.currency || "").toUpperCase() !== "USD" ||
        String(payment?.order_id || "") !== razorpay_order_id ||
        String(payment?.status || "") !== "captured"
      ) {
        return NextResponse.json({ error: "Payment details do not match the purchase" }, { status: 400 })
      }

      plan = "annual"
      expectedAmount = 29900
    } else if (razorpay_subscription_id) {
      const payload = `${razorpay_payment_id}|${razorpay_subscription_id}`
      const expectedSig = crypto.createHmac("sha256", secret).update(payload).digest("hex")
      if (!signaturesMatch(expectedSig, razorpay_signature)) {
        return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
      }

      const [subscription, payment] = await Promise.all([
        razorpay.subscriptions.fetch(razorpay_subscription_id) as Promise<any>,
        razorpay.payments.fetch(razorpay_payment_id) as Promise<any>,
      ])

      if (
        String(subscription?.notes?.user_id || "") !== user.id ||
        String(subscription?.notes?.plan || "") !== "pro" ||
        String(subscription?.plan_id || "") !== String(process.env.RAZORPAY_PLAN_PRO_MONTHLY || "") ||
        String(payment?.status || "") !== "captured" ||
        String(payment?.currency || "").toUpperCase() !== "USD"
      ) {
        return NextResponse.json({ error: "Subscription details do not match the purchase" }, { status: 400 })
      }

      plan = "pro"
      expectedAmount = 2900
    } else {
      return NextResponse.json({ error: "Missing order or subscription id" }, { status: 400 })
    }

    const payment = await razorpay.payments.fetch(razorpay_payment_id) as any
    if (Number(payment?.amount) !== expectedAmount) {
      return NextResponse.json({ error: "Unexpected payment amount" }, { status: 400 })
    }

    const admin = createAdminClient()
    const entitlementExpiresAt = plan === "annual"
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      : null

    const { error: planError } = await admin
      .from("users")
      .update({
        plan,
        conversions_limit: null,
        entitlement_expires_at: entitlementExpiresAt,
      })
      .eq("id", user.id)

    if (planError) {
      console.error("[/api/payments/verify] plan update:", planError)
      return NextResponse.json({ error: "Could not activate purchase" }, { status: 500 })
    }

    const { error: paymentError } = await admin.from("payments").upsert({
      user_id: user.id,
      razorpay_payment_id,
      plan,
      amount: Number(payment.amount),
      currency: String(payment.currency || "USD").toUpperCase(),
      status: "paid",
    }, { onConflict: "razorpay_payment_id" })

    if (paymentError) {
      console.error("[/api/payments/verify] payment record:", paymentError)
    }

    return NextResponse.json({ success: true, plan })
  } catch (err: unknown) {
    console.error("[/api/payments/verify]", err)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
