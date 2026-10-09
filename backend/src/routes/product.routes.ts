import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/", ProductController.getProducts);
router.get("/featured", ProductController.getFeaturedProducts);
router.get("/:slug", ProductController.getProductBySlug);

// Admin protected endpoints
router.post("/", requireAuth as any, requireAdmin as any, ProductController.createProduct);
router.put("/:id", requireAuth as any, requireAdmin as any, ProductController.updateProduct);
router.delete("/:id", requireAuth as any, requireAdmin as any, ProductController.deleteProduct);

export default router;
