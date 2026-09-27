import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "path"
import { copyFileSync, mkdirSync, readdirSync } from "fs"

// Plugin: copy public/ files (manifest.json, icons/) into dist/ after build
function copyPublicFiles() {
  return {
    name: "copy-public-files",
    closeBundle() {
      // Copy manifest
      copyFileSync("public/manifest.json", "dist/manifest.json")
      // Copy icons
      mkdirSync("dist/icons", { recursive: true })
      readdirSync("public/icons").forEach((f) => {
        copyFileSync(`public/icons/${f}`, `dist/icons/${f}`)
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), copyPublicFiles()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup:      resolve(__dirname, "popup.html"),
        background: resolve(__dirname, "src/background/index.ts"),
        content:    resolve(__dirname, "src/content/index.ts"),
        website:    resolve(__dirname, "src/website/index.ts"),
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
