/**
 * Resolve the active NetSuite tab used for read-only SuiteScript scanning.
 *
 * Keep the hostname check strict: `netsuite.com.evil.test` is not NetSuite.
 * Avoid regex escaping pitfalls in generated extension bundles.
 */
export function isNetSuiteUrl(rawUrl: string | undefined | null): boolean {
  if (!rawUrl) return false
  try {
    const url = new URL(rawUrl)
    const host = url.hostname.toLowerCase().replace(/\.$/, "")
    return url.protocol === "https:" && (host === "netsuite.com" || host.endsWith(".netsuite.com"))
  } catch {
    return false
  }
}

/**
 * Chrome's currentWindow and lastFocusedWindow can differ when an extension
 * popup is opened from Chrome. Check both, but never inject into other sites.
 */
export async function getActiveNetSuiteTab(): Promise<chrome.tabs.Tab & { id: number }> {
  const [current] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (current?.id !== undefined && isNetSuiteUrl(current.url)) {
    return current as chrome.tabs.Tab & { id: number }
  }

  const [lastFocused] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
  if (lastFocused?.id !== undefined && isNetSuiteUrl(lastFocused.url)) {
    return lastFocused as chrome.tabs.Tab & { id: number }
  }

  throw new Error(
    "Open your NetSuite account tab in this Chrome window, then retry the source access check."
  )
}
