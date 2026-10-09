"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

type PolicyType = "refund" | "shipping" | "privacy" | "terms" | null;

const POLICIES: Record<string, { title: string; content: string }> = {
  refund: {
    title: "Refund & Returns Policy",
    content: `D1 Store Australia offers a comprehensive 14-day change of mind returns policy for unopened, factory-sealed consumer products. 
    
All products sold by D1 Store come with consumer guarantees under the Australian Consumer Law (ACL). If a product develops a manufacturing fault, you are entitled to a replacement, repair, or refund depending on whether the issue is classified as a major failure under Australian Law.

For DJI Care Refresh claims, our local Australian service centers can facilitate fast priority repairs or immediate replacements.`,
  },
  shipping: {
    title: "Shipping & Delivery Policy",
    content: `All orders placed before 2:00 PM AEST on business days are dispatched same-day from our primary Sydney and Melbourne logistics hubs.

Standard Courier Delivery (StarTrack / Australia Post): 2 to 5 business days Australia-wide. Orders over $99 AUD qualify for FREE Standard Delivery.

StarTrack Express Priority: 1 to 2 business days guaranteed air dispatch for $25.00 AUD.

Click & Collect: Orders are typically ready for pickup within 2 hours at our World Square (Sydney), Chadstone (Melbourne), and Indooroopilly (Brisbane) retail stores.`,
  },
  privacy: {
    title: "Privacy Policy",
    content: `D1 Store Pty Ltd (ABN 84 624 487 186) respects and protects your privacy under the Privacy Act 1988 (Cth) and Australian Privacy Principles (APPs).

We only collect personal information necessary to fulfill your orders, process payments securely, and notify you regarding dispatch and delivery. We never sell, lease, or distribute your private contact or financial details to third-party marketing brokers.`,
  },
  terms: {
    title: "Terms of Service",
    content: `By placing an order on this website, you agree to purchase the goods subject to these terms and conditions. All pricing is quoted in Australian Dollars (AUD) and includes 10% Australian Goods and Services Tax (GST).

Official Tax Invoices with D1 Store Pty Ltd's Australian Business Number (ABN 84 624 487 186) are automatically provided upon order placement.`,
  },
};

export default function CheckoutFooter() {
  const [activePolicy, setActivePolicy] = useState<PolicyType>(null);

  return (
    <>
      <footer className="pt-8 pb-12 border-t border-gray-200/80 text-xs text-gray-500">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <button
            type="button"
            onClick={() => setActivePolicy("refund")}
            className="hover:text-gray-900 transition-colors underline cursor-pointer"
          >
            Refund policy
          </button>
          <button
            type="button"
            onClick={() => setActivePolicy("shipping")}
            className="hover:text-gray-900 transition-colors underline cursor-pointer"
          >
            Shipping policy
          </button>
          <button
            type="button"
            onClick={() => setActivePolicy("privacy")}
            className="hover:text-gray-900 transition-colors underline cursor-pointer"
          >
            Privacy policy
          </button>
          <button
            type="button"
            onClick={() => setActivePolicy("terms")}
            className="hover:text-gray-900 transition-colors underline cursor-pointer"
          >
            Terms of service
          </button>
        </div>
      </footer>

      {/* Policy Modal */}
      {activePolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[85vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">
                {POLICIES[activePolicy].title}
              </h3>
              <button
                type="button"
                onClick={() => setActivePolicy(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Close policy modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {POLICIES[activePolicy].content}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActivePolicy(null)}
                className="px-4 py-2 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
