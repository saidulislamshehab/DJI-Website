"use client";

import React, { useState } from "react";
import { ShoppingBag, ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import OrderSummarySidebar from "./OrderSummarySidebar";
import { CartItem } from "@/context/CartContext";

interface MobileOrderSummaryToggleProps {
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  appliedCoupon: {
    code: string;
    discountAmount: number;
    message: string;
    freeShipping?: boolean;
  } | null;
  shippingFee: number;
  tax: number;
  total: number;
  onApplyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  onRemoveCoupon: () => void;
  shippingMethodLabel?: string;
}

export default function MobileOrderSummaryToggle(props: MobileOrderSummaryToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden border-b border-gray-200 bg-[#f9fafb]">
      {/* Toggle Bar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-3.5 px-4 sm:px-6 flex items-center justify-between text-xs sm:text-sm font-medium text-gray-800 hover:bg-gray-100/70 transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 text-[#0071e3] font-semibold">
          <ShoppingBag className="w-4 h-4" />
          <span>{isOpen ? "Hide order summary" : "Show order summary"}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>

        <div className="text-right">
          <span className="text-xs text-gray-500 mr-1 font-normal">AUD</span>
          <span className="font-bold text-gray-900 text-sm">
            ${props.total.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </button>

      {/* Expandable Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-gray-200/80 bg-[#fbfbfd] px-4 sm:px-6 py-6"
          >
            <OrderSummarySidebar {...props} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
