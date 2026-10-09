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
    // Fallback standard FAQs for any product
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
    <section id="faqs" className="bg-[#fbfbfd] border-t border-gray-200/80 py-[64px]">
      <div className="max-w-[1000px] mx-auto px-[16px] md:px-[36px]">
        <div className="text-center mb-[36px]">
          <span className="text-[#0071e3] font-black uppercase text-xs tracking-widest block mb-2">
            KNOWLEDGE BASE &amp; SUPPORT
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#121212]">
            Frequently Asked Questions
          </h2>
          <p className="text-[15px] text-gray-500 mt-2">
            Got questions? We&apos;ve got answers. Browse our complete library of {faqsList.length} verified answers for {product.name}.
          </p>
        </div>

        {/* FAQ Search Bar */}
        <div className="relative mb-6">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={faqSearch}
            onChange={(e) => setFaqSearch(e.target.value)}
            placeholder={`Search all ${faqsList.length} questions... (e.g. "mic", "waterproof", "battery", "sd card")`}
            className="w-full pl-12 pr-10 py-3.5 rounded-full border border-gray-300 bg-white font-medium text-sm focus:outline-none focus:border-[#0071e3] shadow-xs"
          />
          {faqSearch && (
            <button
              type="button"
              onClick={() => setFaqSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              aria-label="Clear FAQ search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* FAQ Category Pills */}
        {faqCategories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-6 pb-1 flex-wrap">
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
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    faqCategory.toLowerCase() === cat.toLowerCase()
                      ? "bg-[#0071e3] text-white shadow-xs"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Quick Action Bar: Results count & Expand/Collapse All */}
        <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-4 px-1">
          <span>
            Showing {filteredFaqs.length} of {faqsList.length} questions
          </span>
          {filteredFaqs.length > 0 && (
            <button
              type="button"
              onClick={() => handleToggleAllFaqs(filteredFaqs.map((_, i) => i))}
              className="text-[#0071e3] hover:underline cursor-pointer"
            >
              {filteredFaqs.every((_, i) => openFaqIndices[i]) ? "Collapse All" : "Expand All"}
            </button>
          )}
        </div>

        {/* FAQs List */}
        {filteredFaqs.length > 0 ? (
          <div className="space-y-[12px]">
            {filteredFaqs.map((faq: any, idx: number) => {
              const isOpen = !!openFaqIndices[idx];
              const grp = faq.group || faq.category || "General";
              return (
                <div
                  key={idx}
                  className={`bg-white rounded-[18px] border transition-all ${
                    isOpen
                      ? "border-[#0071e3]/40 shadow-md ring-1 ring-[#0071e3]/20"
                      : "border-gray-200/90 shadow-xs hover:border-gray-300"
                  } overflow-hidden`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full py-5 px-6 flex items-start justify-between text-left font-bold text-[15px] sm:text-[16px] text-[#121212] hover:text-[#0071e3] transition-colors cursor-pointer gap-4"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#0071e3]">
                        {grp}
                      </span>
                      <span>{faq.question}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 mt-1">
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#0071e3]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                  </button>
                  {isOpen && (
                    <div
                      className="px-6 pb-6 pt-2 text-gray-600 text-[14px] leading-[1.7] border-t border-gray-100 bg-[#fafafa]/50"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-[20px] border border-gray-200 p-10 text-center">
            <p className="text-gray-600 font-medium">
              No questions matched your search &ldquo;{faqSearch}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setFaqSearch("");
                setFaqCategory("All");
              }}
              className="mt-4 px-5 py-2 rounded-full bg-[#0071e3] text-white text-xs font-bold hover:bg-[#0058b8] cursor-pointer"
            >
              View All FAQs
            </button>
          </div>
        )}

        {/* D1 Store Australian Support & Expert Assistance Card */}
        <div className="mt-12 bg-white border border-gray-200/90 rounded-[24px] p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-black uppercase text-[#0071e3] tracking-widest block mb-1">
                AUSTRALIAN DJI SPECIALISTS
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#121212]">
                Still Have Questions?
              </h3>
              <p className="text-sm text-gray-600 mt-1 max-w-[500px]">
                Speak directly with our local Australian drone and gimbal specialists for personalised product advice.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <a
                href="tel:0392887882"
                className="px-5 py-2.5 rounded-full bg-[#121212] hover:bg-black text-white text-xs font-bold flex items-center gap-2 shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>(03) 9288 7882</span>
              </a>
              <a
                href="mailto:sales@d1store.com.au"
                className="px-5 py-2.5 rounded-full bg-blue-50 hover:bg-blue-100 text-[#0071e3] text-xs font-bold flex items-center gap-2 shadow-xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>sales@d1store.com.au</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
