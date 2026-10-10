import { Request, Response, NextFunction } from "express";
import { UserModel, IUserDocument } from "../models/user.model";
import { ApiResponse } from "../utils/apiResponse";
import { verifyToken, ITokenPayload } from "../utils/jwt.util";

export interface IAuthRequest extends Request {
  user?: IUserDocument;
}

export function isConfiguredAdminEmail(email?: string): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  const configured = [
    ...(process.env.ADMIN_EMAILS || "").split(","),
    process.env.EMAIL_USER || "",
    "saidulislamshehabb@gmail.com",
  ]
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return configured.includes(normalized);
}

export async function requireAuth(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      ApiResponse.error(res, "Authentication required. Please sign in.", 401);
      return;
    }

    const token = authHeader.split(" ")[1];
    let decoded: ITokenPayload;

    try {
      decoded = verifyToken(token);
    } catch {
      ApiResponse.error(res, "Invalid or expired session token.", 401);
      return;
    }

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      ApiResponse.error(res, "User account not found or session expired.", 401);
      return;
    }

    // Auto-promote configured admin emails if not yet set
    if (isConfiguredAdminEmail(user.email) && user.role !== "admin") {
      user.role = "admin";
      await user.save().catch(() => {});
    }

    req.user = user;
    next();
  } catch (error: any) {
    ApiResponse.error(res, "Invalid or expired session token.", 401);
  }
}

export async function requireAdmin(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      ApiResponse.error(res, "Authentication required. Please sign in.", 401);
      return;
    }

    const isAdmin = req.user.role === "admin" || isConfiguredAdminEmail(req.user.email);
    if (!isAdmin) {
      ApiResponse.error(res, "Access denied. Administrator privileges required.", 403);
      return;
    }

    if (req.user.role !== "admin") {
      req.user.role = "admin";
      await req.user.save().catch(() => {});
    }

    next();
  } catch (error: any) {
    ApiResponse.error(res, "Authorization check failed.", 403);
  }
}

export async function optionalAuth(req: IAuthRequest, _res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = verifyToken(token);
      const user = await UserModel.findById(decoded.id);
      if (user) {
        req.user = user;
      }
    }
  } catch {
    // Guest user or token expired; proceed without setting req.user
  }
  next();
}
