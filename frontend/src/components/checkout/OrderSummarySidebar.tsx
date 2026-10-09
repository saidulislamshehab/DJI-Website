"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CartItem } from "@/context/CartContext";
import { Tag, X, ShieldCheck, Truck, HelpCircle, AlertCircle, CheckCircle2 } from "lucide-react";

interface OrderSummarySidebarProps {
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  appliedCoupon: {
    code: string;
    discountAmount: number;
    message: string;
    freeShipping?: boolean;
  } | null;
  shippingFee: number;
  tax: number;
  total: number;
  onApplyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  onRemoveCoupon: () => void;
  shippingMethodLabel?: string;
}

export default function OrderSummarySidebar({
  items,
  subtotal,
  discountAmount,
  appliedCoupon,
  shippingFee,
  tax,
  total,
  onApplyCoupon,
  onRemoveCoupon,
  shippingMethodLabel,
}: OrderSummarySidebarProps) {
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    if (!couponCodeInput.trim()) return;

    setIsApplying(true);
    try {
      const res = await onApplyCoupon(couponCodeInput.trim());
      if (res.success) {
        setCouponSuccess(res.message);
        setCouponCodeInput("");
      } else {
        setCouponError(res.message || "Invalid discount code");
      }
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Product Items List */}
      <div className="space-y-4 divide-y divide-gray-200/80">
        {items.map((item) => {
          const itemKey = String(item.id);
          const lineTotal = item.price * item.quantity;

          return (
            <div key={itemKey} className="pt-4 first:pt-0 flex items-center gap-4 group">
              {/* Product Thumbnail with Floating Quantity Badge */}
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl border border-gray-200/90 bg-white p-2 flex items-center justify-center shrink-0 shadow-2xs">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-contain"
                />
                <span
                  className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs font-bold h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center shadow-xs ring-2 ring-white"
                  aria-label={`Quantity: ${item.quantity}`}
                >
                  {item.quantity}
                </span>
              </div>

              {/* Title & Variant Details */}
              <div className="flex-1 min-w-0 pr-2">
                <Link
                  href={item.slug ? `/products/${item.slug}` : "/collections/all"}
                  className="text-sm sm:text-[15px] font-semibold text-gray-900 hover:text-[#0071e3] transition-colors line-clamp-2 leading-snug"
                >
                  {item.title}
                </Link>
                {item.variantTitle && (
                  <p className="text-xs sm:text-[13px] text-gray-500 mt-0.5 truncate">
                    {item.variantTitle}
                  </p>
                )}
                {item.subtitle && !item.variantTitle && (
                  <p className="text-xs sm:text-[13px] text-gray-400 mt-0.5 truncate">
                    {item.subtitle}
                  </p>
                )}
              </div>

              {/* Line Price */}
              <div className="text-right shrink-0">
                <span className="text-sm sm:text-[15px] font-bold text-gray-900">
                  ${lineTotal.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Discount Code Form */}
      <div className="pt-1">
        {appliedCoupon ? (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-sm">
            <div className="flex items-center gap-2.5 text-emerald-800 font-bold">
              <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{appliedCoupon.code}</span>
              <span className="text-emerald-700 font-medium">
                (-${discountAmount.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
              </span>
            </div>
            <button
              type="button"
              onClick={onRemoveCoupon}
              className="text-gray-400 hover:text-red-600 transition-colors p-1"
              aria-label="Remove coupon"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApply} className="flex gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={couponCodeInput}
                onChange={(e) => setCouponCodeInput(e.target.value)}
                placeholder="Discount code or gift card"
                className="w-full h-12 px-4 rounded-xl border border-gray-300 text-[15px] text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0071e3] focus:border-[#0071e3] uppercase transition-all shadow-xs"
                aria-label="Discount code or gift card"
              />
            </div>
            <button
              type="submit"
              disabled={isApplying || !couponCodeInput.trim()}
              className="h-12 px-6 rounded-xl bg-gray-900 hover:bg-black text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-xs"
            >
              {isApplying ? "..." : "Apply"}
            </button>
          </form>
        )}

        {couponError && (
          <p className="text-xs sm:text-[13px] text-red-600 mt-2 flex items-center gap-1.5 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{couponError}</span>
          </p>
        )}
        {couponSuccess && (
          <p className="text-xs sm:text-[13px] text-emerald-600 mt-2 flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{couponSuccess}</span>
          </p>
        )}
      </div>

      {/* Financial Breakdown */}
      <div className="space-y-3 pt-5 border-t border-gray-200/90 text-sm sm:text-[15px]">
        {/* Subtotal */}
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-semibold text-gray-900">
            ${subtotal.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* Discount (if applicable) */}
        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-700 font-semibold">
            <span className="flex items-center gap-1.5">
              <Tag className="w-4 h-4" />
              <span>Discount &bull; {appliedCoupon?.code}</span>
            </span>
            <span>
              -${discountAmount.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        )}

        {/* Shipping */}
        <div className="flex justify-between text-gray-600">
          <div>
            <span>Shipping</span>
            {shippingMethodLabel && (
              <span className="text-xs text-gray-400 block mt-0.5">{shippingMethodLabel}</span>
            )}
          </div>
          <span className="font-semibold text-gray-900">
            {shippingFee === 0 ? (
              <span className="text-emerald-700 font-bold uppercase text-xs sm:text-[13px]">Free</span>
            ) : (
              `$${shippingFee.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            )}
          </span>
        </div>

        {/* Taxes Note */}
        <div className="flex justify-between text-gray-500 text-xs sm:text-[13px] pt-1">
          <span className="flex items-center gap-1.5">
            <span>Estimated Australian GST</span>
            <span title="Australian 10% Goods & Services Tax is inclusive">
              <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
            </span>
          </span>
          <span className="font-medium">
            ${tax.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* Grand Total */}
        <div className="pt-4 border-t border-gray-200 flex items-baseline justify-between">
          <div>
            <span className="text-base sm:text-lg font-bold text-gray-900 block leading-tight">Total</span>
            <span className="text-xs text-gray-500 font-normal">
              Including ${tax.toFixed(2)} in GST
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs sm:text-sm text-gray-500 font-semibold mr-1.5">AUD</span>
            <span className="text-2xl sm:text-[26px] font-black text-gray-900 tracking-tight">
              ${total.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Trust & Guarantee Badges */}
      <div className="pt-5 border-t border-gray-200/90 space-y-3 text-xs sm:text-[13px] text-gray-600">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="text-gray-900 font-semibold block">Official DJI Australia Authorised Stock</span>
            <span className="text-gray-500 text-xs">Full Australian Manufacturer Warranty & ACL consumer coverage.</span>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Truck className="w-4.5 h-4.5 text-[#0071e3] shrink-0 mt-0.5" />
          <div>
            <span className="text-gray-900 font-semibold block">StarTrack Express Priority Dispatch</span>
            <span className="text-gray-500 text-xs">Insured express courier with live tracking from Sydney & Melbourne hubs.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
