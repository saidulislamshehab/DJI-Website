"use client";

import React, { useState } from "react";
import { ArrowLeft, X, MessageSquare, Send, Loader2, ChevronRight, Check } from "lucide-react";
import { ISupportTicket } from "@/types";
import { addSupportReplyApi } from "@/lib/api";

interface SupportMessagesViewProps {
  tickets: ISupportTicket[];
  onBack: () => void;
  onClose: () => void;
  onStartNewConversation: () => void;
  onTicketUpdated: (ticket: ISupportTicket) => void;
}

export const SupportMessagesView: React.FC<SupportMessagesViewProps> = ({
  tickets,
  onBack,
  onClose,
  onStartNewConversation,
  onTicketUpdated,
}) => {
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);

  const activeTicket = tickets.find(
    (t) => t.ticketNumber === activeTicketId || t._id === activeTicketId
  );

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    setIsSendingReply(true);
    try {
      const res = await addSupportReplyApi(
        activeTicket.ticketNumber || activeTicket._id || "",
        replyText.trim(),
        activeTicket.name
      );

      if (res.success && res.ticket) {
        onTicketUpdated(res.ticket);
        setReplyText("");
      }
    } catch (err) {
      console.error("Failed to send reply:", err);
    } finally {
      setIsSendingReply(false);
    }
  };

  const formatMessageTime = (dateStr?: string | Date) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const formatDateLabel = (dateStr?: string | Date) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      return d.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden select-text">
      {/* 1. Blue Header Matching Screenshot State C */}
      <div className="bg-[#2F80F7] px-4 py-3.5 text-white flex items-center justify-between select-none shrink-0 shadow-sm">
        {/* Back Arrow on the Left */}
        <button
          type="button"
          onClick={activeTicket ? () => setActiveTicketId(null) : onBack}
          aria-label="Back"
          className="w-7 h-7 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors focus:outline-none cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Title "Messages" */}
        <h2 className="text-base font-bold tracking-tight text-white">
          {activeTicket ? activeTicket.ticketNumber : "Messages"}
        </h2>

        {/* Close Icon on the Right */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close widget"
          className="w-7 h-7 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors focus:outline-none cursor-pointer"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* 2. Main Content Area */}
      {activeTicket ? (
        /* Conversation Thread View */
        <div className="flex-1 flex flex-col overflow-hidden bg-neutral-50/50">
          {/* Thread Header Info */}
          <div className="px-4 py-2.5 bg-white border-b border-neutral-100 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-[#222222]">Subject: </span>
              <span className="text-[#555555]">{activeTicket.subject || "Support Enquiry"}</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                activeTicket.status === "resolved"
                  ? "bg-emerald-100 text-emerald-700"
                  : activeTicket.status === "in-progress"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {activeTicket.status}
            </span>
          </div>

          {/* Messages List */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
            {activeTicket.messages?.map((msg, idx) => {
              const isCustomer = msg.sender === "customer";
              return (
                <div
                  key={msg._id || idx}
                  className={`flex flex-col max-w-[85%] ${
                    isCustomer ? "self-end items-end" : "self-start items-start"
                  }`}
                >
                  <span className="text-[10px] text-neutral-400 mb-0.5 px-1">
                    {msg.senderName} • {formatMessageTime(msg.createdAt)}
                  </span>
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      isCustomer
                        ? "bg-[#2F80F7] text-white rounded-br-none"
                        : "bg-white text-[#222222] border border-neutral-100 rounded-bl-none"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reply Input Bar */}
          <form
            onSubmit={handleSendReply}
            className="p-3 bg-white border-t border-neutral-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply..."
              disabled={isSendingReply}
              className="flex-1 h-9 px-3 rounded-lg border border-neutral-200 text-xs text-[#222222] placeholder:text-neutral-400 focus:outline-none focus:border-[#2F80F7] focus:ring-1 focus:ring-[#2F80F7]"
            />
            <button
              type="submit"
              disabled={isSendingReply || !replyText.trim()}
              aria-label="Send reply"
              className="w-9 h-9 rounded-lg bg-[#2F80F7] text-white flex items-center justify-center hover:bg-[#256cd1] disabled:opacity-40 transition-colors shrink-0"
            >
              {isSendingReply ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Conversation List or Empty State */
        <div className="flex-1 p-4 overflow-y-auto flex flex-col">
          {/* "Recent" Label Near Top of Content */}
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#555555] mb-2 select-none">
            Recent
          </div>

          {tickets.length === 0 ? (
            /* Centered Empty State: "No recent conversations" */
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10 px-4">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-2">
                <MessageSquare className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="text-sm font-semibold text-[#222222]">
                No recent conversations
              </h3>
              <p className="text-xs text-[#555555] mt-1 max-w-[220px] leading-relaxed">
                Send us a message from the Home tab and our team will get right back to you.
              </p>
              <button
                type="button"
                onClick={onStartNewConversation}
                className="mt-4 px-4 py-2 rounded-lg bg-[#2F80F7] hover:bg-[#256cd1] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Send a message
              </button>
            </div>
          ) : (
            /* Real Recent Conversations List */
            <div className="flex flex-col gap-2">
              {tickets.map((t) => {
                const latestMsg =
                  t.messages && t.messages.length > 0
                    ? t.messages[t.messages.length - 1]
                    : null;

                return (
                  <button
                    key={t.ticketNumber || t._id}
                    type="button"
                    onClick={() => setActiveTicketId(t.ticketNumber || t._id || "")}
                    className="p-3.5 rounded-xl border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50/70 transition-all text-left flex items-start justify-between gap-3 group cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-[#222222] truncate">
                          {t.ticketNumber}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          {formatDateLabel(t.updatedAt || t.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-[#555555] line-clamp-1 mt-1 font-normal">
                        {latestMsg?.message || t.subject || "Enquiry details"}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          t.status === "open" ? "bg-amber-400" : "bg-emerald-400"
                        }`}
                      />
                      <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 transition-colors" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
