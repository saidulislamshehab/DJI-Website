import { Schema, model, Document } from "mongoose";
import { IArticle } from "../types";

export interface IArticleDocument extends Omit<IArticle, "_id">, Document {}

const articleSchema = new Schema<IArticleDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    summary: { type: String, required: true },
    content: { type: String },
    author: { type: String, default: "D1 Store Team" },
    publishedAt: { type: Date, default: Date.now },
    image: { type: String },
    category: { type: String, default: "Guides" },
    readTime: { type: String, default: "5 min read" },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const ArticleModel = model<IArticleDocument>("Article", articleSchema);
