"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp, MessageSquare, X } from "lucide-react";

interface FloatingLauncherProps {
  isOpen: boolean;
  onToggleChat: () => void;
  unreadCount?: number;
}

export const FloatingLauncher: React.FC<FloatingLauncherProps> = ({
  isOpen,
  onToggleChat,
  unreadCount = 0,
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show scroll-to-top button once scrolled down 120px
      if (window.scrollY > 120) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-center gap-2.5 sm:gap-3 select-none print:hidden pointer-events-auto"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        paddingRight: "env(safe-area-inset-right, 0px)",
      }}
    >
      {/* 1. White Scroll-To-Top Button */}
      <button
        type="button"
        onClick={handleScrollToTop}
        aria-label="Scroll to top of page"
        title="Scroll to top"
        className="w-[44px] h-[44px] sm:w-[50px] sm:h-[50px] rounded-full bg-white text-neutral-800 shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-neutral-100 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-neutral-50 hover:shadow-[0_6px_20px_rgba(0,0,0,0.16)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F80F7] cursor-pointer"
      >
        <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.25] text-neutral-800" />
      </button>

      {/* 2. Blue Floating Support Chat Launcher */}
      <button
        type="button"
        onClick={onToggleChat}
        aria-label={isOpen ? "Close customer support" : "Open customer support chat"}
        aria-expanded={isOpen}
        title={isOpen ? "Close chat" : "Chat with D1 Support"}
        className="w-[44px] h-[44px] sm:w-[50px] sm:h-[50px] rounded-full bg-[#2F80F7] text-white shadow-[0_6px_22px_rgba(47,128,247,0.38)] flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-[#256cd1] hover:shadow-[0_8px_26px_rgba(47,128,247,0.48)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2F80F7] cursor-pointer relative"
      >
        {isOpen ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.25] text-white transition-transform duration-200" />
        ) : (
          <MessageSquare className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2.2] text-white transition-transform duration-200" />
        )}

        {/* Unread Message Pill Badge */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};
