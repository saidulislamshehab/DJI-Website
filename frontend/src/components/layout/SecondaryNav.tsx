"use client";

import React from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";

export default function SecondaryNav() {
  return (
    <div className="w-full bg-[#f7f7f7] text-[#555] text-[12px] font-normal">
      <div className="max-w-[1600px] mx-auto px-10 py-[7px] flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Link href="/pages/about-us" className="hover:text-[#0071e3] transition-colors">
            About Us
          </Link>
          <Link href="/pages/contact" className="hover:text-[#0071e3] transition-colors">
            Contact Us
          </Link>
          <Link href="/pages/support" className="hover:text-[#0071e3] transition-colors">
            Support
          </Link>
          <Link href="/pages/repairs" className="hover:text-[#0071e3] transition-colors">
            Repair
          </Link>
          <Link href="/pages/enterprise" className="hover:text-[#0071e3] transition-colors">
            Enterprise
          </Link>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/pages/get-quote" className="hover:text-[#0071e3] transition-colors">
            Get Quote
          </Link>
          <Link href="/pages/price-match" className="hover:text-[#0071e3] transition-colors">
            Price Match
          </Link>
          <Link href="/pages/stores" className="flex items-center gap-1.5 hover:text-[#0071e3] transition-colors">
            <MapPin className="w-3.5 h-3.5" />
            Store finder
          </Link>
        </div>
      </div>
    </div>
  );
}
