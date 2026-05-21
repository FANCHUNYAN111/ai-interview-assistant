import { Router } from "express";

import prisma from "../lib/prisma.js";

import {
    authMiddleware,
    AuthRequest,
} from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", async (req: AuthRequest, res) => {
    try {
        const conversation =
            await prisma.conversation.create({
                data: {
                    title: "新的聊天",

                    userId: req.userId!,
                },
            });

        res.json(conversation);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "创建会话失败",
        });
    }
});

router.get("/", async (req: AuthRequest, res) => {
    try {
        const conversations =
            await prisma.conversation.findMany({
                where: {
                    userId: req.userId,
                },

                orderBy: {
                    createdAt: "desc",
                },
            });

        res.json(conversations);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "获取会话失败",
        });
    }
});

router.get(
    "/:id/messages",
    async (req: AuthRequest, res) => {
        try {
            const messages =
                await prisma.message.findMany({
                    where: {
                        conversationId: req.params.id as string,
                    },

                    orderBy: {
                        createdAt: "asc",
                    },
                });

            res.json(messages);
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "获取消息失败",
            });
        }
    }
);
router.delete(
    "/:id",
    async (req: AuthRequest, res) => {
        try {
            await prisma.message.deleteMany({
                where: {
                    conversationId: req.params.id as string,
                },
            });

            await prisma.conversation.delete({
                where: {
                    id: req.params.id as string,
                },
            });

            res.json({
                message: "删除成功",
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "删除失败",
            });
        }
    }
);
export default router;