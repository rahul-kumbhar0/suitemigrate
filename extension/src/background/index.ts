/**
 * Background service worker (Manifest V3)
 */

const BASE_URL = import.meta.env.VITE_APP_URL || "https://suitemigrate.vercel.app"

type SessionPayload = {
  authenticated?: boolean
  id?: string
  email?: string
  name?: string | null
  plan?: "free" | "pro" | "annual" | "lifetime" | "team"
  conversionsUsed?: number
  conversionsRemaining?: number | null
  unlimited?: boolean
}

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.tabs.create({ url: `${BASE_URL}/signup?from=extension` })
  }
})

async function verifyAndStoreSession(
  accessToken: string,
  refreshToken: string,
  expiresAt: number | null
) {
  const res = await fetch(`${BASE_URL}/api/auth/session`, {
    method: "GET",
    credentials: "omit",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) {
    await chrome.storage.local.remove([
      "authToken",
      "authRefreshToken",
      "authExpiresAt",
      "authUser",
    ])
    return { ok: false, error: `session_verification_failed_${res.status}` }
  }

  const data = await res.json() as SessionPayload
  if (!data.authenticated || !data.id) {
    await chrome.storage.local.remove([
      "authToken",
      "authRefreshToken",
      "authExpiresAt",
      "authUser",
    ])
    return { ok: false, error: "invalid_verified_session" }
  }

  await chrome.storage.local.set({
    authToken: accessToken,
    authRefreshToken: refreshToken,
    authExpiresAt: expiresAt,
    authUser: {
      id: data.id,
      email: data.email ?? "",
      name: data.name ?? "",
      plan: data.plan ?? "free",
      conversionsUsed: data.conversionsUsed ?? 0,
      conversionsRemaining: data.conversionsRemaining ?? null,
      unlimited: data.unlimited ?? false,
    },
  })

  return { ok: true }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "AUTH_SESSION": {
      // Only the SuiteMigrate first-party website may hand a session to us.
      const senderUrl = sender.url || sender.tab?.url || ""
      if (!senderUrl.startsWith(BASE_URL)) {
        sendResponse({ ok: false, error: "untrusted_sender" })
        break
      }

      const accessToken = typeof message.accessToken === "string" ? message.accessToken : ""
      const refreshToken = typeof message.refreshToken === "string" ? message.refreshToken : ""
      const expiresAt = typeof message.expiresAt === "number" ? message.expiresAt : null

      if (!accessToken || !refreshToken) {
        sendResponse({ ok: false, error: "invalid_session" })
        break
      }

      // Do not tell the website "connected" until the backend has accepted the
      // token and the complete AuthUser has been stored for the popup.
      verifyAndStoreSession(accessToken, refreshToken, expiresAt)
        .then(sendResponse)
        .catch((err) => {
          console.error("[background] auth verification failed:", err)
          sendResponse({ ok: false, error: "session_verification_error" })
        })
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
