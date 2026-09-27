import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Razorpay from "razorpay"

export const dynamic = "force-dynamic"

const PLAN_CONFIG = {
  pro: {
    amount: 400,       // $4.00 in cents
    currency: "USD",
    description: "SuiteMigrate Pro — Monthly",
    planId: process.env.RAZORPAY_PLAN_PRO_MONTHLY,
    type: "subscription",
  },
  lifetime: {
    amount: 1000,      // $10.00 in cents
    currency: "USD",
    description: "SuiteMigrate Lifetime Pro",
    planId: null,
    type: "one_time",
  },
  team: {
    amount: 1500,      // $15.00 in cents
    currency: "USD",
    description: "SuiteMigrate Team — Monthly",
    planId: process.env.RAZORPAY_PLAN_TEAM_MONTHLY,
    type: "subscription",
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

    const config = PLAN_CONFIG[plan]

    // Check Razorpay keys are configured
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      // During dev without Razorpay, redirect to billing page with message
      return NextResponse.redirect(
        new URL("/dashboard/billing?error=payment_not_configured", request.url)
      )
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    if (config.type === "one_time") {
      // Create a Razorpay order for one-time payment
      const order = await razorpay.orders.create({
        amount: config.amount,
        currency: config.currency,
        notes: {
          user_id: user.id,
          plan,
          email: user.email || "",
        },
      })

      // Return HTML page with Razorpay checkout
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      const html = buildCheckoutHtml({
        orderId: order.id,
        amount: config.amount,
        currency: config.currency,
        description: config.description,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        userName: user.user_metadata?.name || user.email || "User",
        userEmail: user.email || "",
        plan,
        callbackUrl: `${appUrl}/api/payments/verify`,
      })

      return new Response(html, { headers: { "Content-Type": "text/html" } })
    } else {
      // Subscription — create via Razorpay subscriptions API
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

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      const html = buildCheckoutHtml({
        subscriptionId: (subscription as { id: string }).id,
        amount: config.amount,
        currency: config.currency,
        description: config.description,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        userName: user.user_metadata?.name || user.email || "User",
        userEmail: user.email || "",
        plan,
        callbackUrl: `${appUrl}/api/payments/verify`,
      })

      return new Response(html, { headers: { "Content-Type": "text/html" } })
    }
  } catch (err: unknown) {
    console.error("[/api/payments/checkout]", err)
    return NextResponse.redirect(
      new URL("/dashboard/billing?error=checkout_failed", new URL(request.url))
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
  plan: string
  callbackUrl: string
}): string {
  const rzpOptions = params.orderId
    ? `order_id: "${params.orderId}"`
    : `subscription_id: "${params.subscriptionId}"`

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SuiteMigrate — Checkout</title>
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #050d1a; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: sans-serif; }
    .loader { text-align: center; color: #94a3b8; }
    .loader h2 { color: #fff; font-size: 1.25rem; margin-bottom: 8px; }
    .spinner { width: 40px; height: 40px; border: 3px solid #1e3a5f; border-top-color: #10b981; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 24px auto; }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="loader">
    <h2>Opening secure checkout...</h2>
    <div class="spinner"></div>
    <p>You will be redirected to your dashboard after payment</p>
  </div>
  <script>
    window.onload = function() {
      const options = {
        key: "${params.keyId}",
        amount: ${params.amount},
        currency: "${params.currency}",
        name: "SuiteMigrate",
        description: "${params.description}",
        ${rzpOptions},
        prefill: {
          name: "${params.userName}",
          email: "${params.userEmail}",
        },
        theme: { color: "#10b981" },
        handler: function(response) {
          fetch("${params.callbackUrl}", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              plan: "${params.plan}",
            }),
          }).then(function(res) {
            return res.json();
          }).then(function(data) {
            if (data.success) {
              window.location.href = "/dashboard/billing?success=true&plan=${params.plan}";
            } else {
              window.location.href = "/dashboard/billing?error=verification_failed";
            }
          });
        },
        modal: {
          ondismiss: function() {
            window.location.href = "/dashboard/billing?cancelled=true";
          }
        }
      };
      const rzp = new Razorpay(options);
      rzp.open();
    };
  </script>
</body>
</html>`
}
