import { resolve } from "path";
import { defineConfig, normalizePath } from 'vite';
import vitePluginFaviconsInject from "vite-plugin-favicons-inject";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  build: {
    outDir: "build",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        en: resolve(__dirname, "en/index.html"),
        es: resolve(__dirname, "es/index.html"),
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
          src: normalizePath(resolve(__dirname, "./data") + '/[!.]*'),
          dest: "./data",
        },
      ],
    }),
  ],
});
