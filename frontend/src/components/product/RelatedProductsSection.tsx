"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { IProduct } from "@/types";

interface RelatedProductsSectionProps {
  products: IProduct[];
  categoryName?: string;
  categorySlug?: string;
}

export default function RelatedProductsSection({
  products,
  categoryName = "Accessories",
  categorySlug = "all",
}: RelatedProductsSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section id="accessories" className="max-w-[1400px] mx-auto px-4 md:px-9 py-16 border-t border-gray-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#0071e3] block mb-1.5">
            ECOSYSTEM &amp; ADD-ONS
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#121212] tracking-tight">
            Recommended Accessories &amp; Gear
          </h2>
          <p className="text-base text-gray-500 mt-1.5">
            Compatible add-ons and accessories hand-selected by Australian DJI specialists.
          </p>
        </div>

        <Link
          href={`/collections/${categorySlug || "all"}`}
          className="text-sm sm:text-base font-bold text-[#0071e3] hover:underline flex items-center gap-1.5 group whitespace-nowrap"
        >
          <span>View All in {categoryName}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {products.slice(0, 8).map((prod) => (
          <Link
            key={prod._id || prod.slug}
            href={`/products/${prod.slug}`}
            className="group bg-white rounded-[16px] sm:rounded-[24px] border border-gray-200/90 p-3 sm:p-5 md:p-6 flex flex-col justify-between hover:shadow-xl hover:border-gray-300 transition-all duration-300"
          >
            <div>
              <div className="w-full aspect-square bg-[#fbfbfd] rounded-[14px] sm:rounded-[20px] p-2 sm:p-4 md:p-6 flex items-center justify-center mb-3 sm:mb-4 overflow-hidden">
                <img
                  src={prod.mainImage || (prod.images && prod.images[0])}
                  alt={prod.name}
                  className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap">
                <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {prod.category}
                </span>
                {prod.isNewArrival && (
                  <span className="text-[10px] sm:text-xs font-bold text-emerald-800 bg-emerald-100 px-1.5 sm:px-2 py-0.5 rounded-full">
                    New
                  </span>
                )}
              </div>

              <h4 className="text-xs sm:text-base md:text-lg font-bold text-[#121212] line-clamp-2 leading-snug group-hover:text-[#0071e3] transition-colors min-h-[36px] sm:min-h-[48px]">
                {prod.name}
              </h4>
            </div>

            <div className="mt-3 sm:mt-5 pt-2.5 sm:pt-3.5 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-sm sm:text-xl md:text-2xl font-black text-[#121212]">
                  ${prod.price.toLocaleString()}.00
                </span>
                <span className="text-[10px] sm:text-xs text-gray-500 font-bold ml-1">AUD</span>
              </div>
              <span className="text-sm font-bold text-[#0071e3] group-hover:translate-x-1 transition-transform flex items-center">
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
