import mongoose, { Schema, model, Document } from "mongoose";
import { IProduct } from "../types";

export interface IProductDocument extends Omit<IProduct, "_id">, Omit<Document, "_id"> {
  _id: string;
}

const productSchema = new Schema<IProductDocument>(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
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
    inStock: { type: Boolean, default: false },
    stockCount: { type: Number, default: 0, min: 0 },
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
    tier: {
      type: String,
      enum: ["product", "bundle", "accessory"],
      default: "product",
      index: true,
    },
    inTheBox: [{ type: Schema.Types.Mixed }],
    compatibility: [{ type: String }],
    highlights: [{ type: String }],
    bundleInclusions: [{ type: Schema.Types.Mixed }],
    bundleMainProduct: { type: Schema.Types.Mixed },
    faqs: [{ type: Schema.Types.Mixed }],
    storyBlocks: [{ type: Schema.Types.Mixed }],
    variants: [{ type: Schema.Types.Mixed }],
    inTheBoxVariants: { type: Schema.Types.Mixed },
    videoShowcases: [{ type: Schema.Types.Mixed }],
    rawSpecs: [{ type: Schema.Types.Mixed }],
    overviewBanner: { type: Schema.Types.Mixed },
    featureCards: [{ type: Schema.Types.Mixed }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.pre("save", function () {
  if (typeof this.stockCount === "number") {
    this.stockCount = Math.max(0, Math.floor(this.stockCount));
    this.inStock = this.stockCount > 0;
  } else {
    this.stockCount = this.inStock ? 1 : 0;
  }
});

export const ProductModel = model<IProductDocument>("Product", productSchema);
