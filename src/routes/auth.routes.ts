import { Router, Request, Response } from "express";
import prisma from "../db/prisma";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid user" });
  }

  // Fake token (just for demo)
  const token = Buffer.from(user.id).toString("base64");

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      businessId: user.businessId,
      departmentId: user.departmentId,
    },
  });
});

export default router;
