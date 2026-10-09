"use client";

import React, { useState } from "react";
import {
  Star,
  ShieldCheck,
  ThumbsUp,
  MessageSquare,
  CheckCircle2,
  X,
  AlertCircle,
} from "lucide-react";
import { IReview, IReviewSummary } from "@/types";
import { createProductReviewApi, voteReviewHelpfulApi } from "@/lib/api";

interface ProductReviewsProps {
  productSlug: string;
  productName: string;
  reviews: IReview[];
  summary: IReviewSummary;
  onReviewAdded: (newReview: IReview) => void;
}

export default function ProductReviews({
  productSlug,
  productName,
  reviews,
  summary,
  onReviewAdded,
}: ProductReviewsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [votedReviews, setVotedReviews] = useState<Record<string, boolean>>({});
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>({});

  // Form state
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const handleHelpfulVote = async (reviewId: string) => {
    if (votedReviews[reviewId]) return;

    setVotedReviews((prev) => ({ ...prev, [reviewId]: true }));
    setHelpfulCounts((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] ?? (reviews.find((r) => r._id === reviewId)?.helpfulCount || 0)) + 1,
    }));

    await voteReviewHelpfulApi(productSlug, reviewId);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!userName.trim() || userName.length < 2) {
      setFormError("Please enter your display name (at least 2 characters).");
      return;
    }
    if (!userEmail.trim() || !userEmail.includes("@")) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (!comment.trim() || comment.length < 5) {
      setFormError("Review comment must be at least 5 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createProductReviewApi(productSlug, {
        userName: userName.trim(),
        userEmail: userEmail.trim(),
        rating,
        title: title.trim(),
        comment: comment.trim(),
      });

      if (res.success && res.review) {
        setFormSuccess("Thank you! Your review has been published.");
        onReviewAdded(res.review);
        setTimeout(() => {
          setIsModalOpen(false);
          setUserName("");
          setUserEmail("");
          setTitle("");
          setComment("");
          setRating(5);
          setFormSuccess("");
        }, 1500);
      } else {
        setFormError(res.message || "Failed to submit review.");
      }
    } catch {
      setFormError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const avgRating = summary.averageRating || (reviews.length > 0 ? 5 : 0);
  const totalCount = summary.totalReviews || reviews.length;

  return (
    <section id="reviews" className="max-w-[1400px] mx-auto px-4 md:px-9 py-16">
      {/* Section Header */}
      <div className="text-center max-w-[760px] mx-auto mb-10">
        <span className="text-[#0071e3] font-black uppercase text-xs sm:text-sm tracking-widest block mb-2">
          VERIFIED CUSTOMER FEEDBACK
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-[42px] font-black text-[#121212] tracking-tight">
          Customer Reviews
        </h2>
        <p className="text-base sm:text-lg text-gray-500 mt-2">
          Real experiences and ratings from creators and pilots across Australia.
        </p>
      </div>

      {/* Review Summary Breakdown Box */}
      <div className="bg-[#fbfbfd] border border-gray-200/90 rounded-[28px] p-6 sm:p-10 mb-10 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Average Rating Score */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center md:border-r md:border-gray-200/90 pr-0 md:pr-8">
            <div className="text-[60px] sm:text-[72px] font-black text-[#121212] tracking-tight leading-none mb-2">
              {avgRating > 0 ? avgRating.toFixed(1) : "5.0"}
            </div>
            <div className="flex items-center text-amber-400 gap-1.5 mb-2.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < Math.floor(avgRating || 5)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm sm:text-base text-gray-600 font-semibold">
              Based on {totalCount} {totalCount === 1 ? "review" : "verified reviews"}
            </span>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="mt-6 h-[48px] px-8 rounded-full bg-[#0071e3] hover:bg-[#0058b8] text-white text-base font-bold transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center gap-2.5"
            >
              <MessageSquare className="w-4.5 h-4.5" />
              <span>Write a Review</span>
            </button>
          </div>

          {/* Star Distribution Progress Bars */}
          <div className="md:col-span-8 space-y-3.5 pl-0 md:pl-6">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = summary.distribution[star as 1 | 2 | 3 | 4 | 5] || 0;
              const pct = summary.percentages[star as 1 | 2 | 3 | 4 | 5] || 0;

              return (
                <div key={star} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                  <div className="w-14 flex items-center gap-1.5 justify-end flex-shrink-0">
                    <span>{star}</span>
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="flex-1 h-3.5 rounded-full bg-gray-200/80 overflow-hidden relative">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="w-20 text-right text-gray-500 font-semibold text-xs sm:text-sm flex-shrink-0">
                    {count} ({pct}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-5">
          {reviews.map((rev, idx) => {
            const currentHelpful = helpfulCounts[rev._id || ""] ?? rev.helpfulCount ?? 0;
            const hasVoted = votedReviews[rev._id || ""];

            return (
              <div
                key={rev._id || idx}
                className="bg-white rounded-[24px] border border-gray-200/90 p-6 sm:p-8 shadow-xs hover:border-gray-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0071e3] font-bold text-base flex items-center justify-center border border-blue-100 flex-shrink-0">
                        {rev.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-bold text-[#121212] text-base">
                            {rev.userName}
                          </span>
                          {rev.isVerifiedPurchase && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-xs sm:text-sm text-gray-400 mt-0.5 block">
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString("en-AU", { year: "numeric", month: "short", day: "numeric" }) : "Recent"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center text-amber-400 gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4.5 h-4.5 ${
                            i < rev.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {rev.title && (
                    <h4 className="font-bold text-lg sm:text-[19px] text-[#121212] mb-2.5 leading-snug">
                      {rev.title}
                    </h4>
                  )}

                  <p className="text-[15px] sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                    {rev.comment}
                  </p>
                </div>

                {/* Helpful Button */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
                  <span className="font-medium">Was this review helpful to you?</span>
                  <button
                    type="button"
                    disabled={hasVoted}
                    onClick={() => rev._id && handleHelpfulVote(rev._id)}
                    className={`inline-flex items-center gap-2 h-[40px] px-4 rounded-full border transition-all cursor-pointer font-bold text-sm ${
                      hasVoted
                        ? "bg-blue-50 border-blue-200 text-[#0071e3]"
                        : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:text-black hover:bg-gray-50"
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Helpful ({currentHelpful})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#fbfbfd] rounded-[26px] border border-gray-200/90 p-12 sm:p-16 text-center max-w-[680px] mx-auto">
          <MessageSquare className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl sm:text-2xl font-bold text-[#121212] mb-2">
            No reviews yet for {productName}
          </h3>
          <p className="text-base text-gray-500 mb-8 max-w-[500px] mx-auto leading-relaxed">
            Have you used this product? Be the first to share your experience with the Australian creator community.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="h-[48px] px-8 rounded-full bg-[#0071e3] hover:bg-[#0058b8] text-white text-base font-bold transition-all shadow-sm hover:shadow-md cursor-pointer inline-flex items-center gap-2"
          >
            <MessageSquare className="w-4.5 h-4.5" />
            <span>Leave the First Review</span>
          </button>
        </div>
      )}

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Write a Customer Review"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-[26px] max-w-[600px] w-full p-6 sm:p-9 shadow-2xl relative border border-gray-100 my-8">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-black uppercase text-[#0071e3] tracking-wider block mb-1">
                CUSTOMER FEEDBACK
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#121212]">
                Write a Review
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Sharing your thoughts helps Australian pilots and creators make informed choices.
              </p>
            </div>

            {formError && (
              <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-bold flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-5">
              {/* Star Rating Selector */}
              <div>
                <label className="text-sm font-bold text-gray-800 block mb-2">
                  Your Overall Rating:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => {
                    const activeVal = hoverRating ?? rating;
                    const isFilled = s <= activeVal;

                    return (
                      <button
                        key={s}
                        type="button"
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(null)}
                        onClick={() => setRating(s)}
                        className="p-1 cursor-pointer focus:outline-none transition-transform hover:scale-110"
                        aria-label={`${s} star rating`}
                      >
                        <Star
                          className={`w-8 h-8 ${
                            isFilled ? "fill-amber-400 text-amber-400" : "text-gray-300"
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="text-sm font-bold text-gray-700 ml-3">
                    {rating} of 5 Stars
                  </span>
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-800 block mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Lachlan Walker"
                    className="w-full h-[48px] px-4 rounded-xl border border-gray-300 text-base font-medium focus:outline-none focus:border-[#0071e3] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-800 block mb-1.5">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="e.g. lachlan@example.com"
                    className="w-full h-[48px] px-4 rounded-xl border border-gray-300 text-base font-medium focus:outline-none focus:border-[#0071e3] transition-colors"
                  />
                  <span className="text-xs text-gray-400 block mt-1">
                    Used to verify authentic order purchases.
                  </span>
                </div>
              </div>

              {/* Review Title */}
              <div>
                <label className="text-sm font-bold text-gray-800 block mb-1.5">
                  Headline / Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Best portable 4K gimbal for travel"
                  className="w-full h-[48px] px-4 rounded-xl border border-gray-300 text-base font-medium focus:outline-none focus:border-[#0071e3] transition-colors"
                />
              </div>

              {/* Review Comment */}
              <div>
                <label className="text-sm font-bold text-gray-800 block mb-1.5">
                  Detailed Review *
                </label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about performance, build quality, video clarity, stabilization, battery life, and accessories..."
                  className="w-full p-4 rounded-xl border border-gray-300 text-base font-medium focus:outline-none focus:border-[#0071e3] resize-none transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-[48px] px-6 rounded-full border border-gray-300 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-[48px] px-8 rounded-full bg-[#0071e3] hover:bg-[#005bb8] text-white text-base font-bold transition-all shadow-sm hover:shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
