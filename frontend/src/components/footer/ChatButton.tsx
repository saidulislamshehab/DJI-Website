"use client";

import React, { useState } from "react";
import { MessageSquare, X } from "lucide-react";

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#1b64da] hover:bg-[#1655be] text-white flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-105"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <MessageSquare className="w-6 h-6 fill-white text-[#1b64da]" />
        )}
      </button>

      {/* Lightweight Chat Drawer / Placeholder Dialog */}
      {isOpen && (
        <div className="fixed bottom-22 right-6 z-50 w-[340px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="bg-[#1b64da] text-white p-4 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm m-0 text-white">D1 Store Live Support</h4>
              <p className="text-xs text-blue-100 m-0 mt-0.5">We typically reply in a few minutes</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1"
              aria-label="Close chat window"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 space-y-3 bg-[#f8f9fa] min-h-[160px] flex flex-col justify-center text-center">
            <p className="text-xs text-gray-600 m-0">
              Need help choosing the right drone or camera gear? Connect with our Melbourne experts.
            </p>
            <a
              href="mailto:info@d1store.com.au"
              className="inline-block py-2 px-4 bg-[#1b64da] hover:bg-[#1655be] text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Start Conversation
            </a>
            <p className="text-[11px] text-gray-400 m-0">
              Mon – Fri: 9:00 AM – 5:00 PM AEST
            </p>
          </div>
        </div>
      )}
    </>
  );
}
