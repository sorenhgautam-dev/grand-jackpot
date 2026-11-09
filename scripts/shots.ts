/*
 * Screenshots every built route at 390, 768 and 1440 wide, in Chromium and (where installed) WebKit.
 * Usage: npm run shots [-- /route/ /hi/route/]   Output: .shots/<browser>/<width>/<route>.png
 */
import { mkdir, readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { chromium, webkit, type BrowserType } from 'playwright';
import { serveDist } from './serve';

const PORT = 4329;
const WIDTHS = [390, 768, 1440];
const HEIGHT_FOR = (width: number) => (width < 600 ? 844 : width < 1000 ? 1024 : 900);

async function routes(dir = 'dist'): Promise<string[]> {
  const found: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== '_astro') found.push(...(await routes(path)));
    else if (entry.name === 'index.html') {
      const route = `/${relative('dist', dir).split(sep).join('/')}`;
      found.push(route === '/' ? '/' : `${route}/`);
    }
  }
  return found.sort();
}

async function shoot(type: BrowserType, list: string[]): Promise<void> {
  let browser;
  try {
    browser = await type.launch();
  } catch {
    console.log(`${type.name()} not installed; skipped`);
    return;
  }
  for (const width of WIDTHS) {
    const context = await browser.newContext({
      viewport: { width, height: HEIGHT_FOR(width) },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    page.on('console', (message) => {
      if (['error', 'warning'].includes(message.type())) {
        console.log(`  console ${message.type()} ${width}: ${message.text()}`);
      }
    });
    page.on('pageerror', (error) => console.log(`  page error ${width}: ${error.message}`));
    for (const route of list) {
      await page.goto(`${ORIGIN}${route}`, { waitUntil: 'networkidle' });
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight / 2) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 60));
        }
        window.scrollTo(0, 0);
        await document.fonts.ready;
        await Promise.all(
          [...document.images].map((image) =>
            image.complete ? null : image.decode().catch(() => null),
          ),
        );
      });
      await page.waitForTimeout(350);
      const name = route === '/' ? 'home' : route.replace(/^\/|\/$/g, '').replaceAll('/', '_');
      const dir = join('.shots', type.name(), String(width));
      await mkdir(dir, { recursive: true });
      await page.screenshot({ path: join(dir, `${name}.png`), fullPage: true });
    }
    await context.close();
  }
  await browser.close();
}

const requested = process.argv.slice(2);
const list = requested.length > 0 ? requested : await routes();
const { origin: ORIGIN, close } = await serveDist(PORT);
try {
  for (const type of [chromium, webkit]) await shoot(type, list);
  console.log(`Saved ${list.length} routes to .shots/`);
} finally {
  close();
}
