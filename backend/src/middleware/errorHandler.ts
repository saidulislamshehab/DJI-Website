import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/apiResponse";

export const errorHandler = (
  err: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "An unexpected error occurred";

  console.error(`[Error Handler] ${statusCode} - ${message}\nStack:`, err.stack);

  ApiResponse.error(
    res,
    process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
    statusCode,
    message
  );
};
