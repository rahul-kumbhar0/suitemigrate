import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

function corsHeaders(origin: string | null) {
  const allowed =
    !origin ||
    origin.startsWith("chrome-extension://") ||
    origin.startsWith("http://localhost") ||
    origin.startsWith("https://suitemigrate.com") ||
    origin.startsWith("https://suitemigrate.vercel.app")

  return {
    "Access-Control-Allow-Origin": allowed ? (origin ?? "*") : "null",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin")
  return new Response(null, { status: 204, headers: corsHeaders(origin) })
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin")
  const headers = corsHeaders(origin)

  try {
    const supabase = createClient()
    await supabase.auth.signOut()

    return NextResponse.json(
      { success: true },
      { headers }
    )
  } catch (err) {
    console.error("[/api/auth/logout]", err)
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500, headers }
    )
  }
}
