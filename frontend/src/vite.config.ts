// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // No production source maps — they publish readable original source.
  build: { outDir: "dist", sourcemap: false },
});
