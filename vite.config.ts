import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    Components({
      dts: true,
    }),
    AutoImport({
      imports: ['vue', '@vueuse/core', 'vee-validate', 'vue-router'],
      dts: 'src/auto-imports.d.ts',
      vueTemplate: true,
    }),
  ],
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    host: true,
    port: 8080,
    watch: {
      usePolling: true,
    },
  },
  build: {
    chunkSizeWarningLimit: 10000,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
