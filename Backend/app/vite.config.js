import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
    // Proxies relative /api/* calls to the FastAPI backend in dev, so the
    // frontend never needs to know the backend's host/port and can use the
    // same relative paths in dev and prod (where a reverse proxy/same-origin
    // deploy handles this instead). Override the target via VITE_API_PROXY_TARGET
    // if the backend isn't running on localhost:8000.
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
