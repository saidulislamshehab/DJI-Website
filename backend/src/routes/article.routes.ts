import { Router, Request, Response } from "express";
import { ArticleModel } from "../models/article.model";
import { ApiResponse } from "../utils/apiResponse";

const router = Router();

// GET /api/articles - List guides & articles
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, tag } = req.query;
    const filter: any = {};
    if (category) filter.category = category as string;
    if (tag) filter.tags = tag as string;

    const articles = await ArticleModel.find(filter).sort({ publishedAt: -1 }).lean();
    return ApiResponse.success(res, articles, "Articles retrieved successfully");
  } catch (error: any) {
    return ApiResponse.error(res, error.message || "Failed to retrieve articles", 500);
  }
});

// GET /api/articles/:slug - Single article
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const article = await ArticleModel.findOne({ slug: req.params.slug }).lean();
    if (!article) {
      return ApiResponse.error(res, "Article not found", 404);
    }
    return ApiResponse.success(res, article, "Article details retrieved successfully");
  } catch (error: any) {
    return ApiResponse.error(res, error.message || "Failed to retrieve article", 500);
  }
});

export default router;
