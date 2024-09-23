import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // ใช้ `true` เพื่อให้ Vite รับการเชื่อมต่อจาก IP ภายนอกได้
    port: 5173  // หรือพอร์ตที่คุณใช้งาน
  }
})
