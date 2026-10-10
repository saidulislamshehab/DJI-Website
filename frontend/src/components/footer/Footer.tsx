"use client";

import React from "react";
import Link from "next/link";
import FooterBottomBar from "./FooterBottomBar";
import { footerNavigation, footerContact, footerBrand } from "@/data/footer";

export default function Footer() {
  const shopGroup = footerNavigation.find((g) => g.id === "shop");
  const supportGroup = footerNavigation.find((g) => g.id === "support");
  const companyGroup = footerNavigation.find((g) => g.id === "company");

  return (
    <footer className="w-full bg-[#141414] text-[#e5e5ea] pt-12 sm:pt-16 pb-8 sm:pb-10 border-t border-[#242424] font-sans relative z-10 selection:bg-[#0071e3] selection:text-white">
      <div className="max-w-[1800px] w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        {/* Main Grid: Left Navigation | Right "Stay in the loop" with left border divider */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] xl:grid-cols-[1.3fr_1fr] gap-10 sm:gap-12 lg:gap-16 xl:gap-24 pb-10 sm:pb-14 items-start">
          
          {/* LEFT SECTION: Logo, Tagline, 3 Columns (Shop, Support, Company), Contact */}
          <div className="flex flex-col gap-7 sm:gap-9">
            {/* Logo & Tagline */}
            <div className="flex flex-col gap-2.5">
              <Link href="/" className="inline-block">
                <img
                  src="https://www.d1store.com.au/cdn/shop/files/DJI_ARS_WHT.png?v=1783662459&width=240"
                  alt={footerBrand.alt}
                  width={220}
                  height={40}
                  className="h-8 sm:h-9 w-auto object-contain brightness-105"
                />
              </Link>
              <p className="text-[#8e8e93] text-xs sm:text-[14px] leading-relaxed max-w-md">
                {footerBrand.tagline}
              </p>
            </div>

            {/* 3 Nav Columns: Shop | Support | Company */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-7 sm:gap-14 lg:gap-16 xl:gap-24 pt-2">
              {/* Column 1: Shop + Contact Details underneath */}
              <div className="flex flex-col">
                <h4 className="text-[16px] sm:text-[17px] font-semibold text-[#dedee3] tracking-normal mb-3 sm:mb-4">
                  Shop
                </h4>
                <ul className="flex flex-col gap-2.5 sm:gap-3 list-none p-0 m-0">
                  {shopGroup?.links.map((link, i) => (
                    <li key={i}>
                      <Link
                        href={link.href}
                        className="text-[13px] sm:text-[14px] text-[#a1a1a6] hover:text-[#f0f0f5] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Contact Details (Phone, Email, Hours) */}
                <div className="flex flex-col gap-1.5 mt-6 sm:mt-8 text-[13px] sm:text-[14px]">
                  <a
                    href={footerContact.phoneTel}
                    className="text-[#a1a1a6] hover:text-[#f0f0f5] transition-colors"
                  >
                    {footerContact.phone}
                  </a>
                  <a
                    href={footerContact.emailMailto}
                    className="text-[#a1a1a6] hover:text-[#f0f0f5] transition-colors"
                  >
                    {footerContact.email}
                  </a>
                  <span className="text-[#8e8e93] text-[12.5px] sm:text-[13.5px] leading-snug">
                    {footerContact.hours}
                  </span>
                </div>
              </div>

              {/* Column 2: Support */}
              <div className="flex flex-col">
                <h4 className="text-[16px] sm:text-[17px] font-semibold text-[#dedee3] tracking-normal mb-3 sm:mb-4">
                  Support
                </h4>
                <ul className="flex flex-col gap-2.5 sm:gap-3 list-none p-0 m-0">
                  {supportGroup?.links.map((link, i) => (
                    <li key={i}>
                      <Link
                        href={link.href}
                        className="text-[13px] sm:text-[14px] text-[#a1a1a6] hover:text-[#f0f0f5] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Company */}
              <div className="flex flex-col">
                <h4 className="text-[16px] sm:text-[17px] font-semibold text-[#dedee3] tracking-normal mb-3 sm:mb-4">
                  Company
                </h4>
                <ul className="flex flex-col gap-2.5 sm:gap-3 list-none p-0 m-0">
                  {companyGroup?.links.map((link, i) => (
                    <li key={i}>
                      <Link
                        href={link.href}
                        className="text-[13px] sm:text-[14px] text-[#a1a1a6] hover:text-[#f0f0f5] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION: "Stay in the loop with exclusive offers", Badges, Socials */}
          <div className="flex flex-col gap-6 sm:gap-8 lg:border-l lg:border-[#2a2a2a] lg:pl-12 xl:pl-20 min-w-0">
            {/* Big Headline */}
            <h3 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#ececf0] leading-[1.08] tracking-tight">
              Stay in the loop with<br />exclusive offers.
            </h3>

            {/* Know Your Drone & Trustpilot Badges */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
              {/* CASA Know Your Drone Badge */}
              <a
                href="https://www.casa.gov.au/knowyourdrone"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-opacity hover:opacity-90 max-w-[140px] sm:max-w-none flex-shrink-0"
                aria-label="CASA Know Your Drone Safety Advocate"
              >
                <img
                  src="https://www.d1store.com.au/cdn/shop/t/22/assets/know-your-drone-safety-advocate.png?v=77025774920087098691788220865"
                  alt="CASA Know Your Drone"
                  width={180}
                  height={60}
                  className="h-[46px] sm:h-[58px] lg:h-[64px] w-auto object-contain rounded"
                  loading="lazy"
                />
              </a>

              {/* Trustpilot 5-Star Rating Card */}
              <a
                href="https://au.trustpilot.com/review/d1store.com.au"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-opacity hover:opacity-90 max-w-[140px] sm:max-w-none flex-shrink-0"
                aria-label="Trustpilot Rating"
              >
                <img
                  src="https://cdn.d1store.app/shopify/trust/trustpilot-rating.png"
                  alt="Trustpilot 5-Star Rating"
                  width={160}
                  height={60}
                  className="h-[46px] sm:h-[58px] lg:h-[64px] w-auto object-contain rounded"
                  loading="lazy"
                />
              </a>
            </div>

            {/* Large Minimal Social Icons in a Row */}
            <div className="flex items-center gap-5 sm:gap-7 pt-1 sm:pt-2 text-[#c7c7cc]">
              <a
                href="https://www.facebook.com/d1store"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#ffffff] transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-[22px] h-[22px] fill-current" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/djistoreau/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#ffffff] transition-colors"
                aria-label="Instagram"
              >
                <svg
                  className="w-[22px] h-[22px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@djistoreau"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#ffffff] transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-[22px] h-[22px] fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3 6.34 6.34 0 0 0 9.5 21.64a6.34 6.34 0 0 0 6.34-6.34V8.87a8.2 8.2 0 0 0 4.76 1.52V6.94a4.85 4.85 0 0 1-1.01-.25z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/c/D1store"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#ffffff] transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-[22px] h-[22px] fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section: Legal Links & Copyright (Left) | Payment Badges (Right) */}
        <FooterBottomBar />
      </div>

    </footer>
  );
}
