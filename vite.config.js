import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  root: "src",
  base: "/typescale/",
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: true,
    assetsDir: "assets",
    rollupOptions: {
      output: {
        entryFileNames: "assets/index-52XAjouG.js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) {
            return "assets/index-OkXB-BDf.css";
          }
          return "assets/[name][extname]";
        },
      },
    },
  },
});
