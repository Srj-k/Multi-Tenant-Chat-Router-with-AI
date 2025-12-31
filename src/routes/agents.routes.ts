import { Router, Request, Response } from "express";
import { mockAuth } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import prisma from "../db/prisma";

const router = Router();

// GET /api/agent/chats
// List conversations for agent's department

router.get(
  "/chats",
  mockAuth,
  requireRole("agent"),
  async (req: Request, res: Response) => {
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
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(chats);
  }
);

// GET /api/agent/chats/:conversationId
// Get messages of a conversation

router.get(
  "/chats/:conversationId",
  mockAuth,
  requireRole("agent"),
  async (req: Request, res: Response) => {
    const { conversationId } = req.params;

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        businessId: req.user!.businessId,
      },
      include: {
        messages: true,
      },
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    res.json(conversation);
  }
);

// POST /api/agent/chats/:conversationId/messages
// Agent sends a reply

router.post(
  "/chats/:conversationId/messages",
  mockAuth,
  requireRole("agent"),
  async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { conversationId } = req.params;
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ error: "Message content required" });
      }

      // Verify conversation belongs to agent's business
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
      });

      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      // Save agent message
      const message = await prisma.message.create({
        data: {
          conversationId,
          sender: "agent",
          content,
        },
      });

      return res.json(message);
    } catch (error) {
      console.error("Agent reply error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.patch(
  "/chats/:conversationId/close",
  mockAuth,
  requireRole("agent"),
  async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { conversationId } = req.params;

      // Ensure conversation belongs to agent's department
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          departmentId: req.user.departmentId,
        },
      });

      if (!conversation) {
        return res
          .status(404)
          .json({ error: "Conversation not found or access denied" });
      }

      // Update status
      const updatedConversation = await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          status: "closed",
        },
      });

      return res.json({
        message: "Conversation closed successfully",
        conversation: updatedConversation,
      });
    } catch (error) {
      console.error("Close conversation error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
