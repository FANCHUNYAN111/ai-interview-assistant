import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
// const API_BASE_URL = import.meta.env.DEV 
//   ? 'http://localhost:5000/api'   // 开发环境
//   : 'https://ai-interview-assistant.up.railway.app/api'; // 生产环境
// https://vite.dev/config/
export default defineConfig({

  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(
        __dirname,
        "./src"
      ),
    },
  },
  server: {
    cors: true,
    // host:'0.0.0.0',
    // 跨域代理配置
    // https://ai-interview-assistant.up.railway.app/
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
