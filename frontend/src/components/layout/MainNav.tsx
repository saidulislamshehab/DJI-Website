"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, Menu, X, ChevronDown, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { d1MegaMenus, MegaMenuCategory } from "@/data/d1_mega_menu";
import { useCart } from "@/context/CartContext";
import { searchStaticCatalog } from "@/lib/catalog";
import { fetchCategories } from "@/lib/api";
import { ICategory } from "@/types";

export const ROOT_CATEGORY_THUMBNAILS: Record<string, string> = {
  drones:
    "https://cdn.d1store.app/shopify/product-page-editor/assets/cc2128f7-0a63-4b8c-924b-d37d38f8b2e6/005-website-categoryimages-mavic4p-fa.webp",
  handhelds:
    "https://cdn.d1store.app/shopify/product-page-editor/assets/9a4fcda6-2e7a-47eb-84ab-5e63c963423b/005-website-categoryimages-batch2-osmopocket4p-fa.jpg",
  "lifestyle-tech":
    "https://cdn.d1store.app/shopify/product-page-editor/assets/ceced266-a544-4451-ba31-e7338eb11755/005-website-categoryimages-romop-fa.webp",
  enterprise:
    "https://cdn.d1store.app/shopify/product-page-editor/assets/a743ac05-d8fa-4b7b-9812-ceb184e763b9/005-website-categoryimages-flycart100-fa.webp",
  "enterprise-agriculture":
    "https://cdn.d1store.app/shopify/product-page-editor/assets/a743ac05-d8fa-4b7b-9812-ceb184e763b9/005-website-categoryimages-flycart100-fa.webp",
  hasselblad:
    "https://cdn.d1store.app/shopify/product-page-editor/assets/7e2a0013-bac8-48f4-a377-c2e5d562ec76/005-website-categoryimages-hb-x2dii100c-fa.webp",
  accessories:
    "https://cdn.d1store.app/shopify/product-page-editor/assets/cfb566ad-af80-45c5-948c-1c58804c8b2e/005-website-categoryimages-creatoressentials-fa.webp",
  sale:
    "https://cdn.d1store.app/shopify/product-page-editor/assets/77aa140a-fe95-4305-90f2-f2dad008a8d6/005-website-categoryimages-sale-v2.png",
};

export const MOBILE_QUICK_LINKS = [
  { label: "About Us", href: "/pages/about-us" },
  { label: "Contact Us", href: "/pages/contact" },
  { label: "Support", href: "/pages/support" },
  { label: "Repair", href: "/pages/repairs" },
  { label: "Enterprise", href: "/pages/enterprise" },
  { label: "Get Quote", href: "/pages/get-quote" },
  { label: "Price Match", href: "/pages/price-match" },
];

const POPULAR_SEARCH_TAGS = [
  "DJI Neo 2",
  "Osmo Pocket 4P",
  "DJI Mavic 4 Pro",
  "DJI Mini 5 Pro",
  "Osmo Action 6",
  "Hasselblad",
];

export function mergeCategoriesWithMegaMenu(
  dbCats: ICategory[],
  staticMenus: MegaMenuCategory[]
): MegaMenuCategory[] {
  if (!dbCats || dbCats.length === 0) return staticMenus;

  const result: MegaMenuCategory[] = [];
  const processedSlugs = new Set<string>();

  // 1. Process all categories returned by backend/database in order
  for (const dbCat of dbCats) {
    const slug = (dbCat.slug || "").toLowerCase().trim();
    if (!slug) continue;
    processedSlugs.add(slug);

    // Look for matching static mega menu
    const existing = staticMenus.find(
      (m) =>
        m.id === slug ||
        m.id.replace("-agriculture", "") === slug ||
        slug.replace("-agriculture", "") === m.id ||
        m.label.toLowerCase() === dbCat.name.toLowerCase()
    );

    if (existing) {
      result.push({
        ...existing,
        id: slug,
        label: dbCat.name || existing.label,
        href: dbCat.url || `/collections/${slug}`,
      });
    } else {
      // Newly created custom category in admin panel
      const columns = (dbCat.subCategories || []).map((sub: any) => {
        const subName = typeof sub === "string" ? sub : sub?.name || "Items";
        const subSlug = typeof sub === "string" ? sub.toLowerCase().replace(/[^a-z0-9]+/g, "-") : (sub?.slug || "");
        const subUrl = typeof sub === "string" ? `/collections/${subSlug}` : (sub?.url || `/collections/${subSlug}`);
        const subThumb = typeof sub === "string" ? dbCat.image || "" : (sub?.thumbnail || dbCat.image || "");
        const options = (typeof sub === "object" && sub?.options) || [];

        return {
          seriesTitle: subName,
          seriesHref: subUrl,
          img: subThumb,
          items: options.map((opt: any) => ({
            title: opt.name,
            href: opt.url || `/collections/${opt.slug}`,
            badge: opt.badge || "",
          })),
        };
      });

      result.push({
        id: slug,
        label: dbCat.name,
        href: dbCat.url || `/collections/${slug}`,
        columns:
          columns.length > 0
            ? columns
            : [
                {
                  seriesTitle: dbCat.name,
                  seriesHref: `/collections/${slug}`,
                  img: dbCat.image || "",
                  items: [],
                },
              ],
      });
    }
  }

  // 2. If any core static menu wasn't in DB yet, preserve it
  for (const staticMenu of staticMenus) {
    if (
      !processedSlugs.has(staticMenu.id) &&
      !processedSlugs.has(staticMenu.id.replace("-agriculture", ""))
    ) {
      result.push(staticMenu);
    }
  }

  return result;
}

export default function MainNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { totalCount, setIsCartOpen, setIsSearchOpen } = useCart();
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<MegaMenuCategory[]>(d1MegaMenus);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileNavLevel, setMobileNavLevel] = useState<"root" | "category" | "series">("root");
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [selectedSeriesTitle, setSelectedSeriesTitle] = useState<string | null>(null);
  const drawerScrollRef = useRef<HTMLDivElement | null>(null);

  // Scroll direction state for smooth auto-hide on scroll-down and reveal on scroll-up
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  // Fetch real categories from database & listen for admin updates
  const loadDynamicCategories = useCallback(async () => {
    try {
      const dbCats = await fetchCategories();
      if (dbCats && dbCats.length > 0) {
        setCategories(mergeCategoriesWithMegaMenu(dbCats, d1MegaMenus));
      }
    } catch {
      // Gracefully maintain initial categories on network error
    }
  }, []);

  useEffect(() => {
    loadDynamicCategories();
    const handleUpdate = () => {
      loadDynamicCategories();
    };
    window.addEventListener("d1_categories_updated", handleUpdate);
    return () => window.removeEventListener("d1_categories_updated", handleUpdate);
  }, [loadDynamicCategories]);

  // Check login state
  useEffect(() => {
    try {
      setIsLoggedIn(Boolean(localStorage.getItem("d1_token") || localStorage.getItem("d1_user")));
    } catch {}
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll while mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileMenuOpen]);

  // Selected category and series for mobile drilldown navigation (resilient matching)
  const selectedCategory = useMemo(() => {
    if (!selectedCatId) return null;
    const target = selectedCatId.toLowerCase().trim();
    return (
      categories.find((c) => c.id === selectedCatId) ||
      categories.find((c) => c.id.toLowerCase() === target) ||
      categories.find((c) => c.id.replace("-agriculture", "") === target) ||
      categories.find((c) => target.replace("-agriculture", "") === c.id) ||
      categories.find((c) => c.label.toLowerCase() === target) ||
      null
    );
  }, [categories, selectedCatId]);

  const selectedSeries = useMemo(() => {
    if (!selectedCategory || !selectedSeriesTitle) return null;
    const target = selectedSeriesTitle.toLowerCase().trim();
    return (
      selectedCategory.columns.find((col) => col.seriesTitle === selectedSeriesTitle) ||
      selectedCategory.columns.find(
        (col) => col.seriesTitle.toLowerCase() === target
      ) ||
      null
    );
  }, [selectedCategory, selectedSeriesTitle]);

  // Reset drilldown state when mobile drawer closes
  useEffect(() => {
    if (!mobileMenuOpen) {
      setMobileNavLevel("root");
      setSelectedCatId(null);
      setSelectedSeriesTitle(null);
    }
  }, [mobileMenuOpen]);

  // Scroll to top of drawer on drilldown level change
  useEffect(() => {
    if (drawerScrollRef.current) {
      drawerScrollRef.current.scrollTop = 0;
    }
  }, [mobileNavLevel, selectedCatId, selectedSeriesTitle]);

  // Keyboard accessibility: Escape key closes active menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMenuId(null);
        setSearchFocused(false);
        setMobileMenuOpen(false);
        setMobileSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Sticky header scroll direction listener
  useEffect(() => {
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    let ticking = false;

    const getHeaderHeight = () => (typeof window !== "undefined" && window.innerWidth >= 1024 ? "72px" : "68px");

    // Initialize CSS variable on mount
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--nav-offset", getHeaderHeight());
    }

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

          // Near top of page: always show navbar and full offset
          if (currentScrollY <= 80) {
            setIsVisible(true);
            document.documentElement.style.setProperty("--nav-offset", getHeaderHeight());
          } else {
            // Avoid triggering on overscroll / rubber banding
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (currentScrollY > 0 && currentScrollY < maxScroll) {
              const diff = currentScrollY - lastScrollY;

              // Scrolling DOWN threshold -> smoothly hide navbar
              if (diff > 6) {
                setIsVisible(false);
                document.documentElement.style.setProperty("--nav-offset", "0px");
                setActiveMenuId(null);
                setSearchFocused(false);
              }
              // Scrolling UP threshold -> smoothly reveal navbar
              else if (diff < -6) {
                setIsVisible(true);
                document.documentElement.style.setProperty("--nav-offset", getHeaderHeight());
              }
            }
          }

          lastScrollY = Math.max(0, currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleResize = () => {
      if (typeof document !== "undefined") {
        document.documentElement.style.setProperty("--nav-offset", isVisible ? getHeaderHeight() : "0px");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [mobileMenuOpen, isVisible]);

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

  const activeCategory = categories.find((c) => c.id === activeMenuId);

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
            className="p-2 -ml-2 text-[#121212] lg:hidden flex items-center justify-center hover:text-[#0070e0] transition-colors cursor-pointer"
            aria-label="Open Navigation"
          >
            <Menu className="w-6 h-6 stroke-[1.8]" />
          </button>

          {/* Logo (DJI | D1 STORE AUTHORISED RETAIL STORE) */}
          <div className="flex items-center shrink-0 mr-1 sm:mr-2 xl:mr-4 max-lg:flex-1 max-lg:justify-center">
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

          {/* Desktop Navigation Items - All Categories Visible on desktop (>= lg) */}
          <nav
            aria-label="Main Navigation"
            className="flex items-center space-x-0.5 lg:space-x-1 xl:space-x-2 2xl:space-x-3.5 max-lg:hidden h-full shrink-0"
          >
            {categories.map((cat) => {
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
                    onFocus={() => handleMouseEnter(cat.id)}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
                        setActiveMenuId(cat.id);
                      }
                    }}
                    aria-haspopup="true"
                    aria-expanded={isActive}
                    className={`px-1.5 lg:px-2 xl:px-2.5 2xl:px-3 py-2 text-[12.5px] lg:text-[13px] xl:text-[14px] font-medium tracking-normal whitespace-nowrap transition-colors flex items-center gap-1 xl:gap-1.5 rounded-md cursor-pointer ${
                      isActive
                        ? "text-[#0070e0]"
                        : "text-[#121212] hover:text-[#0070e0]"
                    }`}
                  >
                    <span className="max-xl:hidden inline">{cat.label}</span>
                    <span className="xl:hidden">
                      {cat.label === "Enterprise & Agriculture" ? "Enterprise" : cat.label}
                    </span>
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

          {/* Search Input Bar (Prominent Capsule Pill on Desktops >= xl) */}
          <div
            ref={searchContainerRef}
            className="relative flex max-xl:hidden flex-1 min-w-[200px] max-w-[340px] 2xl:max-w-[420px] mx-2 xl:mx-4"
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
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
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
                          className="text-xs font-semibold text-[#0070e0] hover:underline cursor-pointer"
                        >
                          Press Enter to search full catalog &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
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
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 shrink-0">
            {/* Search Modal Trigger (Visible on laptop, tablet, mobile < xl) */}
            <button
              type="button"
              onClick={() => {
                if (setIsSearchOpen) setIsSearchOpen(true);
                else setMobileSearchOpen(!mobileSearchOpen);
              }}
              className="p-1.5 text-[#121212] hover:text-[#0070e0] transition-colors xl:hidden cursor-pointer"
              aria-label="Open search dialog"
            >
              <Search className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* Big User / Account Outline Icon */}
            <Link
              href={isLoggedIn ? "/account" : "/login"}
              className="p-1 text-[#121212] hover:text-[#0070e0] transition-colors inline-flex items-center justify-center group"
              aria-label={isLoggedIn ? "Customer Account" : "Log in to account"}
            >
              <svg
                className="w-[24px] h-[24px] sm:w-[26px] sm:h-[26px] stroke-[1.6] group-hover:scale-105 transition-transform"
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
                className="w-[24px] h-[24px] sm:w-[26px] sm:h-[26px] stroke-[1.6] group-hover:scale-105 group-active:scale-95 transition-transform"
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
          <div className="pb-3 sm:hidden">
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
          role="menu"
          aria-label={`${activeCategory.label} Submenu`}
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

      {/* Mobile Navigation Drawer - D1 Store Pixel-Perfect Multi-Panel Drilldown Mounted via Portal */}
      {mounted &&
        mobileMenuOpen &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            className="fixed inset-0 z-[99999] flex overflow-hidden"
          >
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer Container */}
            <div className="relative w-[84%] sm:w-[350px] max-w-[360px] bg-white h-full h-dvh max-h-screen shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-250">
              {/* Top Chrome / Header */}
              {mobileNavLevel === "root" ? (
                <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 active:bg-black/15 flex items-center justify-center text-[#121212] transition-colors cursor-pointer"
                    aria-label="Close navigation"
                  >
                    <X className="w-4 h-4 stroke-[2]" />
                  </button>
                </div>
              ) : mobileNavLevel === "category" ? (
                <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
                  <button
                    type="button"
                    onClick={() => setMobileNavLevel("root")}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-800 hover:text-[#0070e0] transition-colors cursor-pointer py-1"
                    aria-label="Back to categories"
                  >
                    <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                    <span>Back</span>
                  </button>
                  {selectedCategory && (
                    <Link
                      href={selectedCategory.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="inline-flex items-center gap-1 text-[13px] font-medium text-gray-500 hover:text-[#0070e0] transition-colors"
                    >
                      <span>Shop all</span>
                      <span className="text-sm">→</span>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
                  <button
                    type="button"
                    onClick={() => setMobileNavLevel("category")}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-800 hover:text-[#0070e0] transition-colors cursor-pointer py-1"
                    aria-label={`Back to ${selectedCategory?.label || "Category"}`}
                  >
                    <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                    <span>{selectedCategory?.label || "Back"}</span>
                  </button>
                  {selectedSeries?.seriesHref && (
                    <Link
                      href={selectedSeries.seriesHref}
                      onClick={() => setMobileMenuOpen(false)}
                      className="inline-flex items-center gap-1 text-[13px] font-medium text-gray-500 hover:text-[#0070e0] transition-colors"
                    >
                      <span>Shop all</span>
                      <span className="text-sm">→</span>
                    </Link>
                  )}
                </div>
              )}

              {/* Scrollable Drawer Body */}
              <div ref={drawerScrollRef} className="flex-1 overflow-y-auto overflow-x-hidden">
                {/* Level 0: Root Categories & Quick Links */}
                {mobileNavLevel === "root" && (
                  <div className="animate-in fade-in duration-200">
                    <div className="px-4 pt-4 pb-2">
                      <h2 className="text-[17px] font-bold text-[#121212] tracking-tight">
                        Select your category
                      </h2>
                    </div>

                    {/* 7 Main Categories */}
                    <ul className="divide-y divide-gray-100 list-none p-0 m-0">
                      {categories.map((cat) => {
                        const thumb =
                          ROOT_CATEGORY_THUMBNAILS[cat.id] ||
                          ROOT_CATEGORY_THUMBNAILS[cat.id.replace("-agriculture", "")] ||
                          cat.columns[0]?.img ||
                          "";
                        const hasSub = cat.columns && cat.columns.length > 0;
                        return (
                          <li key={cat.id}>
                            <button
                              type="button"
                              onClick={() => {
                                if (hasSub) {
                                  setSelectedCatId(cat.id);
                                  setMobileNavLevel("category");
                                } else {
                                  setMobileMenuOpen(false);
                                  router.push(cat.href);
                                }
                              }}
                              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50/80 active:bg-gray-100 transition-colors text-left cursor-pointer group"
                            >
                              <div className="flex items-center gap-3.5 min-w-0">
                                <span className="w-14 h-14 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-transparent">
                                  {thumb ? (
                                    <img
                                      src={thumb}
                                      alt={cat.label}
                                      className="w-full h-full object-contain"
                                      loading="lazy"
                                    />
                                  ) : (
                                    <span className="w-full h-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                                      {cat.label.slice(0, 2).toUpperCase()}
                                    </span>
                                  )}
                                </span>
                                <span className="text-[15px] font-medium text-[#121212] group-hover:text-[#0070e0] transition-colors truncate">
                                  {cat.label}
                                </span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 group-hover:text-[#0070e0] transition-colors" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>

                    {/* QUICK LINKS Section */}
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <div className="px-4 pt-3 pb-2">
                        <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                          QUICK LINKS
                        </span>
                      </div>
                      <ul className="divide-y divide-gray-100 list-none p-0 m-0">
                        {MOBILE_QUICK_LINKS.map((link) => (
                          <li key={link.label}>
                            <Link
                              href={link.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="px-4 py-3 flex items-center justify-between hover:bg-gray-50/80 hover:text-[#0070e0] transition-colors text-[14px] font-normal text-gray-800"
                            >
                              <span>{link.label}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-gray-400 stroke-[1.8] shrink-0" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Footer Utility / Account & Store Info */}
                    <div className="mt-4 p-4 border-t border-gray-100 bg-[#fafafa] space-y-3">
                      <Link
                        href={isLoggedIn ? "/account" : "/login"}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 text-sm font-semibold text-[#0070e0] hover:underline"
                      >
                        <svg
                          className="w-4 h-4 stroke-[1.8]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="7" r="4" />
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        </svg>
                        <span>{isLoggedIn ? "My Account" : "Log In / Register"}</span>
                      </Link>
                      <div className="text-xs text-gray-500 space-y-0.5">
                        <p className="font-bold text-[#121212]">DJI Authorised Retail Store</p>
                        <p>Australia-wide physical stores & local support</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Level 1: Category Series Drilldown */}
                {mobileNavLevel === "category" && selectedCategory && (
                  <div className="animate-in fade-in duration-200">
                    <div className="px-4 pt-4 pb-2">
                      <h2 className="text-[17px] font-bold text-[#121212] tracking-tight">
                        {selectedCategory.label}
                      </h2>
                    </div>

                    <ul className="divide-y divide-gray-100 list-none p-0 m-0">
                      {selectedCategory.columns.map((col, idx) => {
                        const hasItems = col.items && col.items.length > 0;
                        return (
                          <li key={idx}>
                            {hasItems ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedSeriesTitle(col.seriesTitle);
                                  setMobileNavLevel("series");
                                }}
                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50/80 active:bg-gray-100 transition-colors text-left cursor-pointer group"
                              >
                                <div className="flex items-center gap-3.5 min-w-0">
                                  <span className="w-14 h-14 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-transparent">
                                    {col.img ? (
                                      <img
                                        src={col.img}
                                        alt={col.seriesTitle}
                                        className="w-full h-full object-contain"
                                        loading="lazy"
                                      />
                                    ) : (
                                      <span className="w-full h-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                                        {col.seriesTitle.slice(0, 2).toUpperCase()}
                                      </span>
                                    )}
                                  </span>
                                  <span className="text-[15px] font-medium text-[#121212] group-hover:text-[#0070e0] transition-colors truncate">
                                    {col.seriesTitle}
                                  </span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 group-hover:text-[#0070e0] transition-colors" />
                              </button>
                            ) : (
                              <Link
                                href={col.seriesHref || selectedCategory.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50/80 active:bg-gray-100 transition-colors text-left cursor-pointer group"
                              >
                                <div className="flex items-center gap-3.5 min-w-0">
                                  <span className="w-14 h-14 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-transparent">
                                    {col.img ? (
                                      <img
                                        src={col.img}
                                        alt={col.seriesTitle}
                                        className="w-full h-full object-contain"
                                        loading="lazy"
                                      />
                                    ) : (
                                      <span className="w-full h-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                                        {col.seriesTitle.slice(0, 2).toUpperCase()}
                                      </span>
                                    )}
                                  </span>
                                  <span className="text-[15px] font-medium text-[#121212] group-hover:text-[#0070e0] transition-colors truncate">
                                    {col.seriesTitle}
                                  </span>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0 group-hover:text-[#0070e0] transition-colors" />
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Level 2: Specific Series / Models Drilldown */}
                {mobileNavLevel === "series" && selectedSeries && (
                  <div className="animate-in fade-in duration-200">
                    <div className="px-4 pt-4 pb-2">
                      <h2 className="text-[17px] font-bold text-[#121212] tracking-tight">
                        {selectedSeries.seriesTitle}
                      </h2>
                    </div>

                    <ul className="divide-y divide-gray-100 list-none p-0 m-0">
                      {selectedSeries.items.map((item, idx) => (
                        <li key={idx}>
                          <Link
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50/80 active:bg-gray-100 transition-colors text-left cursor-pointer group"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <span className="w-14 h-14 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-transparent">
                                {selectedSeries.img ? (
                                  <img
                                    src={selectedSeries.img}
                                    alt={item.title}
                                    className="w-full h-full object-contain"
                                    loading="lazy"
                                  />
                                ) : (
                                  <span className="w-full h-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                                    {item.title.slice(0, 2).toUpperCase()}
                                  </span>
                                )}
                              </span>
                              <div className="min-w-0">
                                <span className="text-[15px] font-medium text-[#121212] group-hover:text-[#0070e0] transition-colors block truncate">
                                  {item.title}
                                </span>
                                {item.badge && (
                                  <span
                                    className={`inline-block mt-0.5 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded text-white ${
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
                              </div>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0 group-hover:text-[#0070e0] transition-colors" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}
