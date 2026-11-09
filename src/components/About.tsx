import { Reveal } from "./ui/Reveal";
import { PlaceholderArt } from "./ui/PlaceholderArt";
import { SectionHeading, PlaceholderTag } from "./ui/SectionHeading";

const pillars = [
  { title: "Atmosphere", text: "Warm light, deep emerald and gold, and a room designed to make the evening feel like an occasion." },
  { title: "Hospitality", text: "Attentive, gracious service rooted in the Nepali tradition of treating every guest as a guest of honour." },
  { title: "Entertainment", text: "A venue built around enjoyment, from the gaming floor to dining and live occasions." },
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative py-24 sm:py-32">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-6 lg:order-2">
          <SectionHeading id="about-title" align="left" title="A house of hospitality, in Nepal" />
          <Reveal delay={0.1} className="mt-8 space-y-5 text-base leading-relaxed text-muted sm:text-lg">
            <p>
              Grand Jackpot Casino is a hospitality and entertainment destination in Nepal. Our idea is simple: international standards of comfort and
              polish, delivered with the warmth and generosity Nepal is known for.
            </p>
            <p>
              From the moment you arrive, the aim is a night that feels effortless &mdash; considered surroundings, a welcoming team, and time well spent
              with friends, colleagues or family.
            </p>
            <p className="flex flex-wrap items-center gap-3 text-sm">
              <PlaceholderTag>Copy draft</PlaceholderTag>
              <span className="text-muted/90">Our story, founding date and ownership details will be added once supplied by the business.</span>
            </p>
          </Reveal>

          <dl className="mt-10 grid gap-6 sm:grid-cols-3">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={0.1 + i * 0.08}>
                <div className="border-t border-gold/40 pt-4">
                  <dt className="font-display text-xl text-gold-light">{p.title}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted">{p.text}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>

        <Reveal className="relative lg:col-span-6 lg:order-1">
          <div className="relative mx-auto grid max-w-md grid-cols-5 gap-4 sm:max-w-lg">
            <div className="arch col-span-3 aspect-[3/4.4] overflow-hidden border border-gold/40 shadow-gold">
              <PlaceholderArt variant="chandelier" label="The main hall" />
            </div>
            <div className="col-span-2 mt-16 space-y-4">
              <div className="aspect-square overflow-hidden border border-gold/30">
                <PlaceholderArt variant="cards" showTag={false} />
              </div>
              <div className="arch aspect-[3/4] overflow-hidden border border-gold/30">
                <PlaceholderArt variant="pagoda" showTag={false} />
              </div>
            </div>
            <div aria-hidden className="absolute -left-4 -top-4 -z-10 h-full w-full border border-gold/20" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
