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
      provider: fontProviders.google(),
      name: 'Eczar',
      cssVariable: '--font-eczar',
      weights: ['500', '600'],
      styles: ['normal'],
      subsets: ['latin', 'devanagari'],
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
