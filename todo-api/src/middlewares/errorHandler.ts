import { Request, Response, NextFunction } from "express";

interface AppError {
  status?: number;
  message?: string;
}

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
};

export default errorHandler;
