/*
 * Lighthouse CI on representative pages, mobile emulation (the default), against the budgets in CLAUDE.md.
 * SEO is reported but not asserted: preview builds are deliberately noindex.
 */
const { chromium } = require('playwright');

const PORT = 4331;
const pages = [
  '/',
  '/gaming/',
  '/gaming/baccarat/',
  '/whats-on/',
  '/packages/',
  '/visit/',
  '/about/',
  '/hi/',
];

module.exports = {
  ci: {
    collect: {
      startServerCommand: `npx tsx scripts/serve.ts ${PORT}`,
      startServerReadyPattern: 'Serving dist/',
      url: pages.map((path) => `http://localhost:${PORT}${path}`),
      numberOfRuns: 1,
      chromePath: chromium.executablePath(),
      settings: { chromeFlags: '--headless=new' },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.01 }],
        'total-blocking-time': ['error', { maxNumericValue: 100 }],
        'resource-summary:script:size': ['error', { maxNumericValue: 40960 }],
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci' },
  },
};
