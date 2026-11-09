/*
 * Crawls the built site from the home page in both languages and fails on any broken link or anchor.
 * External links (the maps link) are skipped: they need the network and aren't ours to fix.
 */
import { check } from 'linkinator';
import { serveDist } from './serve';

const PORT = 4330;

const { origin: ORIGIN, close } = await serveDist(PORT);
let failed = false;
try {
  for (const start of ['/', '/hi/', '/404.html']) {
    const result = await check({
      path: `${ORIGIN}${start}`,
      recurse: true,
      checkFragments: true,
      linksToSkip: (link) => Promise.resolve(!link.startsWith(ORIGIN)),
    });
    const broken = result.links.filter((link) => link.state === 'BROKEN');
    console.log(`${start}: ${result.links.length} links checked, ${broken.length} broken`);
    for (const link of broken) {
      console.log(`  ${link.status ?? ''} ${link.url} (from ${link.parent ?? 'start'})`);
    }
    if (broken.length > 0) failed = true;
  }
} finally {
  close();
}
process.exit(failed ? 1 : 0);
