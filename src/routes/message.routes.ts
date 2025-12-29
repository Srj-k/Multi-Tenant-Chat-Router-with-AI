import { Router, Request, Response } from "express";
import prisma from "../db/prisma";
import { routeMessage } from "../services/messageClassifier";

const router = Router();

// POST /api/messages
router.post("/", async (req: Request, res: Response) => {
  try {
    const { businessId, content, sender } = req.body;

    if (!businessId || !content || !sender) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // 1. Validate business
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }

    // 2. Find or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        businessId,
        status: "open",
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          businessId,
          status: "open",
        },
      });
    }

    // 3. Save message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        sender,
        content,
      },
    });

    // 4. Route message using AI
    const aiResult = await routeMessage(content);

    // 5. Update conversation
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        departmentId: aiResult.id,
        status: "in_progress",
      },
    });

    return res.status(200).json({
      conversationId: conversation.id,
      routedTo: aiResult.name,
    });
  } catch (err) {
    console.error("Message routing error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
