"use client";

import React, { useState } from "react";
import { X, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { createSupportTicketApi } from "@/lib/api";
import { ISupportTicket } from "@/types";

interface ContactSupportFormProps {
  onClose: () => void;
  onTicketCreated: (ticket: ISupportTicket) => void;
  onGoToMessages: () => void;
}

export const ContactSupportForm: React.FC<ContactSupportFormProps> = ({
  onClose,
  onTicketCreated,
  onGoToMessages,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<ISupportTicket | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: { name?: string; email?: string; message?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Please enter your name.";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Please enter your email.";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!message.trim()) {
      newErrors.message = "Please enter your message.";
    } else if (message.trim().length < 4) {
      newErrors.message = "Message must be at least 4 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await createSupportTicketApi({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });

      if (res.success && res.ticket) {
        setSubmittedTicket(res.ticket);
        onTicketCreated(res.ticket);
        // Clear fields
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setApiError(res.message || "Failed to submit enquiry. Please try again.");
      }
    } catch {
      setApiError("Network connection error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-neutral-50/70 select-text">
      {/* 1. Bright Blue Header with Rounded Top Corners */}
      <div className="bg-[#2F80F7] px-6 pt-5 pb-9 text-white relative select-none shrink-0">
        {/* Small Close Button in Upper-Right Corner */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close support chat"
          className="w-7 h-7 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 transition-colors absolute top-3.5 right-3.5 focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Centered, Two-Line Introductory Message */}
        <div className="text-center pt-1 pb-1">
          <h2 className="text-[19px] sm:text-[20px] font-bold tracking-tight text-white leading-tight">
            How can we help?
          </h2>
          <p className="text-white/90 text-[13px] sm:text-[14px] mt-1 leading-snug font-normal max-w-[270px] mx-auto">
            Send us a message and our team will get right back to you.
          </p>
        </div>
      </div>

      {/* 2. White Inner Form Card */}
      <div className="px-4 -mt-5 pb-6 flex-1 flex flex-col">
        <div className="bg-white rounded-xl p-5 shadow-[0_2px_14px_rgba(0,0,0,0.06)] border border-neutral-100 flex-1 flex flex-col justify-between">
          {submittedTicket ? (
            /* Submission Success State */
            <div className="py-6 flex flex-col items-center text-center animate-in fade-in duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-7 h-7 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-[#222222]">Message Received!</h3>
              <p className="text-xs text-[#555555] mt-1.5 leading-relaxed max-w-[260px]">
                Your support ticket{" "}
                <span className="font-semibold text-[#2F80F7]">
                  #{submittedTicket.ticketNumber}
                </span>{" "}
                has been logged. We will respond to your email and in your Messages tab.
              </p>

              <div className="w-full mt-6 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={onGoToMessages}
                  className="w-full h-10 rounded-lg bg-[#2F80F7] hover:bg-[#256cd1] text-white text-xs font-semibold flex items-center justify-center transition-colors shadow-sm"
                >
                  View in Messages
                </button>
                <button
                  type="button"
                  onClick={() => setSubmittedTicket(null)}
                  className="w-full h-10 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-[#222222] text-xs font-medium flex items-center justify-center transition-colors"
                >
                  Send another message
                </button>
              </div>
            </div>
          ) : (
            /* Active Form */
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5 flex-1">
              {/* API Error Notification */}
              {apiError && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                  <span>{apiError}</span>
                </div>
              )}

              {/* Name Input */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="support-form-name"
                  className="text-xs font-semibold text-[#222222] flex items-center justify-between"
                >
                  <span>Name</span>
                  <span className="text-red-500 font-normal">*</span>
                </label>
                <input
                  id="support-form-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  disabled={isSubmitting}
                  placeholder="Your name"
                  className={`w-full h-10 px-3 rounded-lg border text-sm text-[#222222] placeholder:text-neutral-400 bg-white transition-colors focus:outline-none ${
                    errors.name
                      ? "border-red-400 focus:border-red-500 ring-1 ring-red-400"
                      : "border-[#333333]/30 focus:border-[#2F80F7] focus:ring-1 focus:ring-[#2F80F7]"
                  }`}
                />
                {errors.name && (
                  <span className="text-[11px] text-red-600 font-medium">{errors.name}</span>
                )}
              </div>

              {/* Email Input */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="support-form-email"
                  className="text-xs font-semibold text-[#222222] flex items-center justify-between"
                >
                  <span>Email</span>
                  <span className="text-red-500 font-normal">*</span>
                </label>
                <input
                  id="support-form-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  disabled={isSubmitting}
                  placeholder="your.email@example.com"
                  className={`w-full h-10 px-3 rounded-lg border text-sm text-[#222222] placeholder:text-neutral-400 bg-white transition-colors focus:outline-none ${
                    errors.email
                      ? "border-red-400 focus:border-red-500 ring-1 ring-red-400"
                      : "border-[#333333]/30 focus:border-[#2F80F7] focus:ring-1 focus:ring-[#2F80F7]"
                  }`}
                />
                {errors.email && (
                  <span className="text-[11px] text-red-600 font-medium">{errors.email}</span>
                )}
              </div>

              {/* Message Textarea */}
              <div className="flex flex-col gap-1 flex-1">
                <label
                  htmlFor="support-form-message"
                  className="text-xs font-semibold text-[#222222] flex items-center justify-between"
                >
                  <span>Message</span>
                  <span className="text-red-500 font-normal">*</span>
                </label>
                <textarea
                  id="support-form-message"
                  rows={4}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                  }}
                  disabled={isSubmitting}
                  placeholder="How can we help you today?"
                  className={`w-full min-h-[96px] p-3 rounded-lg border text-sm text-[#222222] placeholder:text-neutral-400 bg-white transition-colors focus:outline-none resize-none ${
                    errors.message
                      ? "border-red-400 focus:border-red-500 ring-1 ring-red-400"
                      : "border-[#333333]/30 focus:border-[#2F80F7] focus:ring-1 focus:ring-[#2F80F7]"
                  }`}
                />
                {errors.message && (
                  <span className="text-[11px] text-red-600 font-medium">{errors.message}</span>
                )}
              </div>

              {/* Prominent Blue Submit Button with White Send Icon */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 mt-1 rounded-lg bg-[#2F80F7] hover:bg-[#256cd1] active:scale-[0.99] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(47,128,247,0.28)] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2F80F7]/40"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Sending message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-white stroke-[2.2]" />
                    <span>Send message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
