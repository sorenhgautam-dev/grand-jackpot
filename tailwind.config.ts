import type { Config } from "tailwindcss";

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: token("ink"), 2: token("ink-2"), 3: token("ink-3") },
        emerald: { DEFAULT: token("emerald"), deep: token("emerald-deep"), glow: token("emerald-glow") },
        gold: { DEFAULT: token("gold"), light: token("gold-light"), dark: token("gold-dark") },
        ivory: token("ivory"),
        muted: token("muted"),
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: { wider2: "0.22em", wider3: "0.34em" },
      boxShadow: {
        gold: "0 0 0 1px rgb(var(--gold) / 0.45), 0 10px 40px -10px rgb(var(--gold) / 0.35)",
        glow: "0 0 60px -10px rgb(var(--gold) / 0.55)",
      },
      keyframes: {
        spinSlow: { to: { transform: "rotate(360deg)" } },
        spinSlowRev: { to: { transform: "rotate(-360deg)" } },
        drift: {
          "0%": { transform: "translateY(0) translateX(0)", opacity: "0" },
          "15%": { opacity: "0.9" },
          "100%": { transform: "translateY(-120px) translateX(18px)", opacity: "0" },
        },
        sheen: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
      animation: {
        "spin-slow": "spinSlow 90s linear infinite",
        "spin-slow-rev": "spinSlowRev 140s linear infinite",
        drift: "drift 9s ease-out infinite",
        sheen: "sheen 6s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
