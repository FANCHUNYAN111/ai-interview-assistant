import { Router } from "express";

import Groq from "groq-sdk";

import prisma from "../lib/prisma";

import {
  authMiddleware,
  AuthRequest,
} from "../middleware/authMiddleware";

const router = Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post(
  "/",
  authMiddleware,
  async (req: AuthRequest, res) => {
    try {
      const { job, conversationId } =
        req.body;

      // 1. 保存用户消息
      await prisma.message.create({
        data: {
          role: "user",

          content: job,

          conversationId,
        },
      });
      const conversation =
        await prisma.conversation.findUnique({
          where: {
            id: conversationId,
          },
        });

      if (
        conversation &&
        conversation.title === "新的聊天"
      ) {
        await prisma.conversation.update({
          where: {
            id: conversationId,
          },

          data: {
            title:
              job.length > 20
                ? job.slice(0, 20) + "..."
                : job,
          },
        });
      }
      // 2. 调用 AI
      const completion =
        await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",

          messages: [
            {
              role: "user",
              content: `
请针对 ${job} 岗位：

1. 生成 5 道面试题
2. 给出回答建议
3. 返回中文
`,
            },
          ],
        });

      // 3. 获取 AI 回复
      const aiReply =
        completion.choices[0].message.content ||
        "";

      // 4. 保存 AI 回复
      await prisma.message.create({
        data: {
          role: "assistant",

          content: aiReply,

          conversationId,
        },
      });

      // 5. 返回前端
      res.json({
        reply: aiReply,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "AI 请求失败",
      });
    }
  }
);

export default router;