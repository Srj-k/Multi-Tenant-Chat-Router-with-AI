import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import prisma from "./db/prisma";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running");
});

app.post("/webhook/message", async (req: Request, res: Response) => {
  const { message, businessId } = req.body;
  const conversation = await prisma.conversation.create({
    data: {
      businessId,
      department: "General",
      status: "open",
      messages: {
        create: {
          sender: "customer",
          content: message,
        },
      },
    },
  });

  res.json({ conversationId: conversation.id });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
