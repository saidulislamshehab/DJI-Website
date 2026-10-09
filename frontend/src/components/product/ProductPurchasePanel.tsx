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
  ShieldAlert,
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

  return (
    <div className="flex flex-col space-y-[24px]">
      {/* Brand & Badge Header */}
      <div>
        <div className="flex items-center gap-[8px] mb-[8px] flex-wrap">
          <span className="px-[10px] py-[3px] rounded-full text-[11px] font-black uppercase tracking-wider bg-black text-white">
            DJI Genuine
          </span>
          {product.badge && (
            <span className="px-[10px] py-[3px] rounded-full text-[11px] font-black uppercase tracking-wider bg-[#0071e3] text-white">
              {product.badge}
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-[10px] py-[3px] rounded-full text-[11px] font-bold text-emerald-800 bg-emerald-100">
              New Arrival
            </span>
          )}
          {savings > 0 && (
            <span className="px-[10px] py-[3px] rounded-full text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              Save ${savings.toLocaleString()} AUD
            </span>
          )}
        </div>

        {/* Product Title */}
        <h1 className="text-[26px] sm:text-[32px] md:text-[36px] font-black text-[#121212] tracking-tight leading-[1.15]">
          {currentTitle}
        </h1>

        {/* Short Subtitle or Tagline */}
        {(product.tagline || product.subCategory) && (
          <p className="text-[14px] text-gray-500 mt-1 font-medium">
            {product.tagline || product.subCategory}
          </p>
        )}

        {/* Rating and Reviews Counter (Clickable to scroll to #reviews) */}
        <div className="flex items-center gap-3 mt-3">
          <button
            type="button"
            onClick={onScrollToReviews}
            className="flex items-center gap-1.5 text-gray-700 hover:text-[#0071e3] transition-colors cursor-pointer group"
          >
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-[15px] h-[15px] ${
                    i < Math.floor(displayRating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-[13px] font-bold text-[#121212]">
              {displayRating.toFixed(1)}
            </span>
            <span className="text-[13px] text-gray-500 group-hover:underline">
              ({displayReviewCount} {displayReviewCount === 1 ? "review" : "reviews"})
            </span>
          </button>

          <span className="text-gray-300">•</span>

          {/* SKU */}
          <span className="text-[12px] text-gray-500 font-mono">
            SKU: <strong className="text-gray-700">{currentSku}</strong>
          </span>
        </div>
      </div>

      {/* Price & Stock Display */}
      <div className="py-[16px] px-[20px] rounded-[18px] bg-[#fafafa] border border-gray-200/80 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-[10px]">
            <span className="text-[28px] sm:text-[32px] font-black text-[#121212] tracking-tight">
              ${currentPrice.toLocaleString()}.00
            </span>
            <span className="text-[13px] font-semibold text-gray-500">AUD</span>
            {originalPriceDisplay && originalPriceDisplay > currentPrice && (
              <span className="text-[16px] text-gray-400 line-through">
                ${originalPriceDisplay.toLocaleString()}.00
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-500 mt-0.5">Price includes GST. Official Australian Stock.</p>
        </div>

        {/* In-Stock Indicator */}
        <div className="text-right">
          {product.inStock ? (
            <span className="inline-flex items-center gap-[6px] px-[12px] py-[6px] rounded-full text-[12px] font-bold bg-emerald-100 text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              In Stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-[6px] px-[12px] py-[6px] rounded-full text-[12px] font-bold bg-red-100 text-red-800">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Product Variants & Configurations */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-[10px]">
          <label className="text-[13px] font-bold text-gray-700 block">
            Select Configuration / Combo:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
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
                  className={`p-[14px] rounded-[16px] border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-[#0071e3] bg-blue-50/50 shadow-xs ring-2 ring-[#0071e3]/20"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-[#121212] line-clamp-1">
                      {v.name}
                    </span>
                    {v.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#0071e3]">
                        {v.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[14px] font-black text-[#0071e3] mt-2">
                    ${v.price ? Number(v.price).toLocaleString() : currentPrice.toLocaleString()}.00 AUD
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Optional DJI Care Refresh Protection Plan */}
      <div className="space-y-[10px] p-[16px] rounded-[18px] bg-[#fbfbfd] border border-gray-200/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0071e3]" />
            <span className="text-[13px] font-bold text-[#121212]">
              DJI Care Refresh Protection
            </span>
          </div>
          <span className="text-[11px] text-gray-500">Accidental Damage Cover</span>
        </div>

        <div className="grid grid-cols-3 gap-[8px]">
          <button
            type="button"
            onClick={() => onChangeCareRefresh("none")}
            className={`py-2 px-3 rounded-[12px] text-xs font-bold border transition-all cursor-pointer text-center ${
              careRefreshPlan === "none"
                ? "border-[#0071e3] bg-white text-[#0071e3] shadow-xs"
                : "border-gray-200 bg-white/60 text-gray-600 hover:border-gray-300"
            }`}
          >
            No Plan
          </button>
          <button
            type="button"
            onClick={() => onChangeCareRefresh("1year")}
            className={`py-2 px-3 rounded-[12px] text-xs font-bold border transition-all cursor-pointer text-center ${
              careRefreshPlan === "1year"
                ? "border-[#0071e3] bg-white text-[#0071e3] shadow-xs"
                : "border-gray-200 bg-white/60 text-gray-600 hover:border-gray-300"
            }`}
          >
            1-Year Plan
            <span className="block text-[10px] font-normal text-gray-500 mt-0.5">+$59 AUD</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeCareRefresh("2year")}
            className={`py-2 px-3 rounded-[12px] text-xs font-bold border transition-all cursor-pointer text-center ${
              careRefreshPlan === "2year"
                ? "border-[#0071e3] bg-white text-[#0071e3] shadow-xs"
                : "border-gray-200 bg-white/60 text-gray-600 hover:border-gray-300"
            }`}
          >
            2-Year Plan
            <span className="block text-[10px] font-normal text-gray-500 mt-0.5">+$99 AUD</span>
          </button>
        </div>
      </div>

      {/* Quantity & Action Buttons */}
      <div className="space-y-[12px]">
        <div className="flex items-center gap-[12px]">
          {/* Quantity Selector */}
          <div className="flex items-center border border-gray-300 rounded-[12px] bg-white h-[50px] px-2 shadow-xs">
            <button
              type="button"
              disabled={quantity <= 1}
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              aria-label="Decrease quantity"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              min={1}
              max={product.stockCount > 0 ? product.stockCount : 99}
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 1) onQuantityChange(val);
              }}
              className="w-12 text-center font-bold text-sm text-[#121212] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => onQuantityChange(quantity + 1)}
              aria-label="Increase quantity"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Primary Add to Cart Button */}
          <button
            type="button"
            disabled={!product.inStock}
            onClick={onAddToCart}
            className={`flex-1 h-[50px] rounded-[12px] font-bold transition-all flex items-center justify-center gap-[8px] cursor-pointer shadow-xs text-sm sm:text-base ${
              isAdded
                ? "bg-emerald-600 text-white"
                : product.inStock
                ? "bg-[#121212] hover:bg-black text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isAdded ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>

        {/* Secondary Instant Checkout / Buy Now Button */}
        <button
          type="button"
          disabled={!product.inStock}
          onClick={onBuyNow}
          className="w-full h-[50px] rounded-[12px] bg-[#0071e3] hover:bg-[#005bb8] text-white font-bold transition-all flex items-center justify-center gap-[8px] cursor-pointer shadow-xs text-sm sm:text-base"
        >
          <Zap className="w-5 h-5" />
          <span>Buy Now • Instant Checkout</span>
        </button>
      </div>

      {/* D1 Store Trust Value Propositions */}
      <div className="pt-[18px] border-t border-gray-100 grid grid-cols-2 gap-y-[12px] gap-x-[16px] text-gray-700">
        <div className="flex items-center gap-[8px]">
          <Truck className="w-4 h-4 text-[#0071e3] flex-shrink-0" />
          <span className="text-[12px] font-semibold">Free Express Shipping &gt;$99</span>
        </div>
        <div className="flex items-center gap-[8px]">
          <ShieldCheck className="w-4 h-4 text-[#0071e3] flex-shrink-0" />
          <span className="text-[12px] font-semibold">2-Year Official AU Warranty</span>
        </div>
        <div className="flex items-center gap-[8px]">
          <RotateCcw className="w-4 h-4 text-[#0071e3] flex-shrink-0" />
          <span className="text-[12px] font-semibold">14-Day Return Guarantee</span>
        </div>
        <div className="flex items-center gap-[8px]">
          <Building2 className="w-4 h-4 text-[#0071e3] flex-shrink-0" />
          <span className="text-[12px] font-semibold">12+ Stores for Click &amp; Collect</span>
        </div>
      </div>
    </div>
  );
}
