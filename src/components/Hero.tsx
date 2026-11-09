"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { siteConfig } from "@/config/site";

const ease = [0.22, 1, 0.36, 1] as const;

function RouletteBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgb(var(--emerald-glow)/0.38),transparent_60%),radial-gradient(ellipse_at_80%_100%,rgb(var(--emerald)/0.8),transparent_55%)]" />
      {/* Oversized, partly cropped roulette-wheel line art */}
      <svg viewBox="-400 -400 800 800" className="absolute left-1/2 top-[56%] h-[160vmax] w-[160vmax] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-60 sm:h-[118vmax] sm:w-[118vmax]" fill="none" stroke="rgb(201 162 75)">
        <g className="origin-center animate-spin-slow" style={{ transformOrigin: "0 0" }} strokeWidth="1">
          <circle r="390" strokeOpacity=".5" />
          <circle r="350" strokeOpacity=".28" strokeDasharray="2 10" />
          <circle r="300" strokeOpacity=".4" />
          {Array.from({ length: 37 }).map((_, i) => (
            <line key={i} x1="0" y1="-300" x2="0" y2="-350" strokeOpacity=".5" transform={`rotate(${(i * 360) / 37})`} />
          ))}
        </g>
        <g className="animate-spin-slow-rev" style={{ transformOrigin: "0 0" }} strokeWidth="1">
          <circle r="230" strokeOpacity=".3" />
          <circle r="170" strokeOpacity=".22" strokeDasharray="6 14" />
          {Array.from({ length: 8 }).map((_, i) => (
            <path key={i} d="M0 -230 20 -170 0 -110 -20 -170Z" strokeOpacity=".3" transform={`rotate(${i * 45})`} />
          ))}
        </g>
        <circle r="60" strokeOpacity=".35" />
        <circle r="8" fill="rgb(236 211 146)" stroke="none" opacity=".25" />
      </svg>
      <div className="bg-dhaka absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      {/* Drifting gold dust */}
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          className="absolute h-1 w-1 animate-drift rounded-full bg-gold-light/80"
          style={{ left: `${6 + ((i * 37) % 88)}%`, bottom: `${8 + ((i * 23) % 40)}%`, animationDelay: `${(i * 0.9) % 8}s`, animationDuration: `${7 + (i % 5)}s` }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-transparent to-ink" />
    </div>
  );
}

export function Hero() {
  const item = (delay: number) => ({ initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay, ease } });

  return (
    <section id="home" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-[var(--header-h)]">
      <RouletteBackdrop />
      <div className="container-x relative z-10 py-16 text-center">
        <motion.h1 id="hero-title" className="mx-auto max-w-5xl" {...item(0.1)}>
          <span className="block text-[0.8rem] font-semibold tracking-wider3 text-gold-light sm:text-sm">WELCOME TO</span>
          <span className="gold-text mt-3 block animate-sheen text-balance font-display text-[2.9rem] font-semibold leading-[0.98] tracking-[0.04em] min-[420px]:text-6xl sm:text-7xl lg:text-[7rem]">
            GRAND JACKPOT
          </span>
        </motion.h1>

        <motion.div {...item(0.35)} className="mx-auto mt-8 flex items-center justify-center gap-4" aria-hidden="true">
          <span className="gold-rule h-px w-16 sm:w-28" />
          <span className="h-2 w-2 rotate-45 border border-gold-light" />
          <span className="gold-rule h-px w-16 sm:w-28" />
        </motion.div>

        <motion.p {...item(0.5)} className="mx-auto mt-8 max-w-xl text-pretty text-base leading-relaxed text-ivory/85 sm:text-lg">
          {siteConfig.tagline} Step into gracious hospitality, fine surroundings and the thrill of the night.
        </motion.p>

        <motion.div {...item(0.7)} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a href="#experience" className="btn btn-gold w-full sm:w-auto">
            Explore
          </a>
          <a href="#contact" className="btn btn-ghost w-full sm:w-auto">
            Contact Us
          </a>
        </motion.div>
      </div>

      <a href="#about" aria-label="Scroll to About" className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-gold-light/80 transition-colors hover:text-gold-light">
        <ChevronDown size={28} aria-hidden className="motion-safe:animate-bounce" />
      </a>
    </section>
  );
}
