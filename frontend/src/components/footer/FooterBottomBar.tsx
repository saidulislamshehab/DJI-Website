import React from "react";
import Link from "next/link";
import PaymentMethods from "./PaymentMethods";
import { footerLegalLinks } from "@/data/footer";

export default function FooterBottomBar() {
  return (
    <div className="pt-6 border-t border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
      {/* Copyright & Legal Links */}
      <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-5 gap-y-2 text-[12px] text-[#8e8e93]">
        <span className="select-none">&copy; 2026, D1 Store</span>
        {footerLegalLinks.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className="text-[#8e8e93] hover:text-white hover:underline transition-colors duration-150"
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
