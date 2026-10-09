"use client";

import React, { useEffect, useRef } from "react";
import { ContactSupportForm } from "./ContactSupportForm";
import { SupportMessagesView } from "./SupportMessagesView";
import { SupportWidgetNavigation, SupportTab } from "./SupportWidgetNavigation";
import { ISupportTicket } from "@/types";

interface SupportPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: SupportTab;
  onSelectTab: (tab: SupportTab) => void;
  tickets: ISupportTicket[];
  onTicketCreated: (ticket: ISupportTicket) => void;
  onTicketUpdated: (ticket: ISupportTicket) => void;
}

export const SupportPanel: React.FC<SupportPanelProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  tickets,
  onTicketCreated,
  onTicketUpdated,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-label="D1 Customer Support Chat"
      className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[380px] h-[560px] max-h-[calc(100vh-112px)] bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.18)] border border-neutral-200/80 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 print:hidden"
      style={{
        marginBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {/* Dynamic View: State B (Home / Contact Form) vs State C (Messages) */}
      {activeTab === "home" ? (
        <ContactSupportForm
          onClose={onClose}
          onTicketCreated={onTicketCreated}
          onGoToMessages={() => onSelectTab("messages")}
        />
      ) : (
        <SupportMessagesView
          tickets={tickets}
          onBack={() => onSelectTab("home")}
          onClose={onClose}
          onStartNewConversation={() => onSelectTab("home")}
          onTicketUpdated={onTicketUpdated}
        />
      )}

      {/* Bottom Navigation Bar */}
      <SupportWidgetNavigation
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        unreadCount={tickets.length}
      />
    </div>
  );
};
