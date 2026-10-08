import assert from "node:assert/strict"
import { isNetSuiteUrl } from "../src/lib/netsuite-tab.ts"

for (const url of [
  "https://tstdrv2804638.app.netsuite.com/app/center/card.nl",
  "https://1234567.app.netsuite.com/app/common",
  "https://system.netsuite.com/pages",
  "https://netsuite.com/",
  "https://TSTDRV2804638.APP.NETSUITE.COM/app/center",
]) {
  assert.equal(isNetSuiteUrl(url), true, `Should recognize real NetSuite: ${url}`)
}

for (const url of [
  "https://netsuite.com.evil.test/",
  "https://fake-netsuite.com/",
  "https://example.com/",
  "http://tstdrv2804638.app.netsuite.com/",
  "chrome://extensions",
  "not a url",
  "",
  undefined,
]) {
  assert.equal(isNetSuiteUrl(url), false, `Should reject untrusted URL: ${url}`)
}

console.log("✓ NetSuite sandbox/prod tab validation and spoofed-host rejection")
