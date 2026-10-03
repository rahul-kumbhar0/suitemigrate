/**
 * Background service worker (Manifest V3)
 * Item 1: BASE_URL from env — no hardcoded localhost in production
 * Item 5: alarms keepalive removed; "alarms" permission dropped from manifest
 * Item 5: content.js SCAN_SCRIPTS / CONTENT_READY dead code removed
 */

// Single source of truth — set at build time via VITE_APP_URL
// Defaults to production URL so the build fails fast if localhost sneaks in
const BASE_URL = import.meta.env.VITE_APP_URL || "https://suitemigrate.vercel.app"

// Open welcome tab on first install
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.tabs.create({ url: `${BASE_URL}/signup?from=extension` })
  }
})

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  switch (message.type) {

    case "OPEN_WEBSITE": {
      const path: string = message.path || ""
      chrome.tabs.create({ url: `${BASE_URL}${path}` })
      sendResponse({ ok: true })
      break
    }

    case "GET_ACTIVE_TAB": {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        sendResponse({ tab: tabs[0] ?? null })
      })
      return true // async
    }

    default:
      sendResponse({ error: "Unknown message type" })
  }

  return true
})

export {}
