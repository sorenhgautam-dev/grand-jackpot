/*
 * Serves dist/ the way a static host does: directories resolve to index.html,
 * missing paths get 404.html with a 404 status, and text is compressed as hosts do.
 * Used by shots, links and Lighthouse.
 */
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer, type Server } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { createBrotliCompress, createGzip } from 'node:zlib';

const ROOT = 'dist';
const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

async function resolve(urlPath: string): Promise<string | null> {
  const clean = normalize(decodeURIComponent(urlPath.split('?')[0] ?? '/')).replace(
    /^(\.\.[/\\])+/,
    '',
  );
  const candidate = join(ROOT, clean);
  try {
    const info = await stat(candidate);
    if (info.isFile()) return candidate;
    const index = join(candidate, 'index.html');
    if ((await stat(index)).isFile()) return index;
  } catch {
    return null;
  }
  return null;
}

export async function serveDist(port: number): Promise<{ origin: string; close: () => void }> {
  const server: Server = createServer((request, response) => {
    void (async () => {
      const file = await resolve(request.url ?? '/');
      const path = file ?? join(ROOT, '404.html');
      const type = TYPES[extname(path)] ?? 'application/octet-stream';
      const accepts = String(request.headers['accept-encoding'] ?? '');
      const compressible = /^(text|application\/json|image\/svg)/.test(type);
      const encoding = !compressible
        ? null
        : accepts.includes('br')
          ? 'br'
          : accepts.includes('gzip')
            ? 'gzip'
            : null;
      response.writeHead(file ? 200 : 404, {
        'Content-Type': type,
        ...(encoding && { 'Content-Encoding': encoding, Vary: 'Accept-Encoding' }),
      });
      const stream = createReadStream(path);
      if (encoding === 'br') stream.pipe(createBrotliCompress()).pipe(response);
      else if (encoding === 'gzip') stream.pipe(createGzip()).pipe(response);
      else stream.pipe(response);
    })();
  });
  await new Promise<void>((done) => server.listen(port, done));
  return { origin: `http://localhost:${port}`, close: () => server.close() };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { origin } = await serveDist(Number(process.argv[2] ?? 4331));
  console.log(`Serving dist/ at ${origin}`);
}
