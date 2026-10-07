"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

export interface HeroSlide {
  id: number;
  heading?: string;
  eyebrow?: string;
  subheading?: string;
  btnText: string;
  btnHref: string;
  textColor?: string;
  imgDesktop?: string;
  imgMobile?: string;
  videoUrl?: string;
  poster?: string;
  isDockedBottom?: boolean;
}

const slidesData: HeroSlide[] = [
  {
    id: 0,
    heading: "",
    eyebrow: "",
    subheading: "",
    btnText: "Shop Now",
    btnHref: "/collections/dji-sale",
    textColor: "#ffffff",
    imgDesktop:
      "https://cdn.d1store.app/shopify/product-page-editor/assets/b404315c-ebb6-4301-85e4-8c3438d1f82c/003-saleevents-flyintospring-phase2-webbanner-desktop-2560x700px-sep26-fa.jpg",
    imgMobile:
      "https://cdn.d1store.app/shopify/product-page-editor/assets/f5ea6a36-8a16-463e-920c-243ab22a01fd/003-saleevents-flyintospring-phase2-webbanner-mobile-1170x1500px-sep26-fa.jpg",
    isDockedBottom: true
  },
  {
    id: 1,
    heading: "Osmo Pocket 4P",
    eyebrow: "Dual Lens Gimbal Camera",
    subheading: "See More. Share More.",
    btnText: "Order Now",
    btnHref: "/products/osmo-pocket-4p",
    textColor: "#ffffff",
    videoUrl: "https://cdn.d1store.app/shopify/Home-Page/Pocket%204P%20Homepage%20Video.mp4",
    poster: "https://www.d1store.com.au/cdn/shop/files/Osmo_Pocket_4P_Product_KV.jpg?v=1784606000&width=1920"
  },
  {
    id: 2,
    heading: "Osmo 360 II",
    eyebrow: "8K 360° Camera",
    subheading: "Next Generation Video",
    btnText: "Available Now",
    btnHref: "/products/osmo-360-ii",
    textColor: "#ffffff",
    videoUrl: "https://cdn.d1store.app/shopify/Home-Page/Osmo%20360%20II%20Home%20Video.mp4",
    poster: "https://www.d1store.com.au/cdn/shop/files/Osmo_360_II_Homw.jpg?v=1788477098&width=1920"
  },
  {
    id: 3,
    heading: "DJI ROMO P2",
    eyebrow: "Intelligent Robot Vacuum",
    subheading: "$500 Off for Early Bird Purchases",
    btnText: "Order Now",
    btnHref: "/products/dji-romo-p2-water-tank-version",
    textColor: "#ffffff",
    videoUrl: "https://cdn.d1store.app/shopify/Home-Page/Romo%20P2%20Home%20Video.mp4",
    poster: "https://www.d1store.com.au/cdn/shop/files/Romo_P2_Home.webp?v=1788477314&width=1920"
  },
  {
    id: 4,
    heading: "DJI Mic Mini 2S",
    eyebrow: "Pro Wireless Mic for Creators",
    subheading: "Capture Every Detail",
    btnText: "Mic Up",
    btnHref: "/collections/dji-mic-mini-2s",
    textColor: "#ffffff",
    videoUrl: "https://cdn.d1store.app/shopify/Home-Page/Mic%20Mini%202S%20Home.mp4",
    poster:
      "https://cdn.d1store.app/shopify/product-page-editor/assets/1ffb3967-df39-4404-b903-88ee1b753cb7/003-launch-micmini2s-webbanner-desktop-2560x700px-jan26-fa.jpg"
  },
  {
    id: 5,
    heading: "Osmo Action 6",
    eyebrow: "Flagship Action Camera",
    subheading: "Jump into Action",
    btnText: "Shop Osmo Action 6",
    btnHref: "/products/osmo-action-6",
    textColor: "#ffffff",
    videoUrl: "https://cdn.d1store.app/shopify/Home-Page/Osmo-Action-6-Home-Page.mp4",
    poster:
      "https://cdn.d1store.app/shopify/product-page-editor/assets/69eb3c1a-2831-4fa3-b1d5-2e6f43e5e408/003-launch-osmoaction6-webbanner-desktop-2560x700px-jan26-fa.jpg"
  },
  {
    id: 6,
    heading: "DJI Mavic 4 Pro",
    eyebrow: "Triple-Lens Flagship",
    subheading: "Spin Your World",
    btnText: "Shop Mavic 4 Pro",
    btnHref: "/products/dji-mavic-4-pro",
    textColor: "#ffffff",
    videoUrl: "https://cdn.d1store.app/shopify/Home-Page/Mavic%204%20Pro%20Homepage.mp4",
    poster:
      "https://cdn.d1store.app/shopify/product-page-editor/assets/941ba0da-246e-440e-b7d5-d0693510e1ea/003-launch-mavic4pro-webbanner-desktop-2560x700px-nov25-fa.jpg"
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
    <section
      id="shopify-section-template--21396722843809__hero_slideshow_KeeeeG"
      className="shopify-section hero-slideshow-section"
    >
      <div
        id="hero-slideshow-template--21396722843809__hero_slideshow_KeeeeG"
        className="hero-slideshow"
        data-autoplay="true"
        data-speed="5"
        style={{
          "--desktop-height": "700px",
          "--mobile-height": "500px",
        } as React.CSSProperties}
      >
        <div className="hero-slideshow__viewport" data-hero-slideshow-viewport>
          <div className="hero-slideshow__track" data-hero-slideshow-track>
            {slidesData.map((slide, index) => {
              const isActive = index === current;
              return (
                <div
                  key={slide.id}
                  className={`hero-slideshow__slide ${isActive ? "is-active" : ""}`}
                  data-index={index}
                  style={{
                    "--hero-text-color": slide.textColor || "#ffffff",
                    display: isActive ? "block" : "none",
                    position: "relative",
                    width: "100%",
                  } as React.CSSProperties}
                >
                  <div className="hero-slideshow__media">
                    {slide.videoUrl ? (
                      <>
                        <video
                          ref={(el) => {
                            videoRefs.current[index] = el;
                          }}
                          className="hero-slideshow__video"
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          poster={slide.poster}
                          src={slide.videoUrl}
                        />
                        <div className="hero-slideshow__overlay hero-slideshow__overlay--video" />
                      </>
                    ) : (
                      <picture>
                        {slide.imgMobile && (
                          <source
                            media="(max-width: 749px)"
                            srcSet={slide.imgMobile}
                          />
                        )}
                        <img
                          className="hero-slideshow__image"
                          src={slide.imgDesktop}
                          alt={slide.heading || "Banner"}
                          width="2560"
                          height="1080"
                          loading="eager"
                        />
                      </picture>
                    )}
                  </div>

                  <Link
                    className="hero-slideshow__slide-link"
                    href={slide.btnHref}
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    &nbsp;
                  </Link>

                  {slide.isDockedBottom ? (
                    <div className="hero-slideshow__cta-dock hero-slideshow__cta-dock--bottom-center hero-slideshow__cta-align-m--center">
                      <div className="hero-slideshow__cta-group hero-slideshow__cta-align-m--center">
                        <Link
                          className="hero-slideshow__button hero-slideshow__button--solid hero-slideshow__button--lg"
                          href={slide.btnHref}
                        >
                          {slide.btnText}
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="hero-slideshow__content hero-slideshow__content--center-left hero-slideshow__content-m--center-center">
                      <div className="hero-slideshow__content-box">
                        <div className="hero-slideshow__text-group">
                          {slide.eyebrow && (
                            <p className="hero-slideshow__eyebrow hero-slideshow__eyebrow--xxl">
                              {slide.eyebrow}
                            </p>
                          )}
                          {slide.heading && (
                            <h2 className="hero-slideshow__heading hero-slideshow__heading--xxxl">
                              {slide.heading}
                            </h2>
                          )}
                          {slide.subheading && (
                            <p className="hero-slideshow__subheading hero-slideshow__subheading--xl">
                              {slide.subheading}
                            </p>
                          )}
                        </div>
                        <div className="hero-slideshow__cta-group hero-slideshow__cta-align-m--center">
                          <Link
                            className="hero-slideshow__button hero-slideshow__button--solid hero-slideshow__button--lg"
                            href={slide.btnHref}
                          >
                            {slide.btnText}
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Hero Slideshow Navigation Controls */}
        <div className="hero-slideshow__controls">
          <button
            type="button"
            className="hero-slideshow__arrow hero-slideshow__arrow--prev"
            onClick={prevSlide}
            aria-label="Previous"
          >
            <svg
              width="38"
              height="24"
              viewBox="0 0 37 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 5L3 12M3 12L10 19M3 12H33.5"
              />
            </svg>
          </button>

          <div className="hero-slideshow__dots">
            {slidesData.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`hero-slideshow__dot ${
                  idx === current ? "is-active" : ""
                }`}
                onClick={() => setCurrent(idx)}
                aria-label={`Slide ${idx + 1}`}
              >
                <span className="hero-slideshow__dot-fill" aria-hidden="true" />
              </button>
            ))}
          </div>

          <button
            type="button"
            className="hero-slideshow__arrow hero-slideshow__arrow--next"
            onClick={nextSlide}
            aria-label="Next"
          >
            <svg
              width="38"
              height="24"
              viewBox="0 0 37 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M26.5 5L33.5 12M33.5 12L26.5 19M33.5 12H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
