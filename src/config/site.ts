/**
 * Single source of truth for business details.
 *
 * IMPORTANT: Nothing here has been verified with the business. Every value marked
 * `placeholder: true` (or wrapped in [BRACKETS]) must be replaced with real,
 * confirmed information before launch. Do not invent addresses, licences, phone numbers
 * or testimonials.
 */

export const siteConfig = {
  name: "Grand Jackpot Casino",
  shortName: "Grand Jackpot",
  tagline: "An evening worth dressing for, in Nepal.",
  description:
    "Grand Jackpot Casino, Nepal — a hospitality and entertainment destination. Enquire about visits, VIP hospitality, dining and private events.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  contact: {
    // Location is only known to be "Nepal". City/address must come from the business.
    location: "Nepal",
    address: "[Street address, city — to be supplied by Grand Jackpot]",
    phone: "[+977 — phone number to be supplied]",
    phoneHref: null as string | null, // e.g. "tel:+977XXXXXXXXXX" once confirmed
    email: "[enquiries@ — email to be supplied]",
    emailHref: null as string | null, // e.g. "mailto:info@yourdomain.com" once confirmed
    hours: [
      { day: "Monday – Thursday", time: "[Opening hours to be supplied]" },
      { day: "Friday – Sunday", time: "[Opening hours to be supplied]" },
    ],
    whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, ""),
    mapsEmbedUrl: process.env.NEXT_PUBLIC_MAPS_EMBED_URL ?? "",
  },

  nav: [
    { label: "Home", href: "#home" },
    { label: "About Us", href: "#about" },
    { label: "Casino Experience", href: "#experience" },
    { label: "Dining & Entertainment", href: "#dining" },
    { label: "Events", href: "#events" },
    { label: "Gallery", href: "#gallery" },
    { label: "Contact", href: "#contact" },
  ],

  // Shown in the footer and on /responsible-gaming. Wording must be confirmed against
  // current Nepalese regulation and the venue's licence conditions.
  eligibilityNotice:
    "[Eligibility and entry rules — to be confirmed with the venue and current Nepalese regulation.]",
};

export type SiteConfig = typeof siteConfig;
