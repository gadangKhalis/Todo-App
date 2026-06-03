import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");
  return secret;
};

const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(400).json({ message: "Email already registered" });
    return;
  }

  //hash password before saving to database
  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashed },
  });

  res.status(201).json({ message: "Register successfully", userId: user.id });
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(400).json({ message: "Invalid credentials" });
    return;
  }

  // compare pass vs hashed pass in DB
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  // Generate JWT - payload
  const token = jwt.sign({ userId: user.id, email: user.email }, getSecret(), {
    expiresIn: "1h",
  });

  // Sent token via HTTPOnly cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 1000,
  });

  res.json({ message: "Login Success" });
};

export const getMe = async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, isPremium: true },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ user });
};

const logout = (_req: Request, res: Response) => {
  // Clear cookie
  res.clearCookie("token");
  res.json({ message: "Logout Success" });
};

export default { register, login, logout };
