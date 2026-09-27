/**
 * Content script — runs on NetSuite pages
 * Handles scan requests from the popup and relays results
 */

import { scanScripts, detectAccountId, detectAccountName, fetchScriptCode } from "../lib/suiteql"

// Listen for scan requests from popup (via background)
window.addEventListener("message", async (event) => {
  if (event.source !== window) return
  if (event.data?.type !== "SUITEMIGRATE_SCAN") return

  try {
    const accountId = detectAccountId()
    const accountName = detectAccountName()

    if (!accountId) {
      chrome.runtime.sendMessage({
        type: "SCAN_RESULT",
        error: "Could not detect NetSuite account ID",
      })
      return
    }

    const scripts = await scanScripts()

    chrome.runtime.sendMessage({
      type: "SCAN_RESULT",
      data: {
        accountId,
        accountName,
        scripts,
        scannedAt: new Date().toISOString(),
      },
    })
  } catch (err) {
    chrome.runtime.sendMessage({
      type: "SCAN_RESULT",
      error: err instanceof Error ? err.message : "Scan failed",
    })
  }
})

// Listen for fetch script code requests
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "FETCH_SCRIPT_CODE") {
    fetchScriptCode(message.scriptId)
      .then((code) => sendResponse({ code }))
      .catch((err) => sendResponse({ error: String(err) }))
    return true // async
  }
})

// Signal to background that content script is ready
chrome.runtime.sendMessage({ type: "CONTENT_READY", url: window.location.href })

export {}
