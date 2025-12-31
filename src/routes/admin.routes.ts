import { Router, Request, Response } from "express";
import { mockAuth } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import prisma from "../db/prisma";

const router = Router();

// GET /api/admin/conversations
// List all conversations for the business

router.get(
  "/conversations",
  mockAuth,
  requireRole("admin"),
  async (req: Request, res: Response) => {
    const chats = await prisma.conversation.findMany({
      where: {
        businessId: req.user!.businessId,
      },
      include: {
        department: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform response
    const formattedChats = chats.map((chat) => ({
      id: chat.id,
      status: chat.status,
      createdAt: chat.createdAt,
      department: chat.department?.name ?? "Unknown",
    }));

    res.json(formattedChats);
  }
);

// GET /api/admin/conversations/:conversationId
// Get full conversation with messages

router.get(
  "/conversations/:conversationId",
  mockAuth,
  requireRole("admin"),
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

// GET /api/admin/agents

router.get(
  "/agents",
  mockAuth,
  requireRole("admin"),
  async (req: Request, res: Response) => {
    const agents = await prisma.user.findMany({
      where: {
        businessId: req.user!.businessId,
        role: "agent",
      },
      select: {
        id: true,
        name: true,
        email: true,
        departmentId: true,
      },
    });

    res.json(agents);
  }
);

// GET /api/admin/departments

router.get(
  "/departments",
  mockAuth,
  requireRole("admin"),
  async (req: Request, res: Response) => {
    const departments = await prisma.department.findMany({
      where: {
        businessId: req.user!.businessId,
      },
      include: {
        _count: {
          select: {
            chats: true,
          },
        },
      },
    });

    res.json(departments);
  }
);

export default router;
