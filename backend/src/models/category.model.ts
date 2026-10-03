import { Schema, model, Document } from "mongoose";
import { ICategory } from "../types";

export interface ICategoryDocument extends Omit<ICategory, "_id">, Document {}

const categorySchema = new Schema<ICategoryDocument>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    description: { type: String, trim: true },
    icon: { type: String, trim: true },
    image: { type: String, trim: true },
    productCount: { type: Number, default: 0 },
    featuredOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const CategoryModel = model<ICategoryDocument>("Category", categorySchema);
