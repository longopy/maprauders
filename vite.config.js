import { resolve } from "path";
import { defineConfig } from "vite";
import vitePluginFaviconsInject from "vite-plugin-favicons-inject";

export default defineConfig({
  build: {
    outDir: "build",
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        space_port: resolve(__dirname, "maps/space-port.html"),
        asteroid_mine: resolve(__dirname, "maps/asteroid-mine.html"),
      },
    },
  },
  server: {
    port: 8080,
    hot: true,
  },
  plugins: [vitePluginFaviconsInject("favicon.ico")],
});
