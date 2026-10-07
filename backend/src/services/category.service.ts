import { DbStore } from "./dbStore";
import { ICategory } from "../types";

export class CategoryService {
  private static store = DbStore.getInstance();

  static async getAllCategories(): Promise<ICategory[]> {
    return this.store.getCategories();
  }

  static async getCategoryBySlug(slug: string): Promise<ICategory | null> {
    return this.store.getCategoryBySlug(slug);
  }

  static async createCategory(data: Partial<ICategory>): Promise<ICategory> {
    return this.store.createCategory(data);
  }

  static async updateCategory(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
    return this.store.updateCategory(id, data);
  }

  static async deleteCategory(id: string): Promise<boolean> {
    return this.store.deleteCategory(id);
  }
}
