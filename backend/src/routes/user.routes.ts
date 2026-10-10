import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware";

const router = Router();

// All user management routes require both authentication and admin privileges
router.use(requireAuth as any);
router.use(requireAdmin as any);

router.get("/", UserController.getUsers as any);
router.post("/", UserController.createUser as any);
router.get("/stats", UserController.getUserStats as any);
router.patch("/:id/role", UserController.updateUserRole as any);
router.delete("/:id", UserController.deleteUser as any);

export default router;
