import express from "express";
import { PrismaClient } from '@prisma/client';
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import interviewRoutes from "./routes/interviewRoutes";
import conversationRoutes from "./routes/conversationRoutes";

dotenv.config();

// 全局异常捕获
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

// ==================== CORS 配置 ====================
const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.31.81:5173",
  "https://ai-interview-assistant.vercel.app",
  "https://ai-interview-assistant.up.railway.app",
  "https://ai-interview-assistant-git-main-1348029974-7260s-projects.vercel.app"  // 添加这一行
];
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
};

// 使用 CORS 中间件（它会自动处理 OPTIONS 预检请求）
app.use(cors(corsOptions));
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
// ==================== 其他中间件 ====================
app.use(express.json());

// ==================== 路由 ====================
app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/conversations", conversationRoutes);

// 健康检查
app.get("/", (_req, res) => {
  res.send("Backend Running");
});
app.get('/health', (_req, res) => res.send('ok'));

// ==================== 启动服务器 ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});