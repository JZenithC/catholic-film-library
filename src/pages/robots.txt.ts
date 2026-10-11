import type { APIRoute } from 'astro';
import { url } from '../data/catalogue';
// Informational only: crawlers read robots.txt at the host root, not under a
// project base path, so submit the sitemap to search engines directly.
export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('Set `site` in astro.config.mjs');
  return new Response(
    `User-agent: *\nAllow: /\nSitemap: ${new URL(url('sitemap.xml'), site).href}\n`,
    { headers: { 'Content-Type': 'text/plain' } },
  );
};
