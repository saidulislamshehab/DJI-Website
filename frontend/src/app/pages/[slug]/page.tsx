"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import StorefrontShell from "@/components/layout/StorefrontShell";
import EnquiryForm from "@/components/pages/EnquiryForm";
import { storeLocations } from "@/data/stores";
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Wrench,
  Building2,
  Sparkles,
  Clock,
  CheckCircle2,
  Store,
  Headphones,
  Truck,
} from "lucide-react";

function Hero({
  kicker,
  title,
  subtitle,
}: {
  kicker?: string;
  title: string;
  subtitle: string;
}) {
  return (
    <section className="bg-[#f5f5f7] border-b border-[#e5e5ea]">
      <div className="page-width py-12 md:py-16 max-w-4xl">
        {kicker && (
          <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-[#0071e3] mb-3">{kicker}</p>
        )}
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#121212]">{title}</h1>
        <p className="mt-4 text-base md:text-lg text-[#6e6e73] leading-relaxed">{subtitle}</p>
      </div>
    </section>
  );
}

function StoreGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {storeLocations.map((s) => (
        <article key={s.name} className="rounded-2xl border border-[#e5e5ea] p-5 bg-white">
          <h3 className="font-bold text-[16px]">{s.name}</h3>
          <p className="mt-2 text-sm text-[#6e6e73] flex gap-2">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
            {s.address}
          </p>
          <a href={s.phoneTel} className="mt-2 text-sm text-[#0071e3] flex gap-2 hover:underline">
            <Phone className="w-4 h-4 mt-0.5 shrink-0" />
            {s.phone}
          </a>
          <a href={`mailto:${s.email}`} className="mt-1 text-sm text-[#6e6e73] flex gap-2 hover:text-[#0071e3]">
            <Mail className="w-4 h-4 mt-0.5 shrink-0" />
            {s.email}
          </a>
        </article>
      ))}
    </div>
  );
}

function FourUp({
  items,
}: {
  items: { n: string; title: string; body: string; icon: React.ReactNode }[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div key={item.n} className="rounded-2xl bg-[#f5f5f7] p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold text-[#8e8e93]">{item.n}</span>
            <span className="text-[#0071e3]">{item.icon}</span>
          </div>
          <h3 className="font-bold text-lg mb-2">{item.title}</h3>
          <p className="text-sm text-[#6e6e73] leading-relaxed">{item.body}</p>
        </div>
      ))}
    </div>
  );
}

export default function StaticPage() {
  const params = useParams();
  const slug = (Array.isArray(params.slug) ? params.slug[0] : params.slug) || "";

  return (
    <StorefrontShell>
      {renderPage(slug)}
    </StorefrontShell>
  );
}

function renderPage(slug: string) {
  switch (slug) {
    case "about-us":
      return (
        <>
          <Hero
            kicker="About D1"
            title="Australia's home of DJI."
            subtitle="D1 Store is a nationwide authorised DJI retailer with physical stores, enterprise consultancy, and certified repair. We stay with customers after the unboxing — from first flights to industrial workflows."
          />
          <section className="page-width py-14 space-y-12">
            <FourUp
              items={[
                { n: "01", title: "Authorised retail", body: "Premium stores where you can try gear and talk with DJI-trained specialists.", icon: <Store className="w-5 h-5" /> },
                { n: "02", title: "Certified service", body: "Factory-grade maintenance with genuine parts and local turnaround.", icon: <Wrench className="w-5 h-5" /> },
                { n: "03", title: "Enterprise solutions", body: "Fleet, payloads, docks, and training for mining, agriculture, and public safety.", icon: <Building2 className="w-5 h-5" /> },
                { n: "04", title: "Local R&D", body: "Accessories and workflows engineered for Australian conditions.", icon: <Sparkles className="w-5 h-5" /> },
              ]}
            />
            <div>
              <h2 className="text-2xl font-black mb-6">Visit a store</h2>
              <StoreGrid />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-[#e5e5ea] p-6">
                <h3 className="font-bold text-lg mb-2">Enterprise consultancy</h3>
                <p className="text-sm text-[#6e6e73] leading-relaxed">
                  High-level fleet work across mining, agriculture, and public safety — including dock deployments and software integrations.
                </p>
                <Link href="/pages/enterprise" className="inline-block mt-4 text-sm font-semibold text-[#0071e3]">
                  Talk to enterprise →
                </Link>
              </div>
              <div className="rounded-2xl border border-[#e5e5ea] p-6">
                <h3 className="font-bold text-lg mb-2">Pro cinematography</h3>
                <p className="text-sm text-[#6e6e73] leading-relaxed">
                  Support for film crews, broadcasters, and creators, plus Hasselblad sales and technical help.
                </p>
                <Link href="/collections/hasselblad" className="inline-block mt-4 text-sm font-semibold text-[#0071e3]">
                  Shop Hasselblad →
                </Link>
              </div>
            </div>
          </section>
        </>
      );
    case "contact":
      return (
        <>
          <Hero
            kicker="Contact"
            title="We're here to help."
            subtitle="Phones are monitored Monday to Friday, 10:00am – 5:00pm AEST. We aim to reply to email within 24–48 business hours."
          />
          <section className="page-width py-14 grid lg:grid-cols-2 gap-10">
            <div className="grid sm:grid-cols-2 gap-4 content-start">
              {[
                { t: "Retail sales", d: "(03) 9288 7882 · sales@d1store.com.au" },
                { t: "Technical support", d: "1300 090 802 · support@d1store.com.au" },
                { t: "General enquiries", d: "(03) 9288 7800 · info@d1store.com.au" },
                { t: "Enterprise", d: "(03) 9288 7859 · enterprise@d1store.com.au" },
                { t: "Repairs", d: "(03) 9288 7880 · repairservices@d1store.com.au" },
                { t: "Online orders", d: "(03) 9288 7854 · onlineorder@d1store.com.au" },
              ].map((c) => (
                <div key={c.t} className="rounded-2xl bg-[#f5f5f7] p-5">
                  <h3 className="font-bold">{c.t}</h3>
                  <p className="text-sm text-[#6e6e73] mt-1">{c.d}</p>
                </div>
              ))}
            </div>
            <EnquiryForm defaultTopic="Retail sales" />
          </section>
        </>
      );
    case "support":
      return (
        <>
          <Hero
            kicker="Support"
            title="Product support from D1."
            subtitle="Guides, Care Refresh, authorised repairs, and a local Australian team — support that continues after you leave the store."
          />
          <section className="page-width py-14 space-y-10">
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { href: "/pages/care-refresh-activation", title: "Care Refresh", body: "Activate coverage for accidents and water damage." },
                { href: "/pages/repairs", title: "Authorised repairs", body: "Certified techs, genuine parts, assessment-first quotes." },
                { href: "/blogs/news", title: "Guides", body: "Tutorials and setup notes from the D1 team." },
                { href: "/pages/warranty", title: "Warranty", body: "Australian DJI warranty on genuine D1 purchases." },
              ].map((c) => (
                <Link key={c.href} href={c.href} className="rounded-2xl border border-[#e5e5ea] p-5 hover:border-[#0071e3] transition-colors">
                  <h3 className="font-bold mb-1">{c.title}</h3>
                  <p className="text-sm text-[#6e6e73]">{c.body}</p>
                </Link>
              ))}
            </div>
            <div className="max-w-2xl space-y-4">
              <h2 className="text-2xl font-black">Common questions</h2>
              <p className="text-sm text-[#6e6e73] leading-relaxed">
                Shipping updates go out by email with tracking. Activate Care Refresh within 48 hours of product activation, or use the Beyond 48 Hours form. Book repairs from the Repairs page. Grey imports typically do not include Australian DJI warranty.
              </p>
            </div>
            <EnquiryForm defaultTopic="Technical support" />
          </section>
        </>
      );
    case "repairs":
      return (
        <>
          <Hero
            kicker="Repairs"
            title="DJI-certified repair in Australia."
            subtitle="Drop off in store or ship to our authorised centre. Assessment first — you approve the quote before work starts."
          />
          <section className="page-width py-14 grid lg:grid-cols-2 gap-10">
            <div className="space-y-4 text-sm text-[#6e6e73] leading-relaxed">
              <p>Use genuine parts where required. Typical work includes crash damage, gimbal issues, water damage, and preventative maintenance.</p>
              <ul className="space-y-2">
                {["Free assessment (no obligation)", "90-day workmanship warranty on completed repairs", "In-store drop-off at most locations", "Care Refresh swap support where eligible"].map((t) => (
                  <li key={t} className="flex gap-2 text-[#121212]">
                    <CheckCircle2 className="w-4 h-4 text-[#0071e3] mt-0.5 shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <EnquiryForm defaultTopic="Repair" submitLabel="Submit repair request" />
          </section>
        </>
      );
    case "enterprise":
      return (
        <>
          <Hero
            kicker="Enterprise"
            title="Industrial drone programs, locally supported."
            subtitle="Fleet planning, payloads, docks, agriculture, and training for organisations that need more than a retail box."
          />
          <section className="page-width py-14 grid lg:grid-cols-2 gap-10">
            <div className="space-y-4 text-sm text-[#6e6e73] leading-relaxed">
              <p>We work with mining, agriculture, construction, and public safety teams on Matrice, Dock, AGRAS, and payload stacks.</p>
              <Link href="/collections/enterprise-agriculture" className="inline-flex text-sm font-semibold text-[#0071e3]">
                Browse enterprise products →
              </Link>
            </div>
            <EnquiryForm defaultTopic="Enterprise / commercial" submitLabel="Request a consultation" />
          </section>
        </>
      );
    case "get-quote":
      return (
        <>
          <Hero kicker="Get a quote" title="Pricing for bundles, fleets, and education." subtitle="Tell us the models, quantities, and timeline. We respond during business hours." />
          <section className="page-width py-14 max-w-2xl">
            <EnquiryForm defaultTopic="Quote request" submitLabel="Request quote" />
          </section>
        </>
      );
    case "price-match":
      return (
        <>
          <Hero
            kicker="Price match"
            title="We'll beat qualifying authorised prices."
            subtitle="Same genuine SKU, in-stock at another authorised Australian retailer? Send the details. Grey imports, marketplace listings, and one-off promo stacks usually do not qualify."
          />
          <section className="page-width py-14 space-y-10">
            <FourUp
              items={[
                { n: "01", title: "Pick the product", body: "Exact model and pack (combo vs fly more).", icon: <CheckCircle2 className="w-5 h-5" /> },
                { n: "02", title: "Check the offer", body: "Authorised AU retailer, in stock, public price.", icon: <ShieldCheck className="w-5 h-5" /> },
                { n: "03", title: "Send proof", body: "Link or written quote we can verify.", icon: <Headphones className="w-5 h-5" /> },
                { n: "04", title: "We confirm", body: "If it qualifies, we complete the sale at the matched price.", icon: <Sparkles className="w-5 h-5" /> },
              ]}
            />
            <div className="max-w-2xl">
              <EnquiryForm defaultTopic="Price match" submitLabel="Submit price match" />
            </div>
          </section>
        </>
      );
    case "stores":
      return (
        <>
          <Hero
            kicker="Stores"
            title="Visit a D1 Store near you."
            subtitle="Hands-on with current DJI gear, in-store specialists, Click & Collect, and authorised service."
          />
          <section className="page-width py-14 space-y-10">
            <FourUp
              items={[
                { n: "01", title: "Open 7 days", body: "Most stores trade through the weekend. Confirm public-holiday hours before you visit.", icon: <Clock className="w-5 h-5" /> },
                { n: "02", title: "Specialists", body: "In-store teams trained on current DJI product lines.", icon: <Headphones className="w-5 h-5" /> },
                { n: "03", title: "Official services", body: "Care Refresh, repairs, and genuine parts.", icon: <Wrench className="w-5 h-5" /> },
                { n: "04", title: "Click & Collect", body: "Order online and pick up from your nearest store when ready.", icon: <Truck className="w-5 h-5" /> },
              ]}
            />
            <StoreGrid />
          </section>
        </>
      );
    case "trade-in":
      return (
        <>
          <Hero kicker="Trade-in" title="Upgrade with a trade-in." subtitle="Bring eligible DJI gear in-store for an assessment. Values depend on condition, completeness, and current demand." />
          <section className="page-width py-14 max-w-2xl">
            <EnquiryForm defaultTopic="Trade-in" submitLabel="Start trade-in" />
          </section>
        </>
      );
    case "warranty":
      return (
        <>
          <Hero kicker="Warranty" title="Australian warranty on genuine D1 purchases." subtitle="Keep your invoice. Parallel or grey-import units bought elsewhere typically cannot be processed as Australian DJI warranty through us." />
          <section className="page-width py-14 max-w-3xl text-sm text-[#6e6e73] leading-relaxed space-y-4">
            <p>Warranty covers manufacturing defects under DJI’s Australian program for products sold by D1 as an authorised retailer. Accidental damage is a Care Refresh matter, not standard warranty.</p>
            <Link href="/pages/repairs" className="text-[#0071e3] font-semibold">Book a diagnosis →</Link>
          </section>
        </>
      );
    case "careers":
      return (
        <>
          <Hero kicker="Careers" title="Work at D1." subtitle="Retail specialists, technicians, and enterprise roles across our Australian stores." />
          <section className="page-width py-14 max-w-2xl">
            <EnquiryForm defaultTopic="Careers" submitLabel="Send application" />
          </section>
        </>
      );
    case "care-refresh-activation":
      return (
        <>
          <Hero kicker="Care Refresh" title="Activate Care Refresh." subtitle="Most plans need activation shortly after the product is first activated. Have your serial number and order details ready." />
          <section className="page-width py-14 max-w-2xl">
            <EnquiryForm defaultTopic="Other" submitLabel="Request activation help" />
          </section>
        </>
      );
    case "care-refresh-beyond-48-hours":
      return (
        <>
          <Hero kicker="Care Refresh" title="Beyond 48 hours." subtitle="Missed the standard activation window? Send your serial, proof of purchase, and dates — we will confirm what is still possible." />
          <section className="page-width py-14 max-w-2xl">
            <EnquiryForm defaultTopic="Other" submitLabel="Submit late activation request" />
          </section>
        </>
      );
    default:
      return (
        <section className="page-width py-24 text-center">
          <h1 className="text-3xl font-black mb-3">Page not found</h1>
          <p className="text-[#6e6e73] mb-6">That content is not available.</p>
          <Link href="/" className="text-[#0071e3] font-semibold">Back to home</Link>
        </section>
      );
  }
}
