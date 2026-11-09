import { site } from '../data/site';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** schema.org Casino for the home page, built from the site facts. */
export function casinoJsonLd(url: URL, image: URL): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Casino',
    name: site.name,
    url: url.href,
    image: image.href,
    telephone: site.phones,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressCountry: site.address.countryCode,
    },
    containedInPlace: { '@type': 'Hotel', name: site.hotel },
    openingHoursSpecification: site.hours.flatMap((intervals, day) =>
      intervals.map(({ open, close }) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${days[day]}`,
        opens: open,
        closes: close === '24:00' ? '23:59' : close,
      })),
    ),
    publicAccess: true,
    isAccessibleForFree: site.freeEntry,
  };
}
