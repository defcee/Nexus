import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
    },
  },

  // ============================================
  // DEV SERVER ONLY (LOCAL DEVELOPMENT)
  // ============================================

  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,

    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        secure: false,
        ws: true,

        configure: (proxy) => {
          proxy.on("error", (err) => {
            console.error("❌ Vite Proxy Error", err);
          });
        },
      },
    },
  },

  // ============================================
  // PREVIEW SERVER (OPTIONAL LOCAL TEST)
  // ============================================

  preview: {
    host: "0.0.0.0",
    port: 4173,
    strictPort: true,
  },

  // ============================================
  // BUILD SETTINGS (CPanel READY)
  // ============================================

  build: {
    outDir: "dist/spa",
    emptyOutDir: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
        },
      },
    },
  },
});