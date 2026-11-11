# Grand Jackpot Casino website (preview)

A demo of the new website for Grand Jackpot Casino, Grand Hotel, Soaltee Mode, Kathmandu, in English and Hindi. It is static and frontend-only: no backend, no CMS, no cookies, no analytics. Forms check what visitors type and send nothing.

Every fact on the site comes from the casino's current site (a Canva page) or from the client. Photographs are stills from the casino's own walkthrough video, graded and cropped to 16:9, 3:2 and 4:5.

## Commands

Node 22.23 or later is required (`.nvmrc` pins 24: run `nvm use`).

```bash
npm install
npm run dev        # dev server; /dev/ui shows every token and component
npm run build      # astro check + static build to dist/
npm run preview    # serve dist/
npm run check      # types and content schemas
npm run lint       # eslint, zero warnings
npm run test       # vitest: hours, schedules, formatting, i18n
npm run shots      # screenshots of every route at 390, 768, 1440 (Chromium and WebKit) to .shots/
npm run links      # crawl dist/ for broken links and anchors
npm run lh         # Lighthouse CI (mobile) against the performance budgets
```

`shots`, `links` and `lh` run against `dist/`, so build first.

## Deploy

Deploy `dist/` to Vercel, Netlify or Cloudflare Pages with `npm run build` as the build command. Every route is its own HTML file and `404.html` is picked up automatically.

- Canonical and Open Graph URLs use `SITE_URL` if set, otherwise the host's own URL variable (Vercel, Netlify and Cloudflare Pages are detected).
- Preview builds are the default: every page carries `noindex, nofollow` and `robots.txt` disallows everything. For launch, build with `PUBLIC_DEMO=false`.

## Where things live

- `src/data/site.ts`: facts used by code (name, address, phones, timezone, opening hours).
- `src/i18n/en.ts`, `src/i18n/hi.ts`: interface copy. Hindi is typed against English, so a missing string fails the build.
- `src/content/`: games, events, dining venues, packages, FAQs, and the About, Privacy and Responsible gaming pages, one file per language.
- `src/styles/tokens.css`: colours, type, spacing, motion. An ivory page (#F6F2E8, the client's paper warmed toward gold) with a sand band (#ECE5D6), from the client's colours: ink #0A0C0E text, hero and footer; charcoal #231F1E the evening band; umber #59432D labels and the packages band; gold #AE9F73 hairlines and labels on the dark bands. Fraunces (variable weight, upright and italic) for headings, Tiro Devanagari Hindi for Hindi headings, Mukta for text. Photographs of the games stand in arches, after the copper arch over the casino's door; other photographs and buttons are sharp rectangles.
- `src/styles/base.css`: the ivory, sand, ink, charcoal and umber surfaces. Each sets the same roles (`--bg`, `--fg`, `--fg-muted`, `--line`, `--accent`, `--action`), and components use only the roles.
- `src/components/Hero.astro`: the gaming floor, full bleed and toned down, with the name centred over it.
- `src/components/Numeral.astro`: the I to VII chapter marks that open each home page section: a lotus medallion with the roman numeral over the Devanagari one (I over १), drawn in on arrival, turning slowly. Words in `*asterisks*` in a heading's copy are set in italic (`src/lib/emphasis.ts`).
- Nepali touches: prayer flags strung under the header over the hero and between two summits over the packages band (`FlagString.astro`, plain cloth with no printed text), Tihar marigold garlands along the evening band (`Garland.astro`), Dhaka weave (`Dhaka.astro`), the Himalaya with snow on the high peaks (`Ridge.astro`), and "नमस्ते" in the hero and the opening curtain. Devanagari on English pages uses the system's face (`--font-native-label`), so they load no Devanagari font.
- `src/components/WayIn.astro`: the signature, the route from the hotel gate to the gaming floor in seven photographs. It works without JavaScript.
- `src/styles/motion.css`, `src/scripts/motion.ts`: the reveals. Headings, photographs and list rows play their entrance once, when they first come into view. Clicks throw a chip-edge ring and a few marigold petals (`src/scripts/petals.ts`), which the game wheel also throws when it lands. With reduced motion, or without JavaScript, everything is simply there.

There is no sample content: events, packages and games are the casino's own. The Hindi translations were drafted for the demo and need review by a native speaker.

## Needs from the client

- Minimum entry age, and which documents are accepted (the current site says "foreign passport required").
- Dress code.
- Regulator and licence number, for the footer.
- Responsible gaming: self-exclusion, spending or time limits the casino offers, and the support organisations or helplines to list.
- Email address and social media links (the current site shows icons but no links).
- Which phone numbers to publish. The posters list +977 985 144 3002/03, +977 985 144 5002/3 and +977 970 505 5903/10; the site uses +977 970 505 5910 and +977 970 505 5903 from the current website.
- Buffet times, any venue or bar names, and menus.
- Table limits, which games are in the Normal Pit and which in the VIP Pit, and house rules for Flush and Marriage.
- How guests enter the lucky draws, and bumper draw details.
- VIP package price and the package terms and conditions.
- When the casino opened, and any history to tell.
- Accessibility: step-free access, lifts, accessible toilets.
- Photography: night shots of the entrance, the VIP Pit, food and the live dance. The current stills come from 1080p phone video and are soft at large sizes. A vector (SVG) logo.
- Confirmation that the casino is open 24 hours every day, as the site now says.
