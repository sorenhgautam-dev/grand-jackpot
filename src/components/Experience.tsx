import { CalendarHeart, Crown, Sparkles, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { SectionHeading, PlaceholderTag } from "./ui/SectionHeading";

const items: { icon: LucideIcon; title: string; text: string; offset: string; href: string }[] = [
  {
    icon: Sparkles,
    title: "Gaming & Entertainment",
    text: "The heart of the house: an energetic floor and a lively evening atmosphere. Specific games, limits and rules to be confirmed by the venue.",
    offset: "lg:mt-0",
    href: "#contact",
  },
  {
    icon: Crown,
    title: "VIP Hospitality",
    text: "A more private, more personal way to spend the evening, with dedicated attention for guests who want it. Availability to be confirmed.",
    offset: "lg:mt-14",
    href: "#contact",
  },
  {
    icon: UtensilsCrossed,
    title: "Dining & Refreshments",
    text: "Food and drink to pair with the night, from a quiet table to a celebratory round. Menus and opening times to be confirmed.",
    offset: "lg:mt-6",
    href: "#dining",
  },
  {
    icon: CalendarHeart,
    title: "Events & Occasions",
    text: "Celebrations, corporate evenings and special nights hosted with care. Enquire to discuss what is possible.",
    offset: "lg:mt-20",
    href: "#events",
  },
];

export function Experience() {
  return (
    <section id="experience" aria-labelledby="exp-title" className="relative overflow-hidden bg-emerald-deep py-24 sm:py-32">
      <div aria-hidden className="bg-dhaka absolute inset-0 opacity-80 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]" />
      <div className="container-x relative">
        <SectionHeading id="exp-title" title="The Casino Experience" intro="Four ways to enjoy an evening at Grand Jackpot." />
        <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal as="li" key={it.title} delay={i * 0.09} className={it.offset}>
              <a
                href={it.href}
                className="group relative flex h-full flex-col border border-gold/25 bg-ink/70 p-7 pt-10 backdrop-blur transition-[border-color,background-color,box-shadow] duration-300 hover:border-gold/70 hover:bg-ink/90 hover:shadow-gold"
              >
                {/* Arch-topped icon medallion */}
                <span className="arch mb-7 flex h-20 w-14 items-end justify-center border border-gold/50 bg-emerald/40 pb-3 text-gold-light transition-colors duration-300 group-hover:bg-gold group-hover:text-ink">
                  <it.icon size={24} aria-hidden strokeWidth={1.5} />
                </span>
                <h3 className="font-display text-2xl leading-tight text-ivory">{it.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{it.text}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-wider2 text-gold-light">
                  Learn more
                  <span aria-hidden className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-14 flex justify-center">
          <PlaceholderTag>Service details pending confirmation from the venue</PlaceholderTag>
        </Reveal>
      </div>
    </section>
  );
}
