import mongoose from "mongoose";
import { ProductModel } from "../models/product.model";
import { DbStore } from "./dbStore";
import { IProduct } from "../types";

export class ProductService {
  private static store = DbStore.getInstance();

  private static isMongoConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  private static cleanProduct<T extends { rating?: number }>(p: T): T {
    if (p && typeof p.rating === "number") {
      p.rating = Math.round(p.rating * 10) / 10;
    }
    return p;
  }

  static async getAllProducts(query: {
    category?: string;
    subCategory?: string;
    collection?: string;
    tag?: string;
    isFeatured?: boolean;
    isNewArrival?: boolean;
    isBestSeller?: boolean;
    isProfessional?: boolean;
    isEnterprise?: boolean;
    tier?: string;
    inStock?: boolean;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Promise<{ products: IProduct[]; total: number; totalPages: number }> {
    if (this.isMongoConnected()) {
      try {
        const filter: any = {};
        if (query.category) filter.categorySlug = query.category;
        if (query.subCategory) filter.subCategory = query.subCategory;
        if (query.collection) filter.collections = query.collection;
        if (query.tag) filter.tags = query.tag;
        if (query.tier) filter.tier = query.tier;
        if (query.isFeatured !== undefined) filter.isFeatured = query.isFeatured;
        if (query.isNewArrival !== undefined) filter.isNewArrival = query.isNewArrival;
        if (query.isBestSeller !== undefined) filter.isBestSeller = query.isBestSeller;
        if (query.isProfessional !== undefined) filter.isProfessional = query.isProfessional;
        if (query.isEnterprise !== undefined) filter.isEnterprise = query.isEnterprise;
        if (query.inStock !== undefined) filter.inStock = query.inStock;
        if (query.minPrice !== undefined || query.maxPrice !== undefined) {
          filter.price = {};
          if (query.minPrice !== undefined) filter.price.$gte = query.minPrice;
          if (query.maxPrice !== undefined) filter.price.$lte = query.maxPrice;
        }
        if (query.search) {
          filter.$or = [
            { name: { $regex: query.search, $options: "i" } },
            { description: { $regex: query.search, $options: "i" } },
            { sku: { $regex: query.search, $options: "i" } },
          ];
        }

        let sort: any = { createdAt: -1 };
        const s = (query.sortBy || "").toLowerCase();
        if (s === "price-low" || s === "price-asc" || s === "price-ascending") sort = { price: 1 };
        else if (s === "price-high" || s === "price-desc" || s === "price-descending") sort = { price: -1 };
        else if (s === "name-asc" || s === "title-asc" || s === "title-ascending") sort = { name: 1 };
        else if (s === "name-desc" || s === "title-desc" || s === "title-descending") sort = { name: -1 };
        else if (s === "best-selling" || s === "bestseller") sort = { isBestSeller: -1, rating: -1, reviewCount: -1 };
        else if (s === "rating") sort = { rating: -1, reviewCount: -1 };
        else if (s === "featured") sort = { isFeatured: -1, rating: -1 };
        else if (s === "newest" || s === "created-descending") sort = { createdAt: -1 };

        const page = Math.max(1, query.page || 1);
        const limit = Math.max(1, query.limit || 20);
        const skip = (page - 1) * limit;

        const total = await ProductModel.countDocuments(filter);
        const products = await ProductModel.find(filter).sort(sort).skip(skip).limit(limit).lean();

        return {
          products: (products as unknown as IProduct[]).map((p) => this.cleanProduct(p)),
          total,
          totalPages: Math.ceil(total / limit) || 1,
        };
      } catch (err) {
        console.warn("[ProductService] MongoDB query failed, falling back to local store:", err);
      }
    }

    const fallback = this.store.getProducts(query);
    return {
      ...fallback,
      products: fallback.products.map((p) => this.cleanProduct(p)),
    };
  }

  static async getProductBySlug(slug?: string): Promise<IProduct | null> {
    if (!slug || typeof slug !== "string") return null;
    if (this.isMongoConnected()) {
      try {
        const product = await ProductModel.findOne({ slug }).lean();
        if (product) return this.cleanProduct(product as unknown as IProduct);
      } catch (err) {
        console.warn("[ProductService] MongoDB query failed, falling back to local store:", err);
      }
    }
    const fallback = this.store.getProductBySlug(slug);
    return fallback ? this.cleanProduct(fallback) : null;
  }

  static async getProductById(id?: string): Promise<IProduct | null> {
    if (!id || typeof id !== "string") return null;
    if (this.isMongoConnected()) {
      try {
        const filter = mongoose.Types.ObjectId.isValid(id)
          ? { $or: [{ _id: id }, { slug: id }, { sku: id }] }
          : { $or: [{ slug: id }, { sku: id }] };
        const product = await ProductModel.findOne(filter).lean();
        if (product) return this.cleanProduct(product as unknown as IProduct);
      } catch (err) {
        console.warn("[ProductService] MongoDB query failed, falling back to local store:", err);
      }
    }
    const fallback = this.store.getProductById(id) || this.store.getProductBySlug(id);
    return fallback ? this.cleanProduct(fallback) : null;
  }

  static async createProduct(data: Partial<IProduct>): Promise<IProduct> {
    if (data.rating !== undefined) {
      data.rating = Math.round(Number(data.rating) * 10) / 10;
    }
    if (this.isMongoConnected()) {
      try {
        const created = await ProductModel.create(data);
        return this.cleanProduct(created.toObject() as unknown as IProduct);
      } catch (err) {
        console.warn("[ProductService] MongoDB create failed, falling back to local store:", err);
      }
    }
    return this.cleanProduct(this.store.createProduct(data));
  }

  static async updateProduct(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
    if (data.rating !== undefined) {
      data.rating = Math.round(Number(data.rating) * 10) / 10;
    }
    let updatedProduct: IProduct | null = null;
    if (this.isMongoConnected()) {
      try {
        const conditions: any[] = [{ slug: id }, { sku: id }];
        if (mongoose.Types.ObjectId.isValid(id)) {
          conditions.push({ _id: id });
        }
        const filter = { $or: conditions };
        const updated = await ProductModel.findOneAndUpdate(filter, { $set: data }, { new: true }).lean();
        if (updated) {
          updatedProduct = this.cleanProduct(updated as unknown as IProduct);
        }
      } catch (err) {
        console.warn("[ProductService] MongoDB update failed, falling back to local store:", err);
      }
    }
    const fallback = this.store.updateProduct(id, data);
    return updatedProduct || (fallback ? this.cleanProduct(fallback) : null);
  }

  static async deleteProduct(id: string): Promise<boolean> {
    let deleted = false;
    if (this.isMongoConnected()) {
      try {
        const conditions: any[] = [{ slug: id }, { sku: id }];
        if (mongoose.Types.ObjectId.isValid(id)) {
          conditions.push({ _id: id });
        }
        const filter = { $or: conditions };
        const res = await ProductModel.findOneAndDelete(filter);
        if (res) deleted = true;
      } catch (err) {
        console.warn("[ProductService] MongoDB delete failed, falling back to local store:", err);
      }
    }
    const localDeleted = this.store.deleteProduct(id);
    return deleted || localDeleted;
  }

  static async getFeaturedProducts(limit = 8): Promise<IProduct[]> {
    if (this.isMongoConnected()) {
      try {
        const products = await ProductModel.find({ isFeatured: true }).limit(limit).lean();
        if (products.length > 0) {
          return (products as unknown as IProduct[]).map((p) => this.cleanProduct(p));
        }
      } catch (err) {
        console.warn("[ProductService] MongoDB query failed, falling back to local store:", err);
      }
    }
    const res = this.store.getProducts({ isFeatured: true, limit });
    return res.products.map((p) => this.cleanProduct(p));
  }
}
