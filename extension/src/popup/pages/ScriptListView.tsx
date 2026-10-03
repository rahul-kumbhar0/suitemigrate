import { useState, useEffect } from "react"
import { Search, Download } from "lucide-react"
import Header from "../components/Header"
import { useStore } from "../../lib/store"
import { downloadAuditReport } from "../../lib/export"
import { convertScript } from "../../lib/api"
import { saveConversion, getStorage, setStorage } from "../../lib/storage"
import { fetchScriptCode } from "../../lib/suiteql"
import type { NSScript } from "../../lib/types"

// ── Privacy consent notice (Item 7) ──────────────────────────────────────────
function PrivacyNotice({ onAccept, onCancel }: { onAccept: () => void; onCancel: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.55)", zIndex: 100, display: "flex", alignItems: "flex-end" }}>
      <div style={{ background: "var(--paper)", width: "100%", padding: "18px 16px 20px", borderTop: "2px solid var(--clay)" }}>
        <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".12em", color: "var(--clay)", marginBottom: 8 }}>
          Before your first conversion
        </p>
        <p style={{ fontSize: 12.5, color: "var(--ink)", lineHeight: 1.65, marginBottom: 12 }}>
          The script code you choose to convert is sent to{" "}
          <strong>our server</strong> and then to{" "}
          <strong>Google Gemini AI</strong> for processing.
        </p>
        <p style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, color: "var(--ink-mute)", lineHeight: 1.6, marginBottom: 14 }}>
          {/* [OWNER TO CONFIRM] storage and training details — see E-3 in CONTENT-TODO.md */}
          [OWNER TO CONFIRM: is code stored after conversion? Used for model training?]
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onAccept} className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 12 }}>
            I understand — continue
          </button>
          <button onClick={onCancel} className="btn-outline" style={{ fontSize: 12, padding: "8px 14px" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ScriptListView() {
  const {
    activeAccount, user,
    setView, setSelectedScript, setConverting,
    setConversionResult, setConversionError, addConversion,
    privacyAccepted, setPrivacyAccepted,
  } = useStore()

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "needs_update" | "done">("needs_update")
  // Script waiting for privacy acceptance
  const [pendingScript, setPendingScript] = useState<NSScript | null>(null)

  // Load persisted consent from chrome.storage on mount
  useEffect(() => {
    getStorage("privacyAccepted" as any).then((v) => {
      if (v) setPrivacyAccepted(true)
    }).catch(() => {})
  }, [setPrivacyAccepted])

  if (!activeAccount) return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Header showBack onBack={() => setView("dashboard")} title="Scripts" />
      <div style={{ padding: 20, textAlign: "center", color: "var(--ink-mute)", fontSize: 12 }}>
        No account selected. Returning to dashboard…
      </div>
    </div>
  )

  const filtered = activeAccount.scripts.filter(s => {
    const m = s.name.toLowerCase().includes(search.toLowerCase()) ||
              s.scriptType.toLowerCase().includes(search.toLowerCase())
    if (filter === "needs_update") return m && s.needsMigration
    if (filter === "done")         return m && !s.needsMigration
    return m
  })

  const handleConvert = async (script: NSScript) => {
    // Item 7: show privacy notice before the very first conversion
    if (!privacyAccepted) {
      setPendingScript(script)
      return
    }
    await doConvert(script)
  }

  const doConvert = async (script: NSScript) => {
    // Client-side limit check — server enforces independently
    if (!user?.unlimited && (user?.conversionsUsed ?? 0) >= 5) {
      setView("upgrade")
      return
    }

    setSelectedScript(script)
    setConverting(true)
    setConversionError(null)
    setView("converting")

    try {
      // ── Item 3 fix: fetch script code via scripting.executeScript ────────
      // The popup cannot use content.js (content_scripts removed from manifest).
      // Instead we inject fetchScriptCode directly into the active NetSuite tab.
      let code = ""
      let fetchError = ""

      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
        if (tab?.id) {
          const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: fetchScriptCode,           // serialised and injected
            args: [script.id],
          })
          const result = results?.[0]?.result as { code: string; error?: string } | null
          if (result?.code) {
            code = result.code
          } else if (result?.error) {
            fetchError = result.error
          }
        }
      } catch (err) {
        fetchError = err instanceof Error ? err.message : String(err)
      }

      // Fallback: if we couldn't get the code, send a placeholder so the
      // conversion still runs and the user sees what happens.
      if (!code) {
        code = `// Script: ${script.name}\n// SuiteMigrate could not automatically fetch the source code.\n// Paste your script here and click Convert again.\n// Fetch error: ${fetchError || "unknown"}`
      }

      // ── Convert ──────────────────────────────────────────────────────────
      const result = await convertScript({
        code,
        scriptName: script.name,
        nsAccountId: activeAccount.accountId,
      })

      const conversion = {
        conversionId: result.conversionId,
        scriptName: script.name,
        convertedCode: result.convertedCode,
        originalCode: code,
        confidenceScore: result.confidenceScore,
        changeLog: result.changeLog,
        manualReviewLines: result.manualReviewLines,
        isValid: result.isValid,
        validationErrors: result.validationErrors,
        scriptType: result.scriptType,
        originalVersion: result.originalVersion,
      }

      addConversion(conversion)
      await saveConversion(conversion)
      setConversionResult(conversion)
      setView("conversion_result")

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Conversion failed"
      // Server returns "conversion_limit_reached" when the 5-conversion cap is hit
      if (msg === "conversion_limit_reached") {
        setView("upgrade")
      } else {
        setConversionError(msg)
        setView("conversion_result")
      }
    } finally {
      setConverting(false)
    }
  }

  const needs = activeAccount.scripts.filter(s => s.needsMigration).length
  const done  = activeAccount.scripts.filter(s => !s.needsMigration).length

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Header showBack onBack={() => setView("dashboard")} title="Scripts to Migrate" />

      {/* Item 7: Privacy notice overlay */}
      {pendingScript && (
        <PrivacyNotice
          onAccept={async () => {
            setPrivacyAccepted(true)
            // Persist across sessions
            await setStorage("privacyAccepted" as any, true)
            const s = pendingScript
            setPendingScript(null)
            await doConvert(s)
          }}
          onCancel={() => setPendingScript(null)}
        />
      )}

      <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Search */}
        <div style={{ position: "relative" }}>
          <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--ink-mute)" }} />
          <input
            type="text"
            placeholder="Search scripts…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", paddingLeft: 30, paddingRight: 10, paddingTop: 7, paddingBottom: 7, border: "1px solid var(--rule)", borderRadius: 4, background: "var(--paper)", fontSize: 12, color: "var(--ink)", outline: "none", fontFamily: "var(--f-sans)" }}
            onFocus={e => (e.target.style.borderColor = "var(--ink)")}
            onBlur={e => (e.target.style.borderColor = "var(--rule)")}
          />
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 4 }}>
          {(["needs_update", "all", "done"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={filter === f ? "tab-active" : "tab-inactive"}
              style={{ flex: 1, padding: "5px 4px", borderRadius: 3, fontSize: 10, fontFamily: "var(--f-mono)", textTransform: "uppercase", letterSpacing: ".08em", cursor: "pointer", fontWeight: 500 }}
            >
              {f === "needs_update" ? `Update (${needs})` : f === "done" ? `Done (${done})` : `All (${activeAccount.scripts.length})`}
            </button>
          ))}
        </div>

        {/* Audit report — available to all plans client-side; PDF gated server-side */}
        <button
          onClick={() => downloadAuditReport(activeAccount)}
          className="btn-outline"
          style={{ width: "100%", justifyContent: "center", fontSize: 11 }}
        >
          <Download size={11} /> Export Audit Report
        </button>
      </div>

      {/* Script list */}
      <div style={{ overflowY: "auto", maxHeight: 300, padding: "0 14px 14px", display: "flex", flexDirection: "column", gap: 4 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px 0", color: "var(--ink-mute)", fontSize: 11.5 }}>
            No scripts match your filter
          </div>
        ) : filtered.map(script => (
          <div key={script.id} className="card" style={{ padding: "8px 10px", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {script.name}
              </p>
              <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: "var(--ink-mute)", marginTop: 2 }}>
                {script.scriptType} · SS {script.apiVersion}
                {script.hasFile === false && (
                  <span style={{ color: "var(--clay)", marginLeft: 4 }}>· no file</span>
                )}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <span className={`risk-${script.riskLevel.toLowerCase()}`}>{script.riskLevel}</span>
              {script.needsMigration ? (
                <button
                  onClick={() => handleConvert(script)}
                  className="btn-primary"
                  style={{ fontSize: 10, padding: "4px 10px" }}
                >
                  Convert
                </button>
              ) : (
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "#15803d" }}>✓ 2.1</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
