// Se optar por proxy via rewrites, prefira chamar /api/... no cliente e dispense VITE_API_URL nesses fluxos.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const API_URL = process.env.API_URL ? process.env.API_URL.replace(/\/+$/, '') : ''

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: API_URL
    ? {
        proxy: {
          '/api': {
            target: API_URL,
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
          },
        },
      }
    : undefined,
})
