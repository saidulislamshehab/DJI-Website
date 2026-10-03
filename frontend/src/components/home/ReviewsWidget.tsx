"use client";

import React, { useRef, useState, useEffect } from "react";
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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const track = trackRef.current;
    if (track) {
      track.addEventListener("scroll", checkScroll);
      return () => track.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!trackRef.current) return;
    const offset = direction === "left" ? -360 : 360;
    trackRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section className="py-10 md:py-16 bg-[#f5f5f7] border-t border-b border-gray-200/80">
      <div className="page-width">
        {/* Header with 4.9 Rating Card */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-[#0071e3] text-white p-4 rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-blue-500/10 min-w-[120px]">
              <span className="text-3xl font-black leading-none">4.9</span>
              <div className="flex items-center gap-0.5 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-white text-white" />
                ))}
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider mt-1 opacity-90">
                Verified Reviews
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#121212] tracking-tight">
                Customer Reviews
              </h2>
              <p className="text-sm text-gray-500 font-medium">
                Rated 4.9/5 based on over 12,000+ verified Australian customer reviews
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                canScrollLeft
                  ? "bg-[#0071e3] text-white hover:bg-[#0058b8] shadow-md"
                  : "border border-gray-300 text-gray-300 cursor-not-allowed bg-white"
              }`}
              aria-label="Previous reviews"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                canScrollRight
                  ? "bg-[#0071e3] text-white hover:bg-[#0058b8] shadow-md"
                  : "border border-gray-300 text-gray-300 cursor-not-allowed bg-white"
              }`}
              aria-label="Next reviews"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reviews Cards Carousel */}
        <div
          ref={trackRef}
          className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 -my-2"
        >
          {sampleReviews.map((rev) => (
            <div
              key={rev.id}
              className="flex-none w-[300px] sm:w-[340px] md:w-[380px] bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between snap-start"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#0071e3] text-[#0071e3]" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 font-medium">
                    {rev.date}
                  </span>
                </div>

                <p className="text-sm text-[#121212] leading-relaxed mb-4">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#121212]">
                      {rev.name}
                    </h4>
                    <span className="text-[11px] font-semibold text-[#0071e3] block truncate max-w-[220px]">
                      {rev.product}
                    </span>
                  </div>

                  {rev.verified && (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified</span>
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
