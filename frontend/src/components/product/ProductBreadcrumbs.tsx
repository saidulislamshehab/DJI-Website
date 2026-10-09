"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ProductBreadcrumbsProps {
  productName: string;
  category?: string;
  categorySlug?: string;
}

export default function ProductBreadcrumbs({
  productName,
  category = "Collections",
  categorySlug = "all",
}: ProductBreadcrumbsProps) {
  return (
    <div className="border-b border-gray-100 bg-[#fbfbfd]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-9 py-3.5">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-sm text-gray-500 font-medium"
        >
          <Link href="/" className="hover:text-[#0071e3] transition-colors whitespace-nowrap">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <Link
            href={`/collections/${categorySlug || "all"}`}
            className="hover:text-[#0071e3] transition-colors capitalize whitespace-nowrap"
          >
            {category}
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span
            className="text-[#121212] font-bold truncate max-w-[200px] sm:max-w-[340px] md:max-w-[500px]"
            title={productName}
          >
            {productName}
          </span>
        </nav>
      </div>
    </div>
  );
}
