import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: resolve(__dirname, "src") }],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router") ||
              id.includes("@reduxjs/toolkit") ||
              id.includes("redux") ||
              id.includes("react-hook-form") ||
              id.includes("axios")
            ) {
              return "vendor-react";
            }
            return "vendor";
          }
        },
      },
    },
  },
});
