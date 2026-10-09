import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

// Public auth routes
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/send-code", AuthController.sendCode);
router.post("/verify-code", AuthController.verifyCode);
router.post("/verify-token", AuthController.verifyTokenEndpoint);

// Protected auth routes
router.get("/me", requireAuth as any, AuthController.getMe as any);
router.put("/profile", requireAuth as any, AuthController.updateProfile as any);
router.post("/change-password", requireAuth as any, AuthController.changePassword as any);

export default router;
