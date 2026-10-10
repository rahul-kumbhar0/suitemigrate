import assert from "node:assert/strict"
import { modelCandidates, modelFailure, canTryAnotherModel, selectGeminiCredential } from "../lib/conversion-engine/model-routing.ts"

assert.deepEqual(modelCandidates({ NODE_ENV: "production" }), [
  "gemini-3.6-flash", "gemini-3.5-flash-lite", "gemini-3.1-flash-lite",
], "Supported stable model defaults should be used")
assert.deepEqual(modelCandidates({
  GEMINI_MODEL: "gemini-3.5-flash",
  GEMINI_FALLBACK_MODEL: "gemini-3.5-flash",
  GEMINI_SECOND_FALLBACK_MODEL: "gemini-3.1-flash-lite",
}), ["gemini-3.5-flash", "gemini-3.1-flash-lite"],
"Duplicate models should not cause duplicate generation")
assert.deepEqual(modelCandidates({
  NODE_ENV: "production",
  GEMINI_MODEL: "gemini-3-pro-preview",
  GEMINI_FALLBACK_MODEL: "gemini-3.5-flash",
  GEMINI_SECOND_FALLBACK_MODEL: "gemini-3.5-flash-lite",
}), ["gemini-3.5-flash", "gemini-3.5-flash-lite"],
"Preview models should not be used for production source automatically")
assert.equal(modelFailure({ status: 429, message: "resource exhausted" }), "capacity")
assert.equal(modelFailure(new Error("[429 Too Many Requests] Quota exceeded")), "capacity")
assert.equal(modelFailure({ status: 503 }), "transient")
assert.equal(modelFailure(new Error("Model gemini-sample not found (404)")), "not_found")
assert.equal(modelFailure({ status: 401 }), "credential")
assert.equal(modelFailure(new Error("API key not valid")), "credential")
assert.equal(modelFailure(new Error("Invalid JS source")), "other")
assert.equal(canTryAnotherModel("credential"), false)
assert.equal(canTryAnotherModel("other"), false)
assert.equal(canTryAnotherModel("capacity"), true)
assert.equal(canTryAnotherModel("not_found"), true)
assert.equal(canTryAnotherModel("transient"), true)
console.log("✓ Stable fallback models, invalid-model fallback, safe retries and credential fail-fast")

assert.deepEqual(selectGeminiCredential({ GEMINI_API_KEY: "older",
  GEMINI_API_KEY2: "replacement" }), {
  value: "replacement", variable: "GEMINI_API_KEY2",
}, "The newly configured Production key2 should be selected")

assert.deepEqual(selectGeminiCredential({ GEMINI_API_KEY: "older" }), {
  value: "older", variable: "GEMINI_API_KEY",
}, "Preview/rollback should keep using original key when key2 absent")

assert.equal(selectGeminiCredential({ GEMINI_API_KEY: " ",
  GEMINI_API_KEY2: "" }), null, "Empty credentials are not configured")
console.log("✓ Key2 selection does not depend on rotating keys per request")
