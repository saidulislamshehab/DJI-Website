import { Schema, model, Document } from "mongoose";
import { ICollection } from "../types";

export interface ICollectionDocument extends Omit<ICollection, "_id">, Document {}

const collectionSchema = new Schema<ICollectionDocument>(
  {
    shopifyId: { type: Number },
    title: { type: String, required: true, trim: true },
    handle: { type: String, required: true, unique: true, trim: true, index: true },
    description: { type: String },
    tagline: { type: String },
    image: { type: String },
    heroBannerImage: { type: String },
    heroMobileImage: { type: String },
    breadcrumbs: [{ type: String }],
    tabs: [{ type: String }],
    subTabs: [
      {
        title: { type: String },
        handle: { type: String },
      },
    ],
    productsCount: { type: Number, default: 0 },
    sortOrder: { type: String, default: "best-selling" },
    publishedAt: { type: Date },
    category: { type: String, default: "products", index: true },
    categoryGroup: { type: String, default: "products", index: true },
    isCategoryListing: { type: Boolean, default: false, index: true },
    dataTitle: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const CollectionModel = model<ICollectionDocument>("Collection", collectionSchema);
