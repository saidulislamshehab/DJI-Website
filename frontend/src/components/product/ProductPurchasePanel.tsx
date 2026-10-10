"use client";

import React from "react";
import {
  Star,
  CheckCircle2,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Building2,
  Minus,
  Plus,
  Tag,
} from "lucide-react";
import { IProduct } from "@/types";

interface ProductPurchasePanelProps {
  product: IProduct;
  currentTitle: string;
  currentPrice: number;
  originalPriceDisplay?: number;
  currentSku: string;
  selectedVariant: string;
  onSelectVariant: (key: string, variantId?: string) => void;
  careRefreshPlan: "none" | "1year" | "2year";
  onChangeCareRefresh: (plan: "none" | "1year" | "2year") => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  isAdded: boolean;
  averageRating?: number;
  totalReviews?: number;
  onScrollToReviews: () => void;
}

export default function ProductPurchasePanel({
  product,
  currentTitle,
  currentPrice,
  originalPriceDisplay,
  currentSku,
  selectedVariant,
  onSelectVariant,
  careRefreshPlan,
  onChangeCareRefresh,
  quantity,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  isAdded,
  averageRating = 4.9,
  totalReviews = 0,
  onScrollToReviews,
}: ProductPurchasePanelProps) {
  const savings =
    originalPriceDisplay && originalPriceDisplay > currentPrice
      ? originalPriceDisplay - currentPrice
      : 0;

  const displayRating = averageRating || product.rating || 4.9;
  const displayReviewCount = totalReviews > 0 ? totalReviews : product.reviewCount || 0;
  const stockQty = product.stockCount ?? 0;
  const isAvailable = Boolean(product.inStock && stockQty > 0);

  return (
    <div className="flex flex-col space-y-6">
      {/* Brand & Badge Header */}
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black text-white">
            DJI Genuine
          </span>
          {product.badge && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#0071e3] text-white">
              {product.badge}
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-emerald-800 bg-emerald-100">
              New Arrival
            </span>
          )}
          {savings > 0 && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 flex items-center gap-1.5">
              <Tag className="w-3 h-3" />
              Save ${savings.toLocaleString()} AUD
            </span>
          )}
        </div>

        {/* Product Title */}
        <h1 className="text-xl sm:text-2xl md:text-[24px] font-bold text-[#121212] tracking-tight leading-snug">
          {currentTitle}
        </h1>

        {/* Short Subtitle or Tagline */}
        {(product.tagline || product.subCategory) && (
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-normal">
            {product.tagline || product.subCategory}
          </p>
        )}

        {/* Rating and Reviews Counter (Clickable to scroll to #reviews) */}
        <div className="flex items-center gap-3.5 mt-3.5">
          <button
            type="button"
            onClick={onScrollToReviews}
            className="flex items-center gap-1.5 text-gray-700 hover:text-[#0071e3] transition-colors cursor-pointer group"
          >
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(displayRating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-[#121212]">
              {displayRating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500 group-hover:underline">
              ({displayReviewCount} {displayReviewCount === 1 ? "review" : "reviews"})
            </span>
          </button>

          <span className="text-gray-300">•</span>

          {/* SKU */}
          <span className="text-xs text-gray-500 font-mono">
            SKU: <strong className="text-gray-700">{currentSku}</strong>
          </span>
        </div>
      </div>

      {/* Price & Stock Display */}
      <div className="py-3 px-4 rounded-xl bg-[#fafafa] border border-gray-200/90 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-[#121212] tracking-tight">
              ${currentPrice.toLocaleString()}.00
            </span>
            <span className="text-xs font-semibold text-gray-500">AUD</span>
            {originalPriceDisplay && originalPriceDisplay > currentPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${originalPriceDisplay.toLocaleString()}.00
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-500 mt-0.5">Price includes GST. Official Australian Stock.</p>
        </div>

        {/* In-Stock Indicator */}
        <div className="text-right">
          {!isAvailable ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-800">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              No Stock
            </span>
          ) : stockQty <= 5 ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Low Stock • Only {stockQty} left
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              In Stock • {stockQty} available
            </span>
          )}
        </div>
      </div>

      {/* Product Variants & Configurations */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-semibold text-gray-800 block">
            Select Configuration / Combo:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {product.variants.map((v: any, idx: number) => {
              const vKey = v.variantId || v.sku || v.name;
              const isSelected =
                selectedVariant.toLowerCase() === vKey.toLowerCase() ||
                selectedVariant.toLowerCase() === v.name.toLowerCase();

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectVariant(vKey, v.variantId)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-[#0071e3] bg-blue-50/50 shadow-xs ring-2 ring-[#0071e3]/20"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-[#121212] line-clamp-1">
                      {v.name}
                    </span>
                    {v.badge && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-100 text-[#0071e3]">
                        {v.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-[#0071e3] mt-1.5">
                    ${v.price ? Number(v.price).toLocaleString() : currentPrice.toLocaleString()}.00 AUD
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Optional DJI Care Refresh Protection Plan */}
      <div className="space-y-2.5 p-3.5 sm:p-4 rounded-xl bg-[#fbfbfd] border border-gray-200/90">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#0071e3]" />
            <span className="text-xs sm:text-sm font-semibold text-[#121212]">
              DJI Care Refresh Protection
            </span>
          </div>
          <span className="text-[11px] text-gray-500 font-normal">Accidental Damage Cover</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onChangeCareRefresh("none")}
            className={`min-h-[44px] py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
              careRefreshPlan === "none"
                ? "border-[#0071e3] bg-white text-[#0071e3] shadow-xs ring-1 ring-[#0071e3]"
                : "border-gray-200 bg-white/70 text-gray-600 hover:border-gray-300"
            }`}
          >
            <span>No Plan</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeCareRefresh("1year")}
            className={`min-h-[44px] py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
              careRefreshPlan === "1year"
                ? "border-[#0071e3] bg-white text-[#0071e3] shadow-xs ring-1 ring-[#0071e3]"
                : "border-gray-200 bg-white/70 text-gray-600 hover:border-gray-300"
            }`}
          >
            <span>1-Year Plan</span>
            <span className="block text-[10px] font-normal text-gray-500 mt-0.5">+$59 AUD</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeCareRefresh("2year")}
            className={`min-h-[44px] py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
              careRefreshPlan === "2year"
                ? "border-[#0071e3] bg-white text-[#0071e3] shadow-xs ring-1 ring-[#0071e3]"
                : "border-gray-200 bg-white/70 text-gray-600 hover:border-gray-300"
            }`}
          >
            <span>2-Year Plan</span>
            <span className="block text-[10px] font-normal text-gray-500 mt-0.5">+$99 AUD</span>
          </button>
        </div>
      </div>

      {/* Quantity & Action Buttons */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2.5">
          {/* Quantity Selector */}
          <div className={`flex items-center border rounded-xl h-[44px] px-1.5 shadow-xs ${
            !isAvailable ? "border-gray-200 bg-gray-50 opacity-50" : "border-gray-300 bg-white"
          }`}>
            <button
              type="button"
              disabled={!isAvailable || quantity <= 1}
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              aria-label="Decrease quantity"
              className="w-7 h-7 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input
              type="number"
              min={1}
              max={stockQty > 0 ? stockQty : 1}
              disabled={!isAvailable}
              value={!isAvailable ? 0 : quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 1) onQuantityChange(Math.min(stockQty > 0 ? stockQty : 1, val));
              }}
              className="w-10 text-center font-semibold text-xs sm:text-sm text-[#121212] focus:outline-none disabled:bg-transparent"
            />
            <button
              type="button"
              disabled={!isAvailable || quantity >= stockQty}
              onClick={() => onQuantityChange(quantity + 1)}
              aria-label="Increase quantity"
              className="w-7 h-7 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Primary Add to Cart Button */}
          <button
            type="button"
            disabled={!isAvailable}
            onClick={onAddToCart}
            className={`flex-1 h-[44px] rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-xs text-xs sm:text-sm ${
              !isAvailable
                ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                : isAdded
                ? "bg-emerald-600 text-white cursor-pointer hover:shadow-md"
                : "bg-[#121212] hover:bg-black text-white cursor-pointer hover:shadow-md"
            }`}
          >
            {!isAvailable ? (
              <span>No Stock</span>
            ) : isAdded ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>

        {/* Secondary Instant Checkout / Buy Now Button */}
        <button
          type="button"
          disabled={!isAvailable}
          onClick={onBuyNow}
          className={`w-full h-[44px] rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-xs sm:text-sm shadow-xs ${
            !isAvailable
              ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
              : "bg-[#0071e3] hover:bg-[#005bb8] text-white cursor-pointer hover:shadow-md"
          }`}
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>{isAvailable ? "Buy Now • Instant Checkout" : "No Stock Available"}</span>
        </button>
      </div>

      {/* D1 Store Trust Value Propositions */}
      <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-y-3 gap-x-4 text-gray-700">
        <div className="flex items-center gap-2">
          <Truck className="w-4.5 h-4.5 text-[#0071e3] flex-shrink-0" />
          <span className="text-[13px] sm:text-sm font-semibold">Free Express Shipping &gt;$99</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4.5 h-4.5 text-[#0071e3] flex-shrink-0" />
          <span className="text-[13px] sm:text-sm font-semibold">2-Year Official AU Warranty</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4.5 h-4.5 text-[#0071e3] flex-shrink-0" />
          <span className="text-[13px] sm:text-sm font-semibold">14-Day Return Guarantee</span>
        </div>
        <div className="flex items-center gap-2">
          <Building2 className="w-4.5 h-4.5 text-[#0071e3] flex-shrink-0" />
          <span className="text-[13px] sm:text-sm font-semibold">12+ Stores for Click &amp; Collect</span>
        </div>
      </div>
    </div>
  );
}
