"use client";

import React from "react";

interface ExpressPaymentSectionProps {
  onSelectExpressMethod: (method: "paypal" | "card") => void;
}

export default function ExpressPaymentSection({ onSelectExpressMethod }: ExpressPaymentSectionProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
          Express checkout
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Shop Pay */}
        <button
          type="button"
          onClick={() => onSelectExpressMethod("card")}
          className="h-11 sm:h-12 rounded-lg bg-[#5a31f4] hover:bg-[#4b26d8] transition-colors flex items-center justify-center font-bold text-white text-sm shadow-xs cursor-pointer active:scale-[0.99]"
          aria-label="Pay with Shop Pay"
        >
          <span className="font-extrabold tracking-tight">shop</span>
          <span className="font-light tracking-tight ml-0.5">pay</span>
        </button>

        {/* PayPal Express */}
        <button
          type="button"
          onClick={() => onSelectExpressMethod("paypal")}
          className="h-11 sm:h-12 rounded-lg bg-[#ffc439] hover:bg-[#f4bb30] transition-colors flex items-center justify-center text-[#003087] font-bold text-sm shadow-xs cursor-pointer active:scale-[0.99]"
          aria-label="Pay with PayPal"
        >
          <span className="italic font-extrabold text-[15px]">Pay</span>
          <span className="italic font-extrabold text-[#0079c1] text-[15px]">Pal</span>
        </button>

        {/* Google / Apple Pay */}
        <button
          type="button"
          onClick={() => onSelectExpressMethod("card")}
          className="h-11 sm:h-12 rounded-lg bg-black hover:bg-gray-900 transition-colors flex items-center justify-center text-white font-medium text-sm shadow-xs cursor-pointer active:scale-[0.99]"
          aria-label="Pay with GPay"
        >
          <span className="font-semibold tracking-tight text-xs">GPay / Apple Pay</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative py-2 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative bg-white px-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
          OR
        </div>
      </div>
    </div>
  );
}
