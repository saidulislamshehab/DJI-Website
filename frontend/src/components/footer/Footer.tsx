"use client";

import React from "react";
import FooterBrand from "./FooterBrand";
import FooterNavigation from "./FooterNavigation";
import FooterContact from "./FooterContact";
import FooterNewsletter from "./FooterNewsletter";
import FooterTrustBadges from "./FooterTrustBadges";
import FooterSocials from "./FooterSocials";
import FooterBottomBar from "./FooterBottomBar";
import BackToTop from "./BackToTop";
import ChatButton from "./ChatButton";

export default function Footer() {
  return (
    <footer className="w-full bg-[#1a1a1a] text-white pt-14 pb-8 border-t border-[#262626] font-sans relative z-10">
      <div className="max-w-[1780px] mx-auto px-6 sm:px-12 lg:px-16">
        {/* Top Section: Left Content (60-65%) | Vertical Divider | Right Newsletter & Proof (35-40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-0 pb-12">
          {/* Left Column (Span 7 on desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-between lg:pr-14 xl:pr-18 lg:border-r lg:border-white/10">
            <div>
              {/* Brand Logo & Tagline */}
              <FooterBrand />

              {/* 3 Nav Columns: Shop, Support, Company */}
              <FooterNavigation />
            </div>

            {/* Direct Contact Details */}
            <FooterContact />
          </div>

          {/* Right Column (Span 5 on desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-start lg:pl-14 xl:pl-18 space-y-7">
            {/* Large Newsletter Headline & Form */}
            <FooterNewsletter />

            {/* Trust Badges: CASA Know Your Drone + Trustpilot */}
            <FooterTrustBadges />

            {/* Social Media Links */}
            <FooterSocials />
          </div>
        </div>

        {/* Bottom Section: Legal Links & Copyright (Left) | Payment Badges (Right) */}
        <FooterBottomBar />
      </div>

      {/* Floating Controls: Back to Top & Live Chat */}
      <BackToTop />
      <ChatButton />
    </footer>
  );
}
