import React from "react";
import { footerContact } from "@/data/footer";

export default function FooterContact() {
  return (
    <div className="space-y-1.5 text-[13px] pt-1">
      <p className="m-0 leading-relaxed">
        <a
          href={footerContact.phoneTel}
          className="text-white hover:underline font-normal transition-colors"
        >
          {footerContact.phone}
        </a>
      </p>
      <p className="m-0 leading-relaxed">
        <a
          href={footerContact.emailMailto}
          className="text-white hover:underline font-normal transition-colors"
        >
          {footerContact.email}
        </a>
      </p>
      <p className="m-0 leading-relaxed text-[#9ca3af]">
        {footerContact.hours}
      </p>
    </div>
  );
}
