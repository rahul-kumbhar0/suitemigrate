"use client"

import { useState } from "react"
import { X, Download, Copy, CheckCircle, AlertTriangle, FileCode, ListChecks } from "lucide-react"

interface Conversion {
  id: string
  script_name: string
  original_version: string
  script_type: string
  original_code: string
  converted_code: string
  confidence_score: number
  changes_log: string[]
  manual_review_lines: number[]
  created_at: string
}

export default function ConversionDetailModal({ conversion, onClose }: { conversion: Conversion | null; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const [tab, setTab] = useState<"converted" | "changes" | "inline">("converted")

  if (!conversion) return null

  const handleCopy = async () => {
    await navigator.clipboard.writeText(conversion.converted_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const header = `/**
 * SUITESCRIPT 2.1 — CONVERTED BY SUITEMIGRATE
 * ─────────────────────────────────────────────
 * Original: ${conversion.script_name}
 * Converted: ${new Date(conversion.created_at).toLocaleString()}
 * Tool: SuiteMigrate (suitemigrate.vercel.app)
 *
 * CHANGES:
${conversion.changes_log.map(c => ` * — ${c}`).join("\n")}
 *
 * NEXT STEPS:
 * 1. Review all // MIGRATED: comments
 * 2. Test in NetSuite Sandbox
 * 3. Check lines marked // TODO: MANUAL REVIEW
 * 4. Deploy to Production after validation
 *
 * Confidence: ${conversion.confidence_score}/100
 * ─────────────────────────────────────────────
 */\n\n`
    const safeName = conversion.script_name.replace(/[^a-z0-9_-]/gi, "_").toLowerCase()
    const blob = new Blob([header + conversion.converted_code], { type: "text/javascript" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = `${safeName}_2.1.js`; a.click()
    URL.revokeObjectURL(url)
  }

  const confColor = conversion.confidence_score >= 90 ? "var(--clay)"
    : conversion.confidence_score >= 70 ? "#b45309" : "#dc2626"

  const Tab = ({ id, icon: Icon, label }: { id: typeof tab; icon: typeof FileCode; label: string }) => (
    <button onClick={() => setTab(id)} style={{
      display: "flex", alignItems: "center", gap: 7,
      padding: "7px 14px", borderRadius: 3, fontSize: 13, fontFamily: "var(--f-sans)",
      cursor: "pointer", border: "none", fontWeight: tab === id ? 500 : 400,
      background: tab === id ? "rgba(15,23,42,.08)" : "transparent",
      color: tab === id ? "var(--ink)" : "var(--ink-soft)",
      borderBottom: tab === id ? "2px solid var(--clay)" : "2px solid transparent",
      transition: "all .14s",
    }}>
      <Icon size={14} />
      {label}
    </button>
  )

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.45)", backdropFilter: "blur(4px)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "var(--paper)", border: "1px solid var(--rule)", borderRadius: 8, width: "100%", maxWidth: 860, maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 32px 80px -12px rgba(15,23,42,.25)" }}>

        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--rule)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexShrink: 0 }}>
          <div>
            <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 400, fontSize: 20, letterSpacing: "-0.015em", color: "var(--ink)", marginBottom: 4 }}>
              {conversion.script_name}
            </h2>
            <p style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, color: "var(--ink-mute)", textTransform: "uppercase", letterSpacing: ".12em" }}>
              SS {conversion.original_version} → 2.1 · {conversion.script_type}
            </p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-mute)", display: "flex", padding: 4, borderRadius: 4, flexShrink: 0 }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink-mute)")}>
            <X size={18} />
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "var(--rule)", borderBottom: "1px solid var(--rule)", flexShrink: 0 }}>
          {[
            { label: "Confidence", value: `${conversion.confidence_score}%`, color: confColor },
            { label: "Changes",    value: conversion.changes_log.length,      color: "var(--ink)" },
            { label: "Review Lines", value: conversion.manual_review_lines.length, color: conversion.manual_review_lines.length > 0 ? "#b45309" : "#15803d" },
          ].map(s => (
            <div key={s.label} style={{ background: "var(--paper)", padding: "16px 20px", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: 32, letterSpacing: "-0.025em", lineHeight: 1, color: s.color, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Manual review warning */}
        {conversion.manual_review_lines.length > 0 && (
          <div style={{ margin: "14px 24px 0", padding: "10px 14px", border: "1px solid rgba(180,83,9,.25)", borderRadius: 4, background: "rgba(180,83,9,.05)", display: "flex", alignItems: "flex-start", gap: 8, flexShrink: 0 }}>
            <AlertTriangle size={14} style={{ color: "#b45309", flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: "#b45309", marginBottom: 2 }}>Lines needing manual review</p>
              <p style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--ink-soft)" }}>
                Lines: {conversion.manual_review_lines.join(", ")}
              </p>
            </div>
          </div>
        )}

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 0, padding: "12px 24px 0", borderBottom: "1px solid var(--rule)", flexShrink: 0 }}>
          <Tab id="converted" icon={FileCode}    label="Converted Code" />
          <Tab id="changes"   icon={ListChecks}  label={`Changes (${conversion.changes_log.length})`} />
          <Tab id="inline"    icon={CheckCircle} label="Inline Comments" />
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>

          {/* Converted code */}
          {tab === "converted" && (
            <pre style={{ background: "rgba(15,23,42,.04)", border: "1px solid var(--rule)", borderRadius: 4, padding: "14px 16px", fontFamily: "var(--f-mono)", fontSize: 12, lineHeight: 1.65, color: "var(--ink-soft)", overflow: "auto", whiteSpace: "pre", margin: 0 }}>
              {conversion.converted_code}
            </pre>
          )}

          {/* Changes log */}
          {tab === "changes" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {conversion.changes_log.length === 0 ? (
                <p style={{ fontSize: 13.5, color: "var(--ink-mute)" }}>No changes logged</p>
              ) : conversion.changes_log.map((change, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 14px", border: "1px solid var(--rule)", borderRadius: 4, background: "var(--paper)" }}>
                  <span style={{ color: "var(--clay)", flexShrink: 0, fontFamily: "var(--f-mono)", fontSize: 11 }}>—</span>
                  <span style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.6 }}>{change}</span>
                </div>
              ))}
            </div>
          )}

          {/* Inline comments */}
          {tab === "inline" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ padding: "10px 14px", border: "1px solid var(--rule)", borderRadius: 4, background: "rgba(15,23,42,.03)" }}>
                <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.65 }}>
                  Look for <code style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--clay)", background: "rgba(217,74,31,.08)", padding: "1px 5px", borderRadius: 3 }}>// MIGRATED:</code> comments — they explain every change made during conversion.
                </p>
              </div>
              <div style={{ background: "rgba(15,23,42,.04)", border: "1px solid var(--rule)", borderRadius: 4, padding: "14px 16px", fontFamily: "var(--f-mono)", fontSize: 12, lineHeight: 1.65, overflow: "auto" }}>
                {conversion.converted_code.split("\n").map((line, i) => {
                  const isMigrated = line.includes("// MIGRATED:") || line.includes("// CHANGED:") || line.includes("// TODO: MANUAL REVIEW")
                  return (
                    <div key={i} style={{ display: "flex", gap: 10, background: isMigrated ? "rgba(217,74,31,.07)" : "transparent", borderLeft: isMigrated ? "2px solid var(--clay)" : "2px solid transparent", paddingLeft: isMigrated ? 6 : 0, marginLeft: isMigrated ? -2 : 0 }}>
                      <span style={{ color: "var(--ink-mute)", width: 32, flexShrink: 0, textAlign: "right", userSelect: "none" }}>{i + 1}</span>
                      <span style={{ color: isMigrated ? "var(--clay)" : "var(--ink-soft)", whiteSpace: "pre" }}>{line || " "}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--rule)", display: "flex", gap: 10, flexShrink: 0 }}>
          <button onClick={handleDownload} className="btn-pill" style={{ flex: 1, justifyContent: "center", fontSize: 13.5 }}>
            <Download size={15} />
            Download with Header
          </button>
          <button onClick={handleCopy} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 999, border: "1px solid var(--rule)", background: "transparent", color: "var(--ink)", fontSize: 13.5, fontFamily: "var(--f-sans)", cursor: "pointer", fontWeight: 500, transition: "all .2s" }}
            className="copy-btn">
            <Copy size={14} />
            {copied ? "Copied!" : "Copy Code"}
          </button>
        </div>
      </div>

      <style>{`
        .copy-btn:hover { background: var(--paper-warm) !important; border-color: var(--ink) !important; }
      `}</style>
    </div>
  )
}
