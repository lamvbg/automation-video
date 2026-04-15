import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // base './' required for Electron file:// protocol in production
  base: './',
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/downloads': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/browser-api': {
        target: 'http://127.0.0.1:19995',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/browser-api/, ''),
      },
    },
  },
})
