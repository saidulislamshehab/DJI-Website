"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { d1MegaMenus } from "@/data/d1_mega_menu";
import { useCart } from "@/context/CartContext";
import { searchStaticCatalog } from "@/lib/catalog";

const POPULAR_SEARCH_TAGS = [
  "DJI Neo 2",
  "Osmo Pocket 4P",
  "DJI Mavic 4 Pro",
  "DJI Mini 5 Pro",
  "Osmo Action 6",
  "Hasselblad",
];

export default function MainNav() {
  const router = useRouter();
  const { totalCount, setIsCartOpen } = useCart();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);

  // Scroll direction state for smooth auto-hide on scroll-down and reveal on scroll-up
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    let ticking = false;

    const handleScroll = () => {
      // Don't auto-hide if mobile menu is open
      if (mobileMenuOpen) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Update blur state on scroll
          if (currentScrollY > 15) {
            setIsScrolled(true);
          } else {
            setIsScrolled(false);
          }

          // Near top of page: always show navbar
          if (currentScrollY <= 60) {
            setIsVisible(true);
          } else {
            // Avoid triggering on overscroll / rubber banding
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (currentScrollY > 0 && currentScrollY < maxScroll) {
              const diff = currentScrollY - lastScrollY;

              // Scrolling DOWN threshold -> smoothly hide navbar
              if (diff > 6) {
                setIsVisible(false);
                setActiveMenuId(null);
                setSearchFocused(false);
              }
              // Scrolling UP threshold -> smoothly reveal navbar
              else if (diff < -6) {
                setIsVisible(true);
              }
            }
          }

          lastScrollY = Math.max(0, currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [mobileMenuOpen]);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  // Close timeout management with generous 350ms grace period
  const handleMouseEnter = (catId: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveMenuId(catId);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenuId(null);
    }, 350);
  };

  const handleDropdownMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  // Close menus and search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live search results
  const liveResults = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return [];
    return searchStaticCatalog(q).slice(0, 5);
  }, [searchQuery]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
      setSearchFocused(false);
      setMobileSearchOpen(false);
    }
  };

  const handleSelectTag = (tag: string) => {
    setSearchQuery(tag);
    router.push(`/search?q=${encodeURIComponent(tag)}`);
    setSearchFocused(false);
    setMobileSearchOpen(false);
  };

  const activeCategory = d1MegaMenus.find((c) => c.id === activeMenuId);

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-[999] max-w-full border-none transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
        isVisible ? "translate-y-0" : "-translate-y-full pointer-events-none"
      } ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md backdrop-saturate-150 shadow-xs"
          : "bg-white"
      }`}
      style={{
        borderBottom: "none",
        border: "none",
        outline: "none",
        ...(isScrolled
          ? {
              backgroundColor: "rgba(255, 255, 255, 0.96)",
              backdropFilter: "blur(16px) saturate(180%)",
              WebkitBackdropFilter: "blur(16px) saturate(180%)",
            }
          : {}),
      }}
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-[68px] lg:h-[72px] gap-2 lg:gap-3 xl:gap-4 w-full">
          {/* Mobile Hamburger button (visible on screens < lg) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 text-[#121212] lg:hidden flex items-center justify-center hover:text-[#0070e0] transition-colors"
            aria-label="Open Navigation"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo (DJI | D1 STORE AUTHORISED RETAIL STORE) */}
          <div className="flex items-center shrink-0 mr-2 xl:mr-4">
            <Link href="/" className="inline-block focus:outline-hidden">
              <img
                src="/dji-d1-logo.png"
                alt="DJI Authorised Retail Store - D1 Store"
                className="h-[24px] sm:h-[26px] lg:h-[28px] w-auto object-contain"
                width={220}
                height={28}
              />
            </Link>
          </div>

          {/* Desktop Navigation Items - All 7 Categories Visible on desktop (>= lg) */}
          <nav className="flex items-center space-x-1 lg:space-x-1.5 xl:space-x-2.5 2xl:space-x-4 max-lg:hidden h-full shrink-0">
            {d1MegaMenus.map((cat) => {
              const isActive = activeMenuId === cat.id;
              return (
                <div
                  key={cat.id}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => handleMouseEnter(cat.id)}
                >
                  <Link
                    href={cat.href}
                    onClick={() => setActiveMenuId(null)}
                    className={`px-1.5 xl:px-2.5 2xl:px-3 py-2 text-[13px] xl:text-[14px] font-medium tracking-normal whitespace-nowrap transition-colors flex items-center gap-1 xl:gap-1.5 rounded-md cursor-pointer ${
                      isActive
                        ? "text-[#0070e0]"
                        : "text-[#121212] hover:text-[#0070e0]"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 stroke-[2] ${
                        isActive
                          ? "rotate-180 text-[#0070e0]"
                          : "text-[#555] group-hover:text-[#0070e0]"
                      }`}
                    />
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Search Input Bar (Prominent Capsule Pill Search Bar) */}
          <div
            ref={searchContainerRef}
            className="relative flex flex-1 max-w-[200px] sm:max-w-[240px] md:max-w-[280px] lg:max-w-[340px] xl:max-w-[420px] min-w-0 mx-1 md:mx-2 xl:mx-4"
          >
            <form
              onSubmit={handleSearchSubmit}
              className="group/search w-full flex items-center h-[38px] lg:h-[40px] bg-[#f4f5f7] hover:bg-[#ebedf0] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0070e0]/20 focus-within:border-[#0070e0] transition-all duration-200 rounded-full px-3.5 border border-[#e5e7eb]"
            >
              <button
                type="submit"
                className="text-[#8e8e93] group-focus-within/search:text-[#0070e0] hover:text-[#0070e0] transition-colors p-0 mr-2.5 shrink-0 cursor-pointer border-0 bg-transparent outline-none focus:outline-none"
                style={{ border: "none", outline: "none", background: "transparent" }}
                aria-label="Submit search"
              >
                <Search className="w-4 h-4 stroke-[2]" />
              </button>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder="Search products, brands & more"
                className="w-full bg-transparent text-[13px] xl:text-[14px] text-[#121212] placeholder-[#8e8e93] border-none outline-none focus:outline-none focus:ring-0 focus:border-none shadow-none ring-0 appearance-none min-w-0 p-0 leading-normal"
                style={{ border: "none", outline: "none", boxShadow: "none", background: "transparent", WebkitAppearance: "none" }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1 text-[#8e8e93] hover:text-[#121212] transition-colors shrink-0 border-0 bg-transparent outline-none cursor-pointer"
                  style={{ border: "none", outline: "none", background: "transparent" }}
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Instant Search Suggestions / Results Dropdown */}
            {searchFocused && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[1000] p-4 w-[min(380px,calc(100vw-32px))] max-w-[calc(100vw-32px)]">
                {searchQuery.trim() ? (
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                      Products ({liveResults.length})
                    </div>
                    {liveResults.length > 0 ? (
                      <div className="space-y-1">
                        {liveResults.map((prod) => (
                          <Link
                            key={prod.slug}
                            href={`/products/${prod.slug}`}
                            onClick={() => setSearchFocused(false)}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f5f5f7] transition-colors group"
                          >
                            <div className="w-10 h-10 rounded-lg bg-[#f5f5f7] flex items-center justify-center p-1 shrink-0 overflow-hidden">
                              {prod.mainImage ? (
                                <img
                                  src={prod.mainImage}
                                  alt={prod.name}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <Search className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-medium text-[#121212] group-hover:text-[#0070e0] truncate">
                                {prod.name}
                              </p>
                              {prod.price > 0 && (
                                <p className="text-[12px] font-bold text-gray-500">
                                  ${prod.price.toLocaleString()}
                                </p>
                              )}
                            </div>
                          </Link>
                        ))}
                        <div className="pt-2 border-t border-gray-100 mt-2">
                          <button
                            type="button"
                            onClick={() => handleSearchSubmit()}
                            className="w-full text-center text-xs font-semibold text-[#0070e0] hover:underline py-1 cursor-pointer"
                          >
                            View all results for &ldquo;{searchQuery}&rdquo; &rarr;
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-2 text-center">
                        <p className="text-xs text-gray-500 mb-2">
                          No quick preview matching &ldquo;{searchQuery}&rdquo;.
                        </p>
                        <button
                          type="button"
                          onClick={() => handleSearchSubmit()}
                          className="text-xs font-semibold text-[#0070e0] hover:underline"
                        >
                          Press Enter to search full catalog &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                      Popular Searches
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_SEARCH_TAGS.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleSelectTag(tag)}
                          className="text-xs bg-[#f2f3f5] hover:bg-[#e5e7eb] text-[#333336] hover:text-[#0070e0] px-3 py-1.5 rounded-full transition-colors cursor-pointer font-medium"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons: Big Account + Shopping Bag Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-5 shrink-0">
            {/* Mobile Search Button (toggle inline search on small devices) */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="p-1.5 text-[#121212] hover:text-[#0070e0] transition-colors md:hidden"
              aria-label="Toggle mobile search"
            >
              <Search className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* Big User / Account Outline Icon */}
            <Link
              href="/login"
              className="p-1 text-[#121212] hover:text-[#0070e0] transition-colors inline-flex items-center justify-center group"
              aria-label="Log in to account"
            >
              <svg
                className="w-[26px] h-[26px] stroke-[1.6] group-hover:scale-105 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="7" r="4" />
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              </svg>
            </Link>

            {/* Big Shopping Bag Outline Icon */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-1 text-[#121212] hover:text-[#0070e0] transition-all inline-flex items-center justify-center cursor-pointer group active:scale-90 duration-150"
              aria-label="View shopping bag"
            >
              <svg
                className="w-[26px] h-[26px] stroke-[1.6] group-hover:scale-105 group-active:scale-95 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8.5 7V4.8a3.5 3.5 0 0 1 7 0V7" />
                <path d="M4 7h16l-1.3 12a2 2 0 0 1-2 1.8H7.3a2 2 0 0 1-2-1.8L4 7Z" />
              </svg>
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-[#0070e0] text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-xs">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Input Drawer (Visible when toggled on mobile phones) */}
        {mobileSearchOpen && (
          <div className="pb-3 md:hidden">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands & more"
                autoFocus
                className="w-full h-10 pl-10 pr-9 bg-[#f4f5f7] rounded-full text-sm text-[#121212] outline-none border-none border-0 ring-0 focus:ring-2 focus:ring-[#0070e0] focus:border-[#0070e0] shadow-none appearance-none"
                style={{ border: "none", outline: "none", boxShadow: "none", WebkitAppearance: "none" }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 text-gray-400 hover:text-black p-1 border-0 bg-transparent outline-none cursor-pointer"
                  style={{ border: "none", outline: "none", background: "transparent" }}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>
        )}
      </div>

      {/* Interactive Mega Menu Dropdown */}
      {activeCategory && (
        <div
          className="absolute left-0 right-0 top-full w-full max-w-full bg-white border-b border-[#e5e5ea] shadow-2xl py-8 px-4 sm:px-6 lg:px-8 z-[100] overflow-x-hidden"
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Invisible Hover Bridge connecting navbar bottom to dropdown */}
          <div className="absolute -top-4 left-0 right-0 h-4 bg-transparent" />

          <div className="max-w-[1760px] mx-auto w-full overflow-hidden">
            {/* Header / Category Title inside Dropdown */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
              <span className="text-[13px] font-bold tracking-wider uppercase text-[#0070e0]">
                {activeCategory.label}
              </span>
              <Link
                href={activeCategory.href}
                onClick={() => setActiveMenuId(null)}
                className="text-[13px] font-medium text-gray-500 hover:text-[#0070e0] flex items-center gap-1 group/all transition-colors"
              >
                <span>View all {activeCategory.label}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/all:translate-x-0.5" />
              </Link>
            </div>

            {/* Columns of Series & Models */}
            <div className="flex flex-wrap items-start justify-start gap-x-6 gap-y-7 xl:gap-x-8">
              {activeCategory.columns.map((col, cIdx) => (
                <div
                  key={cIdx}
                  className="flex flex-col items-start w-[140px] sm:w-[155px] xl:w-[170px] flex-shrink-0"
                >
                  {/* Column Thumbnail & Series Title */}
                  <Link
                    href={col.seriesHref || (col.items[0] ? col.items[0].href : activeCategory.href)}
                    onClick={() => setActiveMenuId(null)}
                    className="group/thumb flex flex-col items-start w-full text-left"
                  >
                    {col.img ? (
                      <div className="w-[125px] h-[125px] xl:w-[140px] xl:h-[140px] rounded-xl bg-[#f5f5f7]/70 flex items-center justify-center p-2 mb-2.5 overflow-hidden transition-transform duration-300 group-hover/thumb:scale-105">
                        <img
                          src={col.img}
                          alt={col.seriesTitle}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="w-[125px] h-[12px]" />
                    )}

                    <span className="font-semibold text-[14px] text-[#121212] group-hover/thumb:text-[#0070e0] transition-colors leading-snug line-clamp-1">
                      {col.seriesTitle}
                    </span>
                  </Link>

                  {/* List of Models / Sub-links */}
                  {col.items.length > 0 && (
                    <ul className="mt-2 space-y-1.5 list-none p-0 m-0 w-full">
                      {col.items.map((item, iIdx) => (
                        <li key={iIdx}>
                          <Link
                            href={item.href}
                            onClick={() => setActiveMenuId(null)}
                            className="group/link text-[13px] text-[#4b5563] hover:text-[#0070e0] font-normal transition-colors flex items-center gap-1.5 py-0.5 leading-snug"
                          >
                            <span className="hover:underline">{item.title}</span>
                            {item.badge && (
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white uppercase tracking-wider ${
                                  item.badge.toLowerCase() === "sale"
                                    ? "bg-[#e11d48]"
                                    : item.badge.toLowerCase() === "new"
                                    ? "bg-[#16a34a]"
                                    : "bg-[#ea580c]"
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer (< md) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-[85%] max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {/* Mobile Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <img
                src="/dji-d1-logo.png"
                alt="D1 Store"
                className="h-6 w-auto object-contain"
              />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-gray-500 hover:text-black"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {d1MegaMenus.map((cat) => {
                const isExpanded = mobileExpandedCat === cat.id;
                return (
                  <div key={cat.id} className="border-b border-gray-100 pb-2">
                    <div className="w-full flex items-center justify-between py-2">
                      <Link
                        href={cat.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-base font-bold text-[#121212] hover:text-[#0070e0] flex-1 py-1"
                      >
                        {cat.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          setMobileExpandedCat(isExpanded ? null : cat.id)
                        }
                        className="p-1.5 text-gray-400 hover:text-[#0070e0] cursor-pointer"
                        aria-label={`Toggle ${cat.label} menu`}
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isExpanded ? "rotate-180 text-[#0070e0]" : "text-gray-400"
                          }`}
                        />
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="pl-2 py-2 space-y-3 bg-[#f8f9fa] rounded-xl mt-1">
                        <Link
                          href={cat.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between text-xs font-bold text-[#0070e0] py-1.5 px-2 bg-blue-50/70 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <span>Explore All {cat.label}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        {cat.columns.map((col, cIdx) => (
                          <div key={cIdx} className="space-y-1">
                            <div className="flex items-center gap-2">
                              {col.img && (
                                <img
                                  src={col.img}
                                  alt={col.seriesTitle}
                                  className="w-7 h-7 object-contain rounded"
                                />
                              )}
                              <span className="text-[12px] font-bold text-[#121212]">
                                {col.seriesTitle}
                              </span>
                            </div>
                            <div className="pl-9 space-y-1">
                              {col.items.map((it, iIdx) => (
                                <Link
                                  key={iIdx}
                                  href={it.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="flex items-center justify-between py-1 text-xs text-gray-600 hover:text-[#0070e0]"
                                >
                                  <span>{it.title}</span>
                                  {it.badge && (
                                    <span
                                      className={`text-[8px] font-bold px-1 py-0.5 rounded text-white ${
                                        it.badge.toLowerCase() === "sale"
                                          ? "bg-[#e11d48]"
                                          : it.badge.toLowerCase() === "new"
                                          ? "bg-[#16a34a]"
                                          : "bg-[#ea580c]"
                                      }`}
                                    >
                                      {it.badge}
                                    </span>
                                  )}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Utility links inside mobile drawer */}
              <div className="pt-4 space-y-2 text-sm font-medium text-gray-600 border-t border-gray-100">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 text-[#0070e0] font-semibold"
                >
                  Log In / Account
                </Link>
                <Link
                  href="/pages/about-us"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-[#0070e0]"
                >
                  About Us
                </Link>
                <Link
                  href="/pages/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-[#0070e0]"
                >
                  Contact Us
                </Link>
                <Link
                  href="/pages/repairs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-[#0070e0]"
                >
                  Repair & Service
                </Link>
                <Link
                  href="/pages/stores"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 text-[#0070e0] font-semibold"
                >
                  Store Finder
                </Link>
              </div>
            </div>

            {/* Mobile Footer */}
            <div className="p-4 border-t border-gray-100 bg-[#f8f9fa] text-xs text-gray-500">
              <p className="font-bold text-[#121212]">DJI Authorised Retail Store</p>
              <p>Australia-wide physical stores & local support</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
