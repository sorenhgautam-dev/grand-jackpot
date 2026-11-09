import { useId } from "react";

/** Wordmark + mark: a three-tier pagoda roofline over a faceted jewel. Placeholder identity — swap for the official logo. */
export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ECD392" />
          <stop offset="0.55" stopColor="#C9A24B" />
          <stop offset="1" stopColor="#8C6826" />
        </linearGradient>
      </defs>
      <g stroke={`url(#${id})`} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
        <path d="M24 3v4" />
        <path d="M14 14c4-1 7-3.5 10-7 3 3.500 6 6 10 7" />
        <path d="M9 21c6-1 11-4 15-8 4 4 9 7 15 8" />
        <path d="M5 28.500c8-1 15-5 19-10.500 4 5.500 11 9.500 19 10.500" />
      </g>
      <path d="M24 44 14.500 33.500 24 30l9.500 3.500Z" fill={`url(#${id})`} opacity="0.95" />
      <path d="M14.500 33.500h19M24 30v14" stroke="#090908" strokeOpacity=".55" strokeWidth="1" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="gold-text font-display text-[1.15rem] font-semibold tracking-[0.18em]">GRAND JACKPOT</span>
        <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.5em] text-muted">Casino · Nepal</span>
      </span>
    </span>
  );
}
