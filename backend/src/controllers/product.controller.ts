import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/product.service";
import { ApiResponse } from "../utils/apiResponse";

export class ProductController {
  static async getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        category,
        subCategory,
        collection,
        tag,
        isFeatured,
        isNewArrival,
        isBestSeller,
        isProfessional,
        isEnterprise,
        tier,
        inStock,
        lowStock,
        search,
        minPrice,
        maxPrice,
        sortBy,
        page,
        limit,
      } = req.query;

      const result = await ProductService.getAllProducts({
        category: category ? String(category) : undefined,
        subCategory: subCategory ? String(subCategory) : undefined,
        collection: collection ? String(collection) : undefined,
        tag: tag ? String(tag) : undefined,
        tier: tier ? String(tier) : undefined,
        isFeatured: isFeatured !== undefined ? isFeatured === "true" : undefined,
        isNewArrival: isNewArrival !== undefined ? isNewArrival === "true" : undefined,
        isBestSeller: isBestSeller !== undefined ? isBestSeller === "true" : undefined,
        isProfessional: isProfessional !== undefined ? isProfessional === "true" : undefined,
        isEnterprise: isEnterprise !== undefined ? isEnterprise === "true" : undefined,
        inStock: inStock !== undefined ? inStock === "true" : undefined,
        lowStock: lowStock !== undefined ? lowStock === "true" : undefined,
        search: search ? String(search) : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sortBy: sortBy ? String(sortBy) : undefined,
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

  static async getProductStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await ProductService.getProductStats();
      ApiResponse.success(res, stats, "Product statistics retrieved successfully");
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

      const product = await ProductService.getProductBySlug(slug) || await ProductService.getProductById(slug);

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

  static async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const updated = await ProductService.updateProduct(id, req.body);
      if (!updated) {
        ApiResponse.error(res, `Product '${id}' not found`, 404, "Not Found");
        return;
      }
      ApiResponse.success(res, updated, "Product updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const deleted = await ProductService.deleteProduct(id);
      if (!deleted) {
        ApiResponse.error(res, `Product '${id}' not found`, 404, "Not Found");
        return;
      }
      ApiResponse.success(res, { id }, "Product deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
