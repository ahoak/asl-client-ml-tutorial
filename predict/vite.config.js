import { glitchAssetsLoader } from "./vite/glitchAssetsLoader";
import vitePluginString from "vite-plugin-string";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    // HTML to string
    vitePluginString({
      include: ["**/*.html"],
      exclude: "node_modules/**",
      compress: false,
    }),
    vitePluginString({
      include: ["**/*.d.ts"],
      compress: false,
    }),
    glitchAssetsLoader(),
  ],
  build: {
    outDir: "build",
  },
  server: {
    strictPort: true,
    hmr: {
      port: 443, // Run the websocket server on the SSL port
    },
  },
});
