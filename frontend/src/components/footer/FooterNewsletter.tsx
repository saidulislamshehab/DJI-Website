"use client";

import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export default function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setEmail("");
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <h2
        style={{ color: "#ffffff" }}
        className="text-3xl sm:text-4xl lg:text-[42px] font-black text-white tracking-[-0.02em] leading-[1.08] m-0"
      >
        Stay in the loop with
        <br />
        exclusive offers.
      </h2>

      {/* Newsletter Signup Form */}
      <form onSubmit={handleSubmit} className="relative max-w-md">
        <div className="flex items-center rounded-full bg-white/5 border border-white/15 focus-within:border-white/40 transition-colors p-1 pl-4">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            placeholder="Enter your email"
            className="w-full bg-transparent text-white text-[13px] placeholder:text-gray-500 focus:outline-hidden"
            disabled={isLoading || isSubmitted}
            aria-label="Email address for newsletter"
          />
          <button
            type="submit"
            disabled={isLoading || isSubmitted}
            className="w-9 h-9 rounded-full bg-white text-black hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0 disabled:opacity-50"
            aria-label="Subscribe to newsletter"
          >
            {isSubmitted ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <ArrowRight className="w-4 h-4 text-black" />
            )}
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-400 mt-1.5 pl-2">{error}</p>
        )}
        {isSubmitted && (
          <p className="text-xs text-green-400 mt-1.5 pl-2">
            Thank you for subscribing!
          </p>
        )}
      </form>
    </div>
  );
}
