"use client"

import { useState, useEffect } from "react"
import { History, Chrome, ArrowRight, Clock } from "lucide-react"
import ConversionDetailModal from "@/components/dashboard/conversion-detail-modal"
import { createClient } from "@/lib/supabase/client"

interface Conversion {
  id: string
  script_name: string
  original_version: string
  script_type: string
  original_code: string | null
  converted_code: string
  confidence_score: number
  changes_log: string[]
  manual_review_lines: number[]
  created_at: string
}

export default function ConversionsPage() {
  const [conversions, setConversions]               = useState<Conversion[]>([])
  const [selectedConversion, setSelectedConversion] = useState<Conversion | null>(null)
  const [loading, setLoading]                       = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { data, error } = await supabase
        .from("conversions").select("*").eq("user_id", user.id)
        .order("created_at", { ascending: false }).limit(50)
      if (!error && data) setConversions(data as Conversion[])
      setLoading(false)
    }
    load()
  }, [])

  const confidenceColor = (s: number) =>
    s >= 90 ? "var(--clay)" : s >= 70 ? "#b45309" : "#dc2626"

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 240 }}>
      <div style={{ width: 28, height: 28, border: "2px solid var(--rule)", borderTopColor: "var(--clay)", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(24px,3.5vw,38px)", letterSpacing: "-0.025em", color: "var(--ink)", marginBottom: 6 }}>
            Conversion History
          </h1>
          <p style={{ fontFamily: "var(--f-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)" }}>
            {conversions.length} script{conversions.length !== 1 ? "s" : ""} converted
          </p>
        </div>

        {conversions.length === 0 ? (
          /* Empty state */
          <div style={{ border: "1px solid var(--rule)", borderRadius: 6, background: "var(--paper)", padding: "64px 24px", textAlign: "center" }}>
            <div style={{ width: 48, height: 48, border: "1px solid var(--rule)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <History size={22} style={{ color: "var(--ink-mute)" }} />
            </div>
            <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 400, fontSize: 18, color: "var(--ink)", marginBottom: 8 }}>No conversions yet</h2>
            <p style={{ fontSize: 13.5, color: "var(--ink-soft)", maxWidth: 340, margin: "0 auto 28px", lineHeight: 1.65 }}>
              Your converted scripts will appear here once you start using the Chrome extension to migrate scripts.
            </p>
            <a href="#" className="btn-pill" style={{ fontSize: 13 }}>
              <Chrome size={14} />
              Install Extension
              <ArrowRight size={14} />
            </a>
          </div>
        ) : (
          /* Conversion list */
          <div style={{ border: "1px solid var(--rule)", borderRadius: 6, overflow: "hidden" }}>
            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 80px 80px 120px", gap: 0, background: "rgba(15,23,42,.04)", borderBottom: "1px solid var(--rule)", padding: "10px 20px" }}>
              {["Script", "Type", "Version", "Quality", "Date"].map(h => (
                <div key={h} style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)" }}>{h}</div>
              ))}
            </div>

            {conversions.map((c, i) => (
              <div
                key={c.id}
                onClick={() => setSelectedConversion(c)}
                className="conv-row"
                style={{
                  display: "grid", gridTemplateColumns: "1fr 100px 80px 80px 120px",
                  gap: 0, padding: "14px 20px", cursor: "pointer",
                  borderBottom: i < conversions.length - 1 ? "1px solid var(--rule)" : "none",
                  background: "var(--paper)", transition: "background .12s",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 13.5, fontWeight: 500, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {c.script_name}
                  </p>
                  {c.manual_review_lines.length > 0 && (
                    <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: "var(--clay)", marginTop: 3 }}>
                      ⚠ {c.manual_review_lines.length} line{c.manual_review_lines.length > 1 ? "s" : ""} to review
                    </p>
                  )}
                </div>
                <div style={{ fontSize: 12.5, color: "var(--ink-soft)", alignSelf: "center" }}>{c.script_type}</div>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--ink-mute)", alignSelf: "center" }}>SS {c.original_version}</div>
                <div style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: 22, letterSpacing: "-0.02em", color: confidenceColor(c.confidence_score), alignSelf: "center" }}>
                  {c.confidence_score}%
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--ink-mute)" }}>
                  <Clock size={11} />
                  <span style={{ fontFamily: "var(--f-mono)", fontSize: 10.5 }}>
                    {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedConversion && (
        <ConversionDetailModal
          conversion={selectedConversion}
          onClose={() => setSelectedConversion(null)}
        />
      )}

      <style>{`
        .conv-row:hover { background: var(--paper-warm) !important; }
      `}</style>
    </>
  )
}
