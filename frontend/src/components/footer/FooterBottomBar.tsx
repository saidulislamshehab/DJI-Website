import React from "react";
import Link from "next/link";
import PaymentMethods from "./PaymentMethods";
import { footerLegalLinks } from "@/data/footer";

export default function FooterBottomBar() {
  return (
    <div className="pt-6 border-t border-[#262626] flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 text-[12.5px]">
      {/* Copyright & Legal Links */}
      <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-5 gap-y-2 text-[#999999]">
        <span className="select-none text-[#888888]">&copy; 2026, D1 Store</span>
        {footerLegalLinks.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className="text-[#999999] hover:text-white transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Payment Methods Badges */}
      <div className="flex-shrink-0">
        <PaymentMethods />
      </div>
    </div>
  );
}
