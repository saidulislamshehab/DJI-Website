"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X, ChevronDown } from "lucide-react";
import { d1MegaMenus, MegaMenuCategory } from "@/data/d1_mega_menu";
import { useCart } from "@/context/CartContext";

export default function MainNav() {
  const { totalCount, setIsCartOpen, setIsSearchOpen } = useCart();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (catId: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveMenuId(catId);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenuId(null);
    }, 150);
  };

  const PRIMARY_IDS = ["drones", "handhelds", "lifestyle-tech", "enterprise-agriculture"];
  const primaryMenus = d1MegaMenus.filter((c) => PRIMARY_IDS.includes(c.id));
  const moreMenus = d1MegaMenus.filter((c) => !PRIMARY_IDS.includes(c.id));
  const isMoreOpen = activeMenuId === "more";
  const activeCategory = isMoreOpen ? undefined : d1MegaMenus.find((c) => c.id === activeMenuId);

  return (
    <header className="sticky top-0 relative z-50 bg-white border-b border-[#e5e5ea] transition-all">
      <div className="page-width">
        <div className="flex items-center justify-between h-[68px] md:h-[72px] gap-2 lg:gap-4">
          {/* Mobile Hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 text-[#121212] max-lg:flex hidden items-center justify-center hover:text-[#0071e3] transition-colors"
            aria-label="Open Navigation"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="inline-block focus:outline-hidden">
              <img
                src="//www.d1store.com.au/cdn/shop/files/DJIxD1STORE-ARS-PNG.png?v=1768876884&width=360"
                alt="DJI Authorised Retail Store - D1 Store"
                className="h-[26px] md:h-[30px] w-auto object-contain"
                width={190}
                height={30}
              />
            </Link>
          </div>

          {/* Desktop Navigation Items (7 items with chevron down) */}
          <nav
            className="flex max-lg:hidden items-center space-x-0.5 xl:space-x-1"
            onMouseLeave={handleMouseLeave}
          >
            {primaryMenus.map((cat) => {
              const isActive = activeMenuId === cat.id;
              return (
                <div
                  key={cat.id}
                  className="relative group"
                  onMouseEnter={() => handleMouseEnter(cat.id)}
                >
                  <Link
                    href={cat.href}
                    className={`px-2.5 xl:px-3 py-2 text-[14px] font-medium tracking-normal transition-colors flex items-center gap-1.5 rounded-md ${
                      isActive
                        ? "text-[#0071e3] bg-[#f5f5f7]/70"
                        : "text-[#121212] hover:text-[#0071e3]"
                    }`}
                  >
                    <span>{cat.label === "Enterprise & Agriculture" ? "Enterprise & Agriculture" : cat.label}</span>
                    <ChevronDown
                      className={`w-3 h-3 text-[#555] transition-transform duration-200 ${
                        isActive ? "rotate-180 text-[#0071e3]" : "group-hover:text-[#0071e3]"
                      }`}
                    />
                  </Link>
                </div>
              );
            })}
            <div
              className="relative group"
              onMouseEnter={() => handleMouseEnter("more")}
            >
              <button
                type="button"
                className={`px-2.5 xl:px-3 py-2 text-[14px] font-medium tracking-normal transition-colors flex items-center gap-1.5 rounded-md ${
                  isMoreOpen
                    ? "text-[#0071e3] bg-[#f5f5f7]/70"
                    : "text-[#121212] hover:text-[#0071e3]"
                }`}
              >
                <span>More</span>
                <ChevronDown
                  className={`w-3 h-3 text-[#555] transition-transform duration-200 ${
                    isMoreOpen ? "rotate-180 text-[#0071e3]" : "group-hover:text-[#0071e3]"
                  }`}
                />
              </button>
            </div>
          </nav>

          {/* Right Section: Search + User + Bag */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 text-[#121212] hover:text-[#0071e3] transition-colors rounded-full"
              aria-label="Search products, brands & more"
            >
              <Search className="w-5 h-5 stroke-[1.6]" />
            </button>

            {/* Account Link */}
            <Link
              href="/account"
              className="p-1.5 text-[#121212] hover:text-[#0071e3] transition-colors rounded-full inline-flex max-sm:hidden"
              aria-label="Log in to account"
            >
              <User className="w-5 h-5 stroke-[1.5]" />
            </Link>

            {/* Shopping Bag Icon with counter */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 text-[#121212] hover:text-[#0071e3] transition-colors rounded-full"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.6]" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#0071e3] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* More mega menu */}
      {isMoreOpen && (
        <div
          className="absolute left-0 right-0 top-full w-full bg-white border-b border-[#e5e5ea] shadow-2xl py-7 px-4 sm:px-6 lg:px-8 z-50"
          onMouseEnter={() => handleMouseEnter("more")}
          onMouseLeave={handleMouseLeave}
        >
          <div className="absolute -top-3 left-0 right-0 h-3 bg-transparent" />
          <div className="page-width space-y-8">
            {moreMenus.map((cat) => (
              <div key={cat.id}>
                <Link
                  href={cat.href}
                  onClick={() => setActiveMenuId(null)}
                  className="text-[13px] font-bold uppercase tracking-wide text-[#0071e3] mb-4 inline-block"
                >
                  {cat.label}
                </Link>
                <div className="flex flex-wrap items-start justify-start gap-x-6 gap-y-7">
                  {cat.columns.map((col, cIdx) => (
                    <div key={cIdx} className="flex flex-col items-start w-[140px] sm:w-[155px] xl:w-[170px]">
                      <Link
                        href={col.seriesHref || (col.items[0] ? col.items[0].href : cat.href)}
                        onClick={() => setActiveMenuId(null)}
                        className="group/thumb flex flex-col items-start w-full text-left"
                      >
                        {col.img ? (
                          <div className="w-[125px] h-[125px] rounded-xl flex items-center justify-center p-1.5 mb-2.5 overflow-hidden">
                            <img src={col.img} alt={col.seriesTitle} className="w-full h-full object-contain" loading="lazy" />
                          </div>
                        ) : null}
                        <span className="font-semibold text-[14px] text-[#121212] group-hover/thumb:text-[#0071e3]">
                          {col.seriesTitle}
                        </span>
                      </Link>
                      <ul className="mt-2 space-y-1.5 list-none p-0 m-0 w-full">
                        {col.items.map((item, iIdx) => (
                          <li key={iIdx}>
                            <Link
                              href={item.href}
                              onClick={() => setActiveMenuId(null)}
                              className="text-[13px] text-[#4b5563] hover:text-[#0071e3]"
                            >
                              {item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Mega Menu Dropdown */}
      {activeCategory && (
        <div
          className="absolute left-0 right-0 top-full w-full bg-white border-b border-[#e5e5ea] shadow-2xl py-7 px-4 sm:px-6 lg:px-8 z-50 animate-in fade-in duration-150"
          onMouseEnter={() => handleMouseEnter(activeCategory.id)}
          onMouseLeave={handleMouseLeave}
        >
          {/* Hover bridge */}
          <div className="absolute -top-3 left-0 right-0 h-3 bg-transparent" />
          <div className="page-width">
            <div className="flex flex-wrap items-start justify-start gap-x-6 gap-y-7 xl:gap-x-9">
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
                      <div className="w-[125px] h-[125px] xl:w-[140px] xl:h-[140px] rounded-xl bg-transparent flex items-center justify-center p-1.5 mb-2.5 overflow-hidden transition-transform duration-300 group-hover/thumb:scale-105">
                        <img
                          src={col.img}
                          alt={col.seriesTitle}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="w-[125px] h-[20px]" />
                    )}

                    <span className="font-semibold text-[14px] text-[#121212] group-hover/thumb:text-[#0071e3] transition-colors leading-snug line-clamp-1">
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
                            className="group/link text-[13px] text-[#4b5563] hover:text-[#0071e3] font-normal transition-colors flex items-center gap-1.5 py-0.5 leading-snug"
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

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-[85%] max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {/* Mobile Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <img
                src="//www.d1store.com.au/cdn/shop/files/DJIxD1STORE-ARS-PNG.png?v=1768876884&width=360"
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
                    <button
                      onClick={() =>
                        setMobileExpandedCat(isExpanded ? null : cat.id)
                      }
                      className="w-full flex items-center justify-between py-2.5 text-base font-bold text-[#121212] hover:text-[#0071e3]"
                    >
                      <span>{cat.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? "rotate-180 text-[#0071e3]" : "text-gray-400"
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="pl-2 py-2 space-y-3 bg-[#f8f9fa] rounded-xl mt-1">
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
                                  className="flex items-center justify-between py-1 text-xs text-gray-600 hover:text-[#0071e3]"
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
              <div className="pt-4 space-y-2 text-sm font-medium text-gray-600">
                <Link
                  href="/pages/about-us"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-[#0071e3]"
                >
                  About Us
                </Link>
                <Link
                  href="/pages/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-[#0071e3]"
                >
                  Contact Us
                </Link>
                <Link
                  href="/pages/repairs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-[#0071e3]"
                >
                  Repair & Service
                </Link>
                <Link
                  href="/pages/stores"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 text-[#0071e3] font-semibold"
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
