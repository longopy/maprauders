import { resolve } from "path";
import { defineConfig } from "vite";
import vitePluginFaviconsInject from "vite-plugin-favicons-inject";

export default defineConfig({
  build: {
    outDir: "build",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "./index.html"),
        space_port: resolve(__dirname, "./maps/space-port.html"),
      },
    },
  },
  assetsInclude: ["**/*.html"],
  server: {
    port: 8080,
    hot: true,
  },
  plugins: [vitePluginFaviconsInject("./favicon.ico")],
});
