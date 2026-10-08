import { Schema, model, Document } from "mongoose";
import { ICategory, ISubCategory, ICategoryOption } from "../types";

export interface ICategoryDocument extends Omit<ICategory, "_id">, Document {}
export interface ISubCategoryDocument extends Omit<ISubCategory, "_id">, Document {}
export interface ICategoryOptionDocument extends Omit<ICategoryOption, "_id">, Document {}

export const categoryOptionSchema = new Schema<ICategoryOptionDocument>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, trim: true },
  url: { type: String, required: true, trim: true },
  badge: { type: String, trim: true },
  categoryName: { type: String, trim: true },
  categorySlug: { type: String, trim: true },
  subCategoryName: { type: String, trim: true },
  subCategorySlug: { type: String, trim: true },
});

export const subCategorySchema = new Schema<ISubCategoryDocument>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, trim: true },
  url: { type: String, trim: true },
  thumbnail: { type: String, trim: true },
  badge: { type: String, trim: true },
  categoryName: { type: String, trim: true },
  categorySlug: { type: String, trim: true },
  options: [categoryOptionSchema],
  productCount: { type: Number, default: 0 },
});

export const categorySchema = new Schema<ICategoryDocument>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    url: { type: String, trim: true },
    description: { type: String, trim: true },
    icon: { type: String, trim: true },
    image: { type: String, trim: true },
    subCategories: [subCategorySchema],
    productCount: { type: Number, default: 0 },
    featuredOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const CategoryModel = model<ICategoryDocument>("Category", categorySchema, "categories");
export const SubCategoryModel = model<ISubCategoryDocument>("SubCategory", subCategorySchema, "subcategories");
export const CategoryOptionModel = model<ICategoryOptionDocument>("CategoryOption", categoryOptionSchema, "category_options");

