import { resolve } from "path";
import { defineConfig } from "vite";
import vitePluginFaviconsInject from "vite-plugin-favicons-inject";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  build: {
    outDir: "build",
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        penal_colony: resolve(__dirname, "maps/penal-colony.html"),
        attributions_en: resolve(__dirname, "en/attributions.html"),
        attributions_es: resolve(__dirname, "es/attributions.html"),
      },
    },
  },
  server: {
    port: 8080,
    hot: true,
  },
  plugins: [
    vitePluginFaviconsInject("./favicon.ico"),
    viteStaticCopy({
      targets: [
        {
          src: "./data",
          dest: "data",
        },
      ],
    }),
  ],
});
