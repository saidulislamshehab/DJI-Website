import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";
import { VerificationCodeModel } from "../models/verificationCode.model";
import { EmailService } from "../services/email.service";
import { ApiResponse } from "../utils/apiResponse";
import { IAuthRequest, isConfiguredAdminEmail } from "../middleware/auth.middleware";

export class AuthController {
  /**
   * POST /api/auth/send-code
   * Sends a 6-digit verification code to the requested email address.
   */
  static async sendCode(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email || typeof email !== "string" || !email.includes("@")) {
        ApiResponse.error(res, "Please provide a valid email address.", 400);
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Generate random 6-digit numeric verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

      // Remove any existing codes for this email
      await VerificationCodeModel.deleteMany({ email: normalizedEmail });

      // Save new verification code
      await VerificationCodeModel.create({
        email: normalizedEmail,
        code,
        expiresAt,
      });

      // Send verification email via Gmail SMTP
      const sent = await EmailService.sendVerificationCode(normalizedEmail, code);
      if (!sent) {
        ApiResponse.error(res, "Failed to send verification email. Please check the email address and try again.", 500);
        return;
      }

      ApiResponse.success(
        res,
        { email: normalizedEmail, expiresInMinutes: 10 },
        `Verification code successfully sent to ${normalizedEmail}`
      );
    } catch (error: any) {
      console.error("[AuthController.sendCode] Error:", error);
      ApiResponse.error(res, error.message || "Failed to process verification code request", 500);
    }
  }

  /**
   * POST /api/auth/verify-code
   * Validates the 6-digit code. If valid, logs in or adds a new user in MongoDB and returns JWT.
   */
  static async verifyCode(req: Request, res: Response): Promise<void> {
    try {
      const { email, code } = req.body;
      if (!email || !code) {
        ApiResponse.error(res, "Email and 6-digit verification code are required.", 400);
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();
      const trimmedCode = code.toString().trim();

      // Find valid code in DB
      const record = await VerificationCodeModel.findOne({
        email: normalizedEmail,
        code: trimmedCode,
        expiresAt: { $gt: new Date() },
      });

      if (!record) {
        ApiResponse.error(res, "Invalid or expired verification code. Please request a new code.", 400);
        return;
      }

      // Delete the verified code
      await VerificationCodeModel.deleteOne({ _id: record._id });

      // Upsert user in MongoDB Atlas d1store users collection
      let user = await UserModel.findOne({ email: normalizedEmail });
      let isNewUser = false;

      const shouldBeAdmin = isConfiguredAdminEmail(normalizedEmail);

      if (!user) {
        user = await UserModel.create({
          email: normalizedEmail,
          name: normalizedEmail.split("@")[0],
          role: shouldBeAdmin ? "admin" : "customer",
          isVerified: true,
          marketingConsent: true,
          addresses: [],
          lastLoginAt: new Date(),
        });
        isNewUser = true;
        console.log(`[AuthController] New user created & verified: ${normalizedEmail} (Role: ${user.role})`);
      } else {
        user.isVerified = true;
        user.lastLoginAt = new Date();
        if (shouldBeAdmin && user.role !== "admin") {
          user.role = "admin";
        }
        await user.save();
        console.log(`[AuthController] Existing user verified & logged in: ${normalizedEmail} (Role: ${user.role})`);
      }

      // Sign JWT session token (valid for 30 days)
      const secret = process.env.JWT_SECRET || "d1store_super_secure_jwt_secret_key_2026";
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
        secret,
        { expiresIn: "30d" }
      );

      ApiResponse.success(
        res,
        {
          user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            isVerified: user.isVerified,
            marketingConsent: user.marketingConsent,
            addresses: user.addresses,
            createdAt: user.createdAt,
          },
          token,
          isNewUser,
        },
        isNewUser ? "Account created and verified successfully!" : "Signed in successfully!"
      );
    } catch (error: any) {
      console.error("[AuthController.verifyCode] Error:", error);
      ApiResponse.error(res, error.message || "Failed to verify code", 500);
    }
  }

  /**
   * GET /api/auth/me
   * Returns current authenticated user data.
   */
  static async getMe(req: IAuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ApiResponse.error(res, "Not authenticated", 401);
        return;
      }

      if (isConfiguredAdminEmail(req.user.email) && req.user.role !== "admin") {
        req.user.role = "admin";
        await req.user.save().catch(() => {});
      }

      ApiResponse.success(
        res,
        {
          user: {
            _id: req.user._id,
            email: req.user.email,
            name: req.user.name,
            role: req.user.role,
            isVerified: req.user.isVerified,
            marketingConsent: req.user.marketingConsent,
            addresses: req.user.addresses,
            createdAt: req.user.createdAt,
          },
        },
        "User profile retrieved"
      );
    } catch (error: any) {
      ApiResponse.error(res, error.message || "Failed to fetch user data", 500);
    }
  }

  /**
   * PUT /api/auth/profile
   * Updates user preferences like marketing consent or contact info.
   */
  static async updateProfile(req: IAuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ApiResponse.error(res, "Not authenticated", 401);
        return;
      }

      const { name, marketingConsent, addresses } = req.body;
      if (name !== undefined) req.user.name = name;
      if (marketingConsent !== undefined) req.user.marketingConsent = Boolean(marketingConsent);
      if (addresses !== undefined && Array.isArray(addresses)) req.user.addresses = addresses;

      await req.user.save();

      ApiResponse.success(
        res,
        {
          user: {
            _id: req.user._id,
            email: req.user.email,
            name: req.user.name,
            role: req.user.role,
            isVerified: req.user.isVerified,
            marketingConsent: req.user.marketingConsent,
            addresses: req.user.addresses,
            createdAt: req.user.createdAt,
          },
        },
        "Profile updated successfully"
      );
    } catch (error: any) {
      ApiResponse.error(res, error.message || "Failed to update profile", 500);
    }
  }
}
