/**
 * Website content script — runs on localhost:3000 and suitemigrate.com
 * Listens for auth token from AuthBridge and saves to chrome.storage
 * This is the reliable way to get the token without race conditions
 */

// Listen for token broadcast from AuthBridge component
window.addEventListener("message", (event) => {
  if (event.source !== window) return
  if (event.data?.type !== "SUITEMIGRATE_AUTH_TOKEN") return

  const { token, expiresAt } = event.data
  if (!token) return

  // Save to chrome.storage so popup can read it instantly
  chrome.storage.local.set({
    authToken: token,
    authTokenExpiresAt: expiresAt,
  })
})

// On load, also try to read from sessionStorage (in case page already loaded)
function tryReadExistingToken() {
  try {
    const raw = sessionStorage.getItem("suitemigrate_token")
    if (!raw) return
    const parsed = JSON.parse(raw)
    if (!parsed?.token) return
    // Check not expired
    if (parsed.expiresAt && Date.now() / 1000 > parsed.expiresAt) return

    chrome.storage.local.set({
      authToken: parsed.token,
      authTokenExpiresAt: parsed.expiresAt,
    })
  } catch {
    // ignore
  }
}

// Small delay to let AuthBridge useEffect run first
setTimeout(tryReadExistingToken, 500)
setTimeout(tryReadExistingToken, 2000) // retry in case of slow load

export {}
