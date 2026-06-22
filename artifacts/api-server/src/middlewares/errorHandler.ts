import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../lib/logger";

export interface AppError extends Error {
  status?: number;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error({ err }, "Error occurred");

  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation Error",
      details: err.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
    return;
  }

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    error: message,
  });
}
