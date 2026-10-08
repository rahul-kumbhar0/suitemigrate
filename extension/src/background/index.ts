/**
 * Background service worker (Manifest V3)
 */

const BASE_URL = import.meta.env.VITE_APP_URL || "https://suitemigrate.vercel.app"

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.tabs.create({ url: `${BASE_URL}/signup?from=extension` })
  }
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "AUTH_SESSION": {
      const senderUrl = sender.url || sender.tab?.url || ""
      if (!senderUrl.startsWith(BASE_URL)) {
        sendResponse({ ok: false, error: "untrusted_sender" })
        break
      }

      const accessToken = typeof message.accessToken === "string" ? message.accessToken : ""
      const refreshToken = typeof message.refreshToken === "string" ? message.refreshToken : ""
      const expiresAt = typeof message.expiresAt === "number" ? message.expiresAt : null
      const authUser = message.authUser

      if (!accessToken || !refreshToken || !authUser?.id) {
        sendResponse({ ok: false, error: "invalid_session" })
        break
      }

      chrome.storage.local.set(
        {
          authToken: accessToken,
          authRefreshToken: refreshToken,
          authExpiresAt: expiresAt,
          authUser,
        },
        () => {
          if (chrome.runtime.lastError) {
            sendResponse({ ok: false, error: "storage_write_failed" })
            return
          }
          sendResponse({ ok: true })
        }
      )
      return true
    }

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
      return true
    }

    default:
      sendResponse({ error: "Unknown message type" })
  }

  return true
})

export {}
