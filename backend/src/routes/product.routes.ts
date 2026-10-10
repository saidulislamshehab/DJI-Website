import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { ReviewController } from "../controllers/review.controller";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/", ProductController.getProducts);
router.get("/featured", ProductController.getFeaturedProducts);
router.get("/stats", ProductController.getProductStats);
router.get("/:slug", ProductController.getProductBySlug);

// Customer Review endpoints
router.get("/:slug/reviews", ReviewController.getProductReviews);
router.post("/:slug/reviews", ReviewController.createReview);
router.post("/:slug/reviews/:reviewId/helpful", ReviewController.voteHelpful);

// Admin protected endpoints
router.post("/", requireAuth as any, requireAdmin as any, ProductController.createProduct);
router.put("/:id", requireAuth as any, requireAdmin as any, ProductController.updateProduct);
router.delete("/:id", requireAuth as any, requireAdmin as any, ProductController.deleteProduct);

export default router;
