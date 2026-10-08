/**
 * First-party website -> extension auth bridge.
 *
 * Runs only on the SuiteMigrate website. The website posts the authenticated
 * session to the page; this isolated content script relays it to the extension
 * background worker. No NetSuite page can use this bridge.
 */

window.addEventListener("message", (event) => {
  if (event.source !== window || event.origin !== window.location.origin) return

  const data = event.data as {
    type?: string
    source?: string
    accessToken?: string
    refreshToken?: string
    expiresAt?: number | null
  } | null

  if (!data || data.type !== "SUITEMIGRATE_AUTH_SESSION" || data.source !== "suitemigrate-web") {
    return
  }

  if (!data.accessToken || !data.refreshToken) return

  chrome.runtime.sendMessage(
    {
      type: "AUTH_SESSION",
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresAt: data.expiresAt ?? null,
    },
    (response) => {
      window.postMessage(
        {
          type: "SUITEMIGRATE_AUTH_ACK",
          source: "suitemigrate-extension",
          ok: Boolean(response?.ok),
        },
        window.location.origin
      )
    }
  )
})
