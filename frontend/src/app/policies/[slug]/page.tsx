"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import StorefrontShell from "@/components/layout/StorefrontShell";
import { footerLegalLinks } from "@/data/footer";

const copy: Record<string, { title: string; body: string[] }> = {
  "privacy-policy": {
    title: "Privacy policy",
    body: [
      "This storefront collects the details you submit at checkout, enquiry forms, and account sign-in so we can fulfil orders and reply to support.",
      "We do not sell personal information. Access is limited to staff and processors needed to run payments, shipping, and email.",
      "Contact info@d1store.com.au to request a copy or deletion of personal data we hold, subject to legal record-keeping.",
    ],
  },
  "refund-policy": {
    title: "Refund policy",
    body: [
      "Change-of-mind returns are assessed against unused, complete products in original packaging within a reasonable period after delivery.",
      "Faulty goods are handled under Australian Consumer Law and DJI warranty. Accidental damage is not a standard refund.",
      "Opened software, Care Refresh, and custom enterprise builds may be non-returnable once activated.",
    ],
  },
  "shipping-policy": {
    title: "Shipping policy",
    body: [
      "Orders over $199 typically qualify for free standard shipping within Australia, excluding oversized enterprise freight.",
      "Click & Collect is available at participating stores when stock is on hand.",
      "Tracking is emailed when the order leaves the warehouse. Remote and PO Box delivery can add extra time.",
    ],
  },
  "terms-of-service": {
    title: "Terms of service",
    body: [
      "By placing an order you agree that product availability, pricing, and promotions can change until payment is captured.",
      "Title and risk pass on delivery to the address you provide, or on collection for Click & Collect.",
      "CASA and local flying rules remain your responsibility when operating aircraft purchased here.",
    ],
  },
  "contact-information": {
    title: "Contact information",
    body: [
      "D1 Store — info@d1store.com.au — (03) 9288 7882.",
      "Retail hours for phone support are typically Monday to Friday, 10:00am – 5:00pm AEST.",
      "Store addresses are listed on the Store finder page.",
    ],
  },
  "legal-notice": {
    title: "Legal notice",
    body: [
      "DJI, Osmo, Mavic, Mini, Air, Avata, and related marks belong to their owners. This site is an independent authorised retailer recreation for demonstration and commerce tooling.",
      "Product images may be served from manufacturer or retailer CDNs and remain their property.",
    ],
  },
};

export default function PolicyPage() {
  const params = useParams();
  const slug = (Array.isArray(params.slug) ? params.slug[0] : params.slug) || "";
  const page = copy[slug];

  return (
    <StorefrontShell>
      <section className="bg-[#f5f5f7] border-b border-[#e5e5ea]">
        <div className="page-width py-12 md:py-16">
          <h1 className="text-4xl font-black">{page?.title || "Policy"}</h1>
        </div>
      </section>
      <section className="page-width py-12 grid lg:grid-cols-[1fr_240px] gap-10">
        <article className="max-w-2xl space-y-4 text-sm text-[#444] leading-relaxed">
          {(page?.body || ["This policy page is not available."]).map((p) => (
            <p key={p}>{p}</p>
          ))}
        </article>
        <aside className="space-y-2">
          {footerLegalLinks.map((l) => (
            <Link key={l.href} href={l.href} className="block text-sm text-[#0071e3] hover:underline">
              {l.label}
            </Link>
          ))}
        </aside>
      </section>
    </StorefrontShell>
  );
}
