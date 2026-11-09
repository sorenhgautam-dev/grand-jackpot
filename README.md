# Grand Jackpot Casino — Nepal

Public-facing website for Grand Jackpot Casino: brand, hospitality, dining, events and enquiries.

**This is a live demo with no backend.** It builds to a fully static site. The enquiry form validates in the browser and simulates sending (nothing is transmitted or stored). It contains **no** real-money play, deposits, withdrawals, wagering or gambling accounts.

Stack: Next.js 14 (App Router, static export) · TypeScript · Tailwind CSS · Framer Motion · Lucide icons · Zod.

## Run locally

Requires Node 18.18+ (tested on Node 20).

```bash
npm install
npm run dev          # http://localhost:3000
```

Production build (static files are written to `out/`):

```bash
npm run build
npx serve out        # or any static file server
```

Other scripts: `npm run lint`, `npm run typecheck`.

## Deploy

`npm run build` produces a self-contained `out/` folder. Upload it to any static host (Vercel, Netlify, Cloudflare Pages, S3, GitHub Pages).

## Configure (optional)

Copy `.env.example` to `.env.local`:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO metadata, sitemap and robots |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Digits only, international format. Empty = the floating button links to the enquiry form |
| `NEXT_PUBLIC_MAPS_EMBED_URL` | Google Maps embed `src` URL. Empty = styled placeholder |

All business details live in **`src/config/site.ts`**. Everything in `[square brackets]` or tagged *Placeholder / Sample* on the page is **unverified** and must be replaced with information supplied by the business before launch. Nothing about address, phone, email, hours, licences, menus or events has been invented.

## Before going live

1. **Legal and licensing.** Confirm applicable Nepalese law, the venue's licence/authorisation and any rules on advertising and on who may enter. Then replace the eligibility text in `src/config/site.ts` and the `/responsible-gaming` page (both currently placeholders for the venue and legal counsel to complete).
2. **Real content.** Supply the business details above, real photography (replace `PlaceholderArt` usage in `src/components`), real events, and the official logo (`src/components/ui/Logo.tsx`).
3. **Enquiry form.** Wire `onSubmit` in `src/components/Contact.tsx` to a form service or API (the marked `LIVE DEMO` block). Validation rules are in `src/lib/validation.ts`.

## Structure

```
src/
  app/            layout, home page, /responsible-gaming, sitemap, robots, 404
  components/     Header, Hero, About, Experience, Dining, Events, Gallery, Lightbox, Contact, Footer, WhatsAppButton, Preloader
  components/ui/  Logo, PagodaDivider, PlaceholderArt, Reveal, SectionHeading
  config/site.ts  business details and navigation (single source of truth)
  lib/validation.ts
```

See `DESIGN.md` for the brand sheet.
