import { Schema, model, Document } from "mongoose";
import { IProduct } from "../types";

export interface IProductDocument extends Omit<IProduct, "_id">, Document {}

const productSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    sku: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, trim: true },
    categorySlug: { type: String, required: true, trim: true, index: true },
    subCategory: { type: String, trim: true },
    collections: [{ type: String, index: true }],
    tags: [{ type: String, index: true }],
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    discountPercentage: { type: Number, default: 0 },
    badge: { type: String, trim: true },
    tagline: { type: String, trim: true },
    description: { type: String, required: true },
    features: [{ type: String }],
    specs: { type: Map, of: Schema.Types.Mixed },
    images: [{ type: String }],
    mainImage: { type: String, required: true },
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, default: 0 },
    rating: {
      type: Number,
      default: 4.9,
      min: 0,
      max: 5,
      set: (val: number) => Math.round(Number(val) * 10) / 10,
    },
    reviewCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isProfessional: { type: Boolean, default: false },
    isEnterprise: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const ProductModel = model<IProductDocument>("Product", productSchema);
