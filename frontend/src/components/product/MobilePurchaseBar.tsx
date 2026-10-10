"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, CheckCircle2 } from "lucide-react";

interface MobilePurchaseBarProps {
  title: string;
  price: number;
  image: string;
  inStock: boolean;
  onAddToCart: () => void;
  isAdded: boolean;
}

export default function MobilePurchaseBar({
  title,
  price,
  image,
  inStock,
  onAddToCart,
  isAdded,
}: MobilePurchaseBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past the top buy box (approx 650px)
      if (window.scrollY > 650) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isVisible) {
      document.body.classList.add("has-bottom-bar");
    } else {
      document.body.classList.remove("has-bottom-bar");
    }
    return () => {
      document.body.classList.remove("has-bottom-bar");
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl px-4 py-3 animate-in slide-in-from-bottom-4 duration-300">
      <div className="max-w-[600px] mx-auto flex items-center justify-between gap-3.5">
        {/* Left: Thumbnail & Price */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 p-1 flex items-center justify-center flex-shrink-0">
            <img src={image} alt={title} className="max-w-full max-h-full object-contain" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-[#121212] truncate max-w-[160px] sm:max-w-[220px]">
              {title}
            </h4>
            <div className="text-base font-black text-[#0071e3]">
              ${price.toLocaleString()}.00 <span className="text-xs font-bold text-gray-500">AUD</span>
            </div>
          </div>
        </div>

        {/* Right: Buy Button */}
        <button
          type="button"
          disabled={!inStock}
          onClick={onAddToCart}
          className={`h-[48px] px-6 rounded-full font-bold text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer shadow-sm whitespace-nowrap flex-shrink-0 ${
            isAdded
              ? "bg-emerald-600 text-white"
              : inStock
              ? "bg-[#0071e3] hover:bg-[#005bb8] text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isAdded ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Added!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
