"use client";

import { CheckCircle2, Clock, Loader2, Mail, MapPin, Phone, TriangleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { ENQUIRY_TOPICS, enquirySchema, type FieldErrors } from "@/lib/validation";
import { Reveal } from "./ui/Reveal";
import { SectionHeading, PlaceholderTag } from "./ui/SectionHeading";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "success"; demo: boolean } | { kind: "error"; message: string };

const initial = { name: "", email: "", phone: "", topic: "", date: "", guests: "", message: "", consent: false, website: "" };

function InfoRow({ icon: Icon, label, children }: { icon: typeof MapPin; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center border border-gold/40 text-gold-light">
        <Icon size={18} aria-hidden />
      </span>
      <div>
        <p className="text-[0.68rem] font-semibold uppercase tracking-wider2 text-gold-light">{label}</p>
        <div className="mt-1 text-sm leading-relaxed text-ivory/90">{children}</div>
      </div>
    </div>
  );
}

export function Contact() {
  const { contact } = siteConfig;
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const statusRef = useRef<HTMLDivElement>(null);

  // Let other sections (e.g. Events) prefill the form.
  useEffect(() => {
    const onEnquire = (e: Event) => {
      const { topic, message } = (e as CustomEvent<{ topic: string; message: string }>).detail;
      setValues((v) => ({ ...v, topic, message }));
      setStatus({ kind: "idle" });
      setErrors({});
    };
    window.addEventListener("gj:enquire", onEnquire);
    return () => window.removeEventListener("gj:enquire", onEnquire);
  }, []);

  useEffect(() => {
    if (status.kind === "success" || status.kind === "error") statusRef.current?.focus();
  }, [status]);

  const set = (k: keyof typeof initial) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target instanceof HTMLInputElement && e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setValues((v) => ({ ...v, [k]: value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status.kind === "sending") return;
    const parsed = enquirySchema.safeParse(values);
    if (!parsed.success) {
      const fe: FieldErrors = {};
      for (const issue of parsed.error.issues) fe[issue.path[0] as keyof FieldErrors] ??= issue.message;
      setErrors(fe);
      setStatus({ kind: "error", message: "Please check the highlighted fields and try again." });
      const firstKey = Object.keys(fe)[0];
      document.getElementById(`f-${firstKey}`)?.focus();
      return;
    }
    setErrors({});
    setStatus({ kind: "sending" });
    // LIVE DEMO: there is no backend. Simulate a short send, then confirm. Nothing leaves the browser.
    // To go live, replace this with a call to your form service / API endpoint.
    if (values.website) {
      setStatus({ kind: "success", demo: true }); // honeypot filled: pretend success
      return;
    }
    await new Promise((r) => setTimeout(r, 900));
    setValues(initial);
    setStatus({ kind: "success", demo: true });
  }

  const err = (k: keyof FieldErrors) => errors[k];
  const fieldProps = (k: keyof typeof initial) => ({
    id: `f-${k}`,
    name: k,
    "aria-invalid": err(k as keyof FieldErrors) ? (true as const) : undefined,
    "aria-describedby": err(k as keyof FieldErrors) ? `e-${k}` : undefined,
  });
  const Err = ({ k }: { k: keyof FieldErrors }) =>
    err(k) ? (
      <p id={`e-${k}`} className="mt-1.5 text-sm text-[#f5b4a2]">
        {err(k)}
      </p>
    ) : null;
  const labelCls = "block text-[0.68rem] font-semibold uppercase tracking-wider2 text-gold-light";

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden bg-emerald-deep py-24 sm:py-32">
      <div aria-hidden className="bg-dhaka absolute inset-0 opacity-70 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />
      <div className="container-x relative">
        <SectionHeading id="contact-title" title="Plan Your Visit" intro="Send an enquiry about visits, VIP hospitality, dining or private events and the team will get back to you." />

        <div className="mt-16 grid gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Details + map */}
          <Reveal className="space-y-8 lg:col-span-2">
            <InfoRow icon={MapPin} label="Location">
              <p>{contact.address}</p>
              <p className="text-muted">{contact.location}</p>
            </InfoRow>
            <InfoRow icon={Phone} label="Phone">
              {contact.phoneHref ? <a className="underline decoration-gold/50 underline-offset-4 hover:text-gold-light" href={contact.phoneHref}>{contact.phone}</a> : <p>{contact.phone}</p>}
            </InfoRow>
            <InfoRow icon={Mail} label="Email">
              {contact.emailHref ? <a className="underline decoration-gold/50 underline-offset-4 hover:text-gold-light" href={contact.emailHref}>{contact.email}</a> : <p>{contact.email}</p>}
            </InfoRow>
            <InfoRow icon={Clock} label="Opening hours">
              <ul className="space-y-1">
                {contact.hours.map((h) => (
                  <li key={h.day} className="flex flex-wrap justify-between gap-x-4">
                    <span>{h.day}</span>
                    <span className="text-muted">{h.time}</span>
                  </li>
                ))}
              </ul>
            </InfoRow>

            <div className="relative aspect-[4/3] overflow-hidden border border-gold/30 bg-ink/60">
              {contact.mapsEmbedUrl ? (
                <iframe title="Map showing Grand Jackpot Casino" src={contact.mapsEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-full w-full border-0 grayscale-[0.4] invert-[0.92] hue-rotate-180" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                  <MapPin className="text-gold" size={30} aria-hidden />
                  <p className="font-display text-xl">Google Maps</p>
                  <p className="max-w-xs text-sm text-muted">Map embed placeholder. Set <code className="text-gold-light">NEXT_PUBLIC_MAPS_EMBED_URL</code> once the venue address is confirmed.</p>
                  <PlaceholderTag>Placeholder</PlaceholderTag>
                </div>
              )}
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1} className="lg:col-span-3">
            <form onSubmit={onSubmit} noValidate className="border border-gold/30 bg-ink/80 p-6 shadow-gold backdrop-blur sm:p-10" aria-label="Enquiry form">
              <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
                <div>
                  <label htmlFor="f-name" className={labelCls}>Full name *</label>
                  <input {...fieldProps("name")} type="text" autoComplete="name" value={values.name} onChange={set("name")} className="field" placeholder="Your name" />
                  <Err k="name" />
                </div>
                <div>
                  <label htmlFor="f-email" className={labelCls}>Email *</label>
                  <input {...fieldProps("email")} type="email" autoComplete="email" value={values.email} onChange={set("email")} className="field" placeholder="you@example.com" />
                  <Err k="email" />
                </div>
                <div>
                  <label htmlFor="f-phone" className={labelCls}>Phone / WhatsApp</label>
                  <input {...fieldProps("phone")} type="tel" autoComplete="tel" value={values.phone} onChange={set("phone")} className="field" placeholder="Optional" />
                  <Err k="phone" />
                </div>
                <div>
                  <label htmlFor="f-topic" className={labelCls}>Enquiry type *</label>
                  <select {...fieldProps("topic")} value={values.topic} onChange={set("topic")} className="field [&>option]:bg-ink">
                    <option value="" disabled>Select a topic</option>
                    {ENQUIRY_TOPICS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <Err k="topic" />
                </div>
                <div>
                  <label htmlFor="f-date" className={labelCls}>Preferred date</label>
                  <input {...fieldProps("date")} type="date" value={values.date} onChange={set("date")} className="field [color-scheme:dark]" />
                </div>
                <div>
                  <label htmlFor="f-guests" className={labelCls}>Number of guests</label>
                  <input {...fieldProps("guests")} type="number" inputMode="numeric" min={1} max={200} value={values.guests} onChange={set("guests")} className="field" placeholder="Optional" />
                  <Err k="guests" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="f-message" className={labelCls}>Message *</label>
                  <textarea {...fieldProps("message")} rows={4} value={values.message} onChange={set("message")} className="field resize-y" placeholder="Tell us how we can help" />
                  <div className="flex justify-between">
                    <Err k="message" />
                    <span className="ml-auto mt-1.5 text-xs text-muted">{values.message.length}/1500</span>
                  </div>
                </div>

                {/* Honeypot: hidden from people and assistive tech */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label htmlFor="f-website">Website</label>
                  <input id="f-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set("website")} />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex cursor-pointer items-start gap-3 text-sm text-ivory/85">
                    <input
                      {...fieldProps("consent")}
                      type="checkbox"
                      checked={values.consent}
                      onChange={set("consent")}
                      className="mt-1 h-5 w-5 shrink-0 appearance-none border border-gold/60 bg-transparent transition-colors checked:border-gold checked:bg-gold checked:[background-image:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='m4 10 4 4 8-8' fill='none' stroke='%23090908' stroke-width='2.5'/%3E%3C/svg%3E&quot;)]"
                    />
                    <span>I agree to be contacted about this enquiry. We use your details only to reply to you. *</span>
                  </label>
                  <Err k="consent" />
                </div>
              </div>

              <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <button type="submit" disabled={status.kind === "sending"} className="btn btn-gold w-full disabled:opacity-70 sm:w-auto">
                  {status.kind === "sending" ? (<><Loader2 size={16} className="animate-spin" aria-hidden /> Sending…</>) : "Send enquiry"}
                </button>
                <p className="text-xs text-muted">Fields marked * are required.</p>
              </div>

              <div ref={statusRef} tabIndex={-1} aria-live="polite" role="status" className="outline-none">
                {status.kind === "success" && (
                  <div className="mt-7 flex gap-3 border border-gold/50 bg-emerald/30 p-4 text-sm">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-gold-light" size={20} aria-hidden />
                    <div>
                      <p className="font-semibold text-ivory">Thank you — your enquiry looks great.</p>
                      <p className="mt-1 text-muted">In the live site, the team would now reply to the email address you provided.</p>
                      {status.demo && <p className="mt-2 text-xs text-gold-light">Live demo: this site has no backend yet, so nothing was sent or stored.</p>}
                    </div>
                  </div>
                )}
                {status.kind === "error" && (
                  <div role="alert" className="mt-7 flex gap-3 border border-[#f0a08a]/60 bg-[#3a1a12]/60 p-4 text-sm">
                    <TriangleAlert className="mt-0.5 shrink-0 text-[#f5b4a2]" size={20} aria-hidden />
                    <p className="text-ivory">{status.message}</p>
                  </div>
                )}
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
