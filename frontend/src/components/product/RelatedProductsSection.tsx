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
    <section id="accessories" className="max-w-[1400px] mx-auto px-[16px] md:px-[36px] py-[64px] border-t border-gray-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#0071e3] block mb-1">
            ECOSYSTEM &amp; ADD-ONS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#121212]">
            Recommended Accessories &amp; Gear
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Compatible add-ons and accessories hand-selected by Australian DJI specialists.
          </p>
        </div>

        <Link
          href={`/collections/${categorySlug || "all"}`}
          className="text-xs font-bold text-[#0071e3] hover:underline flex items-center gap-1 group whitespace-nowrap"
        >
          <span>View All in {categoryName}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.slice(0, 8).map((prod) => (
          <Link
            key={prod._id || prod.slug}
            href={`/products/${prod.slug}`}
            className="group bg-white rounded-[22px] border border-gray-200/90 p-5 flex flex-col justify-between hover:shadow-lg hover:border-gray-300 transition-all"
          >
            <div>
              <div className="w-full aspect-square bg-[#fbfbfd] rounded-[16px] p-4 flex items-center justify-center mb-4 overflow-hidden">
                <img
                  src={prod.mainImage || (prod.images && prod.images[0])}
                  alt={prod.name}
                  className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {prod.category}
                </span>
                {prod.isNewArrival && (
                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                    New
                  </span>
                )}
              </div>

              <h4 className="text-sm font-bold text-[#121212] line-clamp-2 leading-snug group-hover:text-[#0071e3] transition-colors">
                {prod.name}
              </h4>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-base font-black text-[#121212]">
                ${prod.price.toLocaleString()}.00 <span className="text-[10px] text-gray-500 font-semibold">AUD</span>
              </span>
              <span className="text-xs font-bold text-[#0071e3] group-hover:translate-x-1 transition-transform flex items-center">
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
