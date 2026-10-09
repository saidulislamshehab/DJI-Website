"use client";

import React from "react";
import { Truck, Check, Zap } from "lucide-react";

export type ShippingMethodType = "standard" | "express" | "pickup";

interface ShippingMethodSectionProps {
  selectedMethod: ShippingMethodType;
  onSelectMethod: (method: ShippingMethodType) => void;
  subtotal: number;
  freeShippingUnlocked: boolean;
  deliveryType: "ship" | "pickup";
}

export default function ShippingMethodSection({
  selectedMethod,
  onSelectMethod,
  subtotal,
  freeShippingUnlocked,
  deliveryType,
}: ShippingMethodSectionProps) {
  if (deliveryType === "pickup") {
    return (
      <section className="space-y-3" aria-labelledby="shipping-method-heading">
        <h2 id="shipping-method-heading" className="text-lg sm:text-[19px] font-bold text-[#111827]">
          Delivery method
        </h2>
        <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 text-xs sm:text-sm text-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-full border-4 border-[#0071e3] bg-white inline-block" />
            <div>
              <p className="font-bold text-gray-900">Click &amp; Collect (D1 Store Retail)</p>
              <p className="text-xs text-gray-500">Pick up ready notifications sent via SMS</p>
            </div>
          </div>
          <span className="font-bold text-emerald-700 text-sm">FREE</span>
        </div>
      </section>
    );
  }

  const isFreeStandard = freeShippingUnlocked || subtotal >= 99;

  return (
    <section className="space-y-3.5" aria-labelledby="shipping-method-heading">
      <div className="flex items-center justify-between">
        <h2 id="shipping-method-heading" className="text-xl sm:text-[22px] font-bold text-gray-900">
          Shipping method
        </h2>
      </div>

      <div className="rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-200 bg-white shadow-xs">
        {/* Standard Courier Option */}
        <label
          onClick={() => onSelectMethod("standard")}
          className={`flex items-center justify-between p-4 sm:p-4.5 cursor-pointer transition-colors ${
            selectedMethod === "standard" ? "bg-blue-50/20" : "hover:bg-gray-50/60"
          }`}
        >
          <div className="flex items-center gap-3.5 min-w-0 pr-3">
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                selectedMethod === "standard"
                  ? "border-[#0071e3] bg-[#0071e3] text-white"
                  : "border-gray-300 bg-white"
              }`}
            >
              {selectedMethod === "standard" && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-[15px] sm:text-base font-semibold text-gray-900">
                  Standard Courier (StarTrack / Australia Post)
                </span>
                {isFreeStandard && (
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    FREE DELIVERY
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-0.5">2 to 5 business days Australia-wide</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[15px] sm:text-base font-bold text-gray-900">
              {isFreeStandard ? "Free" : "$15.00 AUD"}
            </span>
          </div>
        </label>

        {/* Express Priority Option */}
        <label
          onClick={() => onSelectMethod("express")}
          className={`flex items-center justify-between p-4 sm:p-4.5 cursor-pointer transition-colors ${
            selectedMethod === "express" ? "bg-blue-50/20" : "hover:bg-gray-50/60"
          }`}
        >
          <div className="flex items-center gap-3.5 min-w-0 pr-3">
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                selectedMethod === "express"
                  ? "border-[#0071e3] bg-[#0071e3] text-white"
                  : "border-gray-300 bg-white"
              }`}
            >
              {selectedMethod === "express" && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-[15px] sm:text-base font-semibold text-gray-900">
                  StarTrack Express Priority
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0071e3] bg-blue-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>NEXT DAY DISPATCH</span>
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">1 to 2 business days priority air express</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[15px] sm:text-base font-bold text-gray-900">$25.00 AUD</span>
          </div>
        </label>
      </div>
    </section>
  );
}
