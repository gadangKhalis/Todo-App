import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// extend Request type - add user property
export interface AuthRequest extends Request {
  user?: { userId: number; email: string };
}

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token; // take token from cookie
  if (!token) {
    res.status(401).json({ message: "No Token" });
    return;
  }
  try {
    const secret = process.env.JWT_SECRET!;
    //verify token and get payload - if invalid or expired, throw error
    const decoded = jwt.verify(token, secret) as {
      userId: number;
      email: string;
    };
    req.user = decoded; // attach to request
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
