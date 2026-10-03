"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { FooterLink } from "@/data/footer";

interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}

export default function FooterColumn({ title, links }: FooterColumnProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10 md:border-none pb-3 md:pb-0">
      {/* Mobile Accordion Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between max-md:flex hidden py-2.5 text-left"
        aria-expanded={isOpen}
      >
        <h3
          style={{ color: "#ffffff" }}
          className="text-[14px] font-bold text-white tracking-normal m-0"
        >
          {title}
        </h3>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-white" : ""
          }`}
        />
      </button>

      {/* Desktop Heading */}
      <h3
        style={{ color: "#ffffff" }}
        className="block max-md:hidden text-[15px] font-bold text-white mb-4 tracking-normal"
      >
        {title}
      </h3>

      {/* Links List */}
      <ul
        className={`space-y-2.5 list-none p-0 m-0 text-[13px] text-[#d1d5db] ${
          isOpen ? "block pt-2 pb-1" : "block max-md:hidden"
        }`}
      >
        {links.map((link, idx) => (
          <li key={idx}>
            <Link
              href={link.href}
              className="text-[#d1d5db] hover:text-white transition-colors duration-150 block py-0.5"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
