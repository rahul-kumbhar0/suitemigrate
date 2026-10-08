import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "path"
import { readdirSync, readFileSync, statSync } from "fs"

// ── Chrome Web Store release guard ─────────────────────────────────────────
function storeReleaseGuard() {
  return {
    name: "store-release-guard",
    writeBundle() {
      const mode = process.env.NODE_ENV || "production"
      if (mode !== "production") return

      const banned = [
        "localhost",
        "[OWNER TO CONFIRM]",
        "Migration Pass",
        "TESTPRO",
        "gemini-1.5-flash",
        "Priority conversion queue",
        "convert whole account at once",
      ]

      const files: string[] = []
      const walk = (dir: string) => {
        for (const name of readdirSync(dir)) {
          const path = `${dir}/${name}`
          if (statSync(path).isDirectory()) walk(path)
          else if (/\.(js|css|html|json)$/i.test(path)) files.push(path)
        }
      }
      walk("dist")

      for (const file of files) {
        const content = readFileSync(file, "utf-8")
        for (const token of banned) {
          if (content.includes(token)) {
            throw new Error(`[store-release-guard] "${file}" contains banned release text: ${token}`)
          }
        }
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), storeReleaseGuard()],
  define: {
    // Expose the build-time APP_URL so background.ts / auth.ts can import.meta.env.VITE_APP_URL
    // Falls back to production URL — never localhost in production builds
    "import.meta.env.VITE_APP_URL": JSON.stringify(
      process.env.VITE_APP_URL || "https://suitemigrate.vercel.app"
    ),
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup:      resolve(__dirname, "popup.html"),
        background: resolve(__dirname, "src/background/index.ts"),
        authBridge: resolve(__dirname, "src/content/auth-bridge.ts"),
        // General NetSuite content.js remains removed; the auth bridge runs only on our own website.
        // The popup uses scripting.executeScript for inline scanning instead
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
})
