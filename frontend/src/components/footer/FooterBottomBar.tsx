import React from "react";
import Link from "next/link";
import PaymentMethods from "./PaymentMethods";
import { footerLegalLinks } from "@/data/footer";

export default function FooterBottomBar() {
  return (
    <div className="pt-[24px] border-t border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-[20px]">
      {/* Copyright & Legal Links */}
      <div className="flex flex-wrap items-center gap-x-[16px] sm:gap-x-[20px] gap-y-[8px] text-[13px] text-[#8e8e93]">
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
        <Link
          href="/admin"
          className="text-[#0071e3] hover:underline font-bold transition-colors duration-150"
        >
          Admin Portal
        </Link>
      </div>

      {/* Payment Methods Badges */}
      <div className="flex-shrink-0">
        <PaymentMethods />
      </div>
    </div>
  );
}
