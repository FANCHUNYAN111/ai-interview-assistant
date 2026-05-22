import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    cors: true,
    // host:'0.0.0.0',
    // 跨域代理配置
// https://ai-interview-assistant.up.railway.app/
    proxy: {
      "/base_api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/base_api/, ""),
      },

    },
  }
})
