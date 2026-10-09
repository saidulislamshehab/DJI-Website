import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { optionalAuth, requireAuth } from "../middleware/auth.middleware";

const router = Router();

// GET /api/cart - get authenticated user's cart (or empty guest cart)
router.get("/", optionalAuth, CartController.getCart);

// POST /api/cart/sync - sync user's cart with server
router.post("/sync", requireAuth, CartController.syncCart);

// POST /api/cart/validate - validate items & stock
router.post("/validate", CartController.validateCart);

// POST /api/cart/coupon - validate and compute coupon discount
router.post("/coupon", CartController.applyCoupon);

// DELETE /api/cart - clear cart
router.delete("/", optionalAuth, CartController.clearCart);

export default router;
