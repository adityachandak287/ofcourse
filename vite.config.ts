import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "node",
    include: ["src/**/*.{test,spec}.{ts,}"],
    coverage: {
      provider: "v8",
      enabled: true,
      reporter: ["text"],
      include: ["src/lib/gpa/**/*.ts"],
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://classes.cornell.edu",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\b/, "/api/2.0"),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
