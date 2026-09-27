import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import crypto from "crypto"
import type { Plan } from "@/types"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get("x-razorpay-signature")

    // Verify webhook signature
    if (process.env.RAZORPAY_WEBHOOK_SECRET && signature) {
      const expectedSig = crypto
        .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest("hex")

      if (expectedSig !== signature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
      }
    }

    const event = JSON.parse(rawBody)
    const admin = createAdminClient()

    switch (event.event) {
      case "payment.captured": {
        // One-time payment confirmed
        const payment = event.payload.payment.entity
        const userId = payment.notes?.user_id
        const plan = payment.notes?.plan as Plan

        if (userId && plan) {
          await admin
            .from("users")
            .update({ plan, conversions_limit: null })
            .eq("id", userId)

          await admin.from("payments").insert({
            user_id: userId,
            razorpay_payment_id: payment.id,
            plan,
            amount: payment.amount,
            currency: payment.currency,
            status: "paid",
          })
        }
        break
      }

      case "subscription.activated": {
        // Subscription started
        const subscription = event.payload.subscription.entity
        const userId = subscription.notes?.user_id
        const plan = subscription.notes?.plan as Plan

        if (userId && plan) {
          await admin
            .from("users")
            .update({ plan, conversions_limit: null })
            .eq("id", userId)
        }
        break
      }

      case "subscription.cancelled":
      case "subscription.expired": {
        // Subscription ended — downgrade to free
        const subscription = event.payload.subscription.entity
        const userId = subscription.notes?.user_id

        if (userId) {
          await admin
            .from("users")
            .update({ plan: "free", conversions_limit: 2 })
            .eq("id", userId)
        }
        break
      }

      case "subscription.charged": {
        // Recurring payment succeeded — keep plan active
        const payment = event.payload.payment.entity
        const userId = payment.notes?.user_id
        const plan = payment.notes?.plan as Plan

        if (userId) {
          await admin.from("payments").insert({
            user_id: userId,
            razorpay_payment_id: payment.id,
            plan: plan || "pro",
            amount: payment.amount,
            currency: payment.currency,
            status: "paid",
          })
        }
        break
      }

      default:
        // Unknown event — ignore
        break
    }

    return NextResponse.json({ received: true })
  } catch (err: unknown) {
    console.error("[/api/webhooks/razorpay]", err)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
