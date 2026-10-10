import assert from "node:assert/strict"
import { getSourceGroup } from "../src/lib/source-status.ts"

const fixture = { id: "1", name: "Sample", scriptType: "UserEvent",
  apiVersion: "1.0", riskLevel: "HIGH", needsMigration: true }

for (const status of ["protected", "restricted", "no_file", "manual"]) {
  assert.equal(getSourceGroup({ ...fixture, sourceAccess: status }), "locked", status)
}
assert.equal(getSourceGroup({ ...fixture, sourceAccess: "readable" }), "unlocked")
assert.equal(getSourceGroup({ ...fixture, sourceAccess: "unknown" }), "checking")
assert.equal(getSourceGroup({ ...fixture }), "checking")
assert.equal(getSourceGroup({ ...fixture, apiVersion: "2.1", needsMigration: false,
  sourceAccess: "protected" }), "current")
console.log("✓ Locked and Unlocked classification, with unverified kept separate")
