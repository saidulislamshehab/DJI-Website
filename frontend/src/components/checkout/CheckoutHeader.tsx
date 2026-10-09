"use client";

import React from "react";
import Link from "next/link";
import { Lock, ShoppingBag, ArrowLeft } from "lucide-react";

interface CheckoutHeaderProps {
  itemCount: number;
}

export default function CheckoutHeader({ itemCount }: CheckoutHeaderProps) {
  return (
    <header className="w-full bg-white border-b border-gray-200/80 sticky top-0 z-40">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo & Store Link */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 group transition-opacity hover:opacity-90"
            aria-label="D1 Store Homepage"
          >
            <img
              src="//www.d1store.com.au/cdn/shop/files/DJIxD1STORE-ARS-PNG.png?v=1768876884&width=360"
              alt="D1 Store - Australia's First DJI Authorised Retailer"
              className="h-7 sm:h-9 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Right action: Return to cart and Security Badge */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50/80 border border-emerald-200/70 px-3 py-1 rounded-full">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted</span>
          </div>

          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 hover:text-[#0071e3] transition-colors p-2 sm:px-3 sm:py-1.5 rounded-lg hover:bg-gray-50"
            aria-label="Return to cart"
          >
            <div className="relative flex items-center">
              <ShoppingBag className="w-5 h-5 text-gray-700" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#0071e3] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Return to cart</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
