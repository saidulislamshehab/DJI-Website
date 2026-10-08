import React from "react";
import Link from "next/link";
import PaymentMethods from "./PaymentMethods";
import { footerLegalLinks } from "@/data/footer";

export default function FooterBottomBar() {
  return (
    <div className="pt-8 border-t border-[#242424] flex flex-col xl:flex-row items-start xl:items-center justify-between gap-5 text-[13px]">
      {/* Copyright & Legal Links */}
      <div className="flex flex-wrap items-center gap-x-5 sm:gap-x-6 gap-y-2 text-[#8e8e93]">
        <span className="select-none text-[#7c7c80]">&copy; 2026, D1 Store</span>
        {footerLegalLinks.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className="text-[#8e8e93] hover:text-[#ededed] transition-colors"
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
