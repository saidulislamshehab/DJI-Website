"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { X, Trash2, Plus, Minus, Check, Info } from "lucide-react";
import { useCart } from "@/context/CartContext";

const CROSS_SELL_ACCESSORY = {
  id: "sunnylife-propellers-mini-3-4",
  slug: "sunnylife-low-noise-propellers-for-dji-mini-3-4-pro",
  title: "SunnyLife Low-Noise Propellers for DJI Mini 3/4 Pro",
  price: 29.0,
  img: "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-SL-6030F-01.jpg?v=1790826992",
  subtitle: "Mini 3/4 Pro",
};

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    addToCart,
    subtotal,
    freeShippingThreshold,
    freeShippingProgress,
    amountLeftForFreeShipping,
  } = useCart();

  const [addedCrossSell, setAddedCrossSell] = useState(false);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleAddCrossSell = () => {
    addToCart(CROSS_SELL_ACCESSORY, 1);
    setAddedCrossSell(true);
    setTimeout(() => setAddedCrossSell(false), 2000);
  };

  const isFreeShipping = amountLeftForFreeShipping <= 0 || subtotal >= freeShippingThreshold;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-[420px] sm:max-w-[440px] md:max-w-[460px] bg-white h-full shadow-2xl flex flex-col z-10 transition-transform duration-300">
        {cart.length === 0 ? (
          /* =======================================================
             EMPTY CART STATE (Matches Reference Screenshot 1)
             ======================================================= */
          <div className="flex-1 flex flex-col p-6 sm:p-7 overflow-y-auto">
            {/* Top Close Button */}
            <div className="flex justify-end -mr-2 -mt-2">
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-gray-800 hover:text-black transition"
                aria-label="Close cart"
              >
                <X className="w-6 h-6 stroke-[1.5]" />
              </button>
            </div>

            {/* Empty Main Content */}
            <div className="flex-1 flex flex-col justify-start pt-8 sm:pt-10">
              <h2 className="text-[26px] sm:text-[28px] font-black text-[#111827] text-center tracking-tight leading-tight">
                Your cart is empty
              </h2>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-[#0070e0] hover:bg-[#005bb5] text-white font-semibold text-[14px] sm:text-[15px] px-8 py-3 rounded-lg shadow-xs transition-colors"
                >
                  Continue shopping
                </button>
              </div>

              {/* Account Prompt */}
              <div className="text-center mt-12 sm:mt-14">
                <h3 className="text-[17px] font-black text-[#111827]">
                  Have an account?
                </h3>
                <p className="text-[14px] text-gray-500 mt-1.5">
                  <Link
                    href="/account"
                    onClick={() => setIsCartOpen(false)}
                    className="underline text-gray-700 hover:text-black font-normal"
                  >
                    Log in
                  </Link>{" "}
                  to check out faster.
                </p>
              </div>

              {/* Forget Something Section */}
              <div className="mt-12 sm:mt-14">
                <h4 className="text-[14px] font-bold text-[#111827] mb-2.5">
                  Forget Something?
                </h4>
                <div className="bg-[#f9fafb] border border-[#f3f4f6] rounded-xl p-3 flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 bg-white rounded-lg border border-gray-100 p-1 flex items-center justify-center shrink-0">
                      <img
                        src={CROSS_SELL_ACCESSORY.img}
                        alt={CROSS_SELL_ACCESSORY.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-bold text-[#111827] leading-tight line-clamp-1">
                        {CROSS_SELL_ACCESSORY.title}
                      </div>
                      <div className="text-[13px] text-gray-500 mt-0.5">
                        ${CROSS_SELL_ACCESSORY.price.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleAddCrossSell}
                    className="w-8 h-8 rounded-full bg-[#111827] hover:bg-black text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                    aria-label="Add propellers to cart"
                  >
                    {addedCrossSell ? (
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* =======================================================
             FILLED CART STATE (Matches Reference Screenshot 2)
             ======================================================= */
          <>
            {/* Header */}
            <div className="p-6 pb-2.5 flex items-center justify-between">
              <h2 className="text-[24px] font-black text-[#111827] tracking-tight">
                Your cart
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={clearCart}
                  className="text-[13px] text-gray-400 hover:text-gray-700 transition cursor-pointer font-normal"
                >
                  Clear cart
                </button>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#f3f4f6] hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-black transition cursor-pointer"
                  aria-label="Close cart"
                >
                  <X className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="px-6 pb-4">
              <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#059669]">
                <Check className="w-4 h-4 stroke-[3]" />
                {isFreeShipping ? (
                  <span>Free Standard Shipping Unlocked</span>
                ) : (
                  <span>
                    Add ${amountLeftForFreeShipping.toFixed(2)} more for Free Shipping
                  </span>
                )}
              </div>
              <div className="w-full bg-gray-100 h-1 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-[#10b981] h-full rounded-full transition-all duration-300"
                  style={{ width: `${isFreeShipping ? 100 : freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Scrollable Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3.5 py-2.5"
                >
                  {/* Thumbnail in Square Box */}
                  <div className="w-[74px] h-[74px] sm:w-[78px] sm:h-[78px] bg-white rounded-lg border border-gray-100 p-1.5 flex items-center justify-center shrink-0 shadow-2xs">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://cdn.shopify.com/s/files/1/0693/6448/2209/files/PRODUCT-THUMB-TRANSSDR2-C-01.jpg?v=1789624836";
                      }}
                    />
                  </div>

                  {/* Middle Info Column */}
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-[14px] font-bold text-[#111827] leading-tight line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-[12px] text-gray-500 mt-1">
                      {item.subtitle || "Configuration: Combo"}
                    </p>

                    {/* Quantity Selector + Trash Icon */}
                    <div className="flex items-center gap-3 mt-2.5">
                      <div className="flex items-center border border-gray-200 rounded-md bg-[#fafafa] px-2 py-0.5 gap-2.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-gray-400 hover:text-black transition flex items-center justify-center w-3.5 h-3.5 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3 stroke-[2.5]" />
                        </button>
                        <span className="text-[12px] font-semibold text-[#111827] min-w-[14px] text-center select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-gray-400 hover:text-black transition flex items-center justify-center w-3.5 h-3.5 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3 stroke-[2.5]" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition p-1 cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5 stroke-[1.75]" />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-[15px] font-semibold text-[#111827] shrink-0 pt-0.5 text-right whitespace-nowrap">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}

              {/* Forget Something Cross-sell section */}
              <div className="pt-3 pb-2">
                <h4 className="text-[14px] font-bold text-[#111827] mb-2.5">
                  Forget Something?
                </h4>
                <div className="bg-[#f9fafb] border border-[#f3f4f6] rounded-xl p-3 flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 bg-white rounded-lg border border-gray-100 p-1 flex items-center justify-center shrink-0">
                      <img
                        src={CROSS_SELL_ACCESSORY.img}
                        alt={CROSS_SELL_ACCESSORY.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-bold text-[#111827] leading-tight line-clamp-1">
                        {CROSS_SELL_ACCESSORY.title}
                      </div>
                      <div className="text-[13px] text-gray-500 mt-0.5">
                        ${CROSS_SELL_ACCESSORY.price.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleAddCrossSell}
                    className="w-8 h-8 rounded-full bg-[#111827] hover:bg-black text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                    aria-label="Add propellers to cart"
                  >
                    {addedCrossSell ? (
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Pinned Bottom Summary & Checkout */}
            <div className="p-6 border-t border-gray-100 bg-white space-y-3.5">
              {/* Total Row */}
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-bold text-[#111827]">
                  Total
                </span>
                <span className="text-[20px] font-black text-[#111827] tracking-tight">
                  ${subtotal.toFixed(2)} AUD
                </span>
              </div>

              {/* Installments info (Zip) */}
              <div className="text-[12px] text-gray-600 flex items-center justify-center gap-1.5 flex-wrap">
                <span>
                  or up to <strong className="font-bold text-[#111827]">6 months</strong> interest free. Fees apply.
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#2e234e] text-[#aa8cff] font-black text-[10px] tracking-tight leading-none shadow-2xs">
                  zip
                </span>
                <Info className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
              </div>

              {/* Taxes & Shipping note */}
              <p className="text-[11px] text-gray-400 text-center leading-normal">
                Taxes included. Discounts and{" "}
                <Link
                  href="/policies/shipping-policy"
                  className="underline hover:text-gray-600"
                >
                  shipping
                </Link>{" "}
                calculated at checkout.
              </p>

              {/* Check Out Button */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full bg-[#0070e0] hover:bg-[#005bb5] text-white font-semibold text-[15px] py-3.5 rounded-lg shadow-xs transition-colors flex items-center justify-center text-center cursor-pointer"
              >
                Check Out
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
