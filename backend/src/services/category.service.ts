import { CategoryModel, ICategoryDocument } from "../models/category.model";
import { ICategory } from "../types";

export class CategoryService {
  static async getAllCategories(): Promise<ICategoryDocument[]> {
    return CategoryModel.find().sort({ featuredOrder: 1, name: 1 }).exec();
  }

  static async getCategoryBySlug(slug: string): Promise<ICategoryDocument | null> {
    return CategoryModel.findOne({ slug }).exec();
  }

  static async createCategory(data: Partial<ICategory>): Promise<ICategoryDocument> {
    return CategoryModel.create(data);
  }
}
