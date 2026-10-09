"use client";

import React from "react";
import Link from "next/link";
import { User, LogOut } from "lucide-react";

interface ContactSectionProps {
  email: string;
  onChangeEmail: (email: string) => void;
  subscribeNews: boolean;
  onChangeSubscribeNews: (checked: boolean) => void;
  error?: string;
  userEmail?: string | null;
  onSignOut?: () => void;
}

export default function ContactSection({
  email,
  onChangeEmail,
  subscribeNews,
  onChangeSubscribeNews,
  error,
  userEmail,
  onSignOut,
}: ContactSectionProps) {
  return (
    <section className="space-y-3.5" aria-labelledby="contact-heading">
      <div className="flex items-center justify-between">
        <h2 id="contact-heading" className="text-xl sm:text-[22px] font-bold text-gray-900">
          Contact
        </h2>
        {userEmail ? (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 hidden sm:inline">Signed in as</span>
            <span className="font-semibold text-gray-900 truncate max-w-[180px] sm:max-w-none">{userEmail}</span>
            {onSignOut && (
              <button
                type="button"
                onClick={onSignOut}
                className="text-[#0071e3] hover:underline font-semibold ml-1 cursor-pointer"
              >
                Log out
              </button>
            )}
          </div>
        ) : (
          <div className="text-sm">
            <span className="text-gray-500 mr-1.5">Have an account?</span>
            <Link
              href="/login?redirect=/checkout"
              className="text-[#0071e3] font-semibold hover:underline"
            >
              Log in
            </Link>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="checkout-email" className="sr-only">
          Email address
        </label>
        <input
          id="checkout-email"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => onChangeEmail(e.target.value)}
          placeholder="Email address"
          className={`w-full h-12 px-4 rounded-lg border text-[15px] font-normal text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 transition-all ${
            error
              ? "border-red-500 ring-2 ring-red-500/10 focus:border-red-500"
              : "border-gray-300 focus:border-[#0071e3]"
          }`}
          aria-invalid={!!error}
          aria-describedby={error ? "email-error" : undefined}
          required
        />
        {error && (
          <p id="email-error" className="text-sm text-red-600 mt-1.5 font-medium">
            {error}
          </p>
        )}
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-700 select-none">
          <input
            type="checkbox"
            checked={subscribeNews}
            onChange={(e) => onChangeSubscribeNews(e.target.checked)}
            className="w-4.5 h-4.5 rounded border-gray-300 text-[#0071e3] focus:ring-[#0071e3] focus:ring-offset-0 cursor-pointer"
          />
          <span>Email me with news and exclusive DJI offers</span>
        </label>
      </div>
    </section>
  );
}
