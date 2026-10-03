"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartTakeoffBar() {
  const { cart, totalCount, subtotal, setIsCartOpen } = useCart();

  if (totalCount === 0) return null;

  const firstItem = cart[0];

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-slide-up max-w-md w-[calc(100vw-3rem)]">
      <div className="bg-[#121212] text-white p-4 rounded-2xl shadow-2xl border border-white/10 flex items-center justify-between gap-4 backdrop-blur-md">
        {/* Left Thumb & Title */}
        <div
          className="flex items-center gap-3 cursor-pointer min-w-0"
          onClick={() => setIsCartOpen(true)}
        >
          {firstItem && (
            <div className="w-12 h-12 rounded-xl bg-white p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
              <img
                src={firstItem.img}
                alt={firstItem.title}
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white truncate flex items-center gap-1.5">
              <span>Your Cart is Ready for Take-Off</span>
              <span className="bg-[#0071e3] text-white text-[10px] px-1.5 py-0.2 rounded-full">
                {totalCount}
              </span>
            </h4>
            <p className="text-xs text-gray-400 font-semibold">
              ${subtotal.toFixed(2)} AUD
            </p>
          </div>
        </div>

        {/* Right CTA */}
        <Link
          href="/checkout"
          className="flex-shrink-0 px-4 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0058b8] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-blue-500/30"
        >
          <span>Checkout</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
