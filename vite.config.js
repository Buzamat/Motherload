import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? "/Motherload/" : "/",
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/pixi.js") || id.includes("node_modules/@pixi")) {
            return "pixi";
          }
        },
      },
    },
  },
});
