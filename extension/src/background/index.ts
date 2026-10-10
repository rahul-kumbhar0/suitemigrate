import { startSourceAudit, pauseSourceAudit, resumeRunningAudits, AUDIT_ALARM } from "./access-scanner"
/**
 * Background service worker (Manifest V3)
 */

const BASE_URL = import.meta.env.VITE_APP_URL || "https://suitemigrate.vercel.app"

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.tabs.create({ url: `${BASE_URL}/signup?from=extension` })
  }
})

// Chrome alarms wake the MV3 worker between batches, without requiring
// the popup to stay open during a large NetSuite inventory check.
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === AUDIT_ALARM) void resumeRunningAudits().catch(console.error)
})
chrome.runtime.onStartup.addListener(() => {
  void resumeRunningAudits().catch(console.error)
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "DOWNLOAD_LOCAL_FILE": {
      // Generic user-requested export for converted .js and inventory .csv.
      // The bytes never leave Chrome, and the sender must be our popup.
      const trusted = sender.id === chrome.runtime.id &&
        (sender.url || "").startsWith(`chrome-extension://${chrome.runtime.id}/`)
      const filename = typeof message.filename === "string" ? message.filename : ""
      const contents = typeof message.contents === "string" ? message.contents : ""
      const format = typeof message.format === "string" ? message.format : ""
      const validName = format === "js"
        ? /^[A-Za-z0-9_-]{1,100}_2\.1\.js$/.test(filename)
        : format === "csv"
        ? /^SuiteMigrate_Inventory_[A-Za-z0-9_-]+_\d{4}-\d{2}-\d{2}\.csv$/.test(filename)
        : false
      if (!trusted || !validName || !contents ||
          new TextEncoder().encode(contents).length > 2_500_000) {
        sendResponse({ ok: false, error: "Local export request was invalid or too large." })
        break
      }

      const mime = format === "csv" ? "text/csv" : "text/javascript"
      chrome.downloads.download({
        url: `data:${mime};charset=utf-8,${encodeURIComponent(contents)}`,
        filename,
        conflictAction: "uniquify",
        saveAs: false,
      }, (downloadId) => {
        const err = chrome.runtime.lastError
        sendResponse(err || typeof downloadId !== "number"
          ? { ok: false, error: err?.message || "Chrome rejected the download." }
          : { ok: true, downloadId })
      })
      return true
    }

    case "DOWNLOAD_HTML_REPORT": {
      // Reports are initiated only by our own extension UI; never accept
      // arbitrary download payloads sent from the NetSuite tab or web bridge.
      const fromOwnExtension = sender.id === chrome.runtime.id &&
        (sender.url || "").startsWith(`chrome-extension://${chrome.runtime.id}/`)
      const html = typeof message.html === "string" ? message.html : ""
      const filename = typeof message.filename === "string" ? message.filename : ""
      if (!fromOwnExtension || !html.startsWith("<!DOCTYPE html>") ||
          html.length > 8_000_000 ||
          !/^SuiteMigrate_Readiness_[a-zA-Z0-9_-]+_\d{4}-\d{2}-\d{2}\.html$/.test(filename)) {
        sendResponse({ ok: false, error: "Report download request was invalid." })
        break
      }

      // data: URL is owned by the downloads subsystem, not a transient popup
      // Blob URL. Chrome can continue saving after the extension popup closes.
      chrome.downloads.download({
        url: "data:text/html;charset=utf-8," + encodeURIComponent(html),
        filename,
        conflictAction: "uniquify",
        saveAs: false,
      }, (downloadId) => {
        const error = chrome.runtime.lastError
        if (error || typeof downloadId !== "number") {
          sendResponse({ ok: false, error: error?.message || "Chrome rejected the report download." })
        } else {
          sendResponse({ ok: true, downloadId })
        }
      })
      return true
    }

    case "START_SOURCE_AUDIT": {
      const accountId = typeof message.accountId === "string" ? message.accountId : ""
      const tabId = typeof message.tabId === "number" ? message.tabId : NaN
      if (!accountId || !Number.isInteger(tabId)) {
        sendResponse({ ok: false, error: "invalid_scan_request" })
        break
      }
      // Caller begins the scan from a user-selected NetSuite tab. Never send
      // any script source to the website or an external AI API during audit.
      void startSourceAudit(accountId, tabId)
      sendResponse({ ok: true })
      break
    }
    case "PAUSE_SOURCE_AUDIT": {
      if (typeof message.accountId === "string") {
        pauseSourceAudit(message.accountId)
          .then(() => sendResponse({ ok: true }))
          .catch(() => sendResponse({ ok: false }))
        return true
      } else {
        sendResponse({ ok: false })
      }
      break
    }

    case "AUTH_SESSION": {
      const senderUrl = sender.url || sender.tab?.url || ""
      // Exact origin comparison prevents lookalike hosts such as
      // suitemigrate.vercel.app.attacker.example from passing this check.
      let trusted = false
      try {
        trusted = new URL(senderUrl).origin === new URL(BASE_URL).origin
      } catch { /* Invalid or absent sender URL. */ }
      if (!trusted) {
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
