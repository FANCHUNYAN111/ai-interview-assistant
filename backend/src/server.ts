import express from "express";

import cors from "cors";

import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";

import interviewRoutes from "./routes/interviewRoutes";

import conversationRoutes from "./routes/conversationRoutes";

dotenv.config();

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

app.get("/", (req, res) => {
  res.send("Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});