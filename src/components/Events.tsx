"use client";

import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { SectionHeading, PlaceholderTag } from "./ui/SectionHeading";

/** SAMPLE DATA — replace with real events supplied by the business. */
const events = [
  { day: "12", month: "DEC", title: "Winter Gala Evening", text: "A black-tie night of music, dining and celebration to welcome the season.", tag: "Sample event" },
  { day: "24", month: "DEC", title: "Festive Eve Dinner", text: "A long-table dinner for friends and family, with live entertainment through the evening.", tag: "Sample event" },
  { day: "14", month: "APR", title: "Nepali New Year Celebration", text: "Ring in the new year with a night inspired by Nepali music, flavour and hospitality.", tag: "Sample event" },
];

export function enquireAbout(topic: string, message: string) {
  window.dispatchEvent(new CustomEvent("gj:enquire", { detail: { topic, message } }));
  document.getElementById("contact")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

export function Events() {
  return (
    <section id="events" aria-labelledby="events-title" className="relative bg-ink-2 py-24 sm:py-32">
      <div aria-hidden className="gold-rule absolute inset-x-0 top-0" />
      <div className="container-x">
        <SectionHeading id="events-title" align="left" title="Upcoming Events" intro="Nights worth marking in the calendar. The events below are samples until the venue supplies its programme." />
        <ul className="mt-14 divide-y divide-gold/20 border-y border-gold/20">
          {events.map((e, i) => (
            <Reveal as="li" key={e.title} delay={i * 0.08}>
              <article className="group grid items-center gap-6 py-8 transition-colors duration-300 hover:bg-gold/[0.04] md:grid-cols-[130px_1fr_auto] md:px-4">
                <div className="flex items-baseline gap-3 md:block md:text-center">
                  <span className="gold-text block font-display text-6xl font-semibold leading-none">{e.day}</span>
                  <span className="text-xs font-semibold tracking-wider3 text-muted">{e.month}</span>
                </div>
                <div>
                  <div className="mb-2">
                    <PlaceholderTag>{e.tag}</PlaceholderTag>
                  </div>
                  <h3 className="font-display text-2xl text-ivory sm:text-3xl">{e.title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted sm:text-base">{e.text}</p>
                </div>
                <button
                  type="button"
                  onClick={() => enquireAbout("Sample event enquiry", `I'd like to enquire about "${e.title}" (${e.day} ${e.month}).`)}
                  className="btn btn-ghost w-full md:w-auto"
                >
                  Enquire <ArrowUpRight size={16} aria-hidden />
                </button>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
