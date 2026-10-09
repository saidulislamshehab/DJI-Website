"use client";

import React, { useEffect, useState } from "react";

interface ProductSectionNavigationProps {
  currentTitle: string;
  currentPrice: number;
  activeSection: string;
  onScrollToSection: (sectionId: string) => void;
  onAddToCart: () => void;
  hasInTheBox?: boolean;
  hasSpecs?: boolean;
  hasFaqs?: boolean;
  reviewsCount?: number;
}

export default function ProductSectionNavigation({
  currentTitle,
  currentPrice,
  activeSection,
  onScrollToSection,
  onAddToCart,
  hasInTheBox = true,
  hasSpecs = true,
  hasFaqs = true,
  reviewsCount = 0,
}: ProductSectionNavigationProps) {
  const sections = [
    { id: "overview", label: "Overview", visible: true },
    { id: "in-the-box", label: "In the Box", visible: hasInTheBox },
    { id: "specifications", label: "Specifications", visible: hasSpecs },
    { id: "faqs", label: "FAQ", visible: hasFaqs },
    { id: "reviews", label: `Reviews (${reviewsCount})`, visible: true },
  ].filter((s) => s.visible);

  return (
    <div className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-y border-gray-200/90 shadow-xs py-3.5 transition-all">
      <div className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] flex items-center justify-between gap-4">
        {/* Left / Center Navigation Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 w-full lg:w-auto">
          {sections.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => onScrollToSection(sec.id)}
                className={`px-4 sm:px-6 py-2 rounded-full text-[13px] sm:text-[14px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-[#0071e3] text-white shadow-xs"
                    : "text-gray-600 hover:text-black hover:bg-gray-100"
                }`}
              >
                {sec.label}
              </button>
            );
          })}
        </div>

        {/* Right Desktop Quick Buy Widget */}
        <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
          <div className="flex flex-col text-right">
            <span className="text-[13px] font-bold text-[#121212] line-clamp-1 max-w-[260px]">
              {currentTitle}
            </span>
            <span className="text-[14px] font-black text-[#0071e3]">
              ${currentPrice.toLocaleString()}.00 AUD
            </span>
          </div>
          <button
            type="button"
            onClick={onAddToCart}
            className="px-6 py-2 rounded-full bg-[#0071e3] text-white text-[13px] font-bold hover:bg-[#0058b8] transition-all cursor-pointer shadow-xs"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
