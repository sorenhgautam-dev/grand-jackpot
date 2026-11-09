import { z } from "zod";

export const ENQUIRY_TOPICS = [
  "General enquiry",
  "Visit or group booking",
  "VIP hospitality",
  "Dining reservation",
  "Private event or celebration",
  "Sample event enquiry",
] as const;

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(80, "Name is too long."),
  email: z.string().trim().email("Please enter a valid email address.").max(120),
  phone: z
    .string()
    .trim()
    .max(24, "Phone number is too long.")
    .refine((v) => v === "" || /^[+\d][\d\s()-]{6,}$/.test(v), "Please enter a valid phone number.")
    .optional()
    .default(""),
  topic: z.enum(ENQUIRY_TOPICS, { errorMap: () => ({ message: "Please choose a topic." }) }),
  date: z.string().trim().max(32).optional().default(""),
  guests: z
    .string()
    .trim()
    .refine((v) => v === "" || (/^\d+$/.test(v) && Number(v) >= 1 && Number(v) <= 200), "Enter a number between 1 and 200.")
    .optional()
    .default(""),
  message: z.string().trim().min(10, "Please tell us a little more (at least 10 characters).").max(1500, "Message is too long (max 1500 characters)."),
  consent: z.literal(true, { errorMap: () => ({ message: "Please confirm so we can reply to you." }) }),
  // Honeypot — real users never fill this in.
  website: z.string().max(0).optional().default(""),
});

export type EnquiryInput = z.input<typeof enquirySchema>;
export type EnquiryData = z.output<typeof enquirySchema>;
export type FieldErrors = Partial<Record<keyof EnquiryData, string>>;
