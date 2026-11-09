import type { APIRoute } from 'astro';
import { isDemo } from '../lib/demo';

/** Preview builds ask every crawler to stay away; launch builds allow everything. */
export const GET: APIRoute = () =>
  new Response(isDemo ? 'User-agent: *\nDisallow: /\n' : 'User-agent: *\nAllow: /\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
