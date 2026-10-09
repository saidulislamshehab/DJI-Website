"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FloatingLauncher } from "./FloatingLauncher";
import { SupportPanel } from "./SupportPanel";
import { SupportTab } from "./SupportWidgetNavigation";
import { ISupportTicket } from "@/types";
import { fetchSupportTicketsApi } from "@/lib/api";

const GUEST_TICKETS_KEY = "d1_support_guest_tickets";

export const SupportWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SupportTab>("home");
  const [tickets, setTickets] = useState<ISupportTicket[]>([]);

  // Load saved guest tickets or user tickets from localStorage and backend
  const loadTickets = useCallback(async () => {
    try {
      const stored = localStorage.getItem(GUEST_TICKETS_KEY);
      let localTicketNumbers: string[] = [];
      if (stored) {
        try {
          localTicketNumbers = JSON.parse(stored);
        } catch {
          localTicketNumbers = [];
        }
      }

      // Check if user is logged in
      const storedUser = localStorage.getItem("d1_user");
      let userEmail: string | undefined = undefined;
      if (storedUser) {
        try {
          userEmail = JSON.parse(storedUser)?.email;
        } catch {
          userEmail = undefined;
        }
      }

      const fetched = await fetchSupportTicketsApi(userEmail);

      // Merge fetched tickets with any known local tickets
      if (fetched.length > 0) {
        setTickets(fetched);
      } else if (localTicketNumbers.length > 0) {
        // Fallback: try fetching by email if saved
        const guestEmail = localStorage.getItem("d1_support_guest_email");
        if (guestEmail) {
          const guestFetched = await fetchSupportTicketsApi(guestEmail);
          if (guestFetched.length > 0) {
            setTickets(guestFetched);
          }
        }
      }
    } catch (err) {
      console.warn("[SupportWidget] Failed to load conversations:", err);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleTicketCreated = (newTicket: ISupportTicket) => {
    setTickets((prev) => [newTicket, ...prev]);

    // Save ticket number & email to localStorage for guest persistence
    try {
      const stored = localStorage.getItem(GUEST_TICKETS_KEY);
      const list = stored ? JSON.parse(stored) : [];
      if (!list.includes(newTicket.ticketNumber)) {
        list.unshift(newTicket.ticketNumber);
        localStorage.setItem(GUEST_TICKETS_KEY, JSON.stringify(list));
      }
      if (newTicket.email) {
        localStorage.setItem("d1_support_guest_email", newTicket.email);
      }
    } catch {
      // Ignore storage errors
    }
  };

  const handleTicketUpdated = (updatedTicket: ISupportTicket) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.ticketNumber === updatedTicket.ticketNumber || t._id === updatedTicket._id
          ? updatedTicket
          : t
      )
    );
  };

  return (
    <>
      {/* Floating Dual Buttons (Scroll-to-top & Chat launcher) */}
      <FloatingLauncher
        isOpen={isOpen}
        onToggleChat={() => setIsOpen((prev) => !prev)}
        unreadCount={tickets.length}
      />

      {/* Floating Support Modal Panel */}
      <SupportPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        tickets={tickets}
        onTicketCreated={handleTicketCreated}
        onTicketUpdated={handleTicketUpdated}
      />
    </>
  );
};

export default SupportWidget;
