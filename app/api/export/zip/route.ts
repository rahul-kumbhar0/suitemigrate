import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { canZipExport } from "@/lib/plans"
import { getCorsHeaders, corsOptions } from "@/lib/cors"
import type { Plan } from "@/types"

// ---------------------------------------------------------------------------
// §12.3 ZIP export — gated to Pro and Team (server-side)
// ---------------------------------------------------------------------------
// Returns a list of converted scripts for the user to download as a ZIP.
// Actual ZIP assembly happens client-side or via a separate download link.
//
// TODO (full implementation):
//   - Use JSZip or a streaming ZIP library to produce a ZIP buffer.
//   - Return the ZIP as a binary response with Content-Type: application/zip.
//   - [OWNER TO CONFIRM] file naming conventions in the ZIP.
// ---------------------------------------------------------------------------

export const dynamic = "force-dynamic"

export async function OPTIONS(request: Request) {
  return corsOptions(request)
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin")
  const headers = getCorsHeaders(origin)

  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers })
    }

    // ── §12.3 Server-side plan gate ─────────────────────────────────
    const admin = createAdminClient()
    const { data: profile } = await admin
      .from("users")
      .select("plan")
      .eq("id", user.id)
      .maybeSingle()

    const plan = (profile?.plan as Plan) ?? "free"

    if (!canZipExport(plan)) {
      return NextResponse.json(
        {
          error: "feature_not_available",
          message: "ZIP export is available on Pro and Team plans.",
          plan,
          upgradeUrl: "/dashboard/billing",
        },
        { status: 402, headers }
      )
    }

    // ── Fetch converted scripts ─────────────────────────────────────
    const body = await request.json().catch(() => ({}))
    const { conversionIds } = body

    let query = admin
      .from("conversions")
      .select("id, script_name, converted_code, original_version, confidence_score, changes_log, created_at")
      .eq("user_id", user.id)

    if (Array.isArray(conversionIds) && conversionIds.length > 0) {
      query = query.in("id", conversionIds)
    }

    const { data: conversions, error } = await query.order("created_at", { ascending: false }).limit(500)

    if (error) {
      console.error("[/api/export/zip]", error)
      return NextResponse.json({ error: "Failed to fetch conversions" }, { status: 500, headers })
    }

    // ── TODO: Generate real ZIP ─────────────────────────────────────
    // Replace this stub with actual ZIP generation.
    // Return the scripts list so the client can assemble the ZIP for now.
    return NextResponse.json(
      {
        scripts: (conversions ?? []).map(c => ({
          id: c.id,
          filename: `${c.script_name.replace(/[^a-z0-9_-]/gi, "_").toLowerCase()}_2.1.js`,
          code: c.converted_code,
          confidence_score: c.confidence_score,
          changes_count: c.changes_log?.length ?? 0,
          converted_at: c.created_at,
        })),
        message: "ZIP assembly not yet implemented server-side. See TODO in /app/api/export/zip/route.ts",
      },
      { headers }
    )

  } catch (err: unknown) {
    console.error("[/api/export/zip]", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Export failed" },
      { status: 500, headers }
    )
  }
}
