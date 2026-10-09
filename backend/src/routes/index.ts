import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import productRoutes from "./product.routes";
import categoryRoutes from "./category.routes";
import collectionRoutes from "./collection.routes";
import storeRoutes from "./store.routes";
import articleRoutes from "./article.routes";
import orderRoutes from "./order.routes";
import cartRoutes from "./cart.routes";
import homepageSectionRoutes from "./homepageSection.routes";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import supportRoutes from "./support.routes";
import { ProductModel } from "../models/product.model";
import { CategoryModel } from "../models/category.model";
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

// Database Connection & Diagnostics Check
router.get("/health/db", async (_req: Request, res: Response) => {
  const isConnected = mongoose.connection.readyState === 1;
  const state = isConnected ? "connected" : mongoose.connection.readyState === 2 ? "connecting" : "disconnected";

  if (isConnected && mongoose.connection.db) {
    const list = await mongoose.connection.db.listCollections().toArray();
    const productCount = await ProductModel.countDocuments();
    const categoryCount = await CategoryModel.countDocuments();

    ApiResponse.success(
      res,
      {
        connected: true,
        state,
        host: mongoose.connection.host,
        database: mongoose.connection.name,
        collections: list.map((c) => c.name),
        counts: {
          products: productCount,
          categories: categoryCount,
        },
      },
      "MongoDB Atlas is connected and active"
    );
  } else {
    ApiResponse.success(
      res,
      {
        connected: false,
        state,
        targetDatabase: process.env.MONGODB_DB_NAME || "d1store",
        notice: "MongoDB Atlas connection is blocked by IP Access List. Fallback local store is actively serving data.",
        actionRequired: "Add your current public IP address or 0.0.0.0/0 to MongoDB Atlas -> Network Access.",
      },
      "MongoDB Atlas is not connected"
    );
  }
});

// Modular Routes
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/collections", collectionRoutes);
router.use("/stores", storeRoutes);
router.use("/articles", articleRoutes);
router.use("/orders", orderRoutes);
router.use("/cart", cartRoutes);
router.use("/homepage-sections", homepageSectionRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/support", supportRoutes);

// GET /api/media - Hero videos and media assets
router.get("/media", async (_req: Request, res: Response) => {
  try {
    const list = await mongoose.connection.db?.collection("media").find().toArray();
    ApiResponse.success(res, list || [], "Media assets retrieved successfully");
  } catch (error: any) {
    ApiResponse.error(res, error.message || "Failed to retrieve media", 500);
  }
});

export default router;
