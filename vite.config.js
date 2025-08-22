import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// const BASE_HOST = import.meta.env.VITE_APP_BASE_HOST || ;
// const BASE_PORT = import.meta.env.VITE_APP_BASE_PORT || ;

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: 'localhost',
    port: 5174,
  },
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
