"use client";

import React from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";

export default function TopBar() {
  return (
    <div className="w-full bg-[#f3f3f3] border-t border-b border-[#e5e5ea] text-[#121212] text-[12px] font-semibold py-[10px] hidden md:block">
      <div className="page-width flex items-center justify-between">
        {/* Left Links */}
        <ul className="flex items-center space-x-6 list-none p-0 m-0">
          <li>
            <Link
              href="/pages/about-us"
              className="text-[#121212] hover:text-[#0071e3] transition-colors"
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              href="/pages/contact"
              className="text-[#121212] hover:text-[#0071e3] transition-colors"
            >
              Contact Us
            </Link>
          </li>
          <li>
            <Link
              href="/pages/support"
              className="text-[#121212] hover:text-[#0071e3] transition-colors"
            >
              Support
            </Link>
          </li>
          <li>
            <Link
              href="/pages/repairs"
              className="text-[#121212] hover:text-[#0071e3] transition-colors"
            >
              Repair
            </Link>
          </li>
          <li>
            <Link
              href="/pages/enterprise"
              className="text-[#121212] hover:text-[#0071e3] transition-colors"
            >
              Enterprise
            </Link>
          </li>
        </ul>

        {/* Right Links */}
        <ul className="flex items-center space-x-6 list-none p-0 m-0">
          <li>
            <Link
              href="/pages/get-quote"
              className="text-[#121212] hover:text-[#0071e3] transition-colors"
            >
              Get Quote
            </Link>
          </li>
          <li>
            <Link
              href="/pages/price-match"
              className="text-[#121212] hover:text-[#0071e3] transition-colors"
            >
              Price Match
            </Link>
          </li>
          <li>
            <Link
              href="/pages/stores"
              className="flex items-center space-x-1.5 text-[#121212] hover:text-[#0071e3] transition-colors font-semibold"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Store finder</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
