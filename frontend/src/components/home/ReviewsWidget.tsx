"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Star, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";

interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  product: string;
  comment: string;
  verified: boolean;
}

const sampleReviews: Review[] = [
  {
    id: 1,
    name: "Marcus L.",
    rating: 5,
    date: "2 days ago",
    product: "DJI Mavic 4 Pro Fly More Combo",
    comment: "Incredible service from the team at Chatswood D1 Store. Ordered online with express delivery and it arrived next day in Brisbane. The Mavic 4 Pro camera is unmatched!",
    verified: true
  },
  {
    id: 2,
    name: "Sarah T.",
    rating: 5,
    date: "4 days ago",
    product: "Osmo Pocket 4P Creator Combo",
    comment: "Best vlog camera ever made. The 1-inch sensor in low light is mind blowing. D1 provided official AU stock with full warranty.",
    verified: true
  },
  {
    id: 3,
    name: "David K.",
    rating: 5,
    date: "1 week ago",
    product: "DJI Neo 2 Fly More Combo",
    comment: "Such a fun little drone! Perfect for palm takeoff and following my mountain bike rides. Fast dispatch and excellent customer support from D1.",
    verified: true
  },
  {
    id: 4,
    name: "Liam O.",
    rating: 5,
    date: "1 week ago",
    product: "DJI Mic Mini 2S",
    comment: "Crystal clear audio for my interviews and TikToks. The range and noise canceling are top notch. 10/10 recommend buying from D1 Store.",
    verified: true
  },
  {
    id: 5,
    name: "Elena R.",
    rating: 5,
    date: "2 weeks ago",
    product: "Hasselblad X2D II 100C",
    comment: "Unbelievable medium format color science and resolution. The staff at the Brunswick store were so knowledgeable and helpful with lens choices.",
    verified: true
  },
  {
    id: 6,
    name: "James W.",
    rating: 5,
    date: "2 weeks ago",
    product: "DJI Air 3S Fly More Combo",
    comment: "Dual cameras are game changing for travel photography. The Care Refresh swap process was also seamless when I needed help. Best DJI retailer in Australia!",
    verified: true
  }
];

export default function ReviewsWidget() {
  const trackRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const scrollPosRef = useRef(0);
  const singleSetWidthRef = useRef(0);
  const isUserInteractingRef = useRef(false);
  const [, setTriggerRender] = useState(0);

  // Extend reviews to 4 duplicated sets for a completely seamless infinite loop
  const extendedReviews = React.useMemo(() => {
    return Array.from({ length: 4 }, (_, copyIndex) =>
      sampleReviews.map((rev) => ({
        ...rev,
        uniqueKey: `copy-${copyIndex}-rev-${rev.id}`,
      }))
    ).flat();
  }, []);

  // Calculate width of one complete set of reviews (including gaps)
  const updateSingleSetWidth = useCallback(() => {
    if (!trackRef.current) return;
    const cards = trackRef.current.children;
    if (cards.length > sampleReviews.length) {
      const firstCard = cards[0] as HTMLElement;
      const targetCard = cards[sampleReviews.length] as HTMLElement;
      const calculatedWidth = targetCard.offsetLeft - firstCard.offsetLeft;
      if (calculatedWidth > 0) {
        singleSetWidthRef.current = calculatedWidth;
      }
    }
  }, []);

  // Initialize scroll position in the center sets and handle window resizing
  useEffect(() => {
    updateSingleSetWidth();
    const handleResize = () => {
      updateSingleSetWidth();
    };

    window.addEventListener("resize", handleResize);

    // Initial positioning to set 1 so user can scroll left or right immediately
    const timer = setTimeout(() => {
      updateSingleSetWidth();
      if (trackRef.current && singleSetWidthRef.current > 0) {
        trackRef.current.scrollLeft = singleSetWidthRef.current;
        scrollPosRef.current = singleSetWidthRef.current;
      }
    }, 150);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [updateSingleSetWidth]);

  // Frame-rate independent slow continuous right-to-left auto-scroll
  useEffect(() => {
    let animationFrameId: number;
    let lastTime: number | null = null;
    const SPEED_PIXELS_PER_SEC = 38; // Smooth, slow drift from right to left

    const step = (currentTime: number) => {
      if (lastTime === null) {
        lastTime = currentTime;
      }
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1); // clamp delta
      lastTime = currentTime;

      if (!isPausedRef.current && !isUserInteractingRef.current && trackRef.current) {
        const setWidth = singleSetWidthRef.current;
        if (setWidth > 0) {
          scrollPosRef.current += SPEED_PIXELS_PER_SEC * delta;

          // Infinite seamless loop
          if (scrollPosRef.current >= setWidth * 2) {
            scrollPosRef.current -= setWidth;
          } else if (scrollPosRef.current <= 0) {
            scrollPosRef.current += setWidth;
          }

          trackRef.current.scrollLeft = scrollPosRef.current;
        }
      }

      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Handle manual arrow navigation
  const scroll = (direction: "left" | "right") => {
    if (!trackRef.current) return;
    const cards = trackRef.current.children;
    if (!cards.length) return;

    const cardStep =
      cards.length > 1
        ? (cards[1] as HTMLElement).offsetLeft - (cards[0] as HTMLElement).offsetLeft
        : 380;

    isUserInteractingRef.current = true;
    const targetOffset = direction === "left" ? -cardStep : cardStep;
    trackRef.current.scrollBy({ left: targetOffset, behavior: "smooth" });

    // Re-synchronize and resume auto-scroll after smooth scroll finishes
    setTimeout(() => {
      if (trackRef.current) {
        scrollPosRef.current = trackRef.current.scrollLeft;
        const setWidth = singleSetWidthRef.current;
        if (setWidth > 0) {
          if (scrollPosRef.current >= setWidth * 2) {
            scrollPosRef.current -= setWidth;
            trackRef.current.scrollLeft = scrollPosRef.current;
          } else if (scrollPosRef.current <= 0) {
            scrollPosRef.current += setWidth;
            trackRef.current.scrollLeft = scrollPosRef.current;
          }
        }
      }
      isUserInteractingRef.current = false;
    }, 700);
  };

  const handleManualScroll = () => {
    if (isUserInteractingRef.current && trackRef.current) {
      scrollPosRef.current = trackRef.current.scrollLeft;
      const setWidth = singleSetWidthRef.current;
      if (setWidth > 0) {
        if (scrollPosRef.current >= setWidth * 2) {
          scrollPosRef.current -= setWidth;
          trackRef.current.scrollLeft = scrollPosRef.current;
        } else if (scrollPosRef.current <= 0) {
          scrollPosRef.current += setWidth;
          trackRef.current.scrollLeft = scrollPosRef.current;
        }
      }
    }
  };

  return (
    <section className="py-[40px] md:py-[64px] bg-[#f5f5f7] border-t border-b border-gray-200/80 select-none">
      <div className="max-w-[1400px] mx-auto px-[16px] md:px-[36px]">
        {/* Header with 4.9 Rating Card */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-[24px] mb-[32px]">
          <div className="flex items-center gap-[16px]">
            <div className="bg-[#0071e3] text-white p-[16px] rounded-[16px] flex flex-col items-center justify-center shadow-lg shadow-blue-500/10 min-w-[120px]">
              <span style={{ fontSize: "36px" }} className="font-black leading-none">4.9</span>
              <div className="flex items-center gap-[2px] mt-[4px]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-[14px] h-[14px] fill-white text-white" />
                ))}
              </div>
              <span style={{ fontSize: "10px" }} className="uppercase font-bold tracking-wider mt-[4px] opacity-90">
                Verified Reviews
              </span>
            </div>

            <div>
              <h2 style={{ fontSize: "28px" }} className="font-black text-[#121212] tracking-tight">
                Customer Reviews
              </h2>
              <p style={{ fontSize: "14px" }} className="text-gray-500 font-medium">
                Rated 4.9/5 based on over 12,000+ verified Australian customer reviews
              </p>
            </div>
          </div>

          <div className="flex items-center gap-[8px]">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="w-[44px] h-[44px] rounded-full flex items-center justify-center transition-all bg-[#0071e3] text-white hover:bg-[#0058b8] shadow-md cursor-pointer hover:scale-105 active:scale-95"
              aria-label="Previous reviews"
            >
              <ChevronLeft className="w-[20px] h-[20px]" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="w-[44px] h-[44px] rounded-full flex items-center justify-center transition-all bg-[#0071e3] text-white hover:bg-[#0058b8] shadow-md cursor-pointer hover:scale-105 active:scale-95"
              aria-label="Next reviews"
            >
              <ChevronRight className="w-[20px] h-[20px]" />
            </button>
          </div>
        </div>

        {/* Reviews Cards Continuous Auto-Scrolling Track */}
        <div
          ref={trackRef}
          onScroll={handleManualScroll}
          onMouseEnter={() => {
            isPausedRef.current = true;
          }}
          onMouseLeave={() => {
            isPausedRef.current = false;
          }}
          onTouchStart={() => {
            isUserInteractingRef.current = true;
          }}
          onTouchEnd={() => {
            setTimeout(() => {
              if (trackRef.current) {
                scrollPosRef.current = trackRef.current.scrollLeft;
              }
              isUserInteractingRef.current = false;
            }, 1000);
          }}
          className="flex gap-[16px] md:gap-[24px] overflow-x-auto no-scrollbar py-[8px] -my-[8px] will-change-scroll"
        >
          {extendedReviews.map((rev) => (
            <div
              key={rev.uniqueKey}
              className="flex-none w-[300px] sm:w-[340px] md:w-[380px] bg-white p-[24px] rounded-[16px] shadow-sm border border-gray-100 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-[12px]">
                  <div className="flex items-center gap-[2px]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-[16px] h-[16px] fill-[#0071e3] text-[#0071e3]" />
                    ))}
                  </div>
                  <span style={{ fontSize: "12px" }} className="text-gray-400 font-medium">
                    {rev.date}
                  </span>
                </div>

                <p style={{ fontSize: "14px" }} className="text-[#121212] leading-relaxed mb-[16px]">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-[16px] border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 style={{ fontSize: "14px" }} className="font-bold text-[#121212]">
                      {rev.name}
                    </h4>
                    <span style={{ fontSize: "11px" }} className="font-semibold text-[#0071e3] block truncate max-w-[220px]">
                      {rev.product}
                    </span>
                  </div>

                  {rev.verified && (
                    <div className="flex items-center gap-[4px] bg-emerald-50 px-[8px] py-[4px] rounded-md">
                      <ShieldCheck className="w-[14px] h-[14px] text-emerald-600" />
                      <span style={{ fontSize: "11px" }} className="font-bold text-emerald-600">Verified</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
