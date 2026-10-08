/**
 * First-party website -> extension auth bridge.
 *
 * Runs only on the SuiteMigrate website. The website posts its already
 * authenticated session/user snapshot to the page; this isolated content
 * script relays it to the extension background worker.
 */

window.addEventListener("message", (event) => {
  if (event.source !== window || event.origin !== window.location.origin) return

  const data = event.data as {
    type?: string
    source?: string
    accessToken?: string
    refreshToken?: string
    expiresAt?: number | null
    authUser?: {
      id?: string
      email?: string
      name?: string | null
      plan?: string
      conversionsUsed?: number
      conversionsRemaining?: number | null
      unlimited?: boolean
    }
  } | null

  if (!data || data.type !== "SUITEMIGRATE_AUTH_SESSION" || data.source !== "suitemigrate-web") {
    return
  }

  if (!data.accessToken || !data.refreshToken || !data.authUser?.id) return

  chrome.runtime.sendMessage(
    {
      type: "AUTH_SESSION",
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresAt: data.expiresAt ?? null,
      authUser: data.authUser,
    },
    (response) => {
      window.postMessage(
        {
          type: "SUITEMIGRATE_AUTH_ACK",
          source: "suitemigrate-extension",
          ok: Boolean(response?.ok),
          error: response?.error || null,
        },
        window.location.origin
      )
    }
  )
})
