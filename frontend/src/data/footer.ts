export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterNavigationGroup {
  id: string;
  title: string;
  links: FooterLink[];
}

export const footerNavigation: FooterNavigationGroup[] = [
  {
    id: "shop",
    title: "Shop",
    links: [
      { label: "Store Finder", href: "/pages/stores" },
      { label: "Trade-In", href: "/pages/trade-in" },
      { label: "Price Match", href: "/pages/price-match" },
      { label: "Get a Quote", href: "/pages/get-quote" },
      { label: "Care Refresh", href: "/pages/care-refresh-activation" },
    ],
  },
  {
    id: "support",
    title: "Support",
    links: [
      { label: "Support", href: "/pages/support" },
      { label: "Repairs", href: "/pages/repairs" },
      { label: "Warranty", href: "/pages/warranty" },
      { label: "Contact", href: "/pages/contact" },
      { label: "Beyond 48 Hours", href: "/pages/care-refresh-beyond-48-hours" },
      { label: "Guides", href: "/blogs/news" },
    ],
  },
  {
    id: "company",
    title: "Company",
    links: [
      { label: "About Us", href: "/pages/about-us" },
      { label: "Careers", href: "/pages/careers" },
    ],
  },
];

export const footerContact = {
  phone: "(03) 9288 7882",
  phoneTel: "tel:0392887882",
  email: "info@d1store.com.au",
  emailMailto: "mailto:info@d1store.com.au",
  hours: "9:00 AM to 5:00 PM Melbourne Time",
};

export const footerSocials = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/d1store",
    icon: "facebook",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/djistoreau/",
    icon: "instagram",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@djistoreau",
    icon: "tiktok",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/c/D1store",
    icon: "youtube",
  },
];

export const footerLegalLinks: FooterLink[] = [
  { label: "Privacy policy", href: "/policies/privacy-policy" },
  { label: "Refund policy", href: "/policies/refund-policy" },
  { label: "Shipping policy", href: "/policies/shipping-policy" },
  { label: "Terms of service", href: "/policies/terms-of-service" },
  { label: "Contact information", href: "/policies/contact-information" },
  { label: "Legal notice", href: "/policies/legal-notice" },
];

export const footerBrand = {
  logoSrc: "//www.d1store.com.au/cdn/shop/files/DJI_ARS_WHT.png?v=1783662459&width=240",
  alt: "DJI Authorised Retail Store",
  tagline: "Australia's First and Only DJI Authorised Retail Store.",
};
