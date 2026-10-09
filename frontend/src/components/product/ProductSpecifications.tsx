"use client";

import React, { useState, useMemo } from "react";
import { Search, X, FileText, Download } from "lucide-react";
import { IProduct } from "@/types";

interface ProductSpecificationsProps {
  product: IProduct;
}

export default function ProductSpecifications({ product }: ProductSpecificationsProps) {
  const [specSearch, setSpecSearch] = useState("");
  const [selectedSpecTab, setSelectedSpecTab] = useState("All");

  // Normalized raw specs list
  const rawSpecsList = useMemo(() => {
    if (product.rawSpecs && product.rawSpecs.length > 0) {
      return product.rawSpecs;
    }
    const list: { group: string; label: string; value: string }[] = [];
    const specsData = (product.specs as Record<string, any>) || {};

    Object.entries(specsData).forEach(([cat, fields]) => {
      if (typeof fields === "object" && fields !== null) {
        Object.entries(fields).forEach(([k, v]) => {
          list.push({
            group: cat,
            label: k.replace(/([A-Z])/g, " $1").trim(),
            value: String(v),
          });
        });
      } else {
        list.push({ group: "General", label: cat, value: String(fields) });
      }
    });

    if (list.length === 0) {
      list.push(
        { group: "General", label: "Product Name", value: product.name },
        { group: "General", label: "SKU", value: product.sku },
        { group: "General", label: "Category", value: product.category },
        { group: "General", label: "Warranty", value: "2-Year Official Australian Manufacturer Warranty" },
        { group: "General", label: "Country of Origin", value: "Genuine DJI Official Stock" }
      );
    }

    return list;
  }, [product]);

  // Unique spec categories
  const specGroups = useMemo(() => {
    if (rawSpecsList.length > 0) {
      const unique = Array.from(new Set(rawSpecsList.map((s) => s.group))).filter(Boolean);
      return ["All", ...unique];
    }
    return ["All"];
  }, [rawSpecsList]);

  // Filtered specs
  const filteredRawSpecs = useMemo(() => {
    return rawSpecsList.filter((s) => {
      const matchesGroup =
        selectedSpecTab === "All" || s.group.toLowerCase() === selectedSpecTab.toLowerCase();
      const query = specSearch.toLowerCase().trim();
      const matchesQuery =
        !query ||
        s.label.toLowerCase().includes(query) ||
        s.value.toLowerCase().includes(query) ||
        s.group.toLowerCase().includes(query);
      return matchesGroup && matchesQuery;
    });
  }, [rawSpecsList, selectedSpecTab, specSearch]);

  // Grouped by Category when "All" is selected
  const groupedFilteredSpecs = useMemo(() => {
    const groups: { [key: string]: typeof filteredRawSpecs } = {};
    filteredRawSpecs.forEach((s) => {
      if (!groups[s.group]) groups[s.group] = [];
      groups[s.group].push(s);
    });
    return groups;
  }, [filteredRawSpecs]);

  return (
    <section id="specifications" className="max-w-[1400px] mx-auto px-4 md:px-9 py-16">
      {/* Section Header */}
      <div className="text-center max-w-[760px] mx-auto mb-10">
        <span className="text-[#0071e3] font-black uppercase text-xs sm:text-sm tracking-widest block mb-2">
          TECHNICAL DATA &amp; PARAMETERS
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-[42px] font-black text-[#121212] tracking-tight">
          Full Specifications
        </h2>
        <p className="text-base sm:text-lg text-gray-500 mt-2">
          Complete technical breakdown across {rawSpecsList.length} engineering parameters for {product.name}.
        </p>
      </div>

      {/* Specs Live Search Bar */}
      <div className="max-w-[720px] mx-auto mb-8">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={specSearch}
            onChange={(e) => setSpecSearch(e.target.value)}
            placeholder={`Search ${rawSpecsList.length} specifications... (e.g. "sensor", "battery", "weight")`}
            className="w-full h-[52px] pl-12 pr-11 rounded-full border border-gray-300 bg-white font-medium text-base text-[#121212] placeholder:text-gray-400 focus:outline-none focus:border-[#0071e3] shadow-xs transition-colors"
          />
          {specSearch && (
            <button
              type="button"
              onClick={() => setSpecSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
              aria-label="Clear specification search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {specSearch && (
          <div className="text-sm text-gray-500 font-semibold mt-2.5 text-center">
            Showing {filteredRawSpecs.length} of {rawSpecsList.length} matching parameters
          </div>
        )}
      </div>

      {/* Category Filter Pills */}
      {specGroups.length > 1 && (
        <div className="flex items-center justify-center gap-2.5 overflow-x-auto no-scrollbar mb-8 flex-wrap">
          {specGroups.map((cat) => {
            const count =
              cat === "All"
                ? rawSpecsList.length
                : rawSpecsList.filter((s) => s.group.toLowerCase() === cat.toLowerCase()).length;
            const isSelected = selectedSpecTab.toLowerCase() === cat.toLowerCase();

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedSpecTab(cat)}
                className={`h-[42px] px-5 rounded-full text-sm sm:text-[15px] font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? "bg-[#0071e3] text-white shadow-xs"
                    : "bg-[#f2f2f7] text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Two-Column Clean High-Contrast Specs Table */}
      {filteredRawSpecs.length > 0 ? (
        <div className="bg-white rounded-[26px] border border-gray-200/90 overflow-hidden shadow-xs">
          {selectedSpecTab === "All" && !specSearch ? (
            // Grouped by Category Headers
            Object.entries(groupedFilteredSpecs).map(([grp, specs], gIdx) => (
              <div key={grp} className={gIdx > 0 ? "border-t-2 border-gray-200" : ""}>
                <div className="bg-[#f8f8fa] px-6 sm:px-8 py-4 border-b border-gray-200 flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#0071e3]">
                    {grp} Specifications
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-gray-500">
                    {specs.length} items
                  </span>
                </div>
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {specs.map((s, i) => (
                      <tr
                        key={i}
                        className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/60 transition-colors"
                      >
                        <th className="py-4.5 px-6 sm:px-8 font-bold text-[#121212] w-1/3 sm:w-1/4 text-[15px] sm:text-base bg-[#fafafa]/50 align-top">
                          {s.label}
                        </th>
                        <td
                          className="py-4.5 px-6 sm:px-8 text-gray-700 text-[15px] sm:text-base leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: s.value }}
                        />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            // Flat Filtered / Searched Specs
            <table className="w-full text-left border-collapse">
              <tbody>
                {filteredRawSpecs.map((s, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/60 transition-colors"
                  >
                    <th className="py-4.5 px-6 sm:px-8 font-bold text-[#121212] w-1/3 sm:w-1/4 text-[15px] sm:text-base bg-[#fafafa]/50 align-top">
                      <span className="block">{s.label}</span>
                      <span className="text-xs text-gray-400 font-normal uppercase tracking-wider mt-0.5 block">
                        {s.group}
                      </span>
                    </th>
                    <td
                      className="py-4.5 px-6 sm:px-8 text-gray-700 text-[15px] sm:text-base leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: s.value }}
                    />
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-[26px] border border-gray-200 p-12 sm:p-16 text-center">
          <p className="text-lg text-gray-700 font-medium">
            No technical specifications matched &ldquo;{specSearch}&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSpecSearch("");
              setSelectedSpecTab("All");
            }}
            className="mt-5 h-[44px] px-7 rounded-full bg-[#0071e3] text-white text-sm sm:text-base font-bold hover:bg-[#0058b8] cursor-pointer transition-colors shadow-xs"
          >
            Reset Filter
          </button>
        </div>
      )}

      {/* PDF Spec Sheet & Support Callout */}
      <div className="mt-8 bg-blue-50/60 border border-blue-200/80 rounded-[22px] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#0071e3] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-bold text-[#121212]">
              Looking for the complete manual or compliance certifications?
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              Download the full Australian warranty documentation and regulatory conformity sheets.
            </p>
          </div>
        </div>
        <a
          href={`mailto:support@d1store.com.au?subject=${encodeURIComponent(product.name)} Spec Sheet Request`}
          className="h-[46px] px-7 rounded-full bg-white border border-gray-300 text-gray-800 text-sm sm:text-base font-bold hover:bg-gray-50 flex items-center gap-2.5 whitespace-nowrap shadow-xs transition-colors flex-shrink-0"
        >
          <Download className="w-4.5 h-4.5 text-[#0071e3]" />
          <span>Request PDF Specs</span>
        </a>
      </div>
    </section>
  );
}
