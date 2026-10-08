"use client";

import React, { useState } from "react";
import Link from "next/link";
import FooterBottomBar from "./FooterBottomBar";
import BackToTop from "./BackToTop";
import ChatButton from "./ChatButton";
import { footerNavigation, footerContact, footerSocials, footerBrand } from "@/data/footer";
import { Phone, Mail, Clock } from "lucide-react";

// Social SVG Icons
const IconMap = {
  facebook: () => (
    <svg className="w-[15px] h-[15px] fill-current" viewBox="0 0 24 24">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  instagram: () => (
    <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  tiktok: () => (
    <svg className="w-[15px] h-[15px] fill-current" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3 6.34 6.34 0 0 0 9.5 21.64a6.34 6.34 0 0 0 6.34-6.34V8.87a8.2 8.2 0 0 0 4.76 1.52V6.94a4.85 4.85 0 0 1-1.01-.25z" />
    </svg>
  ),
  youtube: () => (
    <svg className="w-[15px] h-[15px] fill-current" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const shopGroup = footerNavigation.find((g) => g.id === "shop");
  const supportGroup = footerNavigation.find((g) => g.id === "support");
  const companyGroup = footerNavigation.find((g) => g.id === "company");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="w-full bg-[#141414] text-white pt-16 pb-8 border-t border-[#222222] font-sans relative z-10 selection:bg-[#0071e3] selection:text-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-10">
        {/* Main 4-Column Grid Matching Official DJI D1 Store Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_0.85fr_0.85fr_1.4fr] gap-10 lg:gap-8 pb-12 items-start">
          
          {/* Column 1: Brand Logo, Tagline, Contact & Socials */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Link href="/" className="inline-block">
                <img
                  src="https://www.d1store.com.au/cdn/shop/files/DJI_ARS_WHT.png?v=1783662459&width=240"
                  alt={footerBrand.alt}
                  width={200}
                  height={36}
                  className="h-8 w-auto object-contain brightness-105"
                />
              </Link>
              <p className="text-[#a3a3a3] text-[13.5px] leading-relaxed max-w-[320px]">
                {footerBrand.tagline}
              </p>
            </div>
            
            {/* Contact Details with Icons */}
            <div className="flex flex-col gap-3 text-[13.5px]">
              <a
                href={footerContact.phoneTel}
                className="flex items-center gap-3 text-[#cccccc] hover:text-white transition-colors group"
              >
                <Phone className="w-4 h-4 text-[#8e8e93] group-hover:text-white transition-colors flex-shrink-0" />
                <span>{footerContact.phone}</span>
              </a>
              <a
                href={footerContact.emailMailto}
                className="flex items-center gap-3 text-[#cccccc] hover:text-white transition-colors group"
              >
                <Mail className="w-4 h-4 text-[#8e8e93] group-hover:text-white transition-colors flex-shrink-0" />
                <span>{footerContact.email}</span>
              </a>
              <div className="flex items-start gap-3 text-[#cccccc]">
                <Clock className="w-4 h-4 text-[#8e8e93] mt-0.5 flex-shrink-0" />
                <span className="leading-snug">{footerContact.hours}</span>
              </div>
            </div>

            {/* Circular Social Buttons */}
            <div className="flex items-center gap-2.5 pt-1">
              {footerSocials.map((social) => {
                const IconComponent =
                  IconMap[social.icon as keyof typeof IconMap] || IconMap.facebook;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#262626] hover:bg-[#0071e3] flex items-center justify-center text-[#d4d4d4] hover:text-white transition-all hover:scale-105 shadow-sm"
                    aria-label={social.name}
                  >
                    <IconComponent />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: SHOP */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[14px] font-bold text-white tracking-wider uppercase">
              {shopGroup?.title || "SHOP"}
            </h4>
            <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
              {shopGroup?.links.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-[13.5px] text-[#a3a3a3] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: SUPPORT & COMPANY */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h4 className="text-[14px] font-bold text-white tracking-wider uppercase">
                {supportGroup?.title || "SUPPORT"}
              </h4>
              <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                {supportGroup?.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="text-[13.5px] text-[#a3a3a3] hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex flex-col gap-3">
              <h4 className="text-[14px] font-bold text-white tracking-wider uppercase">
                {companyGroup?.title || "COMPANY"}
              </h4>
              <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                {companyGroup?.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="text-[13.5px] text-[#a3a3a3] hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 4: SUBSCRIBE TO D1 & Trustpilot */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2.5">
              <h4 className="text-[14px] font-bold text-white tracking-wider uppercase">
                SUBSCRIBE TO D1
              </h4>
              <p className="text-[#a3a3a3] text-[13.5px] leading-relaxed max-w-[360px]">
                Get the latest drone news, exclusive deals, and upcoming product releases delivered to your inbox.
              </p>
            </div>

            {/* Newsletter Input + Subscribe Button */}
            <form onSubmit={handleSubscribe} className="flex max-w-[380px] w-full mt-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 h-10 px-3.5 text-[13.5px] bg-[#292929] text-white border border-[#383838] rounded-l focus:outline-none focus:border-[#0071e3] transition-colors placeholder:text-[#737373]"
                required
              />
              <button
                type="submit"
                className="h-10 px-5 bg-[#0071e3] hover:bg-[#005bb5] text-white text-[13.5px] font-semibold rounded-r transition-colors cursor-pointer flex-shrink-0"
              >
                {subscribed ? "Subscribed!" : "Subscribe"}
              </button>
            </form>

            {/* Trustpilot Branding Matching Official Screenshot */}
            <div className="flex items-center gap-2 pt-2">
              <svg className="w-5 h-5 text-[#00b67a] fill-[#00b67a] flex-shrink-0" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-white font-bold text-[17px] tracking-tight">Trustpilot</span>
            </div>
          </div>
        </div>

        {/* Bottom Section: Legal Links & Copyright (Left) | Payment Badges (Right) */}
        <FooterBottomBar />
      </div>

      {/* Floating Corner Accessibility Icon (Bottom-Left from screenshot) */}
      <div className="fixed bottom-6 left-6 z-40 hidden sm:block">
        <button
          type="button"
          className="w-9 h-9 rounded-full bg-black/90 hover:bg-black text-white flex items-center justify-center shadow-lg border border-white/20 transition-all hover:scale-105"
          aria-label="Accessibility options"
        >
          <span className="font-bold text-[13px] tracking-wider text-white">N</span>
        </button>
      </div>

      {/* Floating Controls (BackToTop & Chat) */}
      <BackToTop />
      <ChatButton />
    </footer>
  );
}
