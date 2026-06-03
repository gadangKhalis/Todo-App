import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "./authMiddlewares";

const prisma = new PrismaClient();

export const requirePremium = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = (req as AuthRequest).user?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isPremium: true },
  });

  if (!user || !user.isPremium) {
    return res.status(403).json({
      message: "Fitur ini hanya tersedia untuk pengguna Premium.",
    });
  }

  next();
};
