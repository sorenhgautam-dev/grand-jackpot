import { useId } from "react";
import { PlaceholderTag } from "./SectionHeading";

export type ArtVariant = "roulette" | "cards" | "chandelier" | "dining" | "stage" | "lounge" | "dice" | "pagoda";

const GOLD = "#C9A24B";
const GOLD_L = "#ECD392";

/**
 * Illustrated stand-ins for venue photography. They are deliberately abstract and
 * labelled "Placeholder" so no one mistakes them for real images of the venue.
 * Replace with <Image> components once real assets are supplied.
 */
export function PlaceholderArt({
  variant,
  label,
  showTag = true,
  className = "",
}: {
  variant: ArtVariant;
  label?: string;
  showTag?: boolean;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const bg = `${uid}bg`;
  const glow = `${uid}glow`;
  const emerald = variant === "roulette" || variant === "dining" || variant === "pagoda" || variant === "dice";

  return (
    <div className={`relative isolate h-full w-full overflow-hidden bg-ink-2 ${className}`} role="img" aria-label={label ?? `Placeholder illustration: ${variant}`}>
      <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" fill="none">
        <defs>
          <linearGradient id={bg} x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0" stopColor={emerald ? "#0B4A39" : "#1A1710"} />
            <stop offset="1" stopColor="#060605" />
          </linearGradient>
          <radialGradient id={glow} cx="0.5" cy="0.42" r="0.55">
            <stop offset="0" stopColor={GOLD} stopOpacity="0.38" />
            <stop offset="1" stopColor={GOLD} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="500" fill={`url(#${bg})`} />
        <rect width="400" height="500" fill={`url(#${glow})`} />
        <g stroke={GOLD} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
          {variant === "roulette" && (
            <g transform="translate(200 230)">
              {[150, 128, 96, 58, 20].map((r, i) => (
                <circle key={r} r={r} strokeOpacity={i === 0 ? 0.9 : 0.55} strokeDasharray={i === 1 ? "3 7" : undefined} />
              ))}
              {Array.from({ length: 24 }).map((_, i) => (
                <line key={i} x1="0" y1="-58" x2="0" y2="-128" transform={`rotate(${i * 15})`} strokeOpacity=".45" />
              ))}
              <circle r="6" fill={GOLD_L} stroke="none" />
              <circle cx="82" cy="-40" r="5" fill={GOLD_L} stroke="none" />
            </g>
          )}
          {variant === "cards" && (
            <g transform="translate(200 240)">
              {[-18, 0, 18].map((a, i) => (
                <g key={a} transform={`rotate(${a}) translate(${a * 1.2} 0)`}>
                  <rect x="-62" y="-92" width="124" height="184" rx="10" fill="#0A0A09" fillOpacity=".85" strokeOpacity={0.5 + i * 0.2} />
                  <rect x="-52" y="-82" width="104" height="164" rx="6" strokeOpacity=".25" />
                </g>
              ))}
              <path d="M0 -36c14 18 34 30 34 50a17 17 0 0 1-30 10l6 22h-20l6-22a17 17 0 0 1-30-10c0-20 20-32 34-50Z" fill={GOLD_L} stroke="none" />
            </g>
          )}
          {variant === "chandelier" && (
            <g transform="translate(200 40)" strokeOpacity=".75">
              <path d="M0 0v90" />
              <path d="M-90 150c20-40 60-60 90-60s70 20 90 60" />
              <path d="M-60 180c14-26 36-40 60-40s46 14 60 40" />
              {[-90, -60, -30, 0, 30, 60, 90].map((x) => (
                <g key={x}>
                  <path d={`M${x} 150v${60 + Math.abs(x) * 0.4}`} strokeOpacity=".5" />
                  <path d={`M${x} ${210 + Math.abs(x) * 0.4}l-5 10 5 14 5-14Z`} fill={GOLD_L} stroke="none" />
                </g>
              ))}
              <circle cy="150" r="5" fill={GOLD_L} stroke="none" />
            </g>
          )}
          {variant === "dining" && (
            <g transform="translate(200 250)">
              <ellipse rx="130" ry="46" strokeOpacity=".7" />
              <ellipse rx="96" ry="32" strokeOpacity=".4" />
              <ellipse cy="-6" rx="62" ry="20" fill="#0A0A09" fillOpacity=".7" />
              <path d="M-26 -90c0-18 20-18 20-36M0 -92c0-18 20-18 20-36M26 -90c0-18 20-18 20-36" strokeOpacity=".5" />
              <path d="M-150 20 -176 -70M-158 -30h24M150 20l26-90" strokeOpacity=".6" />
              <path d="M-40 90h80" />
            </g>
          )}
          {variant === "stage" && (
            <g transform="translate(200 40)">
              <path d="M-170 440 -70 40h140l100 400Z" fill={GOLD} fillOpacity=".07" />
              <path d="M-120 440 -30 60M120 440 30 60M0 440V60" strokeOpacity=".35" />
              <ellipse cy="410" rx="170" ry="26" strokeOpacity=".7" />
              <ellipse cy="410" rx="110" ry="15" strokeOpacity=".4" />
              <circle cy="30" r="14" fill={GOLD_L} stroke="none" />
              <path d="M-130 60 -190 0M130 60l60-60" strokeOpacity=".5" />
            </g>
          )}
          {variant === "lounge" && (
            <g transform="translate(200 270)">
              <path d="M-140 80v-70c0-24 20-40 46-40h188c26 0 46 16 46 40v70" />
              <path d="M-170 80h340v26h-340Z" fill="#0A0A09" fillOpacity=".7" />
              <path d="M-100 -60c-40 0-50 30-50 50M100 -60c40 0 50 30 50 50" strokeOpacity=".4" />
              <path d="M-26 -130h52l-10 46h-32ZM0 -84v42M-18 -42h36" strokeOpacity=".9" />
              <circle cx="120" cy="-110" r="18" strokeOpacity=".5" />
            </g>
          )}
          {variant === "dice" && (
            <g transform="translate(200 250) rotate(-12)">
              <path d="M-70 -30 0 -70 70 -30v80L0 90l-70-40Z" fill="#0A0A09" fillOpacity=".75" />
              <path d="M-70 -30 0 10l70-40M0 10v80" strokeOpacity=".7" />
              {[[-6, -34], [24, -48], [-36, -20]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="5" fill={GOLD_L} stroke="none" />
              ))}
              {[[-40, 20], [-20, 38], [-40, 46], [-20, 64]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="4" fill={GOLD_L} stroke="none" />
              ))}
              {[[34, 28], [34, 50], [48, 40]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="4" fill={GOLD_L} stroke="none" />
              ))}
            </g>
          )}
          {variant === "pagoda" && (
            <g transform="translate(200 90)">
              <path d="M0 0v30" />
              {[0, 1, 2, 3].map((i) => {
                const y = 30 + i * 62;
                const w = 46 + i * 28;
                return (
                  <g key={i}>
                    <path d={`M${-w} ${y + 34}c${w * 0.5}-4 ${w * 0.8}-18 ${w}-34 ${w * 0.2} 16 ${w * 0.5} 30 ${w} 34`} />
                    <path d={`M${-w * 0.62} ${y + 34}v28M${w * 0.62} ${y + 34}v28`} strokeOpacity=".5" />
                  </g>
                );
              })}
              <path d="M-90 278h180" />
            </g>
          )}
        </g>
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
      {(label || showTag) && (
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          {label ? <span className="font-display text-sm text-ivory/90">{label}</span> : <span />}
          {showTag && <PlaceholderTag>Placeholder image</PlaceholderTag>}
        </div>
      )}
    </div>
  );
}
