/**
 * Chrome extension storage helpers
 * Wraps chrome.storage.local with typed async API
 */

import type { AuthUser, NSAccount, ConversionResult } from "./types"

export interface ExtensionStorage {
  authToken?: string
  authUser?: AuthUser
  accounts?: Record<string, NSAccount>  // keyed by accountId
  conversions?: ConversionResult[]
  lastActiveAccount?: string
}

export async function getStorage<K extends keyof ExtensionStorage>(
  key: K
): Promise<ExtensionStorage[K] | undefined> {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, (result) => {
      resolve(result[key])
    })
  })
}

export async function setStorage<K extends keyof ExtensionStorage>(
  key: K,
  value: ExtensionStorage[K]
): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, resolve)
  })
}

export async function clearAuth(): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.remove(["authToken", "authUser"], resolve)
  })
}

export async function saveAccount(account: NSAccount): Promise<void> {
  const accounts = (await getStorage("accounts")) || {}
  accounts[account.accountId] = account
  await setStorage("accounts", accounts)
}

export async function saveConversion(result: ConversionResult): Promise<void> {
  const existing = (await getStorage("conversions")) || []
  const updated = [result, ...existing].slice(0, 100) // keep last 100
  await setStorage("conversions", updated)
}

export async function getAllAccounts(): Promise<NSAccount[]> {
  const accounts = (await getStorage("accounts")) || {}
  return Object.values(accounts)
}
