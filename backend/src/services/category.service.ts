import mongoose from "mongoose";
import { CategoryModel, SubCategoryModel, CategoryOptionModel } from "../models/category.model";
import { DbStore } from "./dbStore";
import { ICategory, ISubCategory, ICategoryOption } from "../types";

export class CategoryService {
  private static store = DbStore.getInstance();

  private static isMongoConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  static async getAllCategories(): Promise<ICategory[]> {
    if (this.isMongoConnected()) {
      try {
        const cats = await CategoryModel.find().sort({ featuredOrder: 1, name: 1 }).lean();
        if (cats.length > 0) return cats as unknown as ICategory[];
      } catch (err) {
        console.warn("[CategoryService] MongoDB query failed, falling back to local store:", err);
      }
    }
    return this.store.getCategories();
  }

  static async getCategoryBySlug(slug: string): Promise<ICategory | null> {
    if (this.isMongoConnected()) {
      try {
        const query =
          slug === "enterprise" || slug === "enterprise-agriculture"
            ? { slug: { $in: ["enterprise", "enterprise-agriculture"] } }
            : { slug };
        const cat = await CategoryModel.findOne(query).lean();
        if (cat) return cat as unknown as ICategory;
      } catch (err) {
        console.warn("[CategoryService] MongoDB query failed, falling back to local store:", err);
      }
    }
    return this.store.getCategoryBySlug(slug);
  }

  static async getSubCategories(categorySlug?: string): Promise<ISubCategory[]> {
    if (this.isMongoConnected()) {
      try {
        const filter = categorySlug ? { categorySlug } : {};
        const subCats = await SubCategoryModel.find(filter).lean();
        return subCats as unknown as ISubCategory[];
      } catch (err) {
        console.warn("[CategoryService] SubCategories query failed:", err);
      }
    }
    return [];
  }

  static async getSubCategoryBySlug(slug: string): Promise<ISubCategory | null> {
    if (this.isMongoConnected()) {
      try {
        const subCat = await SubCategoryModel.findOne({ slug }).lean();
        if (subCat) return subCat as unknown as ISubCategory;
      } catch (err) {
        console.warn("[CategoryService] SubCategory query failed:", err);
      }
    }
    return null;
  }

  static async getCategoryOptions(filter?: {
    categorySlug?: string;
    subCategorySlug?: string;
  }): Promise<ICategoryOption[]> {
    if (this.isMongoConnected()) {
      try {
        const query: any = {};
        if (filter?.categorySlug) query.categorySlug = filter.categorySlug;
        if (filter?.subCategorySlug) query.subCategorySlug = filter.subCategorySlug;
        const options = await CategoryOptionModel.find(query).lean();
        return options as unknown as ICategoryOption[];
      } catch (err) {
        console.warn("[CategoryService] CategoryOptions query failed:", err);
      }
    }
    return [];
  }

  static async createCategory(data: Partial<ICategory>): Promise<ICategory> {
    if (this.isMongoConnected()) {
      try {
        const created = await CategoryModel.create(data);
        return created.toObject() as unknown as ICategory;
      } catch (err) {
        console.warn("[CategoryService] MongoDB create failed, falling back to local store:", err);
      }
    }
    return this.store.createCategory(data);
  }

  static async updateCategory(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
    if (this.isMongoConnected()) {
      try {
        if (mongoose.Types.ObjectId.isValid(id)) {
          const updated = await CategoryModel.findByIdAndUpdate(id, data, { new: true }).lean();
          if (updated) return updated as unknown as ICategory;
        }
      } catch (err) {
        console.warn("[CategoryService] MongoDB update failed, falling back to local store:", err);
      }
    }
    return this.store.updateCategory(id, data);
  }

  static async deleteCategory(id: string): Promise<boolean> {
    if (this.isMongoConnected()) {
      try {
        if (mongoose.Types.ObjectId.isValid(id)) {
          const res = await CategoryModel.findByIdAndDelete(id);
          return !!res;
        }
      } catch (err) {
        console.warn("[CategoryService] MongoDB delete failed, falling back to local store:", err);
      }
    }
    return this.store.deleteCategory(id);
  }
}
