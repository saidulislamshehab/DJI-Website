"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { d1MegaMenus } from "@/data/d1_mega_menu";
import { useCart } from "@/context/CartContext";

export default function MainNav() {
  const { totalCount, setIsCartOpen, setIsSearchOpen } = useCart();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);
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

  // Close mega menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeCategory = d1MegaMenus.find((c) => c.id === activeMenuId);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-[999] bg-white border-b border-[#e5e5ea] transition-all"
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px] lg:h-[72px] gap-2 lg:gap-3 xl:gap-4">
          {/* Mobile Hamburger button (only visible on mobile phones < md) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 text-[#121212] md:hidden flex items-center justify-center hover:text-[#0070e0] transition-colors"
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

          {/* Desktop Navigation Items - All 7 Categories Visible on all desktop & tablet screens (>= md) */}
          <nav className="flex items-center space-x-1 lg:space-x-1.5 xl:space-x-2.5 2xl:space-x-4 max-md:hidden h-full">
            {d1MegaMenus.map((cat) => {
              const isActive = activeMenuId === cat.id;
              return (
                <div
                  key={cat.id}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => handleMouseEnter(cat.id)}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setActiveMenuId((prev) => (prev === cat.id ? null : cat.id))
                    }
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
                  </button>
                </div>
              );
            })}
          </nav>

          {/* Search Input Bar (Pill / Capsule matching the reference) */}
          <div className="hidden lg:flex flex-1 max-w-[220px] xl:max-w-[300px] 2xl:max-w-[380px] min-w-[160px] mx-2 xl:mx-4">
            <div
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center w-full h-[40px] bg-[#f2f3f5] hover:bg-[#ebedf0] transition-colors rounded-full px-3.5 cursor-pointer border border-transparent focus-within:border-gray-300 focus-within:bg-white"
            >
              <Search className="w-4 h-4 text-[#8e8e93] shrink-0 mr-2.5 stroke-[1.8]" />
              <input
                type="text"
                placeholder="Search products, brands & more"
                readOnly
                className="w-full bg-transparent text-[13px] xl:text-[13.5px] text-[#121212] placeholder-[#8e8e93] cursor-pointer focus:outline-none select-none"
              />
            </div>
          </div>

          {/* Right Action Icons: Big Account + Shopping Bag Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-5 shrink-0">
            {/* Mobile / Tablet Search Button (visible when pill input is hidden) */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 text-[#121212] hover:text-[#0070e0] transition-colors lg:hidden"
              aria-label="Search products, brands & more"
            >
              <Search className="w-6 h-6 stroke-[1.6]" />
            </button>

            {/* Big User / Account Outline Icon */}
            <Link
              href="/account"
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
              className="relative p-1 text-[#121212] hover:text-[#0070e0] transition-colors inline-flex items-center justify-center cursor-pointer group"
              aria-label="View shopping bag"
            >
              <svg
                className="w-[26px] h-[26px] stroke-[1.6] group-hover:scale-105 transition-transform"
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
      </div>

      {/* Interactive Mega Menu Dropdown */}
      {activeCategory && (
        <div
          className="absolute left-0 right-0 top-full w-full bg-white border-b border-[#e5e5ea] shadow-2xl py-8 px-4 sm:px-6 lg:px-8 z-[100]"
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Invisible Hover Bridge connecting navbar bottom to dropdown */}
          <div className="absolute -top-4 left-0 right-0 h-4 bg-transparent" />

          <div className="max-w-[1760px] mx-auto">
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
                    <button
                      onClick={() =>
                        setMobileExpandedCat(isExpanded ? null : cat.id)
                      }
                      className="w-full flex items-center justify-between py-2.5 text-base font-bold text-[#121212] hover:text-[#0070e0]"
                    >
                      <span>{cat.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? "rotate-180 text-[#0070e0]" : "text-gray-400"
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
              <div className="pt-4 space-y-2 text-sm font-medium text-gray-600">
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
