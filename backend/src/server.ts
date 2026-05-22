import express from "express";
import { PrismaClient } from '@prisma/client';
import cors from "cors";

import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";

import interviewRoutes from "./routes/interviewRoutes";

import conversationRoutes from "./routes/conversationRoutes";

dotenv.config();
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1); // 让 Railway 记录错误后重启
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
// 测试数据库连接
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

console.log(
  "GROQ:",
  process.env.GROQ_API_KEY
);

console.log(
  "DATABASE:",
  process.env.DATABASE_URL
);
const app = express();

/**
 * 中间件
 */

// 先 cors
app.use(
  cors({
    origin: [
      "http://localhost:5173",

      "https://ai-interview-assistant.vercel.app",
    ],

    credentials: true,
  })
);

// 再 json
app.use(express.json());

/**
 * 路由
 */

app.use("/api/auth", authRoutes);

app.use("/api/interview", interviewRoutes);

app.use(
  "/api/conversations",
  conversationRoutes
);

/**
 * 测试接口
 */

app.get("/", (_req, res) => {
  res.send("Backend Running");
});
app.get('/health', (req, res) => res.send('ok'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});
