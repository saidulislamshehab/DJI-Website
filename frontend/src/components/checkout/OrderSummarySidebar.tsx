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
      <div className="space-y-3.5 divide-y divide-gray-200/70">
        {items.map((item) => {
          const itemKey = String(item.id);
          const lineTotal = item.price * item.quantity;

          return (
            <div key={itemKey} className="pt-3.5 first:pt-0 flex items-center gap-3.5 group">
              {/* Product Thumbnail with Floating Quantity Badge */}
              <div className="relative w-16 h-16 rounded-xl border border-gray-200/90 bg-white p-1.5 flex items-center justify-center shrink-0 shadow-2xs">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-contain"
                />
                <span
                  className="absolute -top-2 -right-2 bg-gray-500 text-white text-[11px] font-bold h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center shadow-xs ring-2 ring-white"
                  aria-label={`Quantity: ${item.quantity}`}
                >
                  {item.quantity}
                </span>
              </div>

              {/* Title & Variant Details */}
              <div className="flex-1 min-w-0 pr-2">
                <Link
                  href={item.slug ? `/products/${item.slug}` : "/collections/all"}
                  className="text-xs sm:text-sm font-semibold text-gray-900 hover:text-[#0071e3] transition-colors line-clamp-2 leading-snug"
                >
                  {item.title}
                </Link>
                {item.variantTitle && (
                  <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                    {item.variantTitle}
                  </p>
                )}
                {item.subtitle && !item.variantTitle && (
                  <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                    {item.subtitle}
                  </p>
                )}
              </div>

              {/* Line Price */}
              <div className="text-right shrink-0">
                <span className="text-sm font-bold text-gray-900">
                  ${lineTotal.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Discount Code Form */}
      <div className="pt-2">
        {appliedCoupon ? (
          <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <Tag className="w-3.5 h-3.5 text-emerald-600" />
              <span>{appliedCoupon.code}</span>
              <span className="text-emerald-600 font-medium">
                (-${discountAmount.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
              </span>
            </div>
            <button
              type="button"
              onClick={onRemoveCoupon}
              className="text-gray-400 hover:text-red-600 transition-colors p-1"
              aria-label="Remove coupon"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApply} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={couponCodeInput}
                onChange={(e) => setCouponCodeInput(e.target.value)}
                placeholder="Discount code or gift card"
                className="w-full h-11 px-3.5 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] uppercase transition-all"
                aria-label="Discount code or gift card"
              />
            </div>
            <button
              type="submit"
              disabled={isApplying || !couponCodeInput.trim()}
              className="h-11 px-5 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
            >
              {isApplying ? "..." : "Apply"}
            </button>
          </form>
        )}

        {couponError && (
          <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{couponError}</span>
          </p>
        )}
        {couponSuccess && (
          <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{couponSuccess}</span>
          </p>
        )}
      </div>

      {/* Financial Breakdown */}
      <div className="space-y-2.5 pt-4 border-t border-gray-200/80 text-xs sm:text-sm">
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
              <Tag className="w-3.5 h-3.5" />
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
              <span className="text-[11px] text-gray-400 block">{shippingMethodLabel}</span>
            )}
          </div>
          <span className="font-semibold text-gray-900">
            {shippingFee === 0 ? (
              <span className="text-emerald-700 font-bold uppercase text-xs">Free</span>
            ) : (
              `$${shippingFee.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            )}
          </span>
        </div>

        {/* Taxes Note */}
        <div className="flex justify-between text-gray-500 text-xs pt-1">
          <span className="flex items-center gap-1">
            <span>Estimated Australian GST</span>
            <span title="Australian 10% Goods & Services Tax is inclusive">
              <HelpCircle className="w-3 h-3 text-gray-400" />
            </span>
          </span>
          <span>
            ${tax.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* Grand Total */}
        <div className="pt-3 border-t border-gray-200/90 flex items-baseline justify-between">
          <div>
            <span className="text-base font-bold text-gray-900 block leading-tight">Total</span>
            <span className="text-[11px] text-gray-500 font-normal">
              Including ${tax.toFixed(2)} in GST
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs text-gray-500 font-medium mr-1.5">AUD</span>
            <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              ${total.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Trust & Guarantee Badges */}
      <div className="pt-4 border-t border-gray-200/80 space-y-2 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-gray-700 font-medium">Official DJI Australia Authorised Retailer</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#0071e3] shrink-0" />
          <span>StarTrack Express priority air dispatch from Sydney / Melbourne</span>
        </div>
      </div>
    </div>
  );
}
