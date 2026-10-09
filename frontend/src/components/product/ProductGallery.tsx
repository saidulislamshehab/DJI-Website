"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Play,
  Camera,
  RotateCw,
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
    <div className="flex flex-col-reverse md:flex-row gap-[16px] w-full">
      {/* Thumbnail Navigation Strip */}
      {activeMediaList.length > 1 && (
        <div className="flex md:flex-col gap-[10px] overflow-x-auto md:overflow-y-auto no-scrollbar max-h-[560px] pb-2 md:pb-0 flex-shrink-0">
          {activeMediaList.map((img, idx) => {
            const isSelected = img === selectedImage;
            const hasError = imageErrors[img];

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectImage(img)}
                aria-label={`View image ${idx + 1} of ${activeMediaList.length}`}
                className={`relative w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] rounded-[14px] bg-[#fafafa] border-2 transition-all p-1 flex items-center justify-center flex-shrink-0 cursor-pointer overflow-hidden ${
                  isSelected
                    ? "border-[#0071e3] shadow-sm ring-2 ring-[#0071e3]/20"
                    : "border-gray-200 hover:border-gray-300 opacity-80 hover:opacity-100"
                }`}
              >
                {hasError ? (
                  <Camera className="w-5 h-5 text-gray-400" />
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
              className="relative w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] rounded-[14px] bg-neutral-900 border-2 border-neutral-700 hover:border-[#0071e3] transition-all flex flex-col items-center justify-center flex-shrink-0 text-white cursor-pointer shadow-sm group"
            >
              <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-bold mt-1 uppercase tracking-wider text-blue-300">Video</span>
            </button>
          )}
        </div>
      )}

      {/* Large Main Media Stage */}
      <div className="flex-1 relative aspect-square max-h-[580px] bg-[#fafafa] rounded-[24px] border border-gray-200/90 flex items-center justify-center p-[24px] sm:p-[40px] overflow-hidden group">
        {imageErrors[selectedImage] ? (
          <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
            <Camera className="w-16 h-16" />
            <span className="text-xs font-semibold">Image preview unavailable</span>
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
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 text-gray-600 text-[11px] font-bold shadow-xs">
            {currentIndex + 1} / {activeMediaList.length}
          </div>
        )}

        {/* Fullscreen Expand Button */}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          aria-label="Open fullscreen gallery"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-gray-200 flex items-center justify-center text-gray-700 hover:text-[#0071e3] transition-all shadow-xs cursor-pointer"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Navigation Arrow Controls (Overlay) */}
        {activeMediaList.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-gray-200 flex items-center justify-center text-gray-700 hover:text-black opacity-0 group-hover:opacity-100 transition-all shadow-sm cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-gray-200 flex items-center justify-center text-gray-700 hover:text-black opacity-0 group-hover:opacity-100 transition-all shadow-sm cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
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
              <h3 className="text-sm sm:text-base font-bold text-gray-200 truncate max-w-[280px] sm:max-w-[500px]">
                {productName}
              </h3>
              <span className="text-xs text-gray-400">
                Media {currentIndex + 1} of {activeMediaList.length}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close fullscreen gallery"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
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
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next media"
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          <div className="max-w-[800px] w-full mx-auto flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-2">
            {activeMediaList.map((thumb, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectImage(thumb)}
                className={`w-14 h-14 rounded-xl overflow-hidden p-1 bg-white/5 border-2 transition-all flex-shrink-0 cursor-pointer ${
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
