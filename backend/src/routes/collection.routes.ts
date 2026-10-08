import { Router, Request, Response } from "express";
import { CollectionModel } from "../models/collection.model";
import { ApiResponse } from "../utils/apiResponse";

const router = Router();

// GET /api/collections - List collections with sorting & search
router.get("/", async (req: Request, res: Response) => {
  try {
    const { search, sortBy, category, isCategoryListing, limit = 100, page = 1 } = req.query;

    const filter: any = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search as string, $options: "i" } },
        { handle: { $regex: search as string, $options: "i" } },
      ];
    }

    if (category && category !== "all") {
      filter.$or = [
        { category: category as string },
        { categoryGroup: category as string },
      ];
    }

    if (isCategoryListing === "true") {
      filter.isCategoryListing = true;
    }

    let sort: any = { productsCount: -1 };
    const s = ((sortBy as string) || "").toLowerCase();
    if (s === "title-asc" || s === "name-asc") sort = { title: 1 };
    else if (s === "title-desc" || s === "name-desc") sort = { title: -1 };
    else if (s === "products-desc" || s === "count-desc") sort = { productsCount: -1 };
    else if (s === "newest") sort = { publishedAt: -1 };

    const parsedLimit = Math.min(500, Math.max(1, Number(limit)));
    const parsedPage = Math.max(1, Number(page));
    const skip = (parsedPage - 1) * parsedLimit;

    const total = await CollectionModel.countDocuments(filter);
    const collections = await CollectionModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parsedLimit)
      .lean();

    return ApiResponse.success(
      res,
      collections,
      "Collections retrieved successfully",
      200,
      {
        pagination: {
          page: parsedPage,
          limit: parsedLimit,
          total,
          totalPages: Math.ceil(total / parsedLimit) || 1,
        },
      }
    );
  } catch (error: any) {
    return ApiResponse.error(res, error.message || "Failed to retrieve collections", 500);
  }
});

// GET /api/collections/:handle - Get single collection by handle
router.get("/:handle", async (req: Request, res: Response) => {
  try {
    const collection = await CollectionModel.findOne({ handle: req.params.handle }).lean();
    if (!collection) {
      return ApiResponse.error(res, "Collection not found", 404);
    }
    return ApiResponse.success(res, collection, "Collection details retrieved successfully");
  } catch (error: any) {
    return ApiResponse.error(res, error.message || "Failed to retrieve collection", 500);
  }
});

export default router;
