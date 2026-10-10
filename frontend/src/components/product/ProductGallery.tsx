"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Play,
  Camera,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
} from "lucide-react";

interface ProductGalleryProps {
  productName: string;
  images: string[];
  mainImage: string;
  videoUrl?: string;
  selectedImage: string;
  onSelectImage: (img: string) => void;
}

export default function ProductGallery({
  productName,
  images,
  mainImage,
  videoUrl,
  selectedImage,
  onSelectImage,
}: ProductGalleryProps) {
  const [mounted, setMounted] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [lightboxTheme, setLightboxTheme] = useState<"light" | "dark">("light");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compile all media items (images + optional video)
  const allImages = images && images.length > 0 ? images : [mainImage];
  const activeMediaList = allImages.filter(Boolean);

  const currentIndex = Math.max(0, activeMediaList.indexOf(selectedImage));

  const handleNext = useCallback(() => {
    if (activeMediaList.length <= 1) return;
    const nextIdx = (currentIndex + 1) % activeMediaList.length;
    onSelectImage(activeMediaList[nextIdx]);
    setIsZoomed(false);
  }, [currentIndex, activeMediaList, onSelectImage]);

  const handlePrev = useCallback(() => {
    if (activeMediaList.length <= 1) return;
    const prevIdx = (currentIndex - 1 + activeMediaList.length) % activeMediaList.length;
    onSelectImage(activeMediaList[prevIdx]);
    setIsZoomed(false);
  }, [currentIndex, activeMediaList, onSelectImage]);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 45;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
        setIsZoomed(false);
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isLightboxOpen, handleNext, handlePrev]);

  const handleImageError = (imgSrc: string) => {
    setImageErrors((prev) => ({ ...prev, [imgSrc]: true }));
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 w-full">
      {/* Thumbnail Navigation Strip */}
      {activeMediaList.length > 1 && (
        <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto no-scrollbar max-h-[600px] pb-2 md:pb-0 flex-shrink-0">
          {activeMediaList.map((img, idx) => {
            const isSelected = img === selectedImage;
            const hasError = imageErrors[img];

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectImage(img)}
                aria-label={`View image ${idx + 1} of ${activeMediaList.length}`}
                className={`relative w-[76px] h-[76px] sm:w-[84px] sm:h-[84px] rounded-[18px] bg-[#fafafa] border-2 transition-all p-1.5 flex items-center justify-center flex-shrink-0 cursor-pointer overflow-hidden ${
                  isSelected
                    ? "border-[#0071e3] shadow-md ring-2 ring-[#0071e3]/20"
                    : "border-gray-200 hover:border-gray-300 opacity-80 hover:opacity-100"
                }`}
              >
                {hasError ? (
                  <Camera className="w-6 h-6 text-gray-400" />
                ) : (
                  <img
                    src={img}
                    alt={`${productName} thumbnail ${idx + 1}`}
                    onError={() => handleImageError(img)}
                    className="w-full h-full object-contain"
                  />
                )}
              </button>
            );
          })}

          {videoUrl && (
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              aria-label="Watch product video"
              className="relative w-[76px] h-[76px] sm:w-[84px] sm:h-[84px] rounded-[18px] bg-neutral-900 border-2 border-neutral-700 hover:border-[#0071e3] transition-all flex flex-col items-center justify-center flex-shrink-0 text-white cursor-pointer shadow-sm group"
            >
              <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold mt-1 uppercase tracking-wider text-blue-300">Video</span>
            </button>
          )}
        </div>
      )}

      {/* Large Main Media Stage */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="flex-1 relative aspect-square max-h-[620px] bg-[#fafafa] rounded-[20px] sm:rounded-[28px] border border-gray-200/90 flex items-center justify-center p-4 sm:p-8 md:p-12 overflow-hidden group select-none"
      >
        {imageErrors[selectedImage] ? (
          <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
            <Camera className="w-12 h-12 sm:w-16 sm:h-16" />
            <span className="text-xs sm:text-sm font-semibold">Image preview unavailable</span>
          </div>
        ) : (
          <img
            src={selectedImage || mainImage}
            alt={productName}
            onError={() => handleImageError(selectedImage)}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 cursor-zoom-in"
            onClick={() => setIsLightboxOpen(true)}
          />
        )}

        {/* Media counter pill */}
        {activeMediaList.length > 1 && (
          <div className="absolute top-3 left-3 sm:top-5 sm:left-5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 text-gray-700 text-[11px] sm:text-xs font-bold shadow-xs">
            {currentIndex + 1} / {activeMediaList.length}
          </div>
        )}

        {/* Fullscreen Expand Button */}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          aria-label="Open fullscreen gallery"
          className="absolute top-3 right-3 sm:top-5 sm:right-5 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-gray-200 flex items-center justify-center text-gray-700 hover:text-[#0071e3] transition-all shadow-xs cursor-pointer"
        >
          <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Navigation Arrow Controls (Overlay) */}
        {activeMediaList.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-gray-200 flex items-center justify-center text-gray-700 hover:text-black opacity-90 lg:opacity-0 lg:group-hover:opacity-100 transition-all shadow-md cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-gray-200 flex items-center justify-center text-gray-700 hover:text-black opacity-90 lg:opacity-0 lg:group-hover:opacity-100 transition-all shadow-md cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}
      </div>

      {/* Lightbox Fullscreen Modal */}
      {mounted &&
        isLightboxOpen &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Product Media Fullscreen Lightbox"
            className={`fixed inset-0 z-[99999] flex flex-col justify-between p-3 sm:p-6 md:p-8 animate-in fade-in duration-200 select-none ${
              lightboxTheme === "dark" ? "bg-[#0b0c0e]/98 text-white" : "bg-white/98 text-slate-900"
            } backdrop-blur-xl`}
          >
            {/* Top Bar: Title, Counter, and Action Buttons */}
            <div className="flex items-center justify-between max-w-[1400px] w-full mx-auto pb-2">
              <div className="min-w-0 pr-4">
                <h3
                  className={`text-sm sm:text-base md:text-lg font-bold truncate max-w-[260px] sm:max-w-[500px] ${
                    lightboxTheme === "dark" ? "text-gray-100" : "text-slate-900"
                  }`}
                >
                  {productName}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                      lightboxTheme === "dark" ? "bg-white/10 text-gray-300" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {currentIndex + 1} / {activeMediaList.length}
                  </span>
                  <span
                    className={`text-xs hidden sm:inline ${
                      lightboxTheme === "dark" ? "text-gray-400" : "text-slate-500"
                    }`}
                  >
                    Press Esc to exit • Click image to zoom
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Zoom In/Out Toggle */}
                <button
                  type="button"
                  onClick={() => setIsZoomed((z) => !z)}
                  aria-label={isZoomed ? "Zoom out" : "Zoom in"}
                  title={isZoomed ? "Zoom out" : "Zoom in"}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    lightboxTheme === "dark"
                      ? "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                  }`}
                >
                  {isZoomed ? (
                    <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>

                {/* Light / Dark Canvas Toggle */}
                <button
                  type="button"
                  onClick={() => setLightboxTheme((t) => (t === "light" ? "dark" : "light"))}
                  aria-label={lightboxTheme === "light" ? "Switch to dark backdrop" : "Switch to light canvas"}
                  title={lightboxTheme === "light" ? "Switch to dark backdrop" : "Switch to light canvas"}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    lightboxTheme === "dark"
                      ? "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                  }`}
                >
                  {lightboxTheme === "dark" ? (
                    <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
                  )}
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsLightboxOpen(false);
                    setIsZoomed(false);
                  }}
                  aria-label="Close fullscreen gallery"
                  title="Close (Esc)"
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    lightboxTheme === "dark"
                      ? "bg-white/15 hover:bg-white/25 text-white border border-white/20"
                      : "bg-slate-900 hover:bg-black text-white shadow-md"
                  }`}
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Central Active Media Display */}
            <div
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setIsLightboxOpen(false);
                  setIsZoomed(false);
                }
              }}
              className="relative flex-1 flex items-center justify-center max-w-[1400px] w-full mx-auto my-auto overflow-hidden py-4 px-2 sm:px-6 cursor-default"
            >
              {videoUrl && currentIndex === activeMediaList.length - 1 ? (
                <div className="w-full max-w-[960px] aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div
                  className="relative max-w-full max-h-[76vh] sm:max-h-[80vh] flex items-center justify-center transition-transform duration-300 select-none"
                  onClick={() => setIsZoomed((z) => !z)}
                  title={isZoomed ? "Click to zoom out" : "Click to zoom in"}
                >
                  <img
                    src={selectedImage || mainImage}
                    alt={productName}
                    className={`max-w-full max-h-[76vh] sm:max-h-[80vh] object-contain select-none transition-transform duration-300 ease-out ${
                      isZoomed ? "scale-[1.7] cursor-zoom-out" : "cursor-zoom-in"
                    }`}
                  />
                </div>
              )}

              {/* Left & Right Arrow Buttons in Modal */}
              {activeMediaList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                      setIsZoomed(false);
                    }}
                    aria-label="Previous media"
                    className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-md ${
                      lightboxTheme === "dark"
                        ? "bg-white/10 hover:bg-white/25 text-white border border-white/10"
                        : "bg-white/95 hover:bg-white text-slate-800 border border-slate-200/90 shadow-md"
                    }`}
                  >
                    <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                      setIsZoomed(false);
                    }}
                    aria-label="Next media"
                    className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-md ${
                      lightboxTheme === "dark"
                        ? "bg-white/10 hover:bg-white/25 text-white border border-white/10"
                        : "bg-white/95 hover:bg-white text-slate-800 border border-slate-200/90 shadow-md"
                    }`}
                  >
                    <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Thumbnails Strip */}
            {activeMediaList.length > 1 && (
              <div className="max-w-[850px] w-full mx-auto flex items-center justify-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-2 px-4">
                {activeMediaList.map((thumb, idx) => {
                  const isSelected = thumb === selectedImage;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onSelectImage(thumb);
                        setIsZoomed(false);
                      }}
                      aria-label={`Select media ${idx + 1}`}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden p-1 border-2 transition-all flex-shrink-0 cursor-pointer ${
                        isSelected
                          ? "border-[#0071e3] ring-2 ring-[#0071e3]/30 scale-105 shadow-sm"
                          : lightboxTheme === "dark"
                          ? "border-transparent opacity-50 hover:opacity-100 bg-white/5"
                          : "border-slate-200/80 opacity-60 hover:opacity-100 bg-slate-50"
                      }`}
                    >
                      <img src={thumb} alt={`Media ${idx + 1}`} className="w-full h-full object-contain" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
