"use client";

import React from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";

export default function SecondaryNav() {
  return (
    <div className="w-full bg-[#f7f7f7] text-[#555] text-[12px] font-normal">
      <div className="max-w-[1600px] mx-auto px-10 py-[7px] flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Link href="/about" className="hover:text-black transition-colors">
            About Us
          </Link>
          <Link href="/contact" className="hover:text-black transition-colors">
            Contact Us
          </Link>
          <Link href="/support" className="hover:text-black transition-colors">
            Support
          </Link>
          <Link href="/repair" className="hover:text-black transition-colors">
            Repair
          </Link>
          <Link href="/enterprise" className="hover:text-black transition-colors">
            Enterprise
          </Link>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/quote" className="hover:text-black transition-colors">
            Get Quote
          </Link>
          <Link href="/price-match" className="hover:text-black transition-colors">
            Price Match
          </Link>
          <Link href="/stores" className="flex items-center gap-1.5 hover:text-black transition-colors">
            <MapPin className="w-3.5 h-3.5" />
            Store finder
          </Link>
        </div>
      </div>
    </div>
  );
}
