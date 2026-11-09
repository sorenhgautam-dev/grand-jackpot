import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import type { Locale } from './locale';

type Localised = 'games' | 'events' | 'venues' | 'pages';

/** Entries in one language, ordered by `order` where the collection has one. */
export async function entries<C extends Localised>(
  collection: C,
  locale: Locale,
): Promise<CollectionEntry<C>[]> {
  const list = await getCollection(collection, ({ id }) => id.startsWith(`${locale}/`));
  return list.sort((a, b) => {
    const orderA = 'order' in a.data ? Number(a.data.order) : 0;
    const orderB = 'order' in b.data ? Number(b.data.order) : 0;
    return orderA - orderB || a.id.localeCompare(b.id);
  });
}

/** The language-neutral slug of a localised entry, for example "baccarat" from "en/baccarat". */
export function slugOf(id: string): string {
  return id.slice(id.indexOf('/') + 1);
}

export async function page(locale: Locale, slug: string): Promise<CollectionEntry<'pages'>> {
  const entry = await getEntry('pages', `${locale}/${slug}`);
  if (!entry) throw new Error(`Missing page content: ${locale}/${slug}`);
  return entry;
}

export async function dataFor<C extends 'faqs' | 'packages'>(
  collection: C,
  locale: Locale,
): Promise<CollectionEntry<C>['data']> {
  const entry = await getEntry(collection, locale);
  if (!entry) throw new Error(`Missing ${collection} for ${locale}`);
  return entry.data;
}
