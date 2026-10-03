import React from "react";
import Link from "next/link";
import { footerBrand } from "@/data/footer";

export default function FooterBrand() {
  return (
    <div className="mb-8 lg:mb-10">
      <Link href="/" className="inline-block" aria-label="D1 Store Homepage">
        <img
          src={footerBrand.logoSrc}
          alt={footerBrand.alt}
          className="h-7 sm:h-8 w-auto object-contain"
          width={240}
          height={32}
          loading="lazy"
        />
      </Link>
      <p className="text-[13px] text-[#9ca3af] mt-2.5 font-normal tracking-normal m-0">
        {footerBrand.tagline}
      </p>
    </div>
  );
}
