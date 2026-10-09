"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import {
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Tag,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Lock,
} from "lucide-react";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discountAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    freeShippingThreshold,
    amountLeftForFreeShipping,
    freeShippingProgress,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Australian Shipping & GST calculations
  const isFreeShipping = appliedCoupon?.freeShipping || subtotal >= freeShippingThreshold || subtotal === 0;
  const standardShippingFee = isFreeShipping ? 0 : 15;
  const netSubtotal = Math.max(0, subtotal - discountAmount);
  const total = netSubtotal + standardShippingFee;
  // Australian GST is 10% inclusive of taxable total
  const estimatedGst = total > 0 ? Math.round((total / 11) * 100) / 100 : 0;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    if (!couponInput.trim()) {
      setCouponError("Please enter a valid coupon code.");
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const result = await applyCoupon(couponInput.trim());
      if (result.success) {
        setCouponSuccess(result.message || `Coupon '${couponInput.trim().toUpperCase()}' applied!`);
        setCouponInput("");
      } else {
        setCouponError(result.message || "Invalid coupon code. Try 'WELCOME10' or 'FREESHIP'");
      }
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleDirectQuantityChange = (id: string | number, valueStr: string) => {
    const parsed = parseInt(valueStr, 10);
    if (!isNaN(parsed) && parsed > 0) {
      updateQuantity(id, Math.min(parsed, 99));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-[#121212]">
      <Header />

      <main className="flex-1 page-width py-8 md:py-14">
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#121212] tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Review your DJI equipment before proceeding to secure checkout
            </p>
          </div>

          {cart.length > 0 && (
            <div className="flex items-center gap-3">
              <Link
                href="/collections/all"
                className="text-xs sm:text-sm font-semibold text-gray-600 hover:text-[#0071e3] transition-colors"
              >
                &larr; Continue Shopping
              </Link>
              <span className="text-gray-300">|</span>
              <button
                type="button"
                onClick={clearCart}
                className="text-xs sm:text-sm font-bold text-red-500 hover:text-red-700 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>

        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-3xl p-10 sm:p-16 text-center border border-gray-200 max-w-lg mx-auto shadow-xs my-8">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0071e3] flex items-center justify-center mx-auto mb-5 ring-8 ring-blue-50/50">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-[#121212] mb-2">Your cart is currently empty</h2>
            <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
              You don&apos;t have any drones, gimbals, or accessories in your cart yet. Explore our official DJI range to get started.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/collections/all"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0071e3] text-white font-bold text-sm hover:bg-[#0058b8] transition-all shadow-md text-center"
              >
                Explore All Products &rarr;
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-all text-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Shipping Progress Indicator */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                  <div className="flex items-center gap-2 text-[#0071e3]">
                    <Truck className="w-4 h-4" />
                    <span>
                      {isFreeShipping
                        ? "Congratulations! You have unlocked FREE Express Delivery Australia-wide!"
                        : `Add $${amountLeftForFreeShipping.toFixed(2)} AUD more to unlock FREE Standard Courier Delivery`}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 hidden sm:inline">
                    {freeShippingProgress.toFixed(0)}%
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      isFreeShipping ? "bg-emerald-500" : "bg-[#0071e3]"
                    }`}
                    style={{ width: `${Math.min(100, freeShippingProgress)}%` }}
                  />
                </div>
              </div>

              {/* Items Table / Card List */}
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 overflow-hidden shadow-xs divide-y divide-gray-100">
                {cart.map((item) => (
                  <div
                    key={String(item.id)}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Item Thumbnail */}
                    <Link
                      href={item.slug ? `/products/${item.slug}` : `/collections/all`}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#f8f8fa] p-2 flex items-center justify-center flex-shrink-0 border border-gray-100 overflow-hidden group"
                    >
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </Link>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <Link
                        href={item.slug ? `/products/${item.slug}` : `/collections/all`}
                        className="text-sm sm:text-base font-bold text-[#121212] hover:text-[#0071e3] transition-colors block truncate"
                      >
                        {item.title}
                      </Link>
                      {item.variantTitle && (
                        <p className="text-xs font-medium text-gray-500">
                          Option: <span className="text-gray-800">{item.variantTitle}</span>
                        </p>
                      )}
                      {item.subtitle && (
                        <p className="text-xs text-gray-400">{item.subtitle}</p>
                      )}
                      <div className="text-sm font-black text-[#121212] sm:hidden pt-1">
                        ${item.price.toLocaleString()} AUD
                      </div>
                    </div>

                    {/* Quantity Controls with Direct Number Input */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-200 rounded-xl bg-white p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={item.quantity}
                          onChange={(e) => handleDirectQuantityChange(item.id, e.target.value)}
                          className="w-10 text-center text-xs sm:text-sm font-black text-[#121212] bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          aria-label="Item quantity"
                        />

                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove product"
                        aria-label="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price Calculation for line */}
                    <div className="hidden sm:block text-right w-28">
                      <div className="text-base font-black text-[#121212]">
                        ${(item.price * item.quantity).toLocaleString()} AUD
                      </div>
                      <div className="text-xs text-gray-400">
                        ${item.price.toLocaleString()} each
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Security & Buyer Assurance */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-gray-200 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#0071e3] shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-[#121212]">Official DJI Warranty</p>
                    <p className="text-gray-500">Australian stock & service</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-200 flex items-center gap-3">
                  <Truck className="w-5 h-5 text-[#0071e3] shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-[#121212]">Fast StarTrack Express</p>
                    <p className="text-gray-500">Dispatched from NSW/VIC</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-200 flex items-center gap-3">
                  <Lock className="w-5 h-5 text-[#0071e3] shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-[#121212]">Safe & Encrypted</p>
                    <p className="text-gray-500">256-Bit SSL payment</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Checkout */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-xs sticky top-24">
                <h2 className="text-xl font-black text-[#121212] tracking-tight">Order Summary</h2>

                {/* Promotional Coupon Input */}
                <div>
                  <label htmlFor="coupon" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Promotional Coupon / Gift Code
                  </label>
                  {appliedCoupon ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold">
                        <Tag className="w-4 h-4 text-emerald-600" />
                        <span>Code: {appliedCoupon.code}</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-red-500 hover:text-red-700 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        id="coupon"
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="e.g. WELCOME10, FREESHIP"
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#0071e3] uppercase tracking-wider"
                      />
                      <button
                        type="submit"
                        disabled={isApplyingCoupon || !couponInput.trim()}
                        className="px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isApplyingCoupon ? "..." : "Apply"}
                      </button>
                    </form>
                  )}

                  {couponError && (
                    <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{couponError}</span>
                    </p>
                  )}
                  {couponSuccess && (
                    <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{couponSuccess}</span>
                    </p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 text-xs sm:text-sm pt-2 border-t border-gray-100">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#121212]">${subtotal.toLocaleString()} AUD</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Discount ({appliedCoupon?.code})</span>
                      </span>
                      <span>-${discountAmount.toLocaleString()} AUD</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Standard Shipping (StarTrack / AusPost)</span>
                    <span className={`font-bold ${isFreeShipping ? "text-emerald-600" : "text-[#121212]"}`}>
                      {isFreeShipping ? "FREE" : `$${standardShippingFee}.00 AUD`}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-500 text-xs">
                    <span className="flex items-center gap-1">
                      <span>Estimated GST (10% inclusive)</span>
                      <span title="Australian GST is 10% inclusive of all retail sales" className="cursor-help inline-flex items-center">
                        <HelpCircle className="w-3 h-3 text-gray-400" />
                      </span>
                    </span>
                    <span>${estimatedGst.toLocaleString()} AUD</span>
                  </div>

                  {/* Final Payable Amount */}
                  <div className="pt-3 border-t border-gray-200 flex justify-between text-base font-black text-[#121212]">
                    <span>Total Amount</span>
                    <span className="text-xl text-[#0071e3]">${total.toLocaleString()} AUD</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  className="w-full py-4 rounded-xl bg-[#0071e3] hover:bg-[#0058b8] text-white font-black text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="pt-2 text-xs text-gray-500 space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>256-Bit SSL Encrypted Checkout</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-gray-400">
                    Tax invoice with Australian Business Number (ABN: 84 624 487 186) automatically generated on order placement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
