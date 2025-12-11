import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // hoặc '0.0.0.0'
    port: 5174,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'b4a59cce5b57.ngrok-free.app' // Thêm host ngrok của bạn vào đây
    ]
  }
})
