"use client";

import React, { useMemo } from "react";
import { Check } from "lucide-react";
import { IProduct } from "@/types";

interface ProductWhatsInTheBoxProps {
  product: IProduct;
  inTheBoxTab: string;
  onSelectInTheBoxTab: (tabKey: string) => void;
}

export default function ProductWhatsInTheBox({
  product,
  inTheBoxTab,
  onSelectInTheBoxTab,
}: ProductWhatsInTheBoxProps) {
  const inTheBoxKeys = useMemo(() => {
    if (product.inTheBoxVariants && typeof product.inTheBoxVariants === "object") {
      return Object.keys(product.inTheBoxVariants);
    }
    return [];
  }, [product]);

  const formatVariantLabel = (key: string) => {
    if (key.toLowerCase() === "standard") return "Standard Combo";
    if (key.toLowerCase() === "creator") return "Creator Combo";
    if (key.toLowerCase() === "vlog") return "Vlog Combo";
    if (key.toLowerCase() === "flymore" || key.toLowerCase() === "fly-more") return "Fly More Combo";
    return key.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) + " Combo";
  };

  // Active items for the currently selected tab
  const activeInTheBoxItems = useMemo(() => {
    if (inTheBoxKeys.length > 0 && product.inTheBoxVariants) {
      return (
        product.inTheBoxVariants[inTheBoxTab] ||
        product.inTheBoxVariants[inTheBoxKeys[0]] ||
        []
      );
    }
    if (product.inTheBox && product.inTheBox.length > 0) {
      return product.inTheBox;
    }
    // Fallback standard items
    return [
      {
        title: product.name,
        qty: 1,
        role: "Core Unit",
        image: product.mainImage,
        description: "Primary camera/drone unit with integrated sensor.",
      },
      {
        title: "Protective Transport Cover",
        qty: 1,
        role: "Protection",
        image: product.mainImage,
        description: "Custom protective storage cover.",
      },
      {
        title: "Type-C to Type-C PD Cable",
        qty: 1,
        role: "Power",
        image: product.mainImage,
        description: "High-speed fast charging and data transfer cable.",
      },
      {
        title: "Wrist Strap",
        qty: 1,
        role: "Mount",
        image: product.mainImage,
        description: "Comfortable tether lanyard for secure handling.",
      },
    ];
  }, [product, inTheBoxKeys, inTheBoxTab]);

  // Union of comparison items across combos
  const allComparisonItems = useMemo(() => {
    if (!product.inTheBoxVariants) return [];
    const standardList = product.inTheBoxVariants.standard || [];
    const creatorList = product.inTheBoxVariants.creator || [];
    if (standardList.length === 0 && creatorList.length === 0) return [];

    const standardTitles = standardList.map((it: any) =>
      typeof it === "string" ? it : it.title
    );
    const creatorTitles = creatorList.map((it: any) =>
      typeof it === "string" ? it : it.title
    );
    const allTitles = Array.from(new Set([...standardTitles, ...creatorTitles]));

    return allTitles.map((title) => {
      const stdItem = standardList.find((it: any) =>
        typeof it === "string" ? it === title : it.title === title
      );
      const crtItem = creatorList.find((it: any) =>
        typeof it === "string" ? it === title : it.title === title
      );
      return {
        title,
        stdIncluded: !!stdItem,
        crtIncluded: !!crtItem,
        stdQty: typeof stdItem === "object" ? stdItem?.qty : 1,
        crtQty: typeof crtItem === "object" ? crtItem?.qty : 1,
        image:
          (typeof crtItem === "object" && crtItem?.image) ||
          (typeof stdItem === "object" && stdItem?.image) ||
          product.mainImage,
      };
    });
  }, [product]);

  // Spotlight gear accessories
  const gearSpotlightList = [
    {
      title: "Battery Handle Expansion Grip",
      subtitle: "+64% Extended Shooting Runtime",
      desc: "Built-in 950mAh battery extends overall operating time by approx. 64%. Features a 1/4-inch screw thread at the base for attaching tripods and external microphone handles seamlessly.",
      image: "https://d1store.com.au/media/catalog/product/p/o/pocket_3_battery_handle.jpg",
      highlight: "Hot-Swappable Power",
    },
    {
      title: "DJI Mic 2 Wireless Transmitter",
      subtitle: "32-Bit Float & 250m Wireless Range",
      desc: "Crystal-clear studio audio with 8GB internal recording (up to 14 hours of uncompressed 24-bit 48kHz audio). Magnetic clip allows rapid mounting to clothing and active noise cancellation filters harsh wind.",
      image: "https://d1store.com.au/media/catalog/product/d/j/dji_mic_2_transmitter.jpg",
      highlight: "Studio-Grade Vocals",
    },
    {
      title: "DJI Wide-Angle Lens",
      subtitle: "Expanded 108° Ultra-Wide Field of View",
      desc: "Snaps on magnetically to the front element in less than a second. Expands your framing to capture dramatic Australian landscapes, group vlogs, and interior architectural scenes with zero optical distortion.",
      image: "https://d1store.com.au/media/catalog/product/p/o/pocket_3_wide_angle_lens.jpg",
      highlight: "Magnetic Snap-On",
    },
    {
      title: "DJI Mini Tripod & Protective Shell",
      subtitle: "Everyday Stability & Rigid Travel Shield",
      desc: "Ultra-compact collapsible aluminum legs with non-slip silicone feet for table recording and timelapses. The custom hard case protects the 3-axis gimbal and houses two magnetic lenses and micro SD cards.",
      image: "https://d1store.com.au/media/catalog/product/p/o/pocket_3_mini_tripod.jpg",
      highlight: "Precision Transport",
    },
  ];

  return (
    <section id="in-the-box" className="bg-[#fbfbfd] border-y border-gray-200/80 py-16 space-y-12">
      <div className="max-w-[1400px] mx-auto px-4 md:px-9">
        {/* Section Header */}
        <div className="text-center max-w-[760px] mx-auto mb-10">
          <span className="text-[#0071e3] font-black uppercase text-xs sm:text-sm tracking-widest block mb-2">
            PACKAGE CONTENTS &amp; COMBOS
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-[36px] font-black text-[#121212] tracking-tight">
            What&apos;s in the Box
          </h2>
          <p className="text-base sm:text-lg text-gray-500 mt-2">
            Choose the kit that matches your creative workflow. Compare combos and see every included component.
          </p>
        </div>

        {/* Combo Toggle Pills */}
        {inTheBoxKeys.length > 0 && (
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 flex-wrap">
            <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-gray-500">
              SELECT KIT:
            </span>
            {inTheBoxKeys.map((k) => {
              const isSelected = inTheBoxTab.toLowerCase() === k.toLowerCase();
              const label = formatVariantLabel(k);
              const count =
                (product.inTheBoxVariants && product.inTheBoxVariants[k]?.length) || 0;

              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => onSelectInTheBoxTab(k)}
                  className={`h-[38px] sm:h-[44px] px-3.5 sm:px-6 rounded-full text-xs sm:text-sm md:text-[15px] font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 sm:gap-2.5 ${
                    isSelected
                      ? "bg-[#0071e3] text-white"
                      : "bg-[#e5e5ea] text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <span>{label}</span>
                  {count > 0 && (
                    <span
                      className={`text-[11px] sm:text-xs px-2 py-0.5 rounded-full font-black ${
                        isSelected ? "bg-white/25 text-white" : "bg-white text-gray-700"
                      }`}
                    >
                      {count} Items
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* 6-Column High-Res Cutout Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-5">
          {activeInTheBoxItems.map((item: any, idx: number) => {
            const titleStr = typeof item === "string" ? item : item.title;
            const imgStr =
              typeof item === "string"
                ? product.mainImage
                : item.image || product.mainImage;
            const qty = typeof item === "object" ? item.qty : undefined;
            const desc = typeof item === "object" ? item.description : undefined;
            const role = typeof item === "object" ? item.role : undefined;

            return (
              <div
                key={idx}
                className="bg-white rounded-[20px] sm:rounded-[24px] p-3.5 sm:p-5 md:p-6 border border-gray-200/90 flex flex-col items-center justify-between min-h-[220px] sm:min-h-[260px] shadow-xs hover:shadow-md transition-shadow relative group"
              >
                <div className="w-full flex items-center justify-between absolute top-2.5 sm:top-3 px-2.5 sm:px-3">
                  {role ? (
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#0071e3] bg-blue-50 px-2 py-0.5 rounded-md truncate max-w-[100px]">
                      {role}
                    </span>
                  ) : (
                    <span />
                  )}
                  {qty && qty > 1 && (
                    <span className="text-[10px] sm:text-xs font-black bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                      {qty}x
                    </span>
                  )}
                </div>

                <div className="w-full h-[100px] sm:h-[130px] flex items-center justify-center p-1 sm:p-2 mt-4 mb-2">
                  <img
                    src={imgStr}
                    alt={titleStr}
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="w-full text-center">
                  <span className="text-xs sm:text-sm md:text-[15px] font-bold text-[#121212] leading-snug line-clamp-2 block">
                    {titleStr}
                  </span>
                  {desc && (
                    <span className="text-[11px] sm:text-xs text-gray-500 line-clamp-1 mt-0.5 sm:mt-1 block">
                      {desc}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Side-by-Side Combo Comparison Matrix Table */}
        {allComparisonItems.length > 0 && (
          <div className="mt-10 sm:mt-14 bg-white rounded-[20px] sm:rounded-[26px] border border-gray-200/90 overflow-hidden shadow-xs">
            <div className="p-4 sm:p-6 md:p-8 bg-[#fafafa] border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <span className="text-xs sm:text-sm font-black uppercase text-[#0071e3] tracking-widest block mb-1">
                  SIDE-BY-SIDE MATRIX
                </span>
                <h3 className="text-lg sm:text-2xl font-black text-[#121212]">
                  Combo Comparison Breakdown
                </h3>
                <p className="text-xs sm:text-base text-gray-500 mt-1">
                  Compare all {allComparisonItems.length} components across Standard and Creator configurations.
                </p>
              </div>
              <div className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-800 text-xs sm:text-sm font-bold">
                Save $245 AUD with Creator Combo
              </div>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[480px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-white">
                    <th className="py-3.5 sm:py-4.5 px-4 sm:px-6 text-xs sm:text-[15px] font-bold text-gray-700 w-1/2">
                      Included Component
                    </th>
                    <th className="py-3.5 sm:py-4.5 px-4 sm:px-6 text-xs sm:text-[15px] font-black text-[#121212] text-center w-1/4 bg-gray-50/50">
                      Standard Combo
                      <div className="text-[11px] sm:text-xs font-semibold text-gray-500 mt-0.5">$769 AUD</div>
                    </th>
                    <th className="py-3.5 sm:py-4.5 px-4 sm:px-6 text-xs sm:text-[15px] font-black text-[#0071e3] text-center w-1/4 bg-blue-50/30">
                      Creator Combo
                      <div className="text-[11px] sm:text-xs font-bold text-[#0071e3] mt-0.5">$1,029 AUD</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allComparisonItems.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-100 hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-[15px] font-medium text-[#121212] flex items-center gap-2.5 sm:gap-3.5">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gray-50 border border-gray-100 p-1 flex items-center justify-center flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <span>{item.title}</span>
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6 text-center bg-gray-50/30">
                        {item.stdIncluded ? (
                          <span className="inline-flex items-center gap-1 sm:gap-1.5 text-emerald-700 font-bold text-xs sm:text-sm bg-emerald-50 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                            <Check className="w-3.5 h-3.5" />
                            {(item.stdQty ?? 1) > 1 ? `${item.stdQty}x` : "Included"}
                          </span>
                        ) : (
                          <span className="text-gray-300 font-bold">—</span>
                        )}
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6 text-center bg-blue-50/20">
                        {item.crtIncluded ? (
                          <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[#0071e3] font-bold text-xs sm:text-sm bg-blue-50 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                            <Check className="w-3.5 h-3.5" />
                            {(item.crtQty ?? 1) > 1 ? `${item.crtQty}x` : "Included"}
                          </span>
                        ) : (
                          <span className="text-gray-300 font-bold">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Essential Gear Spotlight Cards */}
        <div className="mt-10 sm:mt-14">
          <div className="text-center max-w-[760px] mx-auto mb-6 sm:mb-8">
            <span className="text-[#0071e3] font-black uppercase text-xs sm:text-sm tracking-widest block mb-2">
              ESSENTIAL ACCESSORY SPOTLIGHT
            </span>
            <h3 className="text-xl sm:text-3xl font-black text-[#121212]">
              Why These Add-Ons Matter
            </h3>
            <p className="text-xs sm:text-base text-gray-500 mt-1">
              Engineered specifically for {product.name} to extend shooting time and audio fidelity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {gearSpotlightList.map((gear, gIdx) => (
              <div
                key={gIdx}
                className="bg-white rounded-[24px] border border-gray-200/90 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all group"
              >
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#0071e3] bg-blue-50 px-3 py-1 rounded-full inline-block mb-3">
                    {gear.highlight}
                  </span>
                  <div className="w-full h-[150px] flex items-center justify-center p-2 mb-4 bg-[#f8f8fa] rounded-[18px]">
                    <img
                      src={gear.image}
                      alt={gear.title}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h4 className="text-lg sm:text-[19px] font-black text-[#121212] leading-snug">
                    {gear.title}
                  </h4>
                  <p className="text-xs sm:text-sm font-bold text-emerald-600 mt-1">
                    {gear.subtitle}
                  </p>
                  <p className="text-[14px] sm:text-[15px] text-gray-600 mt-3 leading-relaxed">
                    {gear.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
