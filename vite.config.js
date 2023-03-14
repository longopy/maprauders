import {defineConfig} from 'vite'
import vitePluginFaviconsInject from 'vite-plugin-favicons-inject';

export default defineConfig({
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 1600
  },
  server: {
    port: 8080,
    hot: true
  },
  plugins: [vitePluginFaviconsInject('./favicon.ico')]
})