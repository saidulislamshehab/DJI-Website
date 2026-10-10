import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { optionalAuth, requireAuth, requireAdmin } from "../middleware/auth.middleware";

const router = Router();

// Order calculation pre-flight check
router.post("/validate", OrderController.validateCheckout);

// Order creation & lookup
router.post("/", optionalAuth, OrderController.createOrder);
router.get("/", optionalAuth, OrderController.getOrders);

// Order details & tax invoice
router.get("/:id", optionalAuth, OrderController.getOrderById);
router.get("/:id/invoice", optionalAuth, OrderController.getOrderInvoice);

// Order actions
router.post("/:id/cancel", optionalAuth, OrderController.cancelOrder);
router.patch("/:id/status", requireAuth, requireAdmin, OrderController.updateOrderStatus);
router.delete("/:id", requireAuth, requireAdmin, OrderController.deleteOrder);

export default router;
