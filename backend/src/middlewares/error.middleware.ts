import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): Response => {
  const status: number = err.status || 500;
  const message: string = err.message || "Backend error";
  return res.status(status).json({ message });
};
