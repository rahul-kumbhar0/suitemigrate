import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getCorsHeaders, corsOptions } from "@/lib/cors"

export const dynamic = "force-dynamic"

export async function OPTIONS(request: Request) {
  return corsOptions(request)
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin")
  const headers = getCorsHeaders(origin)

  try {
    const body = await request.json()
    const refreshToken = typeof body?.refreshToken === "string" ? body.refreshToken : ""

    if (!refreshToken) {
      return NextResponse.json({ error: "refreshToken is required" }, { status: 400, headers })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    )

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    })

    if (error || !data.session) {
      return NextResponse.json({ error: "Session expired" }, { status: 401, headers })
    }

    return NextResponse.json(
      {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at ?? null,
      },
      { headers: { ...headers, "Cache-Control": "no-store" } }
    )
  } catch (err) {
    console.error("[/api/auth/refresh]", err)
    return NextResponse.json({ error: "Session refresh failed" }, { status: 500, headers })
  }
}
