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

let downloaded = false
let attached = false
let capturedBlob = null
const originalCreateObjectURL = URL.createObjectURL
const originalRevokeObjectURL = URL.revokeObjectURL
URL.createObjectURL = (blob) => { capturedBlob = blob; return "blob:readiness-test" }
URL.revokeObjectURL = () => {}
globalThis.document = {
  body: { appendChild(link) { attached = true; assert.equal(link.download.endsWith(".html"), true) } },
  createElement(tag) {
    assert.equal(tag, "a")
    return { style: {}, href: "", download: "", click() { downloaded = true }, remove() {} }
  },
}
downloadAuditReport(account)
assert.ok(attached && downloaded, "Download link must be attached and clicked")
assert.ok(capturedBlob, "Report must produce an HTML Blob")
assert.equal((await capturedBlob.text()).includes("Locked, restricted & missing source"), true)
URL.createObjectURL = originalCreateObjectURL
URL.revokeObjectURL = originalRevokeObjectURL
console.log("✓ Readiness HTML download is triggered without runtime exception")
