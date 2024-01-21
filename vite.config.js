import { fileURLToPath, URL } from 'node:url'
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: fileURLToPath(new URL('.env', import.meta.url)) });

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://adambabynames3.azurewebsites.net/api',  // Substitua pelo endereço do seu servidor
        changeOrigin: true,
        ws : true,
        rewrite: (path) => path.replace(/^\/api/, ''),

      }
    }
  }

})
