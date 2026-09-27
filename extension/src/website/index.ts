/**
 * Website content script — runs on suitemigrate.vercel.app + localhost:3000
 * Syncs auth token between website localStorage and chrome.storage.
 * Handles both login and logout in both directions.
 */

const STORAGE_KEY = "suitemigrate_auth"

function syncTokenFromPage(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return false

    const parsed = JSON.parse(raw) as { token: string; expiresAt: number }
    if (!parsed?.token) return false

    // Skip if expired
    if (parsed.expiresAt && Date.now() / 1000 > parsed.expiresAt) {
      localStorage.removeItem(STORAGE_KEY)
      chrome.storage.local.remove(["authToken", "authTokenExpiresAt"])
      return false
    }

    chrome.storage.local.set({
      authToken: parsed.token,
      authTokenExpiresAt: parsed.expiresAt,
    })
    return true
  } catch {
    return false
  }
}

function clearExtensionAuth() {
  chrome.storage.local.remove(["authToken", "authTokenExpiresAt", "authUser"])
}

// Run immediately on script load
syncTokenFromPage()

// Listen for messages from AuthBridge
window.addEventListener("message", (event) => {
  if (event.source !== window) return

  // Token received — save to chrome.storage
  if (event.data?.type === "SUITEMIGRATE_AUTH_TOKEN") {
    const { token, expiresAt } = event.data as { token: string; expiresAt: number }
    if (!token) return
    chrome.storage.local.set({
      authToken: token,
      authTokenExpiresAt: expiresAt,
    })
    return
  }

  // Logout from website — clear chrome.storage
  if (event.data?.type === "SUITEMIGRATE_AUTH_LOGOUT") {
    clearExtensionAuth()
    return
  }
})

// Listen for logout request FROM extension
// Extension sends this message to tell the website tab to sign out
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "SUITEMIGRATE_SIGNOUT") {
    // Clear localStorage
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
    // Tell the page to sign out via Supabase
    window.postMessage({ type: "SUITEMIGRATE_DO_SIGNOUT" }, "*")
    clearExtensionAuth()
  }
})

// Poll for 15 seconds on load (handles slow page hydration)
let attempts = 0
const poll = setInterval(() => {
  attempts++
  const found = syncTokenFromPage()
  if (found || attempts >= 5) clearInterval(poll)
}, 3000)

export {}
