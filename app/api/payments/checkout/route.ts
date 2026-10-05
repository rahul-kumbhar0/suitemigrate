import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Razorpay from "razorpay"

export const dynamic = "force-dynamic"

const PLAN_CONFIG = {
  pro: {
    amount: 2900,
    currency: "USD",
    description: "SuiteMigrate Pro — Monthly",
    planId: process.env.RAZORPAY_PLAN_PRO_MONTHLY,
    type: "subscription" as const,
  },
  lifetime: {
    amount: 29900,
    currency: "USD",
    description: "SuiteMigrate Lifetime Pro",
    planId: null,
    type: "one_time" as const,
  },
}

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    const { searchParams } = new URL(request.url)
    const plan = searchParams.get("plan") as keyof typeof PLAN_CONFIG | null

    if (!plan || !PLAN_CONFIG[plan]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.redirect(
        new URL("/dashboard/billing?error=payment_not_configured", request.url)
      )
    }

    const config = PLAN_CONFIG[plan]
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://suitemigrate.vercel.app"

    if (config.type === "one_time") {
      const order = await razorpay.orders.create({
        amount: config.amount,
        currency: config.currency,
        notes: {
          user_id: user.id,
          plan,
          email: user.email || "",
        },
      })

      return new Response(buildCheckoutHtml({
        orderId: order.id,
        amount: config.amount,
        currency: config.currency,
        description: config.description,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        userName: user.user_metadata?.name || user.email || "User",
        userEmail: user.email || "",
        callbackUrl: `${appUrl}/api/payments/verify`,
      }), { headers: { "Content-Type": "text/html; charset=utf-8" } })
    }

    if (!config.planId || config.planId === "plan_placeholder") {
      return NextResponse.redirect(
        new URL("/dashboard/billing?error=subscription_not_configured", request.url)
      )
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: config.planId,
      total_count: 12,
      notes: {
        user_id: user.id,
        plan,
        email: user.email || "",
      },
    })

    return new Response(buildCheckoutHtml({
      subscriptionId: (subscription as { id: string }).id,
      amount: config.amount,
      currency: config.currency,
      description: config.description,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      userName: user.user_metadata?.name || user.email || "User",
      userEmail: user.email || "",
      callbackUrl: `${appUrl}/api/payments/verify`,
    }), { headers: { "Content-Type": "text/html; charset=utf-8" } })

  } catch (err: unknown) {
    console.error("[/api/payments/checkout]", err)
    return NextResponse.redirect(
      new URL("/dashboard/billing?error=checkout_failed", request.url)
    )
  }
}

function buildCheckoutHtml(params: {
  orderId?: string
  subscriptionId?: string
  amount: number
  currency: string
  description: string
  keyId: string
  userName: string
  userEmail: string
  callbackUrl: string
}): string {
  const idOption = params.orderId
    ? `order_id: ${JSON.stringify(params.orderId)},`
    : `subscription_id: ${JSON.stringify(params.subscriptionId)},`

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SuiteMigrate — Checkout</title>
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #fafaf9; color: #0f172a; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui, sans-serif; }
    .loader { text-align: center; }
    .loader h2 { font-size: 1.25rem; margin-bottom: 8px; }
    .loader p { color: #64748b; }
  </style>
</head>
<body>
  <div class="loader">
    <h2>Opening secure checkout…</h2>
    <p>You will return to billing after payment verification.</p>
  </div>
  <script>
    window.onload = function () {
      const options = {
        key: ${JSON.stringify(params.keyId)},
        amount: ${params.amount},
        currency: ${JSON.stringify(params.currency)},
        name: "SuiteMigrate",
        description: ${JSON.stringify(params.description)},
        ${idOption}
        prefill: {
          name: ${JSON.stringify(params.userName)},
          email: ${JSON.stringify(params.userEmail)}
        },
        handler: async function (response) {
          const res = await fetch(${JSON.stringify(params.callbackUrl)}, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response)
          })
          const data = await res.json()
          if (data.success) {
            window.location.href = "/dashboard/billing?success=true"
          } else {
            window.location.href = "/dashboard/billing?error=verification_failed"
          }
        },
        modal: {
          ondismiss: function () {
            window.location.href = "/dashboard/billing?cancelled=true"
          }
        }
      }
      const rzp = new Razorpay(options)
      rzp.open()
    }
  </script>
</body>
</html>`
}
