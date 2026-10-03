"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, User, ShoppingBag, ChevronDown } from "lucide-react";

const navItems = [
  { label: "Drones", href: "/drones" },
  { label: "Handhelds", href: "/handhelds" },
  { label: "Lifestyle Tech", href: "/lifestyle-tech" },
  { label: "Enterprise & Agriculture", href: "/enterprise" },
  { label: "Hasselblad", href: "/hasselblad" },
  { label: "Accessories", href: "/accessories" },
  { label: "Sale", href: "/sale" },
];

export default function MainNav() {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <nav className="w-full bg-white">
      <div className="max-w-[1600px] mx-auto px-10 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          {/* DJI Logo SVG */}
          <svg
            width="46"
            height="22"
            viewBox="0 0 80 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <path
              d="M0 0h15.2C23.6 0 28 4.8 28 12.4v3.2C28 23.2 23.6 28 15.2 28H0V0zm7.6 21.6h6.4c4 0 6.4-2.8 6.4-6.8v-1.6c0-4-2.4-6.8-6.4-6.8H7.6v15.2z"
              fill="#000"
            />
            <path
              d="M33.6 19.6V0h7.2v19.2c0 1.6.8 2.4 2.4 2.4h.4V28h-2c-5.2 0-8-2.4-8-8.4z"
              fill="#000"
            />
            <path d="M48 0h7.2v28H48V0z" fill="#000" />
          </svg>
          {/* Divider + D1 Store text */}
          <div className="border-l border-gray-300 pl-2.5 ml-0.5">
            <div className="text-[10px] font-bold text-gray-900 leading-tight tracking-[0.08em] uppercase">
              D1 Store
            </div>
            <div className="text-[7.5px] text-gray-500 leading-tight tracking-[0.06em] uppercase">
              Authorised Retail Store
            </div>
          </div>
        </Link>

        {/* Center Nav Links */}
        <div className="flex items-center gap-0">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-1 px-3.5 py-2 text-[14px] text-[#1a1a1a] hover:text-black font-medium whitespace-nowrap transition-colors"
            >
              {item.label}
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
            </Link>
          ))}
        </div>

        {/* Right: Search + Icons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Search Bar */}
          <div
            className={`flex items-center gap-2.5 bg-[#f0f1f3] rounded-[10px] px-4 h-[40px] transition-all duration-200 ${
              searchFocused ? "w-[360px] ring-1 ring-gray-300" : "w-[320px]"
            }`}
          >
            <Search className="w-[18px] h-[18px] text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search products, brands & more"
              className="bg-transparent outline-none text-[13px] text-gray-700 placeholder-gray-400 w-full"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>

          {/* User Icon */}
          <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors">
            <User className="w-[22px] h-[22px] text-[#1a1a1a]" strokeWidth={1.5} />
          </button>

          {/* Cart Icon */}
          <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors">
            <ShoppingBag className="w-[22px] h-[22px] text-[#1a1a1a]" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </nav>
  );
}
