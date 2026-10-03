import React from "react";

export default function FooterTrustBadges() {
  return (
    <div className="flex items-center gap-4 pt-2">
      {/* CASA Know Your Drone Safety Advocate Badge */}
      <a
        href="https://www.casa.gov.au/knowyourdrone"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block transition-opacity hover:opacity-90 flex-shrink-0"
        aria-label="CASA Know Your Drone Safety Advocate"
      >
        <img
          src="//www.d1store.com.au/cdn/shop/t/22/assets/know-your-drone-safety-advocate.png?v=77025774920087098691788220865"
          alt="CASA Know Your Drone Safety Advocate"
          className="h-[46px] sm:h-[50px] w-auto object-contain rounded"
          width={150}
          height={50}
          loading="lazy"
        />
      </a>

      {/* Trustpilot 5-Star Rating Badge */}
      <a
        href="https://au.trustpilot.com/review/d1store.com.au"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block transition-opacity hover:opacity-90 flex-shrink-0"
        aria-label="D1 Store on Trustpilot"
      >
        <img
          src="https://cdn.d1store.app/shopify/trust/trustpilot-rating.png"
          alt="D1 Store on Trustpilot"
          className="h-[46px] sm:h-[50px] w-auto object-contain rounded"
          width={140}
          height={50}
          loading="lazy"
        />
      </a>
    </div>
  );
}
