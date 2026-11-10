import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const env = process.env;
const deployUrl =
  env.SITE_URL ??
  (env.VERCEL_PROJECT_PRODUCTION_URL && `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`) ??
  env.URL ??
  env.CF_PAGES_URL ??
  'http://localhost:4321';

export default defineConfig({
  site: deployUrl,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  i18n: {
    locales: ['en', 'hi'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  image: {
    layout: 'constrained',
    responsiveStyles: true,
    breakpoints: [360, 480, 640, 768, 960, 1280, 1600, 1920],
  },
  fonts: [
    {
      // Headings in both languages: a high-contrast display serif with Devanagari.
      provider: fontProviders.google(),
      name: 'Rozha One',
      cssVariable: '--font-rozha',
      weights: ['400'],
      styles: ['normal'],
      subsets: ['latin', 'devanagari'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      // The giant English words only (hero, marquee, footer wordmark): Latin is enough.
      provider: fontProviders.google(),
      name: 'Archivo Black',
      cssVariable: '--font-archivo',
      weights: ['400'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Arial', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Mukta',
      cssVariable: '--font-mukta',
      weights: ['400', '600'],
      styles: ['normal'],
      subsets: ['latin', 'devanagari'],
      fallbacks: ['Arial', 'sans-serif'],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
