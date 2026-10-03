import { Router, Request, Response } from "express";
import productRoutes from "./product.routes";
import categoryRoutes from "./category.routes";
import { ApiResponse } from "../utils/apiResponse";

const router = Router();

// Health Check
router.get("/health", (_req: Request, res: Response) => {
  ApiResponse.success(
    res,
    {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: "DJI Drone API Server",
    },
    "DJI Store API is operating normally"
  );
});

// Modular Routes
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);

export default router;
