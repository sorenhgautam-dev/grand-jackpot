import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const time = z.string().regex(/^\d{2}:\d{2}$/);

/** Table games and slots. One file per game per language: `games/<lang>/<slug>.md`. */
const games = defineCollection({
  loader: glob({ base: './src/content/games', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      order: z.number(),
      summary: z.string(),
      photo: image().optional(),
      photoAlt: z.string().optional(),
      sample: z.boolean().default(false),
    }),
});

/** Things that happen on a schedule. Times are local to the casino and repeat every day. */
const events = defineCollection({
  loader: glob({ base: './src/content/events', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    type: z.enum(['entertainment', 'draw']),
    times: z.array(time).min(1),
    summary: z.string(),
    where: z.string().optional(),
    sample: z.boolean().default(false),
  }),
});

/** Places to eat and drink. */
const venues = defineCollection({
  loader: glob({ base: './src/content/venues', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      order: z.number(),
      summary: z.string(),
      served: z.string(),
      photo: image(),
      photoAlt: z.string(),
      sample: z.boolean().default(false),
    }),
});

/** Questions for the Visit page. One JSON file per language. */
const faqs = defineCollection({
  loader: glob({ base: './src/content/faqs', pattern: '*.json' }),
  schema: z.object({
    items: z.array(z.object({ question: z.string(), answer: z.string() })),
  }),
});

/** Offers from the client's posters. One JSON file per language. */
const packages = defineCollection({
  loader: glob({ base: './src/content/packages', pattern: '*.json' }),
  schema: z.object({
    items: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        price: z.string().optional(),
        includes: z.array(z.string()),
      }),
    ),
    terms: z.string(),
  }),
});

/** Long-form pages: about, privacy, responsible gaming. */
const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    sample: z.boolean().default(false),
  }),
});

export const collections = { games, events, venues, faqs, packages, pages };
