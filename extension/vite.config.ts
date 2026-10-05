import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "path"
import { copyFileSync, mkdirSync, readdirSync, readFileSync, statSync } from "fs"

// ── Copy public/ files into dist/ after build ─────────────────────────────
function copyPublicFiles() {
  return {
    name: "copy-public-files",
    closeBundle() {
      copyFileSync("public/manifest.json", "dist/manifest.json")
      mkdirSync("dist/icons", { recursive: true })
      readdirSync("public/icons").forEach((f) => {
        copyFileSync(`public/icons/${f}`, `dist/icons/${f}`)
      })
    },
  }
}

// ── Chrome Web Store release guard ─────────────────────────────────────────
function storeReleaseGuard() {
  return {
    name: "store-release-guard",
    closeBundle() {
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
  plugins: [react(), copyPublicFiles(), storeReleaseGuard()],
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
        // content.js removed — Item 5: dead code eliminated
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
