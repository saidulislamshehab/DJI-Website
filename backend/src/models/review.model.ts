import { Schema, model, Document } from "mongoose";
import { IReview } from "../types";

export interface IReviewDocument extends Omit<IReview, "_id">, Document {}

const reviewSchema = new Schema<IReviewDocument>(
  {
    productId: { type: String, index: true },
    productSlug: { type: String, required: true, index: true },
    userName: { type: String, required: true, trim: true },
    userEmail: { type: String, required: true, trim: true, lowercase: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, default: "" },
    comment: { type: String, required: true, trim: true },
    isVerifiedPurchase: { type: Boolean, default: false },
    helpfulCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      default: "approved",
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const ReviewModel = model<IReviewDocument>("Review", reviewSchema);
