import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import crypto from "crypto"
import type { Plan } from "@/types"

export const dynamic = "force-dynamic"

function signaturesMatch(expected: string, actual: string): boolean {
  const a = Buffer.from(expected, "utf8")
  const b = Buffer.from(actual || "", "utf8")
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

function validPaidPlan(value: unknown): value is Plan {
  return value === "pro" || value === "annual" || value === "lifetime"
}

export async function POST(request: Request) {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET
    const signature = request.headers.get("x-razorpay-signature")
    if (!secret || !signature) {
      return NextResponse.json({ error: "Webhook verification unavailable" }, { status: 503 })
    }

    const rawBody = await request.text()
    const expectedSig = crypto.createHmac("sha256", secret).update(rawBody).digest("hex")
    if (!signaturesMatch(expectedSig, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const event = JSON.parse(rawBody)
    const admin = createAdminClient()

    switch (event.event) {
      case "payment.captured": {
        const payment = event.payload?.payment?.entity
        const userId = String(payment?.notes?.user_id || "")
        const plan = payment?.notes?.plan

        const amount = Number(payment?.amount || 0)
        const currency = String(payment?.currency || "").toUpperCase()
        const matchesPrice =
          ((plan === "annual" || plan === "lifetime") && amount === 29900 && currency === "USD") ||
          (plan === "pro" && amount === 2900 && currency === "USD")

        if (userId && validPaidPlan(plan) && matchesPrice) {
          const entitlementExpiresAt =
            plan === "annual" ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : null

          await admin.from("users").update({
            plan,
            conversions_limit: null,
            entitlement_expires_at: entitlementExpiresAt,
          }).eq("id", userId)

          await admin.from("payments").upsert({
            user_id: userId,
            razorpay_payment_id: payment.id,
            plan,
            amount: Number(payment.amount || 0),
            currency: String(payment.currency || "USD").toUpperCase(),
            status: "paid",
          }, { onConflict: "razorpay_payment_id" })
        }
        break
      }

      case "subscription.activated": {
        const subscription = event.payload?.subscription?.entity
        const userId = String(subscription?.notes?.user_id || "")
        const plan = subscription?.notes?.plan

        if (
          userId &&
          plan === "pro" &&
          String(subscription?.plan_id || "") === String(process.env.RAZORPAY_PLAN_PRO_MONTHLY || "")
        ) {
          await admin.from("users").update({
            plan: "pro",
            conversions_limit: null,
            entitlement_expires_at: null,
          }).eq("id", userId)
        }
        break
      }

      case "subscription.cancelled":
      case "subscription.expired": {
        const subscription = event.payload?.subscription?.entity
        const userId = String(subscription?.notes?.user_id || "")
        if (userId) {
          await admin.from("users").update({
            plan: "free",
            conversions_limit: 5,
            entitlement_expires_at: null,
          }).eq("id", userId)
        }
        break
      }

      case "subscription.charged": {
        const payment = event.payload?.payment?.entity
        const userId = String(payment?.notes?.user_id || "")
        const plan = payment?.notes?.plan
        const amount = Number(payment?.amount || 0)
        const currency = String(payment?.currency || "").toUpperCase()
        if (userId && plan === "pro" && amount === 2900 && currency === "USD") {
          await admin.from("payments").upsert({
            user_id: userId,
            razorpay_payment_id: payment.id,
            plan: "pro",
            amount: Number(payment.amount || 0),
            currency: String(payment.currency || "USD").toUpperCase(),
            status: "paid",
          }, { onConflict: "razorpay_payment_id" })
        }
        break
      }

      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (err: unknown) {
    console.error("[/api/webhooks/razorpay]", err)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
