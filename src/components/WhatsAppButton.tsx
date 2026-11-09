"use client";

import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

/**
 * Floating contact button. Uses NEXT_PUBLIC_WHATSAPP_NUMBER when set; otherwise it
 * falls back to the on-page enquiry form so the button is never dead.
 */
export function WhatsAppButton() {
  const number = siteConfig.contact.whatsappNumber;
  const href = number ? `https://wa.me/${number}?text=${encodeURIComponent("Hello Grand Jackpot, I'd like to make an enquiry.")}` : "#contact";
  const external = Boolean(number);
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={external ? "Chat with us on WhatsApp (opens in a new tab)" : "Contact us — go to enquiry form"}
      className="group fixed bottom-5 right-5 z-40 inline-flex h-14 items-center gap-3 rounded-full bg-[#1FA855] pl-4 pr-4 text-white shadow-[0_10px_30px_-8px_rgba(31,168,85,.7)] ring-1 ring-white/20 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-8px_rgba(31,168,85,.85)] sm:bottom-7 sm:right-7 sm:pr-5"
    >
      <MessageCircle size={24} aria-hidden fill="currentColor" strokeWidth={0} />
      <span className="hidden text-sm font-semibold sm:inline">{external ? "WhatsApp" : "Enquire"}</span>
    </a>
  );
}
