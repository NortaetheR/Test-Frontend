import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.VITE_PORT) || 2374,
    host: process.env.VITE_HOST || '127.0.0.1'
  }
})

