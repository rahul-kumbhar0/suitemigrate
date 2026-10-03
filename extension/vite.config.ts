import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "path"
import { copyFileSync, mkdirSync, readdirSync, readFileSync } from "fs"

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

// ── Item 1: Fail the production build if localhost appears in the bundle ──
function failOnLocalhost() {
  return {
    name: "fail-on-localhost",
    closeBundle() {
      const mode = process.env.NODE_ENV || "production"
      if (mode !== "production") return

      const bundleFiles = ["dist/popup.js", "dist/background.js"]
      for (const file of bundleFiles) {
        try {
          const content = readFileSync(file, "utf-8")
          if (content.includes("localhost")) {
            throw new Error(
              `[fail-on-localhost] Production bundle "${file}" contains "localhost". ` +
              `Remove all hardcoded localhost references before building for production.`
            )
          }
        } catch (e: unknown) {
          if (e instanceof Error && e.message.includes("fail-on-localhost")) throw e
          // File doesn't exist yet — skip
        }
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), copyPublicFiles(), failOnLocalhost()],
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
