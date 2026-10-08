import { Router, Request, Response } from "express";
import { StoreModel } from "../models/store.model";
import { ApiResponse } from "../utils/apiResponse";

const router = Router();

// GET /api/stores - List retail stores in Australia
router.get("/", async (req: Request, res: Response) => {
  try {
    const { state, city } = req.query;
    const filter: any = {};
    if (state) filter.state = new RegExp(state as string, "i");
    if (city) filter.city = new RegExp(city as string, "i");

    const stores = await StoreModel.find(filter).sort({ isFlagship: -1, city: 1 }).lean();
    return ApiResponse.success(res, stores, "Retail stores retrieved successfully");
  } catch (error: any) {
    return ApiResponse.error(res, error.message || "Failed to retrieve stores", 500);
  }
});

// GET /api/stores/:slug - Single store
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const store = await StoreModel.findOne({ slug: req.params.slug }).lean();
    if (!store) {
      return ApiResponse.error(res, "Store not found", 404);
    }
    return ApiResponse.success(res, store, "Store details retrieved successfully");
  } catch (error: any) {
    return ApiResponse.error(res, error.message || "Failed to retrieve store", 500);
  }
});

export default router;
