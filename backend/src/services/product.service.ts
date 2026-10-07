import { DbStore } from "./dbStore";
import { IProduct } from "../types";

export class ProductService {
  private static store = DbStore.getInstance();

  static async getAllProducts(query: {
    category?: string;
    subCategory?: string;
    isFeatured?: boolean;
    isNewArrival?: boolean;
    isBestSeller?: boolean;
    isProfessional?: boolean;
    isEnterprise?: boolean;
    inStock?: boolean;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Promise<{ products: IProduct[]; total: number; totalPages: number }> {
    return this.store.getProducts(query);
  }

  static async getProductBySlug(slug: string): Promise<IProduct | null> {
    return this.store.getProductBySlug(slug);
  }

  static async getProductById(id: string): Promise<IProduct | null> {
    return this.store.getProductById(id);
  }

  static async createProduct(data: Partial<IProduct>): Promise<IProduct> {
    return this.store.createProduct(data);
  }

  static async updateProduct(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
    return this.store.updateProduct(id, data);
  }

  static async deleteProduct(id: string): Promise<boolean> {
    return this.store.deleteProduct(id);
  }

  static async getFeaturedProducts(limit = 8): Promise<IProduct[]> {
    const res = this.store.getProducts({ isFeatured: true, limit });
    return res.products;
  }
}
