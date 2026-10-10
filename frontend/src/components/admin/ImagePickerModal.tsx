"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Search,
  Image as ImageIcon,
  Check,
  ExternalLink,
  Layers,
  Sparkles,
  Link2,
  RefreshCw,
} from "lucide-react";
import { fetchSiteAssetsApi, IMediaAsset } from "@/lib/api";

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string, assetTitle?: string) => void;
  currentImage?: string;
  categoryFilterHint?: string;
  title?: string;
}

export function ImagePickerModal({
  isOpen,
  onClose,
  onSelect,
  currentImage,
  categoryFilterHint,
  title = "Choose from Website Media",
}: ImagePickerModalProps) {
  const [mediaList, setMediaList] = useState<IMediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [activeTab, setActiveTab] = useState<"library" | "custom">("library");

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetchSiteAssetsApi();
        if (isMounted) {
          setMediaList(res.media || []);
          if (categoryFilterHint) {
            const match = res.media.some(
              (m) => m.category.toLowerCase() === categoryFilterHint.toLowerCase()
            );
            if (match) {
              setSelectedCategory(categoryFilterHint);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load media in picker:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [isOpen, categoryFilterHint]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    mediaList.forEach((m) => {
      if (m.category) set.add(m.category);
    });
    return ["All", ...Array.from(set).sort()];
  }, [mediaList]);

  // Filtered Media
  const filteredMedia = useMemo(() => {
    return mediaList.filter((m) => {
      // Category filter
      if (selectedCategory !== "All" && m.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Type filter
      if (selectedType !== "All" && m.type !== selectedType) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = m.title.toLowerCase().includes(q);
        const matchesCategory = m.category.toLowerCase().includes(q);
        const matchesUrl = m.url.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCategory && !matchesUrl) return false;
      }
      return true;
    });
  }, [mediaList, selectedCategory, selectedType, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-4xl w-full h-[90vh] max-h-[720px] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#0070e0] flex items-center justify-center border border-sky-100">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500">
                Select an existing product, category, or promotional image used across the storefront.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-100 flex items-center gap-2 shrink-0 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab("library")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === "library"
                ? "bg-[#0070e0] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Store Media Assets ({mediaList.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("custom")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === "custom"
                ? "bg-[#0070e0] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Custom Image URL</span>
          </button>
        </div>

        {activeTab === "library" ? (
          <>
            {/* Filter & Search Bar */}
            <div className="p-3 sm:px-5 border-b border-slate-100 space-y-2.5 shrink-0 bg-slate-50/40">
              <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center justify-between">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search by product name, category, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0070e0]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium shrink-0">
                  <span>Showing <strong>{filteredMedia.length}</strong> images</span>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {categories.slice(0, 10).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-slate-900 text-white"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Grid Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              {isLoading ? (
                <div className="h-64 flex flex-col items-center justify-center text-slate-500">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#0070e0] mb-2" />
                  <p className="text-xs font-semibold">Loading store media assets...</p>
                </div>
              ) : filteredMedia.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500">
                  <ImageIcon className="w-10 h-10 text-slate-300 mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No media found</p>
                  <p className="text-xs text-slate-400 max-w-sm mt-1">
                    Try clearing your search query or selecting a different category.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {filteredMedia.map((asset) => {
                    const isSelected = currentImage === asset.url;

                    return (
                      <div
                        key={asset.id}
                        onClick={() => {
                          onSelect(asset.url, asset.title);
                          onClose();
                        }}
                        className={`group relative rounded-xl border p-2 bg-white flex flex-col justify-between cursor-pointer transition-all hover:shadow-md hover:border-[#0070e0] ${
                          isSelected
                            ? "border-[#0070e0] ring-2 ring-[#0070e0]/20 bg-sky-50/20"
                            : "border-slate-200 hover:bg-slate-50/50"
                        }`}
                      >
                        {/* Thumbnail Viewport */}
                        <div className="aspect-square rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center relative mb-2">
                          <img
                            src={asset.url}
                            alt={asset.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#0070e0] text-white flex items-center justify-center shadow-xs">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-[#0070e0]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="px-2 py-1 rounded bg-[#0070e0] text-white text-[11px] font-semibold shadow-xs">
                              Select
                            </span>
                          </div>
                        </div>

                        {/* Title & Tag */}
                        <div className="space-y-0.5">
                          <p className="text-xs font-semibold text-slate-800 line-clamp-1 group-hover:text-[#0070e0] transition-colors" title={asset.title}>
                            {asset.title}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <span className="truncate max-w-[80px]">{asset.category}</span>
                            <span className="text-slate-400 uppercase font-mono">{asset.format || "img"}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Custom URL Tab */
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div className="max-w-lg mx-auto w-full space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Enter Custom Image URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-[#0070e0]"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Paste any valid image link from Shopify CDN, Cloudinary, AWS S3, or external hosting.
                </p>
              </div>

              {customUrlInput.trim() && (
                <div>
                  <p className="text-xs font-semibold text-slate-700 mb-1.5">Live Preview:</p>
                  <div className="w-48 h-48 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center">
                    <img
                      src={customUrlInput}
                      alt="Custom preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!customUrlInput.trim()}
                onClick={() => {
                  if (customUrlInput.trim()) {
                    onSelect(customUrlInput.trim(), "Custom Image");
                    onClose();
                  }
                }}
                className="px-4 py-2 rounded-lg bg-[#0070e0] hover:bg-[#0058b8] text-white text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-50"
              >
                Use Custom URL
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#0070e0]" />
            <span>Click any image to set it instantly</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
