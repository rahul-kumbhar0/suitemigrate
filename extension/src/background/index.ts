/**
 * Background service worker (Manifest V3)
 * Handles extension lifecycle, messaging, and alarms
 */

// Open welcome tab on first install
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    const appUrl = "http://localhost:3000" // replaced with prod URL at build time
    chrome.tabs.create({ url: `${appUrl}/signup?from=extension` })
  }
})

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  switch (message.type) {
    case "OPEN_WEBSITE": {
      const appUrl = "http://localhost:3000"
      chrome.tabs.create({ url: `${appUrl}${message.path || ""}` })
      sendResponse({ ok: true })
      break
    }

    case "GET_ACTIVE_TAB": {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        sendResponse({ tab: tabs[0] || null })
      })
      return true // async
    }

    case "SCAN_SCRIPTS": {
      // Inject scanner into the active NetSuite tab
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        const tab = tabs[0]
        if (!tab?.id) {
          sendResponse({ error: "No active tab" })
          return
        }

        try {
          const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              // Tell content script to start scan
              window.postMessage({ type: "SUITEMIGRATE_SCAN" }, "*")
              return true
            },
          })
          sendResponse({ ok: true, results })
        } catch (err) {
          sendResponse({ error: String(err) })
        }
      })
      return true // async
    }

    default:
      sendResponse({ error: "Unknown message type" })
  }

  return true
})

// Keep service worker alive with periodic alarm
chrome.alarms.create("keepalive", { periodInMinutes: 0.4 })
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "keepalive") {
    // no-op — just keeps SW alive
  }
})

export {}
