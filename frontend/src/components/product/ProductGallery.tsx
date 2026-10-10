"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Play,
  Camera,
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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Compile all media items (images + optional video)
  const allImages = images && images.length > 0 ? images : [mainImage];
  const activeMediaList = allImages.filter(Boolean);

  const currentIndex = Math.max(0, activeMediaList.indexOf(selectedImage));

  const handleNext = useCallback(() => {
    if (activeMediaList.length <= 1) return;
    const nextIdx = (currentIndex + 1) % activeMediaList.length;
    onSelectImage(activeMediaList[nextIdx]);
  }, [currentIndex, activeMediaList, onSelectImage]);

  const handlePrev = useCallback(() => {
    if (activeMediaList.length <= 1) return;
    const prevIdx = (currentIndex - 1 + activeMediaList.length) % activeMediaList.length;
    onSelectImage(activeMediaList[prevIdx]);
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
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
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
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Product Media Lightbox"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200"
        >
          {/* Top Bar: Title, Counter, and Close Button */}
          <div className="flex items-center justify-between text-white max-w-[1400px] w-full mx-auto">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-100 truncate max-w-[280px] sm:max-w-[500px]">
                {productName}
              </h3>
              <span className="text-sm text-gray-400">
                Media {currentIndex + 1} of {activeMediaList.length}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close fullscreen gallery"
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Central Active Media Display */}
          <div className="relative flex-1 flex items-center justify-center max-w-[1200px] w-full mx-auto my-4">
            {videoUrl && currentIndex === activeMediaList.length - 1 ? (
              <div className="w-full max-w-[900px] aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <img
                src={selectedImage || mainImage}
                alt={productName}
                className="max-w-full max-h-[75vh] object-contain rounded-lg select-none"
              />
            )}

            {/* Left & Right Arrow Buttons in Modal */}
            {activeMediaList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous media"
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next media"
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          <div className="max-w-[800px] w-full mx-auto flex items-center justify-center gap-2.5 overflow-x-auto no-scrollbar py-2">
            {activeMediaList.map((thumb, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectImage(thumb)}
                className={`w-16 h-16 rounded-xl overflow-hidden p-1 bg-white/5 border-2 transition-all flex-shrink-0 cursor-pointer ${
                  thumb === selectedImage
                    ? "border-[#0071e3] ring-2 ring-[#0071e3]/40"
                    : "border-transparent opacity-50 hover:opacity-100"
                }`}
              >
                <img src={thumb} alt="thumb" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
