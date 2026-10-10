"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Link2,
  Image as ImageIcon,
  Search,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  FolderOpen,
  Package,
  Layers,
  FileText,
  ShieldCheck,
  Sparkles,
  LayoutGrid,
  List,
  Compass,
  ArrowUpRight,
  Globe,
  Sliders,
  X,
} from "lucide-react";
import {
  AdminHeader,
  AdminBadge,
  AdminTableContainer,
  AdminEmptyState,
} from "@/components/admin/AdminComponents";
import { fetchSiteAssetsApi, IMediaAsset, ISiteLink, ISiteAssetsResponse } from "@/lib/api";

export default function AdminLinksAndMediaPage() {
  const [data, setData] = useState<ISiteAssetsResponse>({
    media: [],
    links: [],
    stats: {
      totalMedia: 0,
      totalLinks: 0,
      categoryImages: 0,
      productImages: 0,
      collections: 0,
      products: 0,
      storePages: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"media" | "links">("media");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Media filters
  const [mediaSearch, setMediaSearch] = useState("");
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState("All");
  const [mediaTypeFilter, setMediaTypeFilter] = useState("All");

  // Link filters
  const [linkSearch, setLinkSearch] = useState("");
  const [linkTypeFilter, setLinkTypeFilter] = useState("All");

  // Copied feedback map: key -> boolean
  const [copiedKeys, setCopiedKeys] = useState<Record<string, boolean>>({});

  const loadAssets = async () => {
    setIsLoading(true);
    try {
      const res = await fetchSiteAssetsApi();
      setData(res);
    } catch (err) {
      console.error("Failed to load site assets:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleCopy = (text: string, id: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      const copyText = text.startsWith("/") ? `${window.location.origin}${text}` : text;
      navigator.clipboard.writeText(copyText);
      setCopiedKeys((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopiedKeys((prev) => ({ ...prev, [id]: false }));
      }, 2000);
    }
  };

  // Media Categories
  const mediaCategories = useMemo(() => {
    const set = new Set<string>();
    data.media.forEach((m) => {
      if (m.category) set.add(m.category);
    });
    return ["All", ...Array.from(set).sort()];
  }, [data.media]);

  // Media Types
  const mediaTypes = useMemo(() => {
    const set = new Set<string>();
    data.media.forEach((m) => {
      if (m.type) set.add(m.type);
    });
    return ["All", ...Array.from(set).sort()];
  }, [data.media]);

  // Filtered Media
  const filteredMedia = useMemo(() => {
    return data.media.filter((m) => {
      if (mediaCategoryFilter !== "All" && m.category.toLowerCase() !== mediaCategoryFilter.toLowerCase()) {
        return false;
      }
      if (mediaTypeFilter !== "All" && m.type !== mediaTypeFilter) {
        return false;
      }
      if (mediaSearch.trim()) {
        const q = mediaSearch.toLowerCase().trim();
        const matchesTitle = m.title.toLowerCase().includes(q);
        const matchesCategory = m.category.toLowerCase().includes(q);
        const matchesUrl = m.url.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCategory && !matchesUrl) return false;
      }
      return true;
    });
  }, [data.media, mediaCategoryFilter, mediaTypeFilter, mediaSearch]);

  // Link Types
  const linkTypes = useMemo(() => {
    const set = new Set<string>();
    data.links.forEach((l) => {
      if (l.type) set.add(l.type);
    });
    return ["All", ...Array.from(set).sort()];
  }, [data.links]);

  // Filtered Links
  const filteredLinks = useMemo(() => {
    return data.links.filter((l) => {
      if (linkTypeFilter !== "All" && l.type !== linkTypeFilter) {
        return false;
      }
      if (linkSearch.trim()) {
        const q = linkSearch.toLowerCase().trim();
        const matchesTitle = l.title.toLowerCase().includes(q);
        const matchesUrl = l.url.toLowerCase().includes(q);
        const matchesCategory = l.category?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesUrl && !matchesCategory) return false;
      }
      return true;
    });
  }, [data.links, linkTypeFilter, linkSearch]);

  const copyAllLinks = () => {
    const text = data.links.map((l) => `${l.title}: ${l.url}`).join("\n");
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      handleCopy(text, "all-links");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Site Media & Links" },
        ]}
        title="Site Links & Media Library"
        description="Comprehensive index of all images, videos, category URLs, product pages, and storefront links used throughout the entire website."
        actions={
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={loadAssets}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-slate-500 ${isLoading ? "animate-spin text-[#0070e0]" : ""}`} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={copyAllLinks}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0070e0] hover:bg-[#0058b8] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              {copiedKeys["all-links"] ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>All Links Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy All URLs</span>
                </>
              )}
            </button>
          </div>
        }
      />

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Media Assets</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0070e0] flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{data.stats.totalMedia || data.media.length}</span>
            <span className="text-xs text-slate-500">active assets</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Covers, thumbnails, galleries & banners</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Website Links</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Link2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{data.stats.totalLinks || data.links.length}</span>
            <span className="text-xs text-slate-500">routes indexed</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Storefront, products, collections & pages</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Product Pages</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{data.stats.products || 0}</span>
            <span className="text-xs text-slate-500">product URLs</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Direct product detail links</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Collections & Pages</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {(data.stats.collections || 0) + (data.stats.storePages || 0)}
            </span>
            <span className="text-xs text-slate-500">collections & pages</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Main, subcategory, legal & support</p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-1.5 shadow-[0_1px_3px_rgba(16,24,40,0.04)] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("media")}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "media"
                ? "bg-[#0070e0] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Store Media Assets ({data.media.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("links")}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "links"
                ? "bg-[#0070e0] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>All Website Route Links ({data.links.length})</span>
          </button>
        </div>

        {activeTab === "media" && (
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === "grid" ? "bg-white text-[#0070e0] shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === "table" ? "bg-white text-[#0070e0] shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
              title="Table view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Tab 1: All Website Images & Media */}
      {activeTab === "media" && (
        <div className="space-y-4">
          {/* Media Filters Bar */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-3 sm:p-4 shadow-[0_1px_3px_rgba(16,24,40,0.04)] space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search media by title, product, category, or URL..."
                  value={mediaSearch}
                  onChange={(e) => setMediaSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#0070e0]"
                />
                {mediaSearch && (
                  <button
                    onClick={() => setMediaSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium shrink-0">
                <span>Showing <strong>{filteredMedia.length}</strong> of {data.media.length} media assets</span>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-500 mr-1">Category:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {mediaCategories.slice(0, 12).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setMediaCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      mediaCategoryFilter === cat
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Media Content */}
          {isLoading ? (
            <div className="bg-white rounded-xl border border-slate-200/80 p-16 flex flex-col items-center justify-center">
              <RefreshCw className="w-8 h-8 text-[#0070e0] animate-spin mb-3" />
              <p className="text-xs font-semibold text-slate-600">Indexing website media assets...</p>
            </div>
          ) : filteredMedia.length === 0 ? (
            <AdminEmptyState
              icon={ImageIcon}
              title="No media assets match your criteria"
              description="Try adjusting your search query or selecting a different category filter."
            />
          ) : viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {filteredMedia.map((asset) => {
                const isCopied = copiedKeys[asset.id];

                return (
                  <div
                    key={asset.id}
                    className="group bg-white rounded-xl border border-slate-200/80 p-2.5 shadow-[0_1px_3px_rgba(16,24,40,0.04)] hover:shadow-md hover:border-[#0070e0]/50 transition-all flex flex-col justify-between"
                  >
                    {/* Image Viewport */}
                    <div className="aspect-square rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center relative mb-2.5">
                      <img
                        src={asset.url}
                        alt={asset.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] text-white font-medium">
                        {asset.format || "img"}
                      </span>
                      <a
                        href={asset.url}
                        target="_blank"
                        rel="noreferrer"
                        title="Open full size in new tab"
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-md bg-white/90 hover:bg-white text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-xs"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Meta */}
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-900 line-clamp-1 group-hover:text-[#0070e0] transition-colors" title={asset.title}>
                        {asset.title}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="truncate max-w-[90px]">{asset.category}</span>
                        <span className="text-[10px] font-medium text-slate-400 truncate max-w-[80px]">{asset.type}</span>
                      </div>
                    </div>

                    {/* Copy Button */}
                    <button
                      type="button"
                      onClick={() => handleCopy(asset.url, asset.id)}
                      className={`mt-2.5 w-full py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        isCopied
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <AdminTableContainer>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Preview</th>
                    <th className="py-3 px-4">Asset Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 hidden md:table-cell">Type</th>
                    <th className="py-3 px-4 hidden lg:table-cell">Exact URL</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {filteredMedia.map((asset) => {
                    const isCopied = copiedKeys[asset.id];
                    return (
                      <tr key={asset.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5 px-4">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                            <img
                              src={asset.url}
                              alt={asset.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          </div>
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-slate-900">
                          {asset.title}
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">
                          {asset.category}
                        </td>
                        <td className="py-2.5 px-4 hidden md:table-cell">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-medium">
                            {asset.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 hidden lg:table-cell font-mono text-xs text-slate-500 truncate max-w-xs">
                          {asset.url}
                        </td>
                        <td className="py-2.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <button
                              type="button"
                              onClick={() => handleCopy(asset.url, asset.id)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-[#0070e0] hover:bg-slate-50 transition-colors cursor-pointer"
                              title="Copy URL"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <a
                              href={asset.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                              title="Open image in new tab"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </AdminTableContainer>
          )}
        </div>
      )}

      {/* Tab 2: All Website Pages & Route Links */}
      {activeTab === "links" && (
        <div className="space-y-4">
          {/* Links Filters Bar */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-3 sm:p-4 shadow-[0_1px_3px_rgba(16,24,40,0.04)] space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search routes by page name, path, or category..."
                  value={linkSearch}
                  onChange={(e) => setLinkSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#0070e0]"
                />
                {linkSearch && (
                  <button
                    onClick={() => setLinkSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium shrink-0">
                <span>Showing <strong>{filteredLinks.length}</strong> of {data.links.length} routes</span>
              </div>
            </div>

            {/* Type Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-500 mr-1">Route Type:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {linkTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setLinkTypeFilter(type)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      linkTypeFilter === type
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Links Table */}
          <AdminTableContainer>
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <RefreshCw className="w-8 h-8 text-[#0070e0] animate-spin mb-3" />
                <p className="text-xs font-semibold text-slate-600">Loading website routes...</p>
              </div>
            ) : filteredLinks.length === 0 ? (
              <AdminEmptyState
                icon={Link2}
                title="No route links match your query"
                description="Try clearing your search query or selecting a different route type."
              />
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4 sm:px-5">Page / Route Title</th>
                    <th className="py-3.5 px-4">Relative Path</th>
                    <th className="py-3.5 px-4 hidden md:table-cell">Type</th>
                    <th className="py-3.5 px-4 hidden lg:table-cell">Category</th>
                    <th className="py-3.5 px-4 sm:px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {filteredLinks.map((link) => {
                    const isCopied = copiedKeys[link.id];

                    return (
                      <tr key={link.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 sm:px-5">
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 truncate">{link.title}</p>
                            {link.description && (
                              <p className="text-xs text-slate-500 line-clamp-1">{link.description}</p>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono text-xs text-slate-600 whitespace-nowrap">
                          {link.url}
                        </td>

                        <td className="py-3 px-4 hidden md:table-cell">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              link.type === "Storefront"
                                ? "bg-blue-50 text-[#0070e0]"
                                : link.type === "Collection"
                                ? "bg-emerald-50 text-emerald-700"
                                : link.type === "Product"
                                ? "bg-purple-50 text-purple-700"
                                : link.type === "Policy"
                                ? "bg-amber-50 text-amber-700"
                                : link.type === "Admin"
                                ? "bg-slate-900 text-white"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {link.type}
                          </span>
                        </td>

                        <td className="py-3 px-4 hidden lg:table-cell text-slate-500 text-xs">
                          {link.category || "—"}
                        </td>

                        <td className="py-3 px-4 sm:px-5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <button
                              type="button"
                              onClick={() => handleCopy(link.url, link.id)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-[#0070e0] hover:bg-slate-50 transition-colors cursor-pointer"
                              title="Copy URL"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <Link
                              href={link.url}
                              target="_blank"
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                              title="Visit page"
                            >
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </AdminTableContainer>
        </div>
      )}
    </div>
  );
}
