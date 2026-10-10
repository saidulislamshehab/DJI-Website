"use client";

import React from "react";

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
    <div
      style={{
        position: "sticky",
        top: "var(--nav-offset, 72px)",
        transition: "top 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        zIndex: 30,
      }}
      className="w-full bg-white/95 backdrop-blur-md border-y border-gray-200/90 shadow-xs py-2 sm:py-3 will-change-[top]"
    >
      <div className="max-w-[1400px] mx-auto px-3.5 sm:px-6 md:px-9 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left / Center Navigation Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 w-full lg:w-auto">
          {sections.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => onScrollToSection(sec.id)}
                className={`h-8 sm:h-9 px-3.5 sm:px-5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-[#0071e3] text-white shadow-xs"
                    : "text-gray-700 hover:text-black hover:bg-gray-100"
                }`}
              >
                {sec.label}
              </button>
            );
          })}
        </div>

        {/* Right Desktop Quick Buy Widget */}
        <div className="hidden lg:flex items-center gap-3.5 flex-shrink-0">
          <div className="flex flex-col text-right">
            <span className="text-xs sm:text-sm font-semibold text-[#121212] line-clamp-1 max-w-[240px]">
              {currentTitle}
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#0071e3]">
              ${currentPrice.toLocaleString()}.00 AUD
            </span>
          </div>
          <button
            type="button"
            onClick={onAddToCart}
            className="h-9 px-5 rounded-lg bg-[#0071e3] text-white text-xs sm:text-sm font-semibold hover:bg-[#0058b8] transition-all cursor-pointer shadow-xs"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
