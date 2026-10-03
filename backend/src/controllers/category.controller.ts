import { Request, Response, NextFunction } from "express";
import { CategoryService } from "../services/category.service";
import { ApiResponse } from "../utils/apiResponse";

export class CategoryController {
  static async getCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await CategoryService.getAllCategories();
      ApiResponse.success(res, categories, "Categories retrieved successfully", 200, {
        count: categories.length,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCategoryBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
      if (!slug) {
        ApiResponse.error(res, "Category slug is required", 400, "Bad Request");
        return;
      }

      const category = await CategoryService.getCategoryBySlug(slug);

      if (!category) {
        ApiResponse.error(res, `Category with slug '${slug}' not found`, 404, "Not Found");
        return;
      }

      ApiResponse.success(res, category, "Category retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await CategoryService.createCategory(req.body);
      ApiResponse.success(res, category, "Category created successfully", 201);
    } catch (error) {
      next(error);
    }
  }
}
