"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

export interface HeroSlide {
  id: number;
  heading: string;
  eyebrow: string;
  subheading?: string;
  btnText: string;
  btnHref: string;
  textColor: string;
  imgDesktop: string;
  imgMobile?: string;
  videoUrl?: string;
}

const slidesData: HeroSlide[] = [
  {
    id: 0,
    heading: "Fly Into Spring Sale",
    eyebrow: "Limited Time Deals",
    subheading: "Save up to $600 across top DJI drones, cameras & bundles",
    btnText: "Shop Now",
    btnHref: "/collections/dji-sale",
    textColor: "#ffffff",
    imgDesktop: "https://cdn.d1store.app/shopify/product-page-editor/assets/b404315c-ebb6-4301-85e4-8c3438d1f82c/003-saleevents-flyintospring-phase2-webbanner-desktop-2560x700px-sep26-fa.jpg",
    imgMobile: "https://cdn.d1store.app/shopify/product-page-editor/assets/f5ea6a36-8a16-463e-920c-243ab22a01fd/003-sal"
  },
  {
    id: 1,
    heading: "Osmo Pocket 4P",
    eyebrow: "Dual Lens Gimbal Camera",
    subheading: "See More. Share More.",
    btnText: "Order Now",
    btnHref: "/products/osmo-pocket-4p",
    textColor: "#ffffff",
    imgDesktop: "https://cdn.d1store.app/shopify/product-page-editor/assets/b404315c-ebb6-4301-85e4-8c3438d1f82c/003-saleevents-flyintospring-phase2-webbanner-desktop-2560x700px-sep26-fa.jpg",
    videoUrl: "https://cdn.d1store.app/shopify/Home-Page/Pocket%204P%20Homepage%20Video.mp4"
  },
  {
    id: 2,
    heading: "Osmo 360 II",
    eyebrow: "8K 360° Camera",
    subheading: "Next Generation Video",
    btnText: "Available Now",
    btnHref: "/products/osmo-360-ii",
    textColor: "#ffffff",
    imgDesktop: "https://cdn.d1store.app/shopify/product-page-editor/assets/61f22143-ca39-4458-ba81-e28a5bc93c0d/003-launch-osmo360ii-webbanner-desktop-2560x700px-feb26-fa.jpg",
    videoUrl: "https://cdn.d1store.app/shopify/Home-Page/Osmo%20360%20II%20Home%20Video.mp4"
  },
  {
    id: 3,
    heading: "DJI ROMO P2",
    eyebrow: "Intelligent Robot Vacuum",
    subheading: "$500 Off for Early Bird Purchases",
    btnText: "Order Now",
    btnHref: "/products/dji-romo-p2-water-tank-version",
    textColor: "#ffffff",
    imgDesktop: "https://cdn.d1store.app/shopify/product-page-editor/assets/35ea5563-71a7-47b2-bdcf-3aa95df93a67/003-launch-romop2-webbanner-desktop-2560x700px-feb26-fa.jpg",
    videoUrl: "https://cdn.d1store.app/shopify/Home-Page/Romo%20P2%20Home%20Video.mp4"
  },
  {
    id: 4,
    heading: "DJI Westfield Chatswood",
    eyebrow: "DJI WESTFIELD CHATSWOOD",
    subheading: "October 2026",
    btnText: "Explore Store",
    btnHref: "/pages/stores",
    textColor: "#ffffff",
    imgDesktop: "https://cdn.d1store.app/shopify/Home-Page/Chatswood%20Drawing.png"
  },
  {
    id: 5,
    heading: "DJI Mic Mini 2S",
    eyebrow: "Pro Wireless Mic for Creators",
    subheading: "Capture Every Detail",
    btnText: "Mic Up",
    btnHref: "/collections/dji-mic-mini-2s",
    textColor: "#ffffff",
    imgDesktop: "https://cdn.d1store.app/shopify/product-page-editor/assets/1ffb3967-df39-4404-b903-88ee1b753cb7/003-launch-micmini2s-webbanner-desktop-2560x700px-jan26-fa.jpg",
    videoUrl: "https://cdn.d1store.app/shopify/Home-Page/Mic%20Mini%202S%20Home.mp4"
  },
  {
    id: 6,
    heading: "Osmo Action 6",
    eyebrow: "Flagship Action Camera",
    subheading: "Jump into Action",
    btnText: "Shop Osmo Action 6",
    btnHref: "/products/osmo-action-6",
    textColor: "#ffffff",
    imgDesktop: "https://cdn.d1store.app/shopify/product-page-editor/assets/69eb3c1a-2831-4fa3-b1d5-2e6f43e5e408/003-launch-osmoaction6-webbanner-desktop-2560x700px-jan26-fa.jpg",
    videoUrl: "https://cdn.d1store.app/shopify/Home-Page/Osmo-Action-6-Home-Page.mp4"
  },
  {
    id: 7,
    heading: "DJI Mavic 4 Pro",
    eyebrow: "Triple-Lens Flagship",
    subheading: "Spin Your World",
    btnText: "Shop Mavic 4 Pro",
    btnHref: "/products/dji-mavic-4-pro",
    textColor: "#ffffff",
    imgDesktop: "https://cdn.d1store.app/shopify/product-page-editor/assets/941ba0da-246e-440e-b7d5-d0693510e1ea/003-launch-mavic4pro-webbanner-desktop-2560x700px-nov25-fa.jpg",
    videoUrl: "https://cdn.d1store.app/shopify/Home-Page/Mavic%204%20Pro%20Homepage.mp4"
  }
];

const SLIDE_DURATION = 6500;

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slidesData.length);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slidesData.length) % slidesData.length);
  };

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [isPlaying, nextSlide]);

  // Handle active video playback
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (video) {
        if (idx === current) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });
  }, [current]);

  return (
    <section className="relative w-full overflow-hidden bg-white select-none group py-3 md:py-4">
      <div className="w-full px-2 sm:px-4 md:px-6 max-w-[1920px] mx-auto">
        {/* Slides Track with Peeking Rounded Corners */}
        <div className="relative h-[480px] sm:h-[580px] md:h-[650px] lg:h-[700px] w-full rounded-2xl md:rounded-[28px] overflow-hidden bg-[#0c0c0e] shadow-xl">
          {slidesData.map((slide, index) => {
            const isActive = index === current;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                {/* Media Container: Video or Image */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  {slide.videoUrl ? (
                    <video
                      ref={(el) => { videoRefs.current[index] = el; }}
                      src={slide.videoUrl}
                      muted
                      loop
                      playsInline
                      poster={slide.imgDesktop}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <img
                      src={slide.imgDesktop}
                      alt={slide.heading}
                      className="w-full h-full object-cover object-center"
                    />
                  )}
                </div>

                {/* Subtle Cinematic Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10 md:bg-gradient-to-r md:from-black/60 md:via-black/20 md:to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex items-center">
                  <div className="page-width w-full">
                    <div className="max-w-2xl text-white space-y-2 sm:space-y-3 md:space-y-4 px-4 sm:px-6 md:px-10">
                      {slide.eyebrow && (
                        <p className="text-xs sm:text-sm md:text-base font-bold tracking-wider uppercase text-blue-400">
                          {slide.eyebrow}
                        </p>
                      )}
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08]">
                        {slide.heading}
                      </h1>
                      {slide.subheading && (
                        <p className="text-sm sm:text-base md:text-lg text-white/90 font-medium max-w-lg">
                          {slide.subheading}
                        </p>
                      )}

                      <div className="pt-2 sm:pt-4">
                        <Link
                          href={slide.btnHref}
                          className="inline-flex items-center justify-center px-7 sm:px-9 py-3 sm:py-3.5 rounded-full bg-white text-black font-extrabold text-sm sm:text-base hover:bg-[#0071e3] hover:text-white transition-all duration-300 shadow-2xl transform hover:-translate-y-0.5"
                        >
                          {slide.btnText}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Navigation Arrows (Visible on Hover) */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/10"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/10"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slide Indicators & Play/Pause */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white/80 hover:text-white transition p-0.5"
              aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <div className="flex items-center space-x-2">
              {slidesData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    idx === current
                      ? "w-8 bg-white"
                      : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
