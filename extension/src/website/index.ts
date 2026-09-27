/**
 * Website content script — runs on suitemigrate.vercel.app + localhost:3000
 * Reads Supabase token from localStorage (written by AuthBridge)
 * and saves it to chrome.storage so the popup can use it.
 */

const STORAGE_KEY = "suitemigrate_auth"

function syncTokenFromPage() {
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

// Run immediately on script load
syncTokenFromPage()

// Also listen for postMessage (fired by AuthBridge after hydration)
window.addEventListener("message", (event) => {
  if (event.source !== window) return
  if (event.data?.type !== "SUITEMIGRATE_AUTH_TOKEN") return

  const { token, expiresAt } = event.data as { token: string; expiresAt: number }
  if (!token) return

  chrome.storage.local.set({
    authToken: token,
    authTokenExpiresAt: expiresAt,
  })
})

// Poll every 3 seconds for the first 15 seconds
// handles cases where AuthBridge fires before content script loads
let attempts = 0
const poll = setInterval(() => {
  attempts++
  const found = syncTokenFromPage()
  if (found || attempts >= 5) clearInterval(poll)
}, 3000)

export {}
