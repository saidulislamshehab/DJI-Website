"use client";

import React from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";

export default function TopBar() {
  return (
    <div className="w-full bg-[#fbfbfd] border-b border-[#e5e5ea] text-[#333336] text-[12px] font-normal py-[7px] block max-md:hidden">
      <div className="page-width flex items-center justify-between">
        {/* Left Links */}
        <ul className="flex items-center space-x-5 list-none p-0 m-0 text-[12px]">
          <li>
            <Link
              href="/pages/about-us"
              className="text-[#333336] hover:text-[#0071e3] transition-colors"
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              href="/pages/contact"
              className="text-[#333336] hover:text-[#0071e3] transition-colors"
            >
              Contact Us
            </Link>
          </li>
          <li>
            <Link
              href="/pages/support"
              className="text-[#333336] hover:text-[#0071e3] transition-colors"
            >
              Support
            </Link>
          </li>
          <li>
            <Link
              href="/pages/repairs"
              className="text-[#333336] hover:text-[#0071e3] transition-colors"
            >
              Repair
            </Link>
          </li>
          <li>
            <Link
              href="/pages/enterprise"
              className="text-[#333336] hover:text-[#0071e3] transition-colors"
            >
              Enterprise
            </Link>
          </li>
        </ul>

        {/* Right Links */}
        <ul className="flex items-center space-x-5 list-none p-0 m-0 text-[12px]">
          <li>
            <Link
              href="/pages/get-quote"
              className="text-[#333336] hover:text-[#0071e3] transition-colors"
            >
              Get Quote
            </Link>
          </li>
          <li>
            <Link
              href="/pages/price-match"
              className="text-[#333336] hover:text-[#0071e3] transition-colors"
            >
              Price Match
            </Link>
          </li>
          <li>
            <Link
              href="/pages/stores"
              className="flex items-center space-x-1.5 text-[#333336] hover:text-[#0071e3] transition-colors font-medium"
            >
              <MapPin className="w-3.5 h-3.5 text-gray-500" />
              <span>Store finder</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin"
              className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-blue-50 text-[#0071e3] hover:bg-blue-100 transition-colors font-bold text-[11px]"
            >
              <span>Admin Portal</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
