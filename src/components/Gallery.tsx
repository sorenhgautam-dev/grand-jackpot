"use client";

import { Expand } from "lucide-react";
import { useState } from "react";
import { Lightbox, type GalleryItem } from "./Lightbox";
import { PlaceholderArt } from "./ui/PlaceholderArt";
import { Reveal } from "./ui/Reveal";
import { SectionHeading, PlaceholderTag } from "./ui/SectionHeading";

/** Placeholder gallery — replace `variant` art with real photography via next/image. */
const items: (GalleryItem & { span: string })[] = [
  { variant: "chandelier", caption: "Main hall", span: "row-span-2" },
  { variant: "roulette", caption: "Gaming floor", span: "" },
  { variant: "dining", caption: "Dining room", span: "" },
  { variant: "lounge", caption: "The lounge", span: "" },
  { variant: "stage", caption: "Live stage", span: "" },
  { variant: "pagoda", caption: "Architecture detail", span: "" },
  { variant: "dice", caption: "Details", span: "" },
];

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="gallery" aria-labelledby="gallery-title" className="relative py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading id="gallery-title" title="Gallery" intro="A first look at the atmosphere. Illustrated placeholders until venue photography is supplied." />
        <ul className="mt-14 grid grid-flow-dense auto-rows-[200px] grid-cols-2 gap-3 sm:auto-rows-[240px] sm:gap-4 lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal as="li" key={it.caption} delay={(i % 4) * 0.06} className={it.span}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`View ${it.caption} full screen`}
                className="group relative block h-full w-full overflow-hidden border border-gold/20 transition-[border-color,box-shadow] duration-300 hover:border-gold/80 hover:shadow-gold"
              >
                <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.06]">
                  <PlaceholderArt variant={it.variant} showTag={false} />
                </div>
                <span className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-ink/90 via-ink/10 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="font-display text-lg text-ivory">{it.caption}</span>
                  <Expand size={18} aria-hidden className="text-gold-light" />
                </span>
              </button>
            </Reveal>
          ))}
        </ul>
        <div className="mt-8 text-center">
          <PlaceholderTag>Placeholder imagery</PlaceholderTag>
        </div>
      </div>
      <Lightbox items={items} index={open} onClose={() => setOpen(null)} onChange={setOpen} />
    </section>
  );
}
