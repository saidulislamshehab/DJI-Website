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
  { id: 1, isReview: true, quote: "“Staff were friendly and helpful.”", author: "Kamseng" },
  { id: 2, isReview: false, text: "Free Shipping on Orders over $199" },
  { id: 3, isReview: true, quote: "“So helpful and knowledgeable.”", author: "Shane" },
  { id: 4, isReview: false, text: "Free Shipping on Orders over $199" },
  { id: 5, isReview: true, quote: "“Always super helpful.”", author: "Matt" },
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = announcements[currentIndex];

  return (
    <div className="w-full bg-[#121212] text-white py-1.5 px-4 relative z-50 overflow-hidden border-b border-[#222]">
      <div className="max-w-[1760px] mx-auto flex items-center justify-center min-h-[20px]">
        {/* Centered Message */}
        <div className="text-center font-bold text-[12px] md:text-[13px] tracking-normal select-none transition-opacity duration-300">
          {!current.isReview ? (
            <span>{current.text}</span>
          ) : (
            <div className="inline-flex items-center justify-center gap-1.5 flex-wrap">
              <span className="text-[#f5a623] text-xs tracking-tight flex" aria-hidden="true">
                ★★★★★
              </span>
              <span className="text-white">{current.quote}</span>
              <span className="text-white/80 font-normal">— {current.author}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
