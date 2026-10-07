"use client";

import React from "react";
import Link from "next/link";
import FooterBottomBar from "./FooterBottomBar";
import BackToTop from "./BackToTop";
import ChatButton from "./ChatButton";
import { footerNavigation, footerContact, footerSocials, footerBrand } from "@/data/footer";
import { Phone, Mail, Clock } from "lucide-react";

// Helper icon mapping for socials since they were strings
const IconMap = {
  facebook: () => (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  instagram: () => (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  tiktok: () => (
    <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3 6.34 6.34 0 0 0 9.5 21.64a6.34 6.34 0 0 0 6.34-6.34V8.87a8.2 8.2 0 0 0 4.76 1.52V6.94a4.85 4.85 0 0 1-1.01-.25z" />
    </svg>
  ),
  youtube: () => (
    <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
};

export default function Footer() {
  const shopGroup = footerNavigation.find(g => g.id === "shop");
  const supportGroup = footerNavigation.find(g => g.id === "support");
  const companyGroup = footerNavigation.find(g => g.id === "company");

  return (
    <footer className="w-full bg-[#1a1a1a] text-white pt-[64px] pb-[32px] border-t border-[#262626] font-sans relative z-10">
      <div className="max-w-[1400px] mx-auto px-[16px] md:px-[36px]">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_0.8fr_1.5fr] gap-[40px] lg:gap-[32px] pb-[48px] items-start">
          
          {/* Col 1: Brand, Contact, Socials (1.5fr) */}
          <div className="flex flex-col gap-[24px]">
            <div className="flex flex-col gap-[16px]">
              <Link href="/">
                <img
                  src={footerBrand.logoSrc}
                  alt={footerBrand.alt}
                  width={200}
                  className="h-auto object-contain max-w-[200px]"
                />
              </Link>
              <p className="text-[#a1a1a6] text-[14px] leading-[1.6]">
                {footerBrand.tagline}
              </p>
            </div>
            
            <div className="flex flex-col gap-[12px] text-[#a1a1a6] text-[14px]">
              <a href={footerContact.phoneTel} className="flex items-center gap-[8px] hover:text-white transition-colors">
                <Phone className="w-[16px] h-[16px]" />
                <span>{footerContact.phone}</span>
              </a>
              <a href={footerContact.emailMailto} className="flex items-center gap-[8px] hover:text-white transition-colors">
                <Mail className="w-[16px] h-[16px]" />
                <span>{footerContact.email}</span>
              </a>
              <div className="flex items-start gap-[8px]">
                <Clock className="w-[16px] h-[16px] mt-[2px] flex-shrink-0" />
                <span className="leading-[1.4]">{footerContact.hours}</span>
              </div>
            </div>

            <div className="flex items-center gap-[16px] mt-[8px]">
              {footerSocials.map((social) => {
                const IconComponent = IconMap[social.icon as keyof typeof IconMap] || IconMap.facebook;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[36px] h-[36px] rounded-full bg-[#333333] hover:bg-[#0071e3] flex items-center justify-center text-white transition-colors"
                    aria-label={social.name}
                  >
                    <IconComponent />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Col 2: Shop (0.8fr) */}
          <div className="flex flex-col gap-[20px]">
            <h4 className="text-[16px] font-bold text-white tracking-wide uppercase">
              {shopGroup?.title}
            </h4>
            <ul className="flex flex-col gap-[12px]">
              {shopGroup?.links.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-[14px] text-[#a1a1a6] hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Support & Company (0.8fr) */}
          <div className="flex flex-col gap-[32px]">
            <div className="flex flex-col gap-[20px]">
              <h4 className="text-[16px] font-bold text-white tracking-wide uppercase">
                {supportGroup?.title}
              </h4>
              <ul className="flex flex-col gap-[12px]">
                {supportGroup?.links.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="text-[14px] text-[#a1a1a6] hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex flex-col gap-[20px]">
              <h4 className="text-[16px] font-bold text-white tracking-wide uppercase">
                {companyGroup?.title}
              </h4>
              <ul className="flex flex-col gap-[12px]">
                {companyGroup?.links.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="text-[14px] text-[#a1a1a6] hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Col 4: Newsletter & Trust (1.5fr) */}
          <div className="flex flex-col gap-[32px]">
            <div className="flex flex-col gap-[16px]">
              <h4 className="text-[16px] font-bold text-white tracking-wide uppercase">
                Subscribe to D1
              </h4>
              <p className="text-[14px] text-[#a1a1a6] leading-[1.5]">
                Get the latest drone news, exclusive deals, and upcoming product releases delivered to your inbox.
              </p>
              <form className="flex mt-[8px] max-w-[400px]">
                <input
                  type="email"
                  placeholder="Email address"
                  className="flex-1 h-[44px] px-[16px] text-[14px] bg-[#333] text-white border border-[#444] rounded-l-[4px] focus:outline-none focus:border-[#0071e3] transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="h-[44px] px-[24px] bg-[#0071e3] hover:bg-[#0058b8] text-white text-[14px] font-bold rounded-r-[4px] transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>

            <div className="flex items-center gap-[16px]">
              <img
                src="https://www.d1store.com.au/cdn/shop/files/kyd-logo-white.png?v=1738722744&width=200"
                alt="CASA Know Your Drone"
                className="h-[44px] w-auto object-contain"
              />
              <img
                src="https://cdn.trustpilot.net/brand-assets/4.1.0/logo-white.svg"
                alt="Trustpilot"
                className="h-[32px] w-auto object-contain opacity-90"
              />
            </div>
          </div>
        </div>

        {/* Bottom Section: Legal Links & Copyright (Left) | Payment Badges (Right) */}
        <FooterBottomBar />
      </div>

      {/* Floating Controls */}
      <BackToTop />
      <ChatButton />
    </footer>
  );
}
