/**
 * Export helpers — individual converted scripts and migration readiness report.
 */

import type { NSAccount, ConversionResult } from "./types"

export function downloadScript(scriptName: string, code: string, changeLog?: string[]): void {
  const safeName = scriptName.replace(/[^a-z0-9_-]/gi, "_").toLowerCase()
  const changed = changeLog && changeLog.length
    ? changeLog.map((item) => " * ✓ " + item).join("\n")
    : " * • Review inline migration comments and manual-review flags"

  const header = [
    "/**",
    " * SuiteMigrate — SuiteScript 2.1 Conversion",
    " * Original Script: " + scriptName,
    " * Converted: " + new Date().toLocaleString(),
    " *",
    " * WHAT CHANGED:",
    changed,
    " *",
    " * NEXT STEPS:",
    " * 1. Review all migrated lines and manual-review flags",
    " * 2. Test in NetSuite Sandbox",
    " * 3. Validate deployments, permissions, integrations and business logic",
    " * 4. Move to production only after your own approval",
    " */",
    "",
    "",
  ].join("\n")

  const blob = new Blob([header + code], { type: "text/javascript" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = safeName + "_2.1.js"
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadAuditReport(account: NSAccount): void {
  const esc = (value: unknown) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")

  const needsUpdate = account.scripts.filter((s) => s.needsMigration)
  const current = account.scripts.filter((s) => !s.needsMigration)
  const blockers = account.scripts.filter((s) =>
    ["no_file", "restricted", "protected"].includes(s.sourceAccess || "")
  )
  const ready = needsUpdate.filter((s) =>
    !["no_file", "restricted", "protected"].includes(s.sourceAccess || "")
  )

  const accessLabel = (s: NSAccount["scripts"][number]) => {
    if (s.sourceAccess === "readable") return "Source ready"
    if (s.sourceAccess === "manual") return "Authorized copy supplied"
    if (s.sourceAccess === "no_file") return "No source file"
    if (s.sourceAccess === "restricted") return "Role restricted"
    if (s.sourceAccess === "protected") return "Protected / hidden"
    return s.hasFile === false ? "No source file" : "Not checked"
  }

  const actionFor = (s: NSAccount["scripts"][number]) => {
    if (!s.needsMigration) return "Current on 2.1 — regression test during the migration project."
    if (s.sourceAccess === "protected") {
      return "Ask the vendor/client for an authorized source copy or a 2.1-compatible release. Do not bypass source protection."
    }
    if (s.sourceAccess === "restricted") {
      return "Retry with an authorized NetSuite role or paste an authorized source copy."
    }
    if (s.sourceAccess === "no_file" || s.hasFile === false) {
      return "Locate or attach the source file before conversion."
    }
    return "Convert, review manual flags, then validate in NetSuite Sandbox."
  }

  const accessClass = (s: NSAccount["scripts"][number]) => {
    if (s.sourceAccess === "readable" || s.sourceAccess === "manual") return "ok"
    if (["no_file", "restricted", "protected"].includes(s.sourceAccess || "")) return "block"
    return "neutral"
  }

  const rows = account.scripts.map((s) => {
    const priorityClass = s.riskLevel === "HIGH"
      ? "high"
      : s.riskLevel === "MEDIUM"
        ? "medium"
        : "current"
    const priority = s.riskLevel === "NONE" ? "CURRENT" : s.riskLevel

    return [
      "<tr>",
      "<td><strong>" + esc(s.name) + "</strong><div class=\"sub\">" + esc(s.description || "") + "</div></td>",
      "<td>" + esc(s.scriptType) + "</td>",
      "<td><span class=\"mono\">SS " + esc(s.apiVersion) + "</span></td>",
      "<td><span class=\"pill " + priorityClass + "\">" + esc(priority) + "</span></td>",
      "<td><span class=\"pill " + accessClass(s) + "\">" + esc(accessLabel(s)) + "</span></td>",
      "<td>" + esc(actionFor(s)) + "</td>",
      "</tr>",
    ].join("")
  }).join("")

  const blockerRows = blockers.map((s) => [
    "<div class=\"blocker\">",
    "<div><strong>" + esc(s.name) + "</strong><span class=\"mono\">SS " + esc(s.apiVersion) + "</span></div>",
    "<p>" + esc(accessLabel(s)) + " — " + esc(actionFor(s)) + "</p>",
    "</div>",
  ].join("")).join("")

  const html = [
    "<!DOCTYPE html>",
    "<html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">",
    "<title>SuiteMigrate Migration Readiness Report — " + esc(account.accountName) + "</title>",
    "<style>",
    ":root{--paper:#f8f6f0;--ink:#122236;--soft:#5f6670;--clay:#cd4f1f;--rule:#ded9cf;--green:#176c43;--amber:#9a5a08;--red:#a7372b}",
    "*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:14px/1.55 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}",
    ".page{max-width:1180px;margin:0 auto;padding:44px 42px 56px}.topline{height:6px;background:var(--clay);margin:-44px -42px 34px}",
    "h1{font-size:42px;line-height:1.04;font-weight:350;letter-spacing:-.035em;margin:0 0 8px}h2{font-size:19px;font-weight:600;margin:34px 0 12px}",
    ".eyebrow,.mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.eyebrow{text-transform:uppercase;letter-spacing:.16em;font-size:10px;color:var(--clay);font-weight:700}",
    ".lede{font-size:16px;color:var(--soft);max-width:760px;margin:0}.meta{margin-top:18px;color:var(--soft);font-size:12px}.meta strong{color:var(--ink)}",
    ".stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:28px 0}.stat{background:#fff;border:1px solid var(--rule);border-radius:8px;padding:17px}",
    ".stat b{display:block;font-size:30px;font-weight:500;letter-spacing:-.03em}.stat span{font-size:11px;color:var(--soft);text-transform:uppercase;letter-spacing:.08em}",
    ".callout{border:1px solid rgba(205,79,31,.32);background:rgba(205,79,31,.055);border-radius:8px;padding:16px 18px;margin:22px 0}.callout strong{color:var(--clay)}",
    ".blockers{display:grid;gap:8px}.blocker{background:#fff;border:1px solid var(--rule);border-left:4px solid var(--clay);border-radius:6px;padding:12px 14px}.blocker div{display:flex;justify-content:space-between;gap:12px}.blocker p{margin:5px 0 0;color:var(--soft);font-size:12px}",
    ".table-wrap{overflow-x:auto;border:1px solid var(--rule);border-radius:8px;background:#fff}table{width:100%;border-collapse:collapse;min-width:980px}",
    "th{padding:11px 12px;text-align:left;background:#f1eee7;color:var(--soft);font-size:10px;text-transform:uppercase;letter-spacing:.1em}",
    "td{padding:12px;border-top:1px solid #ece8df;vertical-align:top;font-size:12.5px}.sub{font-size:11px;color:var(--soft);margin-top:3px;max-width:300px}",
    ".pill{display:inline-block;padding:3px 7px;border-radius:999px;font-size:10px;font-weight:700;white-space:nowrap}",
    ".high,.block{background:#f8e4e0;color:var(--red)}.medium{background:#fff0d5;color:var(--amber)}.current,.ok{background:#e1f2e8;color:var(--green)}.neutral{background:#eceff2;color:#59616a}",
    ".next{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.step{background:#fff;border:1px solid var(--rule);border-radius:8px;padding:15px}.step b{display:block;margin-bottom:5px}.step p{margin:0;color:var(--soft);font-size:12px}",
    "footer{margin-top:34px;padding-top:18px;border-top:1px solid var(--rule);display:flex;justify-content:space-between;gap:20px;color:var(--soft);font-size:11px}",
    "@media(max-width:760px){.page{padding:28px 18px}.topline{margin:-28px -18px 26px}.stats,.next{grid-template-columns:1fr 1fr}h1{font-size:32px}}",
    "@media print{body{background:#fff}.page{max-width:none;padding:20px}.topline{margin:-20px -20px 24px}.table-wrap{overflow:visible}.stat,.blocker,.step{break-inside:avoid}}",
    "</style></head><body><main class=\"page\">",
    "<div class=\"topline\"></div><div class=\"eyebrow\">SuiteMigrate · Migration Readiness Report</div>",
    "<h1>Know what can migrate — and what is blocked.</h1>",
    "<p class=\"lede\">A read-only inventory of active SuiteScript visible to the current NetSuite role, with version-based migration priority, source-access status, and recommended next actions.</p>",
    "<div class=\"meta\">Account: <strong>" + esc(account.accountName) + "</strong> · ID: <span class=\"mono\">" + esc(account.accountId) + "</span> · Generated: " + esc(new Date().toLocaleString()) + "</div>",
    "<section class=\"stats\">",
    "<div class=\"stat\"><b>" + account.scripts.length + "</b><span>Active scripts</span></div>",
    "<div class=\"stat\"><b>" + needsUpdate.length + "</b><span>Need migration</span></div>",
    "<div class=\"stat\"><b>" + ready.length + "</b><span>Ready to work</span></div>",
    "<div class=\"stat\"><b>" + blockers.length + "</b><span>Migration blockers</span></div>",
    "</section>",
    "<div class=\"callout\"><strong>Protected source is a planning signal.</strong> A locked bundle object can still be readable, while vendor-hidden server source can be intentionally unavailable. SuiteMigrate does not bypass source protection; resolve protected items with the vendor/client or an authorized source copy.</div>",
    blockers.length ? "<h2>Blockers requiring action</h2><div class=\"blockers\">" + blockerRows + "</div>" : "",
    "<h2>Script inventory</h2><div class=\"table-wrap\"><table>",
    "<thead><tr><th>Script</th><th>Type</th><th>Version</th><th>Priority</th><th>Source access</th><th>Recommended action</th></tr></thead>",
    "<tbody>" + rows + "</tbody></table></div>",
    "<h2>Recommended migration sequence</h2><div class=\"next\">",
    "<div class=\"step\"><b>1 · Resolve blockers</b><p>Get authorized source, a vendor 2.1 release, or the correct NetSuite role before scheduling conversion work.</p></div>",
    "<div class=\"step\"><b>2 · Convert and review</b><p>Convert readable legacy scripts, inspect change notes/manual flags, and keep business logic under human review.</p></div>",
    "<div class=\"step\"><b>3 · Sandbox validation</b><p>Regression-test converted scripts and deployments in NetSuite Sandbox before any production change.</p></div>",
    "</div>",
    "<footer><span>Generated by SuiteMigrate · suitemigrate.vercel.app</span><span>Read-only inventory · Not affiliated with Oracle or NetSuite</span></footer>",
    "</main></body></html>",
  ].join("")

  const blob = new Blob([html], { type: "text/html" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "suitemigrate_readiness_" + account.accountId + "_" + Date.now() + ".html"
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadAllConversions(conversions: ConversionResult[]): void {
  if (!conversions.length) return
  conversions.forEach((conversion) => {
    setTimeout(() => downloadScript(conversion.scriptName, conversion.convertedCode), 100)
  })
}
