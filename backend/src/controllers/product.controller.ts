import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/product.service";
import { ApiResponse } from "../utils/apiResponse";

export class ProductController {
  static async getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, isFeatured, isNewArrival, isBestSeller, search, page, limit } = req.query;

      const result = await ProductService.getAllProducts({
        category: category ? String(category) : undefined,
        isFeatured: isFeatured !== undefined ? isFeatured === "true" : undefined,
        isNewArrival: isNewArrival !== undefined ? isNewArrival === "true" : undefined,
        isBestSeller: isBestSeller !== undefined ? isBestSeller === "true" : undefined,
        search: search ? String(search) : undefined,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      });

      ApiResponse.success(res, result.products, "Products retrieved successfully", 200, {
        count: result.products.length,
        pagination: {
          page: Number(page) || 1,
          limit: Number(limit) || 20,
          total: result.total,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProductBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
      if (!slug) {
        ApiResponse.error(res, "Product slug is required", 400, "Bad Request");
        return;
      }

      const product = await ProductService.getProductBySlug(slug);

      if (!product) {
        ApiResponse.error(res, `Product with slug '${slug}' not found`, 404, "Not Found");
        return;
      }

      ApiResponse.success(res, product, "Product retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getFeaturedProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 8;
      const products = await ProductService.getFeaturedProducts(limit);
      ApiResponse.success(res, products, "Featured products retrieved successfully", 200, {
        count: products.length,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await ProductService.createProduct(req.body);
      ApiResponse.success(res, product, "Product created successfully", 201);
    } catch (error) {
      next(error);
    }
  }
}
