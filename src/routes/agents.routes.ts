import { Router, Request, Response } from "express";
import { mockAuth } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import prisma from "../db/prisma";

const router = Router();

router.get(
  "/chats",
  mockAuth,
  requireRole("agent"),
  async (req: Request, res: Response) => {
    //Find Conversations of respective department
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const chats = await prisma.conversation.findMany({
      where: {
        departmentId: req.user.departmentId,
      },
      include: {
        messages: true,
      },
    });

    res.json(chats);
  }
);

router.get(
  "/chats/:conversationId",
  mockAuth,
  requireRole("agent"),
  async (req: Request, res: Response) => {
    const { conversationId } = req.params;

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });

    res.json(messages);
  }
);

router.post(
  "/chats/:conversationId/messages",
  mockAuth,
  requireRole("agent"),
  async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Message content required" });
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        sender: "agent",
        content,
      },
    });

    res.json(message);
  }
);

export default router;
