"use client";

import React, { useState, useMemo } from "react";
import { Search, X, ChevronDown, ChevronUp, Phone, Mail } from "lucide-react";
import { IProduct } from "@/types";

interface ProductFAQProps {
  product: IProduct;
}

export default function ProductFAQ({ product }: ProductFAQProps) {
  const [faqSearch, setFaqSearch] = useState("");
  const [faqCategory, setFaqCategory] = useState("All");
  const [openFaqIndices, setOpenFaqIndices] = useState<Record<number, boolean>>({ 0: true });

  const faqsList = useMemo(() => {
    if (product.faqs && product.faqs.length > 0) {
      return product.faqs;
    }
    return [
      {
        group: "General",
        category: "General",
        question: `Is this genuine Australian stock for ${product.name}?`,
        answer: `Yes, absolutely. All stock sold by D1 Store is 100% genuine Australian stock sourced directly through official channels, backed by a full 2-Year Australian Manufacturer Warranty and local Australian technical support.`,
      },
      {
        group: "Warranty & Support",
        category: "Warranty & Support",
        question: "What warranty coverage is included with my purchase?",
        answer: `Your purchase includes the official 2-Year Australian Manufacturer Warranty covering hardware defects and manufacturing faults. You can also add DJI Care Refresh for accidental damage and drop replacement coverage.`,
      },
      {
        group: "Shipping & Pickup",
        category: "Shipping & Pickup",
        question: "How fast is delivery across Australia and is Click & Collect available?",
        answer: `Orders over $99 AUD receive Free Express Shipping Australia-wide, typically arriving within 1-3 business days. Click & Collect is also available across 12+ D1 Store retail locations in Melbourne, Sydney, Brisbane, and Perth.`,
      },
      {
        group: "Returns & Exchange",
        category: "Returns & Exchange",
        question: "What is the return and exchange policy?",
        answer: `D1 Store offers a 14-day return guarantee on unopened products in original packaging. Our local technical team is on standby to assist with any setup questions or exchange requests.`,
      },
    ];
  }, [product]);

  // Categories
  const faqCategories = useMemo(() => {
    return [
      "All",
      ...Array.from(new Set(faqsList.map((f: any) => f.group || f.category || "General"))),
    ];
  }, [faqsList]);

  // Filtered
  const filteredFaqs = useMemo(() => {
    return faqsList.filter((f: any) => {
      const grp = f.group || f.category || "General";
      const matchesCat =
        faqCategory === "All" || grp.toLowerCase() === faqCategory.toLowerCase();
      const matchesSearch =
        !faqSearch ||
        f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
        f.answer.toLowerCase().includes(faqSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [faqsList, faqCategory, faqSearch]);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndices((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleToggleAllFaqs = (allIndices: number[]) => {
    const allOpen = allIndices.length > 0 && allIndices.every((i) => openFaqIndices[i]);
    if (allOpen) {
      setOpenFaqIndices({});
    } else {
      const next: Record<number, boolean> = {};
      allIndices.forEach((i) => {
        next[i] = true;
      });
      setOpenFaqIndices(next);
    }
  };

  return (
    <section id="faqs" className="bg-[#fbfbfd] border-t border-gray-200/80 py-16 sm:py-20">
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-10">
          <span className="text-[#0071e3] font-black uppercase text-sm tracking-widest block mb-2">
            KNOWLEDGE BASE &amp; SUPPORT
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-[36px] font-black text-[#121212] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mt-3 max-w-[700px] mx-auto leading-relaxed">
            Got questions? We&apos;ve got answers. Browse our complete library of {faqsList.length} verified answers for {product.name}.
          </p>
        </div>

        {/* FAQ Search Bar */}
        <div className="relative mb-6 max-w-[800px] mx-auto">
          <Search className="w-5 h-5 text-gray-400 absolute left-4.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={faqSearch}
            onChange={(e) => setFaqSearch(e.target.value)}
            placeholder={`Search questions... (e.g. "battery", "warranty", "shipping", "sd card")`}
            className="w-full h-[52px] pl-12 pr-11 rounded-full border border-gray-300 bg-white font-medium text-base text-[#121212] placeholder:text-gray-400 focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20 shadow-xs transition-all"
          />
          {faqSearch && (
            <button
              type="button"
              onClick={() => setFaqSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              aria-label="Clear FAQ search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* FAQ Category Pills */}
        {faqCategories.length > 1 && (
          <div className="flex items-center justify-center gap-2.5 overflow-x-auto no-scrollbar mb-8 pb-1 flex-wrap">
            {faqCategories.map((cat) => {
              const count =
                cat === "All"
                  ? faqsList.length
                  : faqsList.filter(
                      (f: any) =>
                        (f.group || f.category || "General").toLowerCase() === cat.toLowerCase()
                    ).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFaqCategory(cat)}
                  className={`h-[42px] px-6 rounded-full text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                    faqCategory.toLowerCase() === cat.toLowerCase()
                      ? "bg-[#0071e3] text-white shadow-xs"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      faqCategory.toLowerCase() === cat.toLowerCase()
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Action Bar: Count & Expand All */}
        <div className="flex items-center justify-between text-sm text-gray-600 font-semibold mb-5 px-1">
          <span>
            Showing <strong className="text-gray-900">{filteredFaqs.length}</strong> of {faqsList.length} questions
          </span>
          {filteredFaqs.length > 0 && (
            <button
              type="button"
              onClick={() => handleToggleAllFaqs(filteredFaqs.map((_, i) => i))}
              className="text-[#0071e3] hover:underline font-bold cursor-pointer text-sm"
            >
              {filteredFaqs.every((_, i) => openFaqIndices[i]) ? "Collapse All" : "Expand All"}
            </button>
          )}
        </div>

        {/* FAQ Accordion List */}
        {filteredFaqs.length > 0 ? (
          <div className="space-y-4">
            {filteredFaqs.map((faq: any, idx: number) => {
              const isOpen = !!openFaqIndices[idx];
              const grp = faq.group || faq.category || "General";
              return (
                <div
                  key={idx}
                  className={`bg-white rounded-[22px] border transition-all overflow-hidden ${
                    isOpen
                      ? "border-[#0071e3]/40 shadow-md ring-1 ring-[#0071e3]/20"
                      : "border-gray-200/90 shadow-2xs hover:border-gray-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full py-5 sm:py-6 px-6 sm:px-8 flex items-start justify-between text-left font-bold text-base sm:text-lg text-[#121212] hover:text-[#0071e3] transition-colors cursor-pointer gap-4"
                  >
                    <div className="flex flex-col gap-1.5 pr-2">
                      <span className="text-xs font-black uppercase tracking-wider text-[#0071e3]">
                        {grp}
                      </span>
                      <span className="leading-snug">{faq.question}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-100/80 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-[#0071e3]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                  </button>
                  {isOpen && (
                    <div
                      className="px-6 sm:px-8 pb-6 sm:pb-7 pt-2 text-gray-700 text-base leading-relaxed border-t border-gray-100 bg-[#fafafa]/40"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-[24px] border border-gray-200 p-12 text-center">
            <p className="text-gray-700 font-semibold text-base mb-2">
              No questions matched your search &ldquo;{faqSearch}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setFaqSearch("");
                setFaqCategory("All");
              }}
              className="mt-3 px-6 py-2.5 rounded-full bg-[#0071e3] text-white text-sm font-bold hover:bg-[#0058b8] cursor-pointer"
            >
              View All Questions
            </button>
          </div>
        )}

        {/* Assistance Card */}
        <div className="mt-12 bg-white border border-gray-200/90 rounded-[26px] p-7 sm:p-9 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-black uppercase text-[#0071e3] tracking-widest block mb-1">
                AUSTRALIAN DJI SPECIALISTS
              </span>
              <h3 className="text-2xl font-black text-[#121212]">
                Still Have Questions?
              </h3>
              <p className="text-base text-gray-600 mt-1 max-w-[560px]">
                Speak directly with our local Australian drone and gimbal specialists for personalized product advice.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <a
                href="tel:0392887882"
                className="h-[46px] px-6 rounded-full bg-[#121212] hover:bg-black text-white text-sm font-bold flex items-center gap-2 shadow-xs"
              >
                <Phone className="w-4 h-4" />
                <span>(03) 9288 7882</span>
              </a>
              <a
                href="mailto:sales@d1store.com.au"
                className="h-[46px] px-6 rounded-full bg-blue-50 hover:bg-blue-100 text-[#0071e3] text-sm font-bold flex items-center gap-2 shadow-xs border border-blue-200"
              >
                <Mail className="w-4 h-4" />
                <span>sales@d1store.com.au</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
