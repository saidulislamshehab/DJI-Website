import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { VerificationCodeModel } from "../models/verificationCode.model";
import { EmailService } from "../services/email.service";
import { ApiResponse } from "../utils/apiResponse";
import { IAuthRequest, isConfiguredAdminEmail } from "../middleware/auth.middleware";
import { generateToken, verifyToken } from "../utils/jwt.util";

export class AuthController {
  /**
   * POST /api/auth/register
   * Registers a new user with email, password, and optional name.
   */
  static async register(_req: Request, res: Response): Promise<void> {
    try {
      ApiResponse.error(
        res,
        "Direct registration without verification is disabled. Please enter your email to receive a 6-digit verification code to create or access your account.",
        400
      );
      return;
    } catch (error: any) {
      ApiResponse.error(res, error.message || "Registration failed", 500);
    }
  }

  /**
   * POST /api/auth/login
   * Authenticates user via email and password, returning a JWT token.
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        ApiResponse.error(res, "Email and password are required.", 400);
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();
      const user = await UserModel.findOne({ email: normalizedEmail }).select("+password");

      if (!user) {
        ApiResponse.error(res, "Invalid email or password.", 401);
        return;
      }

      if (!user.password) {
        ApiResponse.error(
          res,
          "This account does not have a password set. Please sign in via email verification code or reset your password.",
          400
        );
        return;
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        ApiResponse.error(res, "Invalid email or password.", 401);
        return;
      }

      // Promote to admin if email is in ADMIN_EMAILS
      if (isConfiguredAdminEmail(normalizedEmail) && user.role !== "admin") {
        user.role = "admin";
      }

      user.lastLoginAt = new Date();
      await user.save();

      // Sign JWT session token
      const token = generateToken({
        id: (user._id as any).toString(),
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      });

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
        },
        "Signed in successfully!"
      );
    } catch (error: any) {
      console.error("[AuthController.login] Error:", error);
      ApiResponse.error(res, error.message || "Failed to sign in", 500);
    }
  }

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

      // Check resend cooldown (60 seconds) to prevent abuse and spam
      const existing = await VerificationCodeModel.findOne({ email: normalizedEmail });
      if (existing) {
        const elapsed = Date.now() - new Date(existing.createdAt).getTime();
        if (elapsed < 60 * 1000) {
          const remaining = Math.ceil((60 * 1000 - elapsed) / 1000);
          ApiResponse.error(
            res,
            `Please wait ${remaining} seconds before requesting a new verification code.`,
            429
          );
          return;
        }
      }

      // Generate cryptographically secure random 6-digit verification code
      const crypto = await import("crypto");
      const code = crypto.randomInt(100000, 1000000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

      // Remove any existing codes for this email
      await VerificationCodeModel.deleteMany({ email: normalizedEmail });

      // Save new verification code
      await VerificationCodeModel.create({
        email: normalizedEmail,
        code,
        expiresAt,
        attempts: 0,
      });

      // Send verification email via configured SMTP
      const { success: sent, error: emailError } = await EmailService.sendVerificationCode(normalizedEmail, code);
      console.log(`[AuthController.sendCode] Verification code generated and dispatched for ${normalizedEmail}.`);

      if (!sent) {
        console.error(`[AuthController.sendCode] Email sending failed for ${normalizedEmail}: ${emailError}`);
        // Remove code from database so user is not blocked by 60s cooldown if sending failed
        await VerificationCodeModel.deleteMany({ email: normalizedEmail });
        ApiResponse.error(
          res,
          emailError || "Failed to deliver verification email. Please try again.",
          500
        );
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
   * Validates the 6-digit code. If valid, logs in or creates user in database and returns JWT.
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

      // Find code in DB
      const record = await VerificationCodeModel.findOne({ email: normalizedEmail });

      if (!record) {
        ApiResponse.error(res, "No verification code was requested for this email, or the code has expired. Please request a new code.", 400);
        return;
      }

      // Check expiration
      if (new Date() > record.expiresAt) {
        await VerificationCodeModel.deleteOne({ _id: record._id });
        ApiResponse.error(res, "Verification code has expired. Please request a new code.", 400);
        return;
      }

      // Enforce attempt limits (max 5 failed attempts)
      if ((record.attempts || 0) >= 5) {
        await VerificationCodeModel.deleteOne({ _id: record._id });
        ApiResponse.error(
          res,
          "Too many incorrect attempts. For your security, this verification code has been invalidated. Please request a new code.",
          429
        );
        return;
      }

      // Check code match
      if (record.code !== trimmedCode) {
        record.attempts = (record.attempts || 0) + 1;
        await record.save();
        const remaining = 5 - record.attempts;
        ApiResponse.error(
          res,
          `Invalid verification code. ${remaining > 0 ? `${remaining} attempt${remaining === 1 ? "" : "s"} remaining.` : "Please request a new code."}`,
          400
        );
        return;
      }

      // Delete the verified code immediately (one-time use prevention)
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
      const token = generateToken({
        id: (user._id as any).toString(),
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      });

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

  /**
   * POST /api/auth/change-password
   * Updates user password after confirming the existing password.
   */
  static async changePassword(req: IAuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ApiResponse.error(res, "Not authenticated", 401);
        return;
      }

      const { currentPassword, newPassword } = req.body;

      if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
        ApiResponse.error(res, "New password must be at least 6 characters long.", 400);
        return;
      }

      // Re-fetch user with password
      const user = await UserModel.findById(req.user._id).select("+password");
      if (!user) {
        ApiResponse.error(res, "User not found", 404);
        return;
      }

      // If user had a password set, require and verify current password
      if (user.password) {
        if (!currentPassword) {
          ApiResponse.error(res, "Current password is required.", 400);
          return;
        }
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
          ApiResponse.error(res, "Incorrect current password.", 400);
          return;
        }
      }

      user.password = newPassword;
      await user.save();

      // Issue refreshed JWT token
      const token = generateToken({
        id: (user._id as any).toString(),
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      });

      ApiResponse.success(res, { token }, "Password updated successfully!");
    } catch (error: any) {
      console.error("[AuthController.changePassword] Error:", error);
      ApiResponse.error(res, error.message || "Failed to change password", 500);
    }
  }

  /**
   * POST /api/auth/verify-token
   * Validates a JWT token and returns user info.
   */
  static async verifyTokenEndpoint(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : req.body.token;

      if (!token) {
        ApiResponse.error(res, "Token is required.", 400);
        return;
      }

      const decoded = verifyToken(token);
      const user = await UserModel.findById(decoded.id);

      if (!user) {
        ApiResponse.error(res, "User associated with token no longer exists.", 401);
        return;
      }

      ApiResponse.success(
        res,
        {
          valid: true,
          user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            isVerified: user.isVerified,
          },
        },
        "Token is valid"
      );
    } catch {
      ApiResponse.error(res, "Invalid or expired token", 401);
    }
  }
}
