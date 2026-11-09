import { Reveal } from "./ui/Reveal";
import { PlaceholderArt, type ArtVariant } from "./ui/PlaceholderArt";
import { SectionHeading, PlaceholderTag } from "./ui/SectionHeading";

const venues: { variant: ArtVariant; title: string; text: string }[] = [
  { variant: "dining", title: "The Dining Room", text: "A refined setting for a long dinner or a quick bite between rounds. [Cuisine and menu to be supplied.]" },
  { variant: "lounge", title: "The Lounge", text: "Low light, deep seating and a place to unwind with friends. [Bar offering to be supplied.]" },
  { variant: "stage", title: "Live Entertainment", text: "Music and performances to carry the night along. [Programme to be supplied.]" },
];

export function Dining() {
  return (
    <section id="dining" aria-labelledby="dining-title" className="relative py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading id="dining-title" title="Dining & Entertainment" intro="The evening doesn't have to stop at the tables." />
        <div className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-3">
          {venues.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.1} className={i === 1 ? "md:mt-12" : ""}>
              <article className="group">
                <div className="arch relative aspect-[4/5] overflow-hidden border border-gold/30 transition-[border-color,box-shadow] duration-300 group-hover:border-gold/70 group-hover:shadow-gold">
                  <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105">
                    <PlaceholderArt variant={v.variant} />
                  </div>
                </div>
                <h3 className="mt-6 font-display text-2xl text-ivory">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{v.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-14 text-center">
          <PlaceholderTag>Menus and programme pending</PlaceholderTag>
        </Reveal>
      </div>
    </section>
  );
}
