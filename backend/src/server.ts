import express from "express";
import { PrismaClient } from '@prisma/client';
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import interviewRoutes from "./routes/interviewRoutes";
import conversationRoutes from "./routes/conversationRoutes";

dotenv.config();

// 全局异常捕获（帮助调试）
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// 数据库连接测试
const prisma = new PrismaClient();
async function testDbConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (err) {
    console.error('❌ FATAL: Cannot connect to database:', err);
    process.exit(1);
  }
}
testDbConnection();

console.log("JWT:", process.env.JWT_SECRET);
console.log("GROQ:", process.env.GROQ_API_KEY);
console.log("DATABASE:", process.env.DATABASE_URL);

const app = express();

// ==================== CORS 完整配置 ====================
// 允许的前端域名列表
const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-interview-assistant.vercel.app",
  "https://ai-interview-assistant.up.railway.app",
  // 如果你还有其他的前端域名（比如 Railway 前端服务），请一并添加
];

// 动态判断 origin 是否允许
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // 允许无 origin 的请求（如 Postman 或服务器间调用）
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,            // 允许携带 cookie / Authorization 头
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // 明确允许 OPTIONS 预检
  allowedHeaders: ['Content-Type', 'Authorization'],     // 前端实际用到的头
  exposedHeaders: ['Content-Length', 'X-Request-Id'],    // 如需暴露额外头可添加
  maxAge: 86400,                // 预检结果缓存 24 小时，减少 OPTIONS 请求
};

// 全局使用 CORS 中间件
app.use(cors(corsOptions));

// 显式处理所有 OPTIONS 请求（预检），确保返回 204 和 CORS 头
app.options('*', cors(corsOptions));

// ==================== 其他中间件 ====================
app.use(express.json());

// ==================== 路由 ====================
app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/conversations", conversationRoutes);

// 健康检查及根路径
app.get("/", (_req, res) => {
  res.send("Backend Running");
});
app.get('/health', (_req, res) => res.send('ok'));

// ==================== 启动服务器 ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});