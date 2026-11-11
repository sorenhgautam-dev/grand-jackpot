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
      // Headings: Fraunces, a soft, slightly wonky old-style serif with a lively italic.
      // Variable weight. Latin only, so Devanagari falls through to Tiro below (no generic
      // family here, or it would catch Devanagari first).
      provider: fontProviders.google(),
      name: 'Fraunces',
      cssVariable: '--font-fraunces',
      weights: ['300 800'],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Georgia'],
    },
    {
      // Hindi headings: a calm book serif with an italic, to sit beside Fraunces.
      provider: fontProviders.google(),
      name: 'Tiro Devanagari Hindi',
      cssVariable: '--font-tiro',
      weights: ['400'],
      styles: ['normal', 'italic'],
      subsets: ['devanagari'],
      fallbacks: ['Georgia', 'serif'],
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
