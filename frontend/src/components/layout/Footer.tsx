"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUp, MessageSquare } from "lucide-react";

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 250);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#171717] text-white pt-16 pb-8 border-t border-[#262626] font-sans relative z-10">
      <div className="max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-20">
        {/* Main Grid: Left Navigation (60%) + Vertical Line + Right Newsletter/Proof (40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-0 pb-14">
          {/* Left Column (Span 7) */}
          <div className="lg:col-span-7 flex flex-col justify-between lg:pr-16 lg:border-r lg:border-white/10">
            <div>
              {/* Brand Logo & Tagline */}
              <div className="mb-10">
                <Link href="/" className="inline-block">
                  <img
                    src="//www.d1store.com.au/cdn/shop/files/DJI_ARS_WHT.png?v=1783662459&width=240"
                    alt="DJI Authorised Retail Store"
                    className="h-8 w-auto object-contain"
                    width={240}
                    height={30}
                  />
                </Link>
                <p className="text-[13px] text-[#999999] mt-2.5 font-normal tracking-tight">
                  Australia's First and Only DJI Authorised Retail Store.
                </p>
              </div>

              {/* 3 Nav Columns: Shop, Support, Company */}
              <div className="grid grid-cols-3 gap-8 sm:gap-12 lg:gap-16 mb-10 w-full">
                {/* Shop */}
                <div>
                  <h3
                    style={{ color: "#ffffff" }}
                    className="text-[15px] font-bold text-white mb-4 tracking-tight"
                  >
                    Shop
                  </h3>
                  <ul className="space-y-3 list-none p-0 m-0 text-[13px] text-[#cccccc]">
                    <li>
                      <Link href="/pages/stores" className="hover:text-white transition-colors">
                        Store Finder
                      </Link>
                    </li>
                    <li>
                      <Link href="/pages/trade-in" className="hover:text-white transition-colors">
                        Trade-In
                      </Link>
                    </li>
                    <li>
                      <Link href="/pages/price-match" className="hover:text-white transition-colors">
                        Price Match
                      </Link>
                    </li>
                    <li>
                      <Link href="/pages/get-quote" className="hover:text-white transition-colors">
                        Get a Quote
                      </Link>
                    </li>
                    <li>
                      <Link href="/pages/care-refresh-activation" className="hover:text-white transition-colors">
                        Care Refresh
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h3
                    style={{ color: "#ffffff" }}
                    className="text-[15px] font-bold text-white mb-4 tracking-tight"
                  >
                    Support
                  </h3>
                  <ul className="space-y-3 list-none p-0 m-0 text-[13px] text-[#cccccc]">
                    <li>
                      <Link href="/pages/support" className="hover:text-white transition-colors">
                        Support
                      </Link>
                    </li>
                    <li>
                      <Link href="/pages/repairs" className="hover:text-white transition-colors">
                        Repairs
                      </Link>
                    </li>
                    <li>
                      <Link href="/pages/warranty" className="hover:text-white transition-colors">
                        Warranty
                      </Link>
                    </li>
                    <li>
                      <Link href="/pages/contact" className="hover:text-white transition-colors">
                        Contact
                      </Link>
                    </li>
                    <li>
                      <Link href="/pages/care-refresh-beyond-48-hours" className="hover:text-white transition-colors">
                        Beyond 48 Hours
                      </Link>
                    </li>
                    <li>
                      <Link href="/blogs/news" className="hover:text-white transition-colors">
                        Guides
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Company */}
                <div>
                  <h3
                    style={{ color: "#ffffff" }}
                    className="text-[15px] font-bold text-white mb-4 tracking-tight"
                  >
                    Company
                  </h3>
                  <ul className="space-y-3 list-none p-0 m-0 text-[13px] text-[#cccccc]">
                    <li>
                      <Link href="/pages/about-us" className="hover:text-white transition-colors">
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link href="/pages/careers" className="hover:text-white transition-colors">
                        Careers
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-1.5 text-[13px] pt-2">
              <p className="m-0 leading-relaxed">
                <a href="tel:0392887882" className="text-white hover:underline font-medium">
                  (03) 9288 7882
                </a>
              </p>
              <p className="m-0 leading-relaxed">
                <a href="mailto:info@d1store.com.au" className="text-white hover:underline font-medium">
                  info@d1store.com.au
                </a>
              </p>
              <p className="m-0 leading-relaxed text-[#888888]">
                9:00 AM to 5:00 PM Melbourne Time
              </p>
            </div>
          </div>

          {/* Right Column (Span 5): Large Heading, Badges, Socials */}
          <div className="lg:col-span-5 flex flex-col justify-start lg:pl-16 space-y-8">
            <h2
              style={{ color: "#ffffff" }}
              className="text-4xl sm:text-[44px] lg:text-[48px] font-black text-white tracking-[-0.02em] leading-[1.08] max-w-md m-0"
            >
              Stay in the loop with
              <br />
              exclusive offers.
            </h2>

            {/* Proof Badges (CASA + Trustpilot) */}
            <div className="flex items-center gap-4 pt-1">
              {/* CASA Know Your Drone */}
              <a
                href="https://www.casa.gov.au/knowyourdrone"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-opacity hover:opacity-90"
              >
                <img
                  src="//www.d1store.com.au/cdn/shop/t/22/assets/know-your-drone-safety-advocate.png?v=77025774920087098691788220865"
                  alt="CASA Know Your Drone Safety Advocate"
                  className="h-[48px] sm:h-[52px] w-auto object-contain rounded"
                  width={150}
                  height={52}
                  loading="lazy"
                />
              </a>

              {/* Trustpilot Widget Badge */}
              <a
                href="https://au.trustpilot.com/review/d1store.com.au"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-opacity hover:opacity-90"
                aria-label="D1 Store on Trustpilot"
              >
                <img
                  src="https://cdn.d1store.app/shopify/trust/trustpilot-rating.png"
                  alt="D1 Store on Trustpilot"
                  className="h-[48px] sm:h-[52px] w-auto object-contain rounded"
                  width={140}
                  height={52}
                  loading="lazy"
                />
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-6 pt-1 text-white/80">
              <a
                href="https://www.facebook.com/d1store"
                className="hover:text-white transition-colors"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/djistoreau/"
                className="hover:text-white transition-colors"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="18" cy="6" r="1" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@djistoreau"
                className="hover:text-white transition-colors"
                aria-label="TikTok"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3 6.34 6.34 0 0 0 9.5 21.64a6.34 6.34 0 0 0 6.34-6.34V8.87a8.2 8.2 0 0 0 4.76 1.52V6.94a4.85 4.85 0 0 1-1.01-.25z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/c/D1store"
                className="hover:text-white transition-colors"
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Policies (Left) | Payment Badges (Right) */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright & Legal Links */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[#777777]">
            <span>&copy; 2026, D1 Store</span>
            <Link href="/policies/privacy-policy" className="hover:text-white hover:underline transition-colors">
              Privacy policy
            </Link>
            <Link href="/policies/refund-policy" className="hover:text-white hover:underline transition-colors">
              Refund policy
            </Link>
            <Link href="/policies/shipping-policy" className="hover:text-white hover:underline transition-colors">
              Shipping policy
            </Link>
            <Link href="/policies/terms-of-service" className="hover:text-white hover:underline transition-colors">
              Terms of service
            </Link>
            <Link href="/policies/contact-information" className="hover:text-white hover:underline transition-colors">
              Contact information
            </Link>
            <Link href="/policies/legal-notice" className="hover:text-white hover:underline transition-colors">
              Legal notice
            </Link>
          </div>

          {/* Payment Icons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* AMEX */}
            <span className="inline-flex h-[24px]">
              <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 38 24" width="38" height="24">
                <rect width="38" height="24" rx="3" fill="#016fd0" />
                <path d="M7 6h3.4l1.3 3.2L13 6h3.4v12h-2.5v-7.2L12.4 14h-1.6l-1.5-3.2V18H7V6z" fill="#fff" />
                <path d="M19 6h7.5c1.4 0 2.5 1.1 2.5 2.5v1.2c0 .9-.5 1.7-1.3 2.1 1 .4 1.7 1.3 1.7 2.4V15.5c0 1.4-1.1 2.5-2.5 2.5H19V6zm2.4 4.8h4.5c.3 0 .6-.3.6-.6v-.8c0-.3-.3-.6-.6-.6h-4.5v2zm0 4.8h4.7c.3 0 .6-.3.6-.6v-.9c0-.3-.3-.6-.6-.6h-4.7v2.1z" fill="#fff" />
              </svg>
            </span>

            {/* Apple Pay */}
            <span className="inline-flex h-[24px]">
              <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 38 24" width="38" height="24">
                <rect width="38" height="24" rx="3" fill="#fff" />
                <path d="M13.4 10.9c-.3.4-.8.7-1.3.6-.1-.5.1-1.1.4-1.4.3-.4.8-.6 1.3-.6.1.5-.1 1-.4 1.4zm.4.8c-.7 0-1.3.4-1.7.4-.4 0-.9-.4-1.5-.4-.8 0-1.5.5-1.9 1.2-.8 1.5-.2 3.7.6 4.9.4.6.9 1.3 1.5 1.3.6 0 .8-.4 1.5-.4.7 0 .9.4 1.5.4.6 0 1.1-.6 1.5-1.2.5-.7.7-1.4.7-1.4-.7-.3-1.1-.9-1.1-1.7 0-1.4 1.1-2 1.2-2.1-.6-.9-1.5-1-1.8-1zm4.7-.6h1.7c1.3 0 2.1.9 2.1 2.2 0 1.3-.9 2.2-2.1 2.2h-.7v2.6h-.9V11.1zm.9 3.6h.7c.8 0 1.3-.5 1.3-1.4 0-.8-.5-1.4-1.3-1.4h-.7v2.8zm6.5 1.5c0-.9.7-1.5 1.8-1.5.6 0 1 .1 1.2.2v-.2c0-.6-.5-1-1.2-1-.5 0-.9.1-1.2.3l-.3-.6c.4-.2 1-.4 1.7-.4 1.3 0 1.9.7 1.9 1.8v3.1h-.9v-.7c-.3.5-.8.8-1.5.8-.9 0-1.5-.6-1.5-1.5zm3.1-.2v-.5c-.2-.1-.6-.2-1-.2-.7 0-1.1.3-1.1.8 0 .5.4.8.9.8.7 0 1.2-.4 1.2-.9zm4.2 3.6l1.5-4.4h1l-2.4 6.3h-1l.9-2.3-2.1-4h1l1.1 3.2z" fill="#000" />
              </svg>
            </span>

            {/* Google Pay */}
            <span className="inline-flex h-[24px]">
              <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 38 24" width="38" height="24">
                <rect width="38" height="24" rx="3" fill="#fff" stroke="#e6e6e6" strokeWidth="0.5" />
                <path d="M15.4 12.2c0-.2 0-.4-.1-.6h-3.4v1.2h2c-.1.5-.4.9-.8 1.2v1h1.3c.8-.7 1-1.7 1-2.8z" fill="#4285F4" />
                <path d="M11.9 15.7c1 0 1.9-.3 2.5-1l-1.3-1c-.3.2-.8.4-1.2.4-.9 0-1.7-.6-2-1.5H8.6v1c.6 1.3 1.9 2.1 3.3 2.1z" fill="#34A853" />
                <path d="M9.9 12.6c-.1-.3-.1-.6-.1-.9 0-.3 0-.6.1-.9V9.8H8.6c-.5 1-1 2.2-1 3.2 0 1.1.5 2.2 1 3.2l1.3-1z" fill="#FBBC04" />
                <path d="M11.9 9.5c.6 0 1.1.2 1.5.6l1.1-1.1C13.8 8.4 12.9 8 11.9 8c-1.4 0-2.7.8-3.3 2.1l1.3 1c.3-.9 1.1-1.6 2-1.6z" fill="#EA4335" />
                <path d="M18.8 10.7v4.6h-.8v-4.6h.8zm3.3 3.4c-.2.4-.7.6-1.2.6-.9 0-1.6-.7-1.6-1.7 0-1 .7-1.7 1.6-1.7.5 0 1 .2 1.2.6v-.5c0-.6-.5-1-1.2-1-.5 0-.9.2-1.2.5l-.5-.5c.4-.4 1-.7 1.7-.7 1.2 0 2 .7 2 1.7v2.7h-.8v-.5zm-.8-.2c.5 0 .8-.3.8-.8 0-.5-.4-.8-.8-.8s-.8.3-.8.8c0 .5.3.8.8.8zm4.8.8l-1.8-4.5h.9l1.3 3.5 1.3-3.5h.9l-2.7 6.4h-.9l1-1.9z" fill="#5F6368" />
              </svg>
            </span>

            {/* Mastercard */}
            <span className="inline-flex h-[24px]">
              <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 38 24" width="38" height="24">
                <rect width="38" height="24" rx="3" fill="#141414" />
                <circle cx="15" cy="12" r="7" fill="#EB001B" />
                <circle cx="23" cy="12" r="7" fill="#F79E1B" />
                <path d="M19 6.8c1.7 1.3 2.8 3.3 2.8 5.2s-1.1 3.9-2.8 5.2c-1.7-1.3-2.8-3.3-2.8-5.2s1.1-3.9 2.8-5.2z" fill="#FF5F00" />
              </svg>
            </span>

            {/* PayPal */}
            <span className="inline-flex h-[24px]">
              <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 38 24" width="38" height="24">
                <rect width="38" height="24" rx="3" fill="#003087" />
                <path d="M14.8 6.5h3.6c2.2 0 3.7 1.1 3.4 3.2-.3 2.3-2 3.7-4.1 3.7h-1.4l-.8 4.6h-2.1l1.4-11.5z" fill="#0079C1" />
                <path d="M16.4 8.7h3.3c1.7 0 2.9.8 2.6 2.5-.3 1.9-1.6 3-3.3 3h-1.1l-.8 4.6h-1.8l1.1-10.1z" fill="#00457C" />
                <path d="M14.7 10.3h1.8c1.3 0 2.2.6 2 1.9-.2 1.4-1.2 2.3-2.5 2.3h-.9l-.6 3.5h-1.4l1.6-7.7z" fill="#0079C1" opacity="0.9" />
              </svg>
            </span>

            {/* Shop Pay */}
            <span className="inline-flex h-[24px]">
              <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 38 24" width="38" height="24">
                <rect width="38" height="24" rx="3" fill="#5A31F4" />
                <path d="M12.5 14.5c.3.3.7.5 1.2.5.6 0 1-.3 1-.7 0-.5-.4-.7-1.1-.9-.9-.3-1.6-.7-1.6-1.6 0-1 .8-1.7 1.9-1.7.6 0 1.1.2 1.5.5l-.4.8c-.3-.2-.7-.4-1.1-.4-.6 0-.9.3-.9.7 0 .4.4.6 1 .8 1 .3 1.7.7 1.7 1.7 0 1.1-.8 1.7-2 1.7-.7 0-1.3-.2-1.7-.6l.4-.9zm5.3-5.2h1v3.2c.2-.3.6-.5 1-.5.9 0 1.5.7 1.5 1.8 0 1.1-.6 1.8-1.5 1.8-.4 0-.8-.2-1-.5v1.9h-1V9.3zm2.5 4.5c0-.6-.3-1-.8-1s-.8.4-.8 1c0 .6.3 1 .8 1s.8-.4.8-1zm3.8-2.6c1.1 0 1.9.8 1.9 1.9s-.8 1.9-1.9 1.9-1.9-.8-1.9-1.9.8-1.9 1.9-1.9zm0 2.9c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm4.2-2.8h1v.5c.2-.3.6-.6 1-.6.9 0 1.5.7 1.5 1.8 0 1.1-.6 1.8-1.5 1.8-.4 0-.8-.2-1-.5v1.9h-1v-4.9zm2.5 2.5c0-.6-.3-1-.8-1s-.8.4-.8 1c0 .6.3 1 .8 1s.8-.4.8-1z" fill="#fff" />
              </svg>
            </span>

            {/* UnionPay */}
            <span className="inline-flex h-[24px]">
              <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 38 24" width="38" height="24">
                <rect width="38" height="24" rx="3" fill="#fff" stroke="#e0e0e0" strokeWidth="0.5" />
                <path d="M12.5 5.5h4.6c2.5 0 3.7 1.5 3.3 4.2-.5 3.1-2.5 5.8-6.1 5.8H10l2.5-10z" fill="#D62027" />
                <path d="M16.5 5.5h4.6c2.5 0 3.7 1.5 3.3 4.2-.5 3.1-2.5 5.8-6.1 5.8H14l2.5-10z" fill="#00659E" />
                <path d="M20.5 5.5h4.6c2.5 0 3.7 1.5 3.3 4.2-.5 3.1-2.5 5.8-6.1 5.8H18l2.5-10z" fill="#008375" />
              </svg>
            </span>

            {/* Visa */}
            <span className="inline-flex h-[24px]">
              <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 38 24" width="38" height="24">
                <rect width="38" height="24" rx="3" fill="#1434CB" />
                <path d="M14.5 15.5l1.6-8h2.5l-1.6 8h-2.5zm7.3-7.8c-.5-.2-1.3-.4-2.2-.4-2.4 0-4.1 1.3-4.1 3.1 0 1.4 1.2 2.1 2.2 2.6 1 .5 1.3.8 1.3 1.2 0 .7-.8 1-1.6 1-.9 0-1.4-.2-2.2-.5l-.3-.2-.3 1.9c.5.2 1.5.4 2.5.4 2.6 0 4.3-1.3 4.3-3.2 0-1.1-.6-1.9-2.1-2.6-.9-.5-1.4-.8-1.4-1.3 0-.4.5-.9 1.5-.9.8 0 1.4.2 1.9.4l.2.1.5-1.6zm7.2 5.1l1.1-3-.7 3h-.4zm2.4 2.7h2.2l-1.9-8h-2.1c-.5 0-.9.3-1.1.7l-3.8 7.3h2.6l.5-1.4h3.2l.4 1.4zm-14.8-8l-2.4 5.5-.3-1.4c-.4-1.5-1.7-3.1-3.2-3.9l2.1 7.8h2.6l3.9-8h-2.7z" fill="#fff" />
              </svg>
            </span>

            {/* Afterpay */}
            <span className="inline-flex h-[24px]">
              <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 38 24" width="38" height="24">
                <rect width="38" height="24" rx="3" fill="#B2FCE4" />
                <path d="M27.4 6.8l-2.7-1.6-2.7-1.6c-1.8-1-4.1.3-4.1 2.4v.4c0 .2.1.4.3.5l1.3.7c.4.2.8-.1.8-.5v-.8c0-.4.4-.7.8-.5l2.5 1.4 2.4 1.5c.4.2.4.7 0 .9l-2.5 1.4-2.5 1.6c-.4.2-.8-.1-.8-.5v-.4c0-2.1-2.3-3.4-4.1-2.4l-2.7 1.6-2.7 1.6c-1.8 1-1.8 3.7 0 4.7l2.7 1.6 2.7 1.6c1.8 1 4.1-.3 4.1-2.4v-.4c0-.2-.1-.4-.3-.5l-1.3-.7c-.4-.2-.8.1-.8.5v.8c0 .4-.4.7-.8.5l-2.5-1.4-2.5-1.5c-.4-.2-.4-.7 0-.9l2.5-1.4 2.5-1.4c.4-.2.8.1.8.5v.4c0 2.1 2.3 3.4 4.1 2.4l2.7-1.6 2.7-1.6c1.9-1.2 1.9-3.8.1-4.9z" fill="#000" />
              </svg>
            </span>

            {/* Zip */}
            <span className="inline-flex h-[24px]">
              <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 38 24" width="38" height="24">
                <rect width="38" height="24" rx="3" fill="#fff" stroke="#e0e0e0" strokeWidth="0.5" />
                <path d="M7 15l.2 2h7.8l-.2-2.2H11v-.2l3.4-2.4-.2-2H6.2l.3 2.1H10v.3z" fill="#1a0826" />
                <path d="M15 10.2l.9 6.8h7.9l-.8-6.8z" fill="#AA8FFF" />
                <path d="M32 12.5c-.2-1.5-1.4-2.4-3-2.4h-5.3l.8 6.8h2.4l-.2-1.3h2.5c2.1-.1 3-1.3 2.8-3.1zm-3 1.1h-2.5l-.2-1.6h2.5c.6 0 .9.3.9.8 0 .2 0 .8-.7.8z" fill="#1a0826" />
                <ellipse cx="16.5" cy="8.4" rx="1.1" ry="1.3" transform="rotate(-45 16.5 8.4)" fill="#1a0826" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* Floating Scroll-to-Top Button (shown on scroll) */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-20 right-6 z-40 w-11 h-11 rounded-full bg-[#7a7a7a] hover:bg-[#606060] text-white flex items-center justify-center shadow-lg transition-all duration-300 transform ${
          showScrollTop ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* Floating Chat / Support Widget Button */}
      <button
        onClick={() => {
          if (typeof window !== "undefined") {
            window.location.href = "mailto:info@d1store.com.au";
          }
        }}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#007aff] hover:bg-[#0066d6] text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-105"
        aria-label="Live Chat Support"
      >
        <MessageSquare className="w-6 h-6 fill-white text-[#007aff]" />
      </button>
    </footer>
  );
}
