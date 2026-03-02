import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import viteCompression from "vite-plugin-compression"

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    tailwindcss(),
    // Gzip compression
    viteCompression({
      algorithm: "gzip",
      threshold: 1024,
    }),
    // Brotli compression
    viteCompression({
      algorithm: "brotliCompress",
      threshold: 1024,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          animations: ["framer-motion"],
        },
      },
    },
  },
})