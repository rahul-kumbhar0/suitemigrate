import assert from "node:assert/strict"
import { buildReadinessReportHtml, downloadAuditReport } from "../src/lib/export.ts"

const account = {
  accountId: "TSTDRV123",
  accountName: "Test <Client> & Co",
  lastScannedAt: new Date().toISOString(),
  scriptsTotal: 5,
  scriptsNeedingUpdate: 4,
  scripts: [
    { id: "1", name: "Readable <script>", scriptType: "UserEvent", apiVersion: "1.0", riskLevel: "HIGH", needsMigration: true, hasFile: true, sourceAccess: "readable" },
    { id: "2", name: "Vendor-locked", scriptType: "RESTlet", apiVersion: "1.0", riskLevel: "HIGH", needsMigration: true, hasFile: true, sourceAccess: "protected" },
    { id: "3", name: "Role restricted", scriptType: "ClientScript", apiVersion: "2.0", riskLevel: "MEDIUM", needsMigration: true, hasFile: true, sourceAccess: "restricted" },
    { id: "4", name: "Not verified", scriptType: "ScheduledScript", apiVersion: "2.0", riskLevel: "MEDIUM", needsMigration: true, hasFile: true, sourceAccess: "unknown" },
    { id: "5", name: "Already 2.1", scriptType: "Suitelet", apiVersion: "2.1", riskLevel: "NONE", needsMigration: false, hasFile: true, sourceAccess: "unknown" },
  ],
}
const html = buildReadinessReportHtml(account)
for (const fragment of ["Verified readable", "Locked, restricted & missing source",
   "Not yet verified", "Already on SuiteScript 2.1",
   "Print / Save as PDF", "3 of 4", "Partial audit",
   "Vendor-locked", "Role restricted"]) {
  assert.ok(html.includes(fragment), `Expected report fragment: ${fragment}`)
}
assert.ok(html.includes("Test &lt;Client&gt; &amp; Co"), "Account name must be escaped")
assert.ok(html.includes("Readable &lt;script&gt;"), "Script names must be escaped")
assert.ok(!html.includes("Test <Client>"), "Raw HTML must not be injected into the report")
assert.ok(html.includes("id=\"blocked\""), "Blocked section must be linkable")
console.log("✓ Report categories, partial status, safe HTML, and Print/PDF design")

let payload = null
globalThis.chrome = {
  runtime: {
    sendMessage: async (message) => {
      payload = message
      return { ok: true, downloadId: 42 }
    },
  },
}
const id = await downloadAuditReport(account)
assert.equal(id, 42, "Download should return Chrome download ID")
assert.equal(payload.type, "DOWNLOAD_HTML_REPORT")
assert.equal(payload.filename.endsWith(".html"), true)
assert.ok(payload.html.includes("Locked, restricted & missing source"))
console.log("✓ Report is handed to background Chrome downloads handler")

globalThis.chrome.runtime.sendMessage = async () =>
  ({ ok: false, error: "Chrome download blocked" })
await assert.rejects(() => downloadAuditReport(account), /Chrome download blocked/)
console.log("✓ Chrome download failures are shown, not silently swallowed")
