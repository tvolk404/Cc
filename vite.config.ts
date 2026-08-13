import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Static SPA build. `base: "./"` keeps asset paths relative so the
// production build can be hosted from any sub-path (Pages, S3, etc.).
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
