/** Language codes and Intl settings, kept free of strings so client scripts stay small. */
export const locales = ['en', 'hi'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

/** BCP 47 tags for Intl, following Indian conventions for both languages. */
export const intlLocale: Record<Locale, string> = { en: 'en-IN', hi: 'hi-IN' };

export function isLocale(value: string | undefined): value is Locale {
  return locales.some((locale) => locale === value);
}

/** Replaces `{key}` placeholders. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
