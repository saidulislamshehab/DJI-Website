import React from "react";
import FooterColumn from "./FooterColumn";
import { footerNavigation } from "@/data/footer";

export default function FooterNavigation() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-10 lg:gap-14 mb-8 lg:mb-10 w-full">
      {footerNavigation.map((col) => (
        <FooterColumn key={col.id} title={col.title} links={col.links} />
      ))}
    </div>
  );
}
