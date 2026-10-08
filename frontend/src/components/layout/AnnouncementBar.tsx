"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

export default function AnnouncementBar() {
  const [[currentIndex, direction], setPage] = useState([0, 1]);
  const [isPaused, setIsPaused] = useState(false);

  const paginate = useCallback((newDirection: number) => {
    setPage(([prevIndex]) => {
      const nextIndex = (prevIndex + newDirection + announcements.length) % announcements.length;
      return [nextIndex, newDirection];
    });
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      paginate(1);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, paginate]);

  const current = announcements[currentIndex];

  return (
    <div
      className="w-full bg-[#121212] text-white h-[36px] px-3 sm:px-4 relative z-50 overflow-hidden border-b border-[#222] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-[1760px] mx-auto h-full flex items-center justify-between">
        {/* Subtle Previous Button */}
        <button
          type="button"
          onClick={() => paginate(-1)}
          className="text-white/40 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 shrink-0 cursor-pointer focus:outline-hidden"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Fixed Dimension Container for Text with Smooth Left-Right Slide */}
        <div className="relative flex-1 h-[24px] max-w-[720px] mx-2 sm:mx-4 overflow-hidden flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={current.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "tween", ease: [0.25, 1, 0.5, 1], duration: 0.45 },
                opacity: { duration: 0.35 },
              }}
              className="absolute inset-0 flex items-center justify-center text-center font-bold text-[12px] md:text-[13px] tracking-normal whitespace-nowrap"
            >
              {!current.isReview ? (
                <span className="text-white">{current.text}</span>
              ) : (
                <div className="inline-flex items-center justify-center gap-1.5 flex-nowrap">
                  <span className="text-[#f5a623] text-xs tracking-tight shrink-0 flex" aria-hidden="true">
                    ★★★★★
                  </span>
                  <span className="text-white truncate">{current.quote}</span>
                  <span className="text-white/80 font-normal shrink-0">— {current.author}</span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Subtle Next Button */}
        <button
          type="button"
          onClick={() => paginate(1)}
          className="text-white/40 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 shrink-0 cursor-pointer focus:outline-hidden"
          aria-label="Next announcement"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
