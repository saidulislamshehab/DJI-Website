import { ProductModel, IProductDocument } from "../models/product.model";
import { IProduct } from "../types";

export class ProductService {
  static async getAllProducts(query: {
    category?: string;
    isFeatured?: boolean;
    isNewArrival?: boolean;
    isBestSeller?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ products: IProductDocument[]; total: number; totalPages: number }> {
    const filter: Record<string, unknown> = {};

    if (query.category) {
      filter.categorySlug = query.category;
    }
    if (typeof query.isFeatured === "boolean") {
      filter.isFeatured = query.isFeatured;
    }
    if (typeof query.isNewArrival === "boolean") {
      filter.isNewArrival = query.isNewArrival;
    }
    if (typeof query.isBestSeller === "boolean") {
      filter.isBestSeller = query.isBestSeller;
    }
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: "i" } },
        { description: { $regex: query.search, $options: "i" } },
        { category: { $regex: query.search, $options: "i" } },
      ];
    }

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      ProductModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      ProductModel.countDocuments(filter).exec(),
    ]);

    return {
      products,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  static async getProductBySlug(slug: string): Promise<IProductDocument | null> {
    return ProductModel.findOne({ slug }).exec();
  }

  static async createProduct(data: Partial<IProduct>): Promise<IProductDocument> {
    return ProductModel.create(data);
  }

  static async getFeaturedProducts(limit = 8): Promise<IProductDocument[]> {
    return ProductModel.find({ isFeatured: true }).limit(limit).exec();
  }
}
