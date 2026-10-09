"use client";

import React from "react";
import { Home, MessageSquare } from "lucide-react";

export type SupportTab = "home" | "messages";

interface SupportWidgetNavigationProps {
  activeTab: SupportTab;
  onSelectTab: (tab: SupportTab) => void;
  unreadCount?: number;
}

export const SupportWidgetNavigation: React.FC<SupportWidgetNavigationProps> = ({
  activeTab,
  onSelectTab,
  unreadCount = 0,
}) => {
  return (
    <nav
      aria-label="Support widget navigation"
      className="h-16 min-h-[64px] bg-white border-t border-neutral-100 flex items-center justify-around px-4 select-none rounded-b-2xl shadow-[0_-2px_10px_rgba(0,0,0,0.02)]"
    >
      {/* Home Tab */}
      <button
        type="button"
        onClick={() => onSelectTab("home")}
        aria-label="Support Home"
        aria-selected={activeTab === "home"}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors duration-150 focus:outline-none rounded-lg group ${
          activeTab === "home" ? "text-[#2F80F7]" : "text-[#555555] hover:text-[#222222]"
        }`}
      >
        <Home
          className={`w-5 h-5 transition-transform duration-150 group-hover:scale-105 ${
            activeTab === "home" ? "stroke-[2.5]" : "stroke-[2]"
          }`}
        />
        <span
          className={`text-[11px] mt-1 tracking-tight ${
            activeTab === "home" ? "font-semibold" : "font-medium"
          }`}
        >
          Home
        </span>
      </button>

      {/* Messages Tab */}
      <button
        type="button"
        onClick={() => onSelectTab("messages")}
        aria-label="Support Messages"
        aria-selected={activeTab === "messages"}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors duration-150 focus:outline-none rounded-lg group relative ${
          activeTab === "messages" ? "text-[#2F80F7]" : "text-[#555555] hover:text-[#222222]"
        }`}
      >
        <div className="relative">
          <MessageSquare
            className={`w-5 h-5 transition-transform duration-150 group-hover:scale-105 ${
              activeTab === "messages" ? "stroke-[2.5]" : "stroke-[2]"
            }`}
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#2F80F7] text-white text-[10px] font-bold flex items-center justify-center border border-white">
              {unreadCount}
            </span>
          )}
        </div>
        <span
          className={`text-[11px] mt-1 tracking-tight ${
            activeTab === "messages" ? "font-semibold" : "font-medium"
          }`}
        >
          Messages
        </span>
      </button>
    </nav>
  );
};
