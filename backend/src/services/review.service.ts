import mongoose from "mongoose";
import { ReviewModel } from "../models/review.model";
import { ProductModel } from "../models/product.model";
import { OrderModel } from "../models/order.model";
import { IReview, IReviewSummary } from "../types";

export class ReviewService {
  private static isMongoConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  static async getProductReviews(slug: string): Promise<{
    reviews: IReview[];
    summary: IReviewSummary;
  }> {
    let reviews: IReview[] = [];

    if (this.isMongoConnected()) {
      try {
        const docs = await ReviewModel.find({ productSlug: slug, status: "approved" })
          .sort({ createdAt: -1 })
          .lean();
        reviews = docs.map((doc: any) => ({
          ...doc,
          _id: doc._id?.toString(),
        })) as IReview[];
      } catch (err) {
        console.warn("[ReviewService] MongoDB query failed:", err);
      }
    }

    // Calculate summary statistics
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;

    reviews.forEach((r) => {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      distribution[rounded] = (distribution[rounded] || 0) + 1;
      sum += r.rating;
    });

    const totalReviews = reviews.length;
    let averageRating = totalReviews > 0 ? Math.round((sum / totalReviews) * 10) / 10 : 0;

    // If no reviews yet, check product's default rating
    if (totalReviews === 0 && this.isMongoConnected()) {
      try {
        const prod = await ProductModel.findOne({ slug }).select("rating reviewCount").lean();
        if (prod && prod.reviewCount && prod.reviewCount > 0) {
          averageRating = prod.rating || 5.0;
        }
      } catch {
        // ignore
      }
    }

    const percentages = {
      5: totalReviews > 0 ? Math.round((distribution[5] / totalReviews) * 100) : 0,
      4: totalReviews > 0 ? Math.round((distribution[4] / totalReviews) * 100) : 0,
      3: totalReviews > 0 ? Math.round((distribution[3] / totalReviews) * 100) : 0,
      2: totalReviews > 0 ? Math.round((distribution[2] / totalReviews) * 100) : 0,
      1: totalReviews > 0 ? Math.round((distribution[1] / totalReviews) * 100) : 0,
    };

    return {
      reviews,
      summary: {
        averageRating,
        totalReviews,
        distribution,
        percentages,
      },
    };
  }

  static async createReview(
    slug: string,
    data: {
      userName: string;
      userEmail: string;
      rating: number;
      title?: string;
      comment: string;
    }
  ): Promise<IReview> {
    const cleanRating = Math.min(5, Math.max(1, Math.round(Number(data.rating) || 5)));
    const cleanEmail = String(data.userEmail || "").trim().toLowerCase();
    const cleanName = String(data.userName || "").trim();
    const cleanTitle = String(data.title || "").trim();
    const cleanComment = String(data.comment || "").trim();

    if (!cleanName || cleanName.length < 2) {
      throw new Error("Display name must be at least 2 characters.");
    }
    if (!cleanEmail || !cleanEmail.includes("@")) {
      throw new Error("Please provide a valid email address.");
    }
    if (!cleanComment || cleanComment.length < 5) {
      throw new Error("Review comment must be at least 5 characters.");
    }

    let isVerifiedPurchase = false;
    let productId: string | undefined = undefined;

    if (this.isMongoConnected()) {
      try {
        // Check if verified buyer from completed/active orders
        const matchingOrder = await OrderModel.findOne({
          "customer.email": cleanEmail,
          "items.slug": slug,
        }).lean();

        if (matchingOrder) {
          isVerifiedPurchase = true;
        }

        const product = await ProductModel.findOne({ slug }).select("_id").lean();
        if (product) {
          productId = product._id?.toString();
        }

        const created = await ReviewModel.create({
          productId,
          productSlug: slug,
          userName: cleanName,
          userEmail: cleanEmail,
          rating: cleanRating,
          title: cleanTitle,
          comment: cleanComment,
          isVerifiedPurchase,
          helpfulCount: 0,
          status: "approved",
        });

        // Recalculate average rating & reviewCount for product
        const allReviews = await ReviewModel.find({ productSlug: slug, status: "approved" }).lean();
        const total = allReviews.length;
        const totalRatingSum = allReviews.reduce((acc, r) => acc + r.rating, 0);
        const newAvg = total > 0 ? Math.round((totalRatingSum / total) * 10) / 10 : cleanRating;

        await ProductModel.findOneAndUpdate(
          { slug },
          { rating: newAvg, reviewCount: total }
        );

        return {
          ...created.toObject(),
          _id: created._id.toString(),
        } as IReview;
      } catch (err: any) {
        console.error("[ReviewService] Failed to create review in MongoDB:", err);
        throw err;
      }
    }

    throw new Error("Database not connected. Please try again later.");
  }

  static async voteHelpful(reviewId: string): Promise<boolean> {
    if (this.isMongoConnected()) {
      try {
        const updated = await ReviewModel.findByIdAndUpdate(
          reviewId,
          { $inc: { helpfulCount: 1 } },
          { new: true }
        );
        return !!updated;
      } catch (err) {
        console.warn("[ReviewService] Vote helpful failed:", err);
      }
    }
    return false;
  }
}
