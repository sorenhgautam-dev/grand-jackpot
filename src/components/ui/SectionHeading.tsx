import { PagodaDivider } from "./PagodaDivider";
import { Reveal } from "./Reveal";

export function SectionHeading({
  title,
  intro,
  align = "center",
  id,
}: {
  title: string;
  intro?: string;
  align?: "center" | "left";
  id?: string;
}) {
  const center = align === "center";
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      <h2 id={id} className="text-balance font-display text-4xl font-medium leading-[1.08] text-ivory sm:text-5xl lg:text-[3.4rem]">
        {title}
      </h2>
      {center ? <PagodaDivider className="mt-6" /> : <span className="gold-rule mt-6 block h-px w-24 !bg-gold/70" />}
      {intro && <p className={`mt-6 text-pretty text-base leading-relaxed text-muted sm:text-lg ${center ? "" : "max-w-lg"}`}>{intro}</p>}
    </Reveal>
  );
}

/** Marks content that is not yet supplied/verified by the business. */
export function PlaceholderTag({ children = "Placeholder" }: { children?: string }) {
  return (
    <span className="inline-flex items-center border border-gold/40 bg-ink/70 px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wider2 text-gold-light backdrop-blur">
      {children}
    </span>
  );
}
