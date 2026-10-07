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
    <div className="fixed bottom-[24px] right-[24px] z-40 animate-slide-up max-w-[400px] w-[calc(100vw-48px)]">
      <div className="bg-[#121212] text-white p-[16px] rounded-[16px] shadow-2xl border border-white/10 flex items-center justify-between gap-[16px] backdrop-blur-md">
        {/* Left Thumb & Title */}
        <div
          className="flex items-center gap-[12px] cursor-pointer min-w-0"
          onClick={() => setIsCartOpen(true)}
        >
          {firstItem && (
            <div className="w-[48px] h-[48px] rounded-[12px] bg-white p-[4px] flex-shrink-0 flex items-center justify-center overflow-hidden">
              <img
                src={firstItem.img}
                alt={firstItem.title}
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div className="min-w-0">
            <h4 style={{ fontSize: "14px" }} className="font-bold text-white truncate flex items-center gap-[6px]">
              <span>Your Cart is Ready for Take-Off</span>
              <span style={{ fontSize: "11px" }} className="bg-[#0071e3] text-white px-[6px] py-[2px] rounded-full">
                {totalCount}
              </span>
            </h4>
            <p style={{ fontSize: "14px" }} className="text-gray-400 font-semibold mt-[2px]">
              ${subtotal.toFixed(2)} AUD
            </p>
          </div>
        </div>

        {/* Right CTA */}
        <Link
          href="/checkout"
          style={{ fontSize: "14px" }}
          className="flex-shrink-0 px-[20px] py-[10px] rounded-full bg-[#0071e3] hover:bg-[#0058b8] text-white font-bold transition-all flex items-center gap-[6px] shadow-lg shadow-blue-500/30"
        >
          <span>Checkout</span>
          <ArrowRight className="w-[16px] h-[16px]" />
        </Link>
      </div>
    </div>
  );
}
