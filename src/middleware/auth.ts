import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";

export async function mockAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No auth token" });
  }

  const token = authHeader.replace("Bearer ", "");
  const userId = Buffer.from(token, "base64").toString("utf-8");

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  req.user = user; // attach user to request
  next();
}
