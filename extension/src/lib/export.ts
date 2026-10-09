/**
 * Export helpers. All readiness report data is assembled locally from the
 * user's scanned NetSuite metadata; no source code or report is uploaded.
 */
import type { NSAccount, NSScript, ConversionResult } from "./types"

const escapeHtml = (value: unknown): string => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;")

/**
 * Append before clicking. Immediate URL revocation aborts downloads in some
 * Chrome extension popups; keep it alive long enough for the download to start.
 */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.style.display = "none"
  document.body.appendChild(link)
  link.click()
  const timer = setTimeout(() => {
    link.remove()
    URL.revokeObjectURL(url)
  }, 30_000)
  // Node test runner can exit without waiting on the delayed cleanup.
  if (typeof timer === "object" && timer && "unref" in timer) {
    (timer as unknown as { unref: () => void }).unref()
  }
}

export function downloadScript(scriptName: string, code: string, changeLog?: string[]): void {
  const safeName = scriptName.replace(/[^a-z0-9_-]/gi, "_").toLowerCase()
  const changed = changeLog?.length
    ? changeLog.map(item => " * - " + item).join("\n")
    : " * - Review inline migration comments and manual-review flags"
  const header = [
    "/**",
    " * SuiteMigrate — SuiteScript 2.1 Migration Draft",
    " * Original Script: " + scriptName,
    " * Converted: " + new Date().toLocaleString(),
    " *",
    " * WHAT CHANGED:",
    changed,
    " *",
    " * NEXT STEPS:",
    " * 1. Review migrated APIs and manual-review flags",
    " * 2. Test in NetSuite Sandbox",
    " * 3. Validate permissions, integrations, deployments and business logic",
    " * 4. Deploy only after your own approval",
    " */",
    "",
    "",
  ].join("\n")
  downloadBlob(new Blob([header, code], { type: "text/javascript;charset=utf-8" }), safeName + "_2.1.js")
}

function sourceStatus(script: NSScript): "ready" | "blocked" | "unknown" | "current" {
  if (!script.needsMigration) return "current"
  if (script.sourceAccess === "readable") return "ready"
  if (["no_file", "restricted", "protected", "manual"].includes(script.sourceAccess || "")) return "blocked"
  return "unknown"
}

function accessText(script: NSScript): string {
  switch (script.sourceAccess) {
    case "readable": return "Verified readable"
    case "restricted": return "Role restricted"
    case "protected": return "Protected / hidden"
    case "no_file": return "No source file"
    case "manual": return "Manual source required"
    default: return "Not yet verified"
  }
}

function recommendedAction(script: NSScript): string {
  if (!script.needsMigration) return "Already on SuiteScript 2.1; regression-test before a wider migration."
  if (script.sourceAccess === "readable") return "Convert, review changes, and validate in NetSuite Sandbox."
  if (script.sourceAccess === "restricted") return "Obtain authorized role access or request an authorized source copy."
  if (script.sourceAccess === "protected") return "Ask the vendor or owner for a supported 2.1 release or authorized source."
  if (script.sourceAccess === "no_file") return "Locate the missing script file before planning conversion."
  if (script.sourceAccess === "manual") return "Request an authorized source copy and review manually."
  return "Verify source access before scheduling a migration."
}

function scriptRow(script: NSScript): string {
  const status = sourceStatus(script)
  return `<tr>
    <td><strong>${escapeHtml(script.name)}</strong><small>${escapeHtml(script.description || "")}</small></td>
    <td>${escapeHtml(script.scriptType)}</td>
    <td><span class="code">SS ${escapeHtml(script.apiVersion)}</span></td>
    <td><span class="risk ${escapeHtml(script.riskLevel.toLowerCase())}">${escapeHtml(script.riskLevel)}</span></td>
    <td><span class="status ${status}">${escapeHtml(accessText(script))}</span></td>
    <td>${escapeHtml(recommendedAction(script))}</td>
  </tr>`
}

function section(title: string, subtitle: string, scripts: NSScript[], id: string, empty: string): string {
  return `<section id="${id}" class="report-section">
    <div class="section-heading">
      <div><p class="eyebrow">MIGRATION INVENTORY</p><h2>${title} <span class="section-count">${scripts.length}</span></h2>
      <p class="section-intro">${subtitle}</p></div>
    </div>
    ${scripts.length
      ? `<div class="table-scroll"><table><thead><tr><th>Script</th><th>Type</th><th>Version</th><th>Risk</th><th>Source access</th><th>Next action</th></tr></thead><tbody>${scripts.map(scriptRow).join("")}</tbody></table></div>`
      : `<div class="empty">${empty}</div>`}
  </section>`
}

export function buildReadinessReportHtml(account: NSAccount): string {
  const scripts = account.scripts || []
  const legacy = scripts.filter(s => s.needsMigration)
  const ready = legacy.filter(s => sourceStatus(s) === "ready")
  const blockers = legacy.filter(s => sourceStatus(s) === "blocked")
  const unknown = legacy.filter(s => sourceStatus(s) === "unknown")
  const current = scripts.filter(s => sourceStatus(s) === "current")
  const checked = legacy.length - unknown.length
  const complete = unknown.length === 0
  const date = new Date().toLocaleString()

  const safeAccountName = escapeHtml(account.accountName)
  const safeAccountId = escapeHtml(account.accountId)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>SuiteMigrate | Migration Readiness Report — ${safeAccountName}</title>
  <style>
    :root{color-scheme:light;--ink:#101a2e;--muted:#657186;--paper:#f5f4f0;--white:#fff;--rule:#e4e6e9;--accent:#dc5127;--green:#167751;--amber:#a66a16;--red:#a93840}
    *{box-sizing:border-box}
    html{scroll-behavior:smooth}
    body{margin:0;background:var(--paper);color:var(--ink);font:14px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}
    .page{max-width:1240px;margin:auto;background:var(--white);min-height:100vh;padding:0 44px 54px;border-left:1px solid var(--rule);border-right:1px solid var(--rule)}
    .topline{height:6px;background:linear-gradient(90deg,var(--accent),#e9a56f)}
    header{padding:30px 0 25px;border-bottom:1px solid var(--rule)}
    .brand{display:flex;align-items:center;gap:8px;font-size:18px;font-weight:700;letter-spacing:-.04em}
    .brand-dot{width:10px;height:10px;border-radius:50%;background:var(--accent)}
    .eyebrow{font:700 10px/1.4 ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:.17em;color:var(--accent);text-transform:uppercase;margin:0 0 8px}
    h1{font-size:clamp(30px,4.5vw,52px);line-height:1.06;letter-spacing:-.05em;font-weight:400;margin:30px 0 14px;max-width:850px}
    .lede{font-size:16px;color:var(--muted);max-width:830px;margin:0 0 23px}
    .header-actions{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
    .identity{font-size:12px;color:var(--muted)}.identity strong{color:var(--ink)}
    .print{appearance:none;border:1px solid var(--ink);border-radius:22px;background:var(--ink);color:#fff;padding:9px 17px;font:600 12px inherit;cursor:pointer}
    .metrics{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin:26px 0 16px}
    .metric{background:#fbfaf8;border:1px solid var(--rule);border-radius:9px;padding:15px 13px}
    .metric .num{font-size:33px;font-weight:400;letter-spacing:-.06em;line-height:1.1}
    .metric .label{display:block;font-size:10px;line-height:1.3;margin-top:7px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}
    .metric.warn .num{color:var(--amber)}.metric.good .num{color:var(--green)}.metric.bad .num{color:var(--red)}
    .progress{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:12px;color:var(--muted);margin:10px 0}
    .bar{height:7px;background:#edf0ef;border-radius:99px;overflow:hidden}
    .bar-inner{height:100%;width:${legacy.length ? Math.round(checked / legacy.length * 100) : 100}%;background:var(--green);border-radius:99px}
    .notice{padding:15px 18px;border:1px solid #eddec6;background:#fff9ef;border-radius:8px;margin:23px 0;color:#785622;font-size:12px}
    .notice strong{color:#65451b}
    nav{display:flex;flex-wrap:wrap;gap:8px;margin:26px 0 0}
    nav a{font-size:12px;text-decoration:none;color:var(--ink);background:#f7f7f7;border:1px solid var(--rule);border-radius:20px;padding:7px 11px}
    .report-section{margin:39px 0 0;scroll-margin-top:16px}
    .section-heading{display:flex;justify-content:space-between;gap:16px;align-items:end;margin-bottom:13px}
    h2{font-size:23px;font-weight:500;letter-spacing:-.035em;margin:0}
    .section-count{color:var(--muted);font:500 13px ui-monospace,SFMono-Regular,Consolas,monospace;margin-left:7px}
    .section-intro{margin:4px 0 0;color:var(--muted);font-size:12px}
    .table-scroll{overflow-x:auto;border:1px solid var(--rule);border-radius:9px}
    table{width:100%;border-collapse:collapse;min-width:1000px}
    th{background:#f7f8f7;text-align:left;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);padding:11px 12px}
    td{border-top:1px solid var(--rule);padding:12px;vertical-align:top;font-size:12px}
    td strong{display:block;font-weight:650;line-height:1.4;overflow-wrap:anywhere}
    td small{display:block;color:var(--muted);margin-top:4px;font-size:10px;max-width:260px;overflow-wrap:anywhere}
    .code{font:11px ui-monospace,SFMono-Regular,Consolas,monospace;white-space:nowrap}
    .status,.risk{display:inline-block;border-radius:5px;padding:4px 7px;font-size:10px;white-space:nowrap;font-weight:650}
    .status.ready,.risk.none{background:#e9f6ee;color:var(--green)}
    .status.blocked,.risk.high{background:#fbebeb;color:var(--red)}
    .status.unknown,.risk.medium{background:#fff4df;color:var(--amber)}
    .status.current,.risk.low{background:#f0f2f4;color:var(--muted)}
    .empty{border:1px dashed var(--rule);border-radius:8px;background:#fafafa;padding:25px;color:var(--muted);font-size:12px}
    .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:15px 0 0}
    .step{border:1px solid var(--rule);border-radius:8px;padding:16px;background:#fbfaf8}
    .step b{font-weight:650}.step p{margin:6px 0 0;color:var(--muted);font-size:12px}
    footer{display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;border-top:1px solid var(--rule);padding-top:17px;margin-top:40px;color:var(--muted);font-size:11px}
    @media(max-width:880px){.page{padding:0 20px 28px}.metrics{grid-template-columns:repeat(2,1fr)}.steps{grid-template-columns:1fr}}
    @media print{body{background:#fff}.page{max-width:none;padding:0 10px;border:0}.topline{height:4px}.print,nav{display:none}.metrics{grid-template-columns:repeat(5,1fr)}.report-section{break-before:auto}.metric,.step{break-inside:avoid}.table-scroll{overflow:visible}table{min-width:0}tr{break-inside:avoid}td,th{font-size:9px;padding:7px}.notice{background:#fff}footer{margin-top:20px}}
  </style>
</head>
<body><main class="page">
  <div class="topline"></div>
  <header>
    <div class="brand"><span class="brand-dot"></span>SuiteMigrate</div>
    <h1>Migration readiness.<br>Know what is blocked.</h1>
    <p class="lede">Read-only SuiteScript inventory, verified source-access checks, and recommended next actions for the NetSuite migration team.</p>
    <div class="header-actions">
      <div class="identity"><strong>${safeAccountName}</strong> · Account ${safeAccountId}<br>Generated ${escapeHtml(date)}</div>
      <button class="print" onclick="window.print()">Print / Save as PDF</button>
    </div>
  </header>

  <section class="metrics" aria-label="Migration overview">
    <div class="metric"><div class="num">${scripts.length}</div><span class="label">Active scripts</span></div>
    <div class="metric"><div class="num">${legacy.length}</div><span class="label">Need migration</span></div>
    <div class="metric good"><div class="num">${ready.length}</div><span class="label">Verified readable</span></div>
    <div class="metric bad"><div class="num">${blockers.length}</div><span class="label">Blocked source</span></div>
    <div class="metric warn"><div class="num">${unknown.length}</div><span class="label">Unverified</span></div>
  </section>

  <div class="progress"><span>Legacy-script source checks</span><strong>${checked} of ${legacy.length} classified</strong></div>
  <div class="bar" aria-hidden="true"><div class="bar-inner"></div></div>
  <div class="notice"><strong>${complete ? "Audit completed." : "Partial audit — some source remains unverified."}</strong>
    Source access is evaluated using the active NetSuite role. A locked bundle object may still have readable source;
    protected vendor code is not bypassed. Unknown and temporary errors are never assumed unlocked.
    Migration outputs always require human review and NetSuite Sandbox testing.
  </div>

  <nav aria-label="Report sections">
    <a href="#ready">Verified readable (${ready.length})</a>
    <a href="#blocked">Locked / blocked (${blockers.length})</a>
    <a href="#unverified">Unverified (${unknown.length})</a>
    <a href="#current">Already on 2.1 (${current.length})</a>
  </nav>

  ${section("Verified readable", "Source was confirmed readable under the scanning role. Review and test conversions before deployment.", ready, "ready", "No readable legacy source verified yet.")}
  ${section("Locked, restricted & missing source", "Requires an authorized source copy, permissions change, missing file, or vendor update.", blockers, "blocked", "No confirmed source blockers.")}
  ${section("Not yet verified", "Checks not completed or a transient error prevented a reliable classification.", unknown, "unverified", "Every legacy script with a file is classified.")}
  ${section("Already on SuiteScript 2.1", "Version status from your active script inventory; include these scripts in regression testing.", current, "current", "No scripts already on 2.1.")}

  <section class="report-section"><p class="eyebrow">RECOMMENDED NEXT STEPS</p><h2>From inventory to validated migration</h2>
    <div class="steps">
      <div class="step"><b>01 · Resolve blockers</b><p>Work with the account admin or vendor to obtain authorized source or a supported update.</p></div>
      <div class="step"><b>02 · Convert & review</b><p>Inspect generated code, API changes, and manual review flags. Keep original source available for comparison.</p></div>
      <div class="step"><b>03 · Validate in Sandbox</b><p>Test entry points, permissions, transactions and integrations. Deploy only after approval.</p></div>
    </div>
  </section>
  <footer><span>SuiteMigrate · Migration Readiness Report</span><span>Read-only inventory · Not affiliated with Oracle or NetSuite</span></footer>
</main></body></html>`
}

/**
 * Download from the extension service worker using chrome.downloads, rather
 * than a temporary blob owned by a popup that may close at any moment.
 * The HTML report stays on the device: it is never sent to our server.
 */
export async function downloadAuditReport(account: NSAccount): Promise<number> {
  const html = buildReadinessReportHtml(account)
  const safeId = account.accountId.replace(/[^a-z0-9_-]/gi, "_")
  const filename = `SuiteMigrate_Readiness_${safeId}_${new Date().toISOString().slice(0, 10)}.html`

  const response = await chrome.runtime.sendMessage({
    type: "DOWNLOAD_HTML_REPORT",
    filename,
    html,
  }) as { ok?: boolean; downloadId?: number; error?: string } | undefined

  if (!response?.ok || typeof response.downloadId !== "number") {
    throw new Error(response?.error || "Chrome could not start the report download. Check Downloads permission.")
  }

  return response.downloadId
}

export function downloadAllConversions(conversions: ConversionResult[]): void {
  for (const [index, conversion] of conversions.entries()) {
    setTimeout(() => downloadScript(conversion.scriptName, conversion.convertedCode), index * 350)
  }
}
