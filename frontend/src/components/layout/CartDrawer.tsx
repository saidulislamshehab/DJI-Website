"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalCount,
    freeShippingThreshold,
    freeShippingProgress,
    amountLeftForFreeShipping,
  } = useCart();

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

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-left">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#0071e3]" />
            <h2 className="text-lg font-bold text-[#121212]">
              Your Cart ({totalCount})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="p-4 bg-[#f5f5f7] border-b border-gray-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#121212] mb-1.5">
            <Truck className="w-4 h-4 text-[#0071e3]" />
            {amountLeftForFreeShipping > 0 ? (
              <span>
                Add <strong className="text-[#0071e3]">${amountLeftForFreeShipping.toFixed(2)}</strong> more for <strong>FREE Shipping</strong>
              </span>
            ) : (
              <span className="text-emerald-600 font-bold">
                🎉 You've unlocked FREE Express Shipping!
              </span>
            )}
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#0071e3] h-full rounded-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-gray-400 space-y-4">
              <div className="w-20 h-20 rounded-full bg-[#f5f5f7] flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-700">
                  Your cart is empty
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Explore our latest drones, handhelds, and cameras
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 px-6 py-2.5 bg-[#0071e3] hover:bg-[#0058b8] text-white text-sm font-semibold rounded-full transition"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3 bg-[#f5f5f7]/60 rounded-xl border border-gray-100 items-center"
              >
                <div className="w-20 h-20 bg-white rounded-lg p-1.5 flex-shrink-0 border border-gray-100 overflow-hidden flex items-center justify-center">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#121212] truncate">
                    {item.title}
                  </h4>
                  {item.subtitle && (
                    <p className="text-xs text-gray-500 truncate mb-1">
                      {item.subtitle}
                    </p>
                  )}
                  <div className="text-sm font-extrabold text-[#121212] mt-1">
                    ${item.price.toFixed(2)} AUD
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 text-gray-600 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-[#121212]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 text-gray-600 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-white space-y-4">
            <div className="flex justify-between text-base font-extrabold text-[#121212]">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)} AUD</span>
            </div>
            <p className="text-xs text-gray-500">
              Taxes and shipping calculated at checkout. Free warranty and Australian support included.
            </p>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#0071e3] hover:bg-[#0058b8] text-white font-bold rounded-xl text-base shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.01]"
              onClick={() => setIsCartOpen(false)}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Official Australian Warranty & Safe Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
