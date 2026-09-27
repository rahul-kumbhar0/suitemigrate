import { create } from "zustand"
import type { AuthUser, NSAccount, NSScript, ConversionResult, AppView } from "./types"

interface AppStore {
  // Auth
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void

  // Navigation
  view: AppView
  setView: (view: AppView) => void

  // Accounts
  accounts: NSAccount[]
  activeAccount: NSAccount | null
  setAccounts: (accounts: NSAccount[]) => void
  setActiveAccount: (account: NSAccount | null) => void

  // Scanning
  isScanning: boolean
  scanError: string | null
  setScanning: (v: boolean) => void
  setScanError: (e: string | null) => void

  // Script selection
  selectedScript: NSScript | null
  setSelectedScript: (script: NSScript | null) => void

  // Conversion
  isConverting: boolean
  conversionResult: ConversionResult | null
  conversionError: string | null
  setConverting: (v: boolean) => void
  setConversionResult: (r: ConversionResult | null) => void
  setConversionError: (e: string | null) => void

  // Conversions history
  conversions: ConversionResult[]
  addConversion: (r: ConversionResult) => void
}

export const useStore = create<AppStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  view: "loading",
  setView: (view) => set({ view }),

  accounts: [],
  activeAccount: null,
  setAccounts: (accounts) => set({ accounts }),
  setActiveAccount: (account) => set({ activeAccount: account }),

  isScanning: false,
  scanError: null,
  setScanning: (isScanning) => set({ isScanning }),
  setScanError: (scanError) => set({ scanError }),

  selectedScript: null,
  setSelectedScript: (selectedScript) => set({ selectedScript }),

  isConverting: false,
  conversionResult: null,
  conversionError: null,
  setConverting: (isConverting) => set({ isConverting }),
  setConversionResult: (conversionResult) => set({ conversionResult }),
  setConversionError: (conversionError) => set({ conversionError }),

  conversions: [],
  addConversion: (r) =>
    set((s) => ({ conversions: [r, ...s.conversions].slice(0, 50) })),
}))
