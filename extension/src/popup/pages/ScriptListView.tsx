import { useState, useEffect } from "react"
import { Search, Download } from "lucide-react"
import Header from "../components/Header"
import { useStore } from "../../lib/store"
import { downloadAuditReport } from "../../lib/export"
import { convertScript } from "../../lib/api"
import { saveConversion, getStorage, setStorage, saveAccount } from "../../lib/storage"
import { fetchScriptCode } from "../../lib/suiteql"
import { fetchCurrentUser } from "../../lib/auth"
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
          <strong>SuiteMigrate&apos;s server</strong> and then to{" "}
          <strong>Google Gemini API</strong> to perform the requested conversion.
        </p>
        <p style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, color: "var(--ink-mute)", lineHeight: 1.6, marginBottom: 14 }}>
          SuiteMigrate does not retain the original source code in its conversion database after processing. The converted result may be stored in your account for review and re-download.
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
    activeAccount, user, setUser, setActiveAccount,
    setView, setSelectedScript, setConverting,
    setConversionResult, setConversionError, addConversion,
    privacyAccepted, setPrivacyAccepted,
  } = useStore()

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "needs_update" | "blockers" | "done">("needs_update")
  const [pendingScript, setPendingScript] = useState<NSScript | null>(null)
  const [sourceIssue, setSourceIssue] = useState<{ script: NSScript; message: string; access: NonNullable<NSScript["sourceAccess"]> } | null>(null)
  const [manualCode, setManualCode] = useState("")
  const [manualError, setManualError] = useState("")
  const [showManualPaste, setShowManualPaste] = useState(false)

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
    if (filter === "blockers") return m && ["no_file", "restricted", "protected"].includes(s.sourceAccess || "")
    if (filter === "done") return m && !s.needsMigration
    return m
  })

  const markSourceAccess = async (
    scriptId: string,
    access: NonNullable<NSScript["sourceAccess"]>,
    note?: string
  ) => {
    const next = {
      ...activeAccount,
      scripts: activeAccount.scripts.map((s) =>
        s.id === scriptId ? { ...s, sourceAccess: access, sourceAccessNote: note } : s
      ),
    }
    setActiveAccount(next)
    await saveAccount(next)
  }

  const runConversionWithCode = async (script: NSScript, code: string) => {
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
    try {
      await saveConversion(conversion)
    } catch {
      // Server history already holds this result; local cache is best effort.
    }

    // Update usage immediately so the popup never shows a stale conversion count.
    if (user) {
      const used = result.usage?.used ?? (user.conversionsUsed + 1)
      setUser({
        ...user,
        conversionsUsed: used,
        conversionsRemaining: user.unlimited ? null : Math.max(0, 5 - used),
      })
    }

    // Then reconcile against the backend profile in case the plan/quota changed.
    try {
      const freshUser = await fetchCurrentUser()
      if (freshUser) setUser(freshUser)
    } catch {
      // A profile refresh failure must not hide an already saved result.
    }

    setConversionResult(conversion)
    setView("conversion_result")
  }

  const handleConvert = async (script: NSScript) => {
    if (!privacyAccepted) {
      setPendingScript(script)
      return
    }

    if (["no_file", "restricted", "protected"].includes(script.sourceAccess || "")) {
      setSourceIssue({
        script,
        access: script.sourceAccess as NonNullable<NSScript["sourceAccess"]>,
        message: script.sourceAccessNote ||
          (script.sourceAccess === "no_file"
            ? "No source file is attached to this script record."
            : "Automatic source access is unavailable for this script."),
      })
      setShowManualPaste(false)
      setManualCode("")
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
      let fetchAccess: NonNullable<NSScript["sourceAccess"]> = script.sourceAccess || "unknown"

      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
        if (tab?.id) {
          const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: fetchScriptCode,           // serialised and injected
            args: [script.id],
          })
          const result = results?.[0]?.result as {
            code: string
            error?: string
            access: "readable" | "no_file" | "restricted" | "protected"
          } | null
          if (result?.code) {
            code = result.code
            fetchAccess = "readable"
          } else if (result) {
            fetchAccess = result.access
            fetchError = result.error || "Could not read the selected source file."
          }
        }
      } catch (err) {
        fetchError = err instanceof Error ? err.message : String(err)
      }

      // Never send placeholder/HTML content to the conversion service.
      if (!code) {
        const message = fetchError || "Could not retrieve the selected source file."
        await markSourceAccess(script.id, fetchAccess === "unknown" ? "protected" : fetchAccess, message)
        setSourceIssue({
          script: { ...script, sourceAccess: fetchAccess === "unknown" ? "protected" : fetchAccess, sourceAccessNote: message },
          message,
          access: fetchAccess === "unknown" ? "protected" : fetchAccess,
        })
        setShowManualPaste(false)
        setManualCode("")
        setManualError("")
        setView("script_list")
        return
      }

      await markSourceAccess(script.id, "readable")
      await runConversionWithCode(script, code)

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

  const handleManualConvert = async () => {
    if (!sourceIssue) return
    const code = manualCode.trim()
    if (code.length < 30) {
      setManualError("Paste the complete authorized SuiteScript source before converting.")
      return
    }
    setManualError("")

    await markSourceAccess(sourceIssue.script.id, "manual", "Authorized source copy supplied manually.")
    setSelectedScript(sourceIssue.script)
    setSourceIssue(null)
    setShowManualPaste(false)
    setConverting(true)
    setConversionError(null)
    setView("converting")

    try {
      await runConversionWithCode(sourceIssue.script, code)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Conversion failed"
      if (msg === "conversion_limit_reached") setView("upgrade")
      else {
        setConversionError(msg)
        setView("conversion_result")
      }
    } finally {
      setConverting(false)
      setManualCode("")
    }
  }

  const needs = activeAccount.scripts.filter(s => s.needsMigration).length
  const done  = activeAccount.scripts.filter(s => !s.needsMigration).length
  const blockers = activeAccount.scripts.filter(s =>
    ["no_file", "restricted", "protected"].includes(s.sourceAccess || "")
  ).length

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

      {sourceIssue && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.58)", zIndex: 110, display: "flex", alignItems: "flex-end" }}>
          <div style={{ background: "var(--paper)", width: "100%", maxHeight: "88vh", overflowY: "auto", padding: "18px 16px 20px", borderTop: "2px solid var(--clay)" }}>
            <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".12em", color: "var(--clay)", marginBottom: 7 }}>
              Migration blocker
            </p>
            <h3 style={{ fontFamily: "var(--f-head)", fontSize: 17, fontWeight: 500, color: "var(--ink)", marginBottom: 8 }}>
              {sourceIssue.access === "protected" ? "Protected or hidden source" :
               sourceIssue.access === "restricted" ? "Role cannot read source" :
               sourceIssue.access === "no_file" ? "No source file attached" :
               "Source unavailable"}
            </h3>
            <p style={{ fontSize: 11.5, color: "var(--ink-soft)", lineHeight: 1.6, marginBottom: 10 }}>
              {sourceIssue.message}
            </p>
            <div style={{ background: "rgba(15,23,42,.035)", border: "1px solid var(--rule)", borderRadius: 4, padding: "9px 10px", marginBottom: 12 }}>
              <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: "var(--ink-mute)", lineHeight: 1.55 }}>
                Recommended: use an authorized role, request a SuiteScript 2.1 update/source copy from the vendor or client, or paste source only if you are authorized to process it. SuiteMigrate does not bypass NetSuite or vendor source protection.
              </p>
            </div>

            {showManualPaste ? (
              <>
                <textarea
                  value={manualCode}
                  onChange={(e) => { setManualCode(e.target.value); setManualError("") }}
                  placeholder="Paste authorized SuiteScript source here…"
                  style={{ width: "100%", minHeight: 150, resize: "vertical", border: "1px solid var(--rule)", borderRadius: 4, padding: 9, fontFamily: "var(--f-mono)", fontSize: 10.5, background: "#fff", color: "var(--ink)", outline: "none", marginBottom: 10 }}
                />
                {manualError && (
                  <p style={{ fontSize: 10.5, color: "var(--clay)", marginBottom: 9, lineHeight: 1.5 }}>{manualError}</p>
                )}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={handleManualConvert} className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 11 }}>
                    Convert pasted source
                  </button>
                  <button onClick={() => { setShowManualPaste(false); setManualCode(""); setManualError("") }} className="btn-outline" style={{ fontSize: 11 }}>
                    Cancel paste
                  </button>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <button onClick={() => { setShowManualPaste(true); setManualError("") }} className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: 11 }}>
                  Paste authorized source
                </button>
                {sourceIssue.access !== "no_file" && (
                  <button
                    onClick={async () => {
                      const script = sourceIssue.script
                      setSourceIssue(null)
                      await doConvert({ ...script, sourceAccess: "unknown", sourceAccessNote: undefined })
                    }}
                    className="btn-outline"
                    style={{ width: "100%", justifyContent: "center", fontSize: 11 }}
                  >
                    Retry automatic access
                  </button>
                )}
                <button onClick={() => setSourceIssue(null)} className="btn-outline" style={{ width: "100%", justifyContent: "center", fontSize: 11 }}>
                  Keep as blocker
                </button>
              </div>
            )}
          </div>
        </div>
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
          {(["needs_update", "blockers", "all", "done"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={filter === f ? "tab-active" : "tab-inactive"}
              style={{ flex: 1, padding: "5px 4px", borderRadius: 3, fontSize: 10, fontFamily: "var(--f-mono)", textTransform: "uppercase", letterSpacing: ".08em", cursor: "pointer", fontWeight: 500 }}
            >
              {f === "needs_update" ? `Update (${needs})` : f === "blockers" ? `Blockers (${blockers})` : f === "done" ? `Done (${done})` : `All (${activeAccount.scripts.length})`}
            </button>
          ))}
        </div>

        {/* Migration Readiness Report is generated locally from scanned account metadata.
            Paid-plan status is checked from the signed-in SuiteMigrate account. */}
        {user && !user.unlimited ? (
          <button
            onClick={() => setView("upgrade")}
            className="btn-outline"
            style={{ width: "100%", justifyContent: "center", fontSize: 11, opacity: 0.6, cursor: "pointer" }}
            title="Migration Readiness Report is available on paid plans"
          >
            <Download size={11} /> Migration Readiness Report (Pro)
          </button>
        ) : (
          <button
            onClick={() => downloadAuditReport(activeAccount)}
            className="btn-outline"
            style={{ width: "100%", justifyContent: "center", fontSize: 11 }}
          >
            <Download size={11} /> Migration Readiness Report
          </button>
        )}
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
                {script.sourceAccess === "no_file" && <span style={{ color: "var(--clay)", marginLeft: 4 }}>· no file</span>}
                {script.sourceAccess === "restricted" && <span style={{ color: "#b45309", marginLeft: 4 }}>· role restricted</span>}
                {script.sourceAccess === "protected" && <span style={{ color: "#b91c1c", marginLeft: 4 }}>· protected source</span>}
                {script.sourceAccess === "readable" && <span style={{ color: "#15803d", marginLeft: 4 }}>· source ready</span>}
                {script.sourceAccess === "manual" && <span style={{ color: "#2563eb", marginLeft: 4 }}>· authorized copy</span>}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <span className={`risk-${script.riskLevel.toLowerCase()}`}>{script.riskLevel}</span>
              {script.needsMigration ? (
                <button
                  onClick={() => handleConvert(script)}
                  className={["no_file", "restricted", "protected"].includes(script.sourceAccess || "") ? "btn-outline" : "btn-primary"}
                  title={["no_file", "restricted", "protected"].includes(script.sourceAccess || "") ? "View migration options" : "Convert this script"}
                  style={{ fontSize: 10, padding: "4px 10px" }}
                >
                  {["no_file", "restricted", "protected"].includes(script.sourceAccess || "") ? "Options" : "Convert"}
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
