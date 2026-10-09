import { Request, Response, NextFunction } from "express";
import { ReviewService } from "../services/review.service";
import { ApiResponse } from "../utils/apiResponse";

export class ReviewController {
  static async getProductReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : (req.params.slug || "");
      const data = await ReviewService.getProductReviews(slug);
      ApiResponse.success(res, data, "Product reviews retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async createReview(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : (req.params.slug || "");
      const { userName, userEmail, rating, title, comment } = req.body;
      const review = await ReviewService.createReview(slug, {
        userName,
        userEmail,
        rating,
        title,
        comment,
      });
      ApiResponse.success(res, review, "Review submitted successfully", 201);
    } catch (error: any) {
      ApiResponse.error(res, error.message || "Failed to submit review", 400);
    }
  }

  static async voteHelpful(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reviewId = Array.isArray(req.params.reviewId) ? req.params.reviewId[0] : (req.params.reviewId || "");
      const success = await ReviewService.voteHelpful(reviewId);
      ApiResponse.success(res, { success }, "Helpful vote recorded");
    } catch (error) {
      next(error);
    }
  }
}
