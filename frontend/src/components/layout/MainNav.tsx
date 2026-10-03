"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, MapPin, User, Menu, X, ChevronRight, ChevronDown } from "lucide-react";
import { navigationCategories, NavCategory } from "@/data/mega_menu_data";
import { useCart } from "@/context/CartContext";

export default function MainNav() {
  const { totalCount, setIsCartOpen, setIsSearchOpen } = useCart();
  const [activeCategory, setActiveCategory] = useState<NavCategory | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e5e5ea] transition-all">
      <div className="page-width">
        <div className="flex items-center justify-between h-[68px] md:h-[76px] gap-4">
          {/* Mobile Hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 text-[#121212] lg:hidden hover:text-[#0071e3] transition"
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
                className="h-[26px] md:h-[32px] w-auto object-contain"
                width={200}
                height={32}
              />
            </Link>
          </div>

          {/* Desktop Navigation Categories */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navigationCategories.map((cat) => (
              <div
                key={cat.id}
                className="relative"
                onMouseEnter={() => setActiveCategory(cat)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link
                  href={cat.href}
                  className={`px-3 py-2 text-[15px] font-semibold tracking-[-0.01em] transition-colors flex items-center gap-1 rounded-md ${
                    activeCategory?.id === cat.id
                      ? "text-[#0071e3] bg-[#f5f5f7]"
                      : cat.id === "sale"
                      ? "text-red-600 hover:text-red-700"
                      : "text-[#121212] hover:text-[#0071e3]"
                  }`}
                >
                  <span>{cat.label}</span>
                  {cat.badge && (
                    <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-full bg-red-600 text-white tracking-wider">
                      {cat.badge}
                    </span>
                  )}
                </Link>

                {/* Mega Menu Dropdown */}
                {activeCategory?.id === cat.id && (
                  <div
                    className="fixed left-0 right-0 top-[calc(100%+1px)] w-full bg-white shadow-2xl border-b border-[#e5e5ea] py-8 px-6 z-50 animate-fade-in"
                    onMouseEnter={() => setActiveCategory(cat)}
                    onMouseLeave={() => setActiveCategory(null)}
                  >
                    <div className="page-width">
                      <div className="grid grid-cols-12 gap-8">
                        {/* Sections / Columns */}
                        <div className={`${cat.featured ? "col-span-8" : "col-span-12"} grid grid-cols-2 md:grid-cols-3 gap-6`}>
                          {cat.sections.map((section, sIdx) => (
                            <div key={sIdx} className="space-y-4">
                              <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                                {section.title}
                              </h3>
                              <ul className="space-y-2.5 list-none p-0 m-0">
                                {section.items.map((item, iIdx) => (
                                  <li key={iIdx}>
                                    <Link
                                      href={item.href}
                                      onClick={() => setActiveCategory(null)}
                                      className="group flex items-center gap-3 py-1 text-sm font-semibold text-[#121212] hover:text-[#0071e3] transition-colors"
                                    >
                                      {item.img && (
                                        <div className="w-9 h-9 rounded-md bg-[#f5f5f7] p-1 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                          <img
                                            src={item.img}
                                            alt={item.title}
                                            className="w-full h-full object-contain"
                                          />
                                        </div>
                                      )}
                                      <span className="flex-1">{item.title}</span>
                                      {item.badge && (
                                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-blue-100 text-[#0071e3] uppercase">
                                          {item.badge}
                                        </span>
                                      )}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        {/* Featured Spotlight Card inside Mega Menu */}
                        {cat.featured && (
                          <div className="col-span-4 border-l border-gray-100 pl-8 flex flex-col justify-between">
                            <div>
                              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0071e3] mb-2 inline-block">
                                Spotlight Highlight
                              </span>
                              <h4 className="text-lg font-bold text-[#121212] mb-1">
                                {cat.featured.title}
                              </h4>
                              <p className="text-xs text-gray-500 line-clamp-2 mb-4">
                                {cat.featured.description}
                              </p>
                              <div className="rounded-xl overflow-hidden bg-[#f5f5f7] p-4 flex items-center justify-center relative aspect-video">
                                <img
                                  src={cat.featured.image}
                                  alt={cat.featured.title}
                                  className="w-full h-full object-contain hover:scale-105 transition-transform"
                                />
                              </div>
                            </div>

                            <Link
                              href={cat.featured.href}
                              onClick={() => setActiveCategory(null)}
                              className="mt-4 inline-flex items-center text-xs font-bold text-[#0071e3] hover:underline"
                            >
                              <span>Explore {cat.featured.title}</span>
                              <ChevronRight className="w-3.5 h-3.5 ml-1" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Action Icons & Search */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#f5f5f7] hover:bg-[#e5e5ea] text-gray-600 text-xs font-medium transition"
              aria-label="Open Search"
            >
              <Search className="w-4 h-4 text-gray-600" />
              <span className="hidden xl:inline">Search DJI drones, gear...</span>
            </button>

            {/* Store Finder Icon */}
            <Link
              href="/pages/stores"
              className="p-2 text-[#121212] hover:text-[#0071e3] transition rounded-full hover:bg-gray-100"
              aria-label="Store Finder"
            >
              <MapPin className="w-5 h-5" />
            </Link>

            {/* Account Icon */}
            <Link
              href="/account"
              className="p-2 text-[#121212] hover:text-[#0071e3] transition rounded-full hover:bg-gray-100 hidden sm:inline-flex"
              aria-label="Account Login"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart Icon & Badge */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#121212] hover:text-[#0071e3] transition rounded-full hover:bg-gray-100"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#0071e3] text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center animate-scale-up">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-[85%] max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-right">
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
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {navigationCategories.map((cat) => {
                const isExpanded = mobileExpandedCat === cat.id;
                return (
                  <div key={cat.id} className="border-b border-gray-100 pb-2">
                    <button
                      onClick={() =>
                        setMobileExpandedCat(isExpanded ? null : cat.id)
                      }
                      className="w-full flex items-center justify-between py-2.5 text-base font-bold text-[#121212] hover:text-[#0071e3]"
                    >
                      <span className="flex items-center gap-2">
                        <span>{cat.label}</span>
                        {cat.badge && (
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-red-600 text-white uppercase">
                            {cat.badge}
                          </span>
                        )}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isExpanded ? "rotate-180 text-[#0071e3]" : "text-gray-400"
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="pl-4 py-2 space-y-3 bg-[#f5f5f7]/50 rounded-xl mt-1">
                        {cat.sections.map((sec, sIdx) => (
                          <div key={sIdx} className="space-y-1.5">
                            <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block">
                              {sec.title}
                            </span>
                            {sec.items.map((item, iIdx) => (
                              <Link
                                key={iIdx}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-between py-1.5 text-sm font-medium text-[#121212] hover:text-[#0071e3]"
                              >
                                <span>{item.title}</span>
                                {item.badge && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-[#0071e3]">
                                    {item.badge}
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Quick links in mobile drawer */}
              <div className="pt-4 space-y-2 text-sm font-semibold text-gray-600">
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
                  className="block py-1 text-[#0071e3]"
                >
                  Store Finder
                </Link>
              </div>
            </div>

            {/* Mobile Footer */}
            <div className="p-4 border-t border-gray-100 bg-[#f5f5f7] text-xs text-gray-500 space-y-1">
              <p className="font-bold text-[#121212]">DJI Authorised Retail Store</p>
              <p>Australia-wide physical stores & local support</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
