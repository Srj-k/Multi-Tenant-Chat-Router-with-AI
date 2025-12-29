import { Router, Request, Response } from "express";
import { mockAuth } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import prisma from "../db/prisma";

const router = Router();

router.get(
  "/conversations",
  mockAuth,
  requireRole("admin"),
  async (req: Request, res: Response) => {
    //Find all Conversations
    const chats = await prisma.conversation.findMany({
      where: {
        businessId: req.user!.businessId,
      },
    });

    res.json(chats);
  }
);

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

router.patch(
  "/conversations/:conversationId/reassign",
  mockAuth,
  requireRole("admin"),
  async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    const { departmentId } = req.body;

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { departmentId },
    });

    res.json({ success: true });
  }
);

export default router;
