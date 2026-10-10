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
    <div className="fixed bottom-4 left-3 right-3 sm:bottom-6 sm:left-auto sm:right-24 z-30 animate-slide-up max-w-[420px] w-auto sm:w-[380px]">
      <div className="bg-[#121212] text-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl border border-white/10 flex items-center justify-between gap-2.5 sm:gap-4 backdrop-blur-md">
        {/* Left Thumb & Title */}
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer min-w-0"
          onClick={() => setIsCartOpen(true)}
        >
          {firstItem && (
            <div className="w-[38px] h-[38px] sm:w-[48px] sm:h-[48px] rounded-lg sm:rounded-[12px] bg-white p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
              <img
                src={firstItem.img}
                alt={firstItem.title}
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div className="min-w-0">
            <h4 className="text-xs sm:text-[15px] font-bold text-white truncate flex items-center gap-1.5">
              <span>Cart Ready for Take-Off</span>
              <span className="text-[10px] sm:text-[12px] bg-[#0071e3] text-white px-1.5 py-0.5 rounded-full">
                {totalCount}
              </span>
            </h4>
            <p className="text-[11px] sm:text-[14px] text-gray-400 font-semibold mt-0.5">
              ${subtotal.toFixed(2)} AUD
            </p>
          </div>
        </div>

        {/* Right CTA */}
        <Link
          href="/checkout"
          className="flex-shrink-0 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0058b8] text-white font-bold transition-all flex items-center gap-1.5 text-xs sm:text-sm shadow-lg shadow-blue-500/30"
        >
          <span>Checkout</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Link>
      </div>
    </div>
  );
}
