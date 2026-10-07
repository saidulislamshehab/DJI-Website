"use client";

import React, { useState } from "react";
import { toast } from "sonner";

const topics = [
  "Retail sales",
  "Online order",
  "Technical support",
  "Repair",
  "Enterprise / commercial",
  "Price match",
  "Quote request",
  "Trade-in",
  "Careers",
  "Other",
];

export default function EnquiryForm({
  defaultTopic,
  submitLabel = "Send enquiry",
}: {
  defaultTopic?: string;
  submitLabel?: string;
}) {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
    toast.success("Enquiry received. Our team will reply during business hours.");
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-[#e5e5ea] rounded-2xl p-6 md:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block text-sm font-medium">
          First name *
          <input required name="firstName" className="mt-1.5 w-full h-11 px-3 rounded-xl border border-[#e5e5ea] bg-[#fbfbfd] outline-none focus:border-[#0071e3]" />
        </label>
        <label className="block text-sm font-medium">
          Last name *
          <input required name="lastName" className="mt-1.5 w-full h-11 px-3 rounded-xl border border-[#e5e5ea] bg-[#fbfbfd] outline-none focus:border-[#0071e3]" />
        </label>
      </div>
      <label className="block text-sm font-medium">
        Email *
        <input required type="email" name="email" className="mt-1.5 w-full h-11 px-3 rounded-xl border border-[#e5e5ea] bg-[#fbfbfd] outline-none focus:border-[#0071e3]" />
      </label>
      <label className="block text-sm font-medium">
        Phone
        <input name="phone" className="mt-1.5 w-full h-11 px-3 rounded-xl border border-[#e5e5ea] bg-[#fbfbfd] outline-none focus:border-[#0071e3]" />
      </label>
      <label className="block text-sm font-medium">
        Topic
        <select
          name="topic"
          defaultValue={defaultTopic || topics[0]}
          className="mt-1.5 w-full h-11 px-3 rounded-xl border border-[#e5e5ea] bg-[#fbfbfd] outline-none focus:border-[#0071e3]"
        >
          {topics.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium">
        Message *
        <textarea
          required
          name="message"
          rows={5}
          className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-[#e5e5ea] bg-[#fbfbfd] outline-none focus:border-[#0071e3] resize-y"
        />
      </label>
      <button
        type="submit"
        className="w-full sm:w-auto px-8 h-12 rounded-full bg-[#0071e3] text-white font-semibold text-sm hover:bg-[#0058b8] transition-colors"
      >
        {sent ? "Sent — send another" : submitLabel}
      </button>
    </form>
  );
}
