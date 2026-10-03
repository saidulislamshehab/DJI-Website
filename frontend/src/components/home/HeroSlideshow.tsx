"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

export interface HeroSlide {
  id: number;
  heading: string;
  eyebrow: string;
  btnText: string;
  btnHref: string;
  textColor: string;
  imgDesktop: string;
  imgMobile: string;
}

const slidesData: HeroSlide[] = [
  {
    id: 0,
    heading: "Osmo Pocket 4P",
    eyebrow: "The Next Generation Pocket Camera",
    btnText: "Shop Now",
    btnHref: "/products/osmo-pocket-4p",
    textColor: "#ffffff",
    imgDesktop: "https://cdn.d1store.app/shopify/product-page-editor/assets/b404315c-ebb6-4301-85e4-8c3438d1f82c/003-saleevents-flyintospring-phase2-webbanner-desktop-2560x700px-sep26-fa.jpg",
    imgMobile: "https://cdn.d1store.app/shopify/product-page-editor/assets/f5ea6a36-8a16-463e-920c-243a8519e9eb/003-saleevents-flyintospring-phase2-webbanner-mobile-1080x1350px-sep26-fa.jpg"
  },
  {
    id: 1,
    heading: "Osmo 360 II",
    eyebrow: "Capture Everything in Stunning 8K 360°",
    btnText: "Order Now",
    btnHref: "/products/osmo-360-ii",
    textColor: "#ffffff",
    imgDesktop: "https://cdn.d1store.app/shopify/product-page-editor/assets/61f22143-ca39-4458-ba81-e28a5bc93c0d/003-launch-osmo360ii-webbanner-desktop-2560x700px-feb26-fa.jpg",
    imgMobile: "https://cdn.d1store.app/shopify/product-page-editor/assets/7be5a073-6fc9-4674-bf4b-eef4fce32386/003-launch-osmo360ii-webbanner-mobile-1080x1350px-feb26-fa.jpg"
  },
  {
    id: 2,
    heading: "DJI ROMO P2",
    eyebrow: "Intelligent Cleaning Reimagined",
    btnText: "Available Now",
    btnHref: "/products/dji-romo-p2-water-tank-version",
    textColor: "#ffffff",
    imgDesktop: "https://cdn.d1store.app/shopify/product-page-editor/assets/35ea5563-71a7-47b2-bdcf-3aa95df93a67/003-launch-romop2-webbanner-desktop-2560x700px-feb26-fa.jpg",
    imgMobile: "https://cdn.d1store.app/shopify/product-page-editor/assets/a23d4681-36ce-468f-a9cb-b2f5b5f3ee6b/003-launch-romop2-webbanner-mobile-1080x1350px-feb26-fa.jpg"
  },
  {
    id: 3,
    heading: "GRAND OPENING",
    eyebrow: "Visit our newest store at Chatswood Chase Sydney",
    btnText: "Explore Store",
    btnHref: "/pages/stores",
    textColor: "#ffffff",
    imgDesktop: "https://cdn.d1store.app/shopify/Home-Page/Chatswood%20Drawing.png",
    imgMobile: "https://cdn.d1store.app/shopify/Home-Page/Chatswood%20Drawing.png"
  },
  {
    id: 4,
    heading: "DJI Mic Mini 2S",
    eyebrow: "Ultra-Compact Wireless Audio",
    btnText: "Mic Up",
    btnHref: "/products/dji-mic-mini-2-transmitter",
    textColor: "#ffffff",
    imgDesktop: "https://cdn.d1store.app/shopify/product-page-editor/assets/1ffb3967-df39-4404-b903-88ee1b753cb7/003-launch-micmini2s-webbanner-desktop-2560x700px-jan26-fa.jpg",
    imgMobile: "https://cdn.d1store.app/shopify/product-page-editor/assets/d9fb02c8-892a-464a-93f5-7b5832a829e2/003-launch-micmini2s-webbanner-mobile-1080x1350px-jan26-fa.jpg"
  },
  {
    id: 5,
    heading: "Osmo Action 6",
    eyebrow: "Extreme Adventure Action Camera",
    btnText: "Shop Osmo Action 6",
    btnHref: "/products/osmo-action-6",
    textColor: "#ffffff",
    imgDesktop: "https://cdn.d1store.app/shopify/product-page-editor/assets/69eb3c1a-2831-4fa3-b1d5-2e6f43e5e408/003-launch-osmoaction6-webbanner-desktop-2560x700px-jan26-fa.jpg",
    imgMobile: "https://cdn.d1store.app/shopify/product-page-editor/assets/f69ec6d6-f38b-49ef-97b7-58bfa79f6483/003-launch-osmoaction6-webbanner-mobile-1080x1350px-jan26-fa.jpg"
  },
  {
    id: 6,
    heading: "DJI Mavic 4 Pro",
    eyebrow: "Flagship Aerial Photography",
    btnText: "Shop Mavic 4 Pro",
    btnHref: "/products/dji-mavic-4-pro",
    textColor: "#ffffff",
    imgDesktop: "https://cdn.d1store.app/shopify/product-page-editor/assets/941ba0da-246e-440e-b7d5-d0693510e1ea/003-launch-mavic4pro-webbanner-desktop-2560x700px-nov25-fa.jpg",
    imgMobile: "https://cdn.d1store.app/shopify/product-page-editor/assets/0b59b158-944e-4f54-8e10-38fe359a3977/003-launch-mavic4pro-webbanner-mobile-1080x1350px-nov25-fa.jpg"
  }
];

const SLIDE_DURATION = 6000;

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

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

  return (
    <section className="relative w-full overflow-hidden bg-black select-none group">
      {/* Slides Container */}
      <div className="relative h-[480px] sm:h-[580px] md:h-[650px] lg:h-[700px] w-full">
        {slidesData.map((slide, index) => {
          const isActive = index === current;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Background Image (Responsive Picture) */}
              <picture>
                <source media="(max-width: 749px)" srcSet={slide.imgMobile} />
                <source media="(min-width: 750px)" srcSet={slide.imgDesktop} />
                <img
                  src={slide.imgDesktop}
                  alt={slide.heading}
                  className="w-full h-full object-cover object-center"
                />
              </picture>

              {/* Overlay Gradient for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:bg-gradient-to-r md:from-black/60 md:via-black/20 md:to-transparent" />

              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-center">
                <div className="page-width w-full">
                  <div className="max-w-xl text-white space-y-3 md:space-y-4 px-4 sm:px-0">
                    <p className="text-xs sm:text-sm md:text-base font-semibold tracking-wider uppercase text-blue-400">
                      {slide.eyebrow}
                    </p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                      {slide.heading}
                    </h1>

                    <div className="pt-2 sm:pt-4">
                      <Link
                        href={slide.btnHref}
                        className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-white text-black font-bold text-sm sm:text-base hover:bg-[#0071e3] hover:text-white transition-all duration-300 shadow-xl"
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
      </div>

      {/* Navigation Arrows (visible on hover) */}
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
    </section>
  );
}
