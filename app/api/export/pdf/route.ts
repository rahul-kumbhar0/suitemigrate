import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { canExportPDF } from "@/lib/plans"
import { getCorsHeaders, corsOptions } from "@/lib/cors"
import type { Plan } from "@/types"

// ---------------------------------------------------------------------------
// §12.1 PDF audit report — gated to Pro and Team (server-side)
// ---------------------------------------------------------------------------
// This endpoint generates and returns the PDF audit report for a user's
// conversions. Free users receive a 402 response.
//
// TODO (full implementation):
//   - Use a PDF generation library (e.g. @react-pdf/renderer, puppeteer,
//     or a third-party PDF API) to render the audit report.
//   - The current implementation returns JSON metadata as a stub.
//   - [OWNER TO CONFIRM] report format and required fields.
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

    // ── §12.1 Server-side plan gate ─────────────────────────────────
    const admin = createAdminClient()
    const { data: profile } = await admin
      .from("users")
      .select("plan")
      .eq("id", user.id)
      .maybeSingle()

    const plan = (profile?.plan as Plan) ?? "free"

    if (!canExportPDF(plan)) {
      return NextResponse.json(
        {
          error: "feature_not_available",
          message: "PDF audit reports are available on Pro and Team plans.",
          plan,
          upgradeUrl: "/dashboard/billing",
        },
        { status: 402, headers }
      )
    }

    // ── Fetch conversions for report ────────────────────────────────
    const { nsAccountId } = await request.json().catch(() => ({}))

    const query = admin
      .from("conversions")
      .select("id, script_name, original_version, script_type, confidence_score, changes_log, manual_review_lines, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(200)

    if (nsAccountId) {
      query.eq("ns_account_id", nsAccountId)
    }

    const { data: conversions, error } = await query

    if (error) {
      console.error("[/api/export/pdf]", error)
      return NextResponse.json({ error: "Failed to fetch conversion data" }, { status: 500, headers })
    }

    // ── TODO: Generate real PDF ─────────────────────────────────────
    // Replace this stub with actual PDF generation.
    // [OWNER TO CONFIRM] format, branding, and required fields.
    // For Team plan, client-branded reports need a client name field.
    const reportMetadata = {
      generated_at: new Date().toISOString(),
      user_id: user.id,
      plan,
      total_conversions: conversions?.length ?? 0,
      // stub — replace with actual PDF buffer/URL
      pdf_url: null,
      message: "PDF generation not yet implemented. See TODO in /app/api/export/pdf/route.ts",
    }

    return NextResponse.json(reportMetadata, { headers })

  } catch (err: unknown) {
    console.error("[/api/export/pdf]", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Export failed" },
      { status: 500, headers }
    )
  }
}
