import { Router } from "express";
import { OrderController } from "../controllers/order.controller";

const router = Router();

router.get("/", OrderController.getOrders);
router.get("/:id", OrderController.getOrderById);
router.post("/", OrderController.createOrder);
router.patch("/:id/status", OrderController.updateOrderStatus);

export default router;
