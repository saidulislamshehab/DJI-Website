"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AnnouncementItem {
  id: number;
  isReview: boolean;
  text?: string;
  quote?: string;
  author?: string;
}

const announcements: AnnouncementItem[] = [
  { id: 1, isReview: false, text: "Free Shipping on Orders over $199" },
  { id: 2, isReview: true, quote: "“Staff were friendly and helpful.”", author: "Kamseng" },
  { id: 3, isReview: false, text: "Free Shipping on Orders over $199" },
  { id: 4, isReview: true, quote: "“So helpful and knowledgeable.”", author: "Shane" },
  { id: 5, isReview: false, text: "Free Shipping on Orders over $199" },
  { id: 6, isReview: true, quote: "“Always super helpful.”", author: "Matt" },
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? announcements.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  const current = announcements[currentIndex];

  return (
    <div className="w-full bg-[#121212] text-white py-2 px-4 relative z-50 overflow-hidden border-b border-[#222]">
      <div className="max-w-[1760px] mx-auto flex items-center justify-between min-h-[22px]">
        {/* Previous Button (subtle) */}
        <button
          onClick={handlePrev}
          className="text-white/60 hover:text-white transition-opacity p-0.5"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Message */}
        <div className="flex-1 text-center font-bold text-[13px] tracking-normal select-none transition-opacity duration-300">
          {!current.isReview ? (
            <span>{current.text}</span>
          ) : (
            <div className="inline-flex items-center justify-center gap-1.5 flex-wrap">
              <span className="text-[#f5a623] text-xs tracking-tight flex" aria-hidden="true">
                ★★★★★
              </span>
              <span className="text-white">{current.quote}</span>
              <span className="text-white/70 font-normal">— {current.author}</span>
            </div>
          )}
        </div>

        {/* Next Button (subtle) */}
        <button
          onClick={handleNext}
          className="text-white/60 hover:text-white transition-opacity p-0.5"
          aria-label="Next announcement"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
