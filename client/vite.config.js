import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // ถ้า backend เส้นทางขึ้นด้วย /api อยู่แล้ว ไม่ต้อง rewrite
        // ถ้าหลังบ้านไม่มี /api ให้ปลดคอมเมนต์บรรทัดนี้:
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
