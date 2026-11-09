import { en, type Strings } from '../i18n/en';
import { hi } from '../i18n/hi';
import { defaultLocale, isLocale, locales, type Locale } from './locale';

export { defaultLocale, fill, intlLocale, isLocale, locales, type Locale } from './locale';

const dictionaries: Record<Locale, Strings> = { en, hi };

export function strings(locale: Locale): Strings {
  return dictionaries[locale];
}

/** The site path for a page in a language, always with a trailing slash. */
export function localePath(locale: Locale, path = '/'): string {
  const trimmed = path.replace(/^\/+|\/+$/g, '');
  const prefix = locale === defaultLocale ? '' : `${locale}/`;
  const joined = `/${prefix}${trimmed}`;
  return joined.endsWith('/') ? joined : `${joined}/`;
}

/** Splits a pathname into its language and the language-neutral path. */
export function splitPath(pathname: string): { locale: Locale; path: string } {
  const [first, ...rest] = pathname.replace(/^\/+/, '').split('/');
  if (isLocale(first) && first !== defaultLocale) {
    return { locale: first, path: `/${rest.join('/')}` };
  }
  return { locale: defaultLocale, path: pathname.startsWith('/') ? pathname : `/${pathname}` };
}

/** The `[...lang]` route parameter for each language. */
export function langParams(): {
  params: { lang: string | undefined };
  props: { locale: Locale };
}[] {
  return locales.map((locale) => ({
    params: { lang: locale === defaultLocale ? undefined : locale },
    props: { locale },
  }));
}
