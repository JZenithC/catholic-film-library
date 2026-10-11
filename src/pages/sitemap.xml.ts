import type { APIRoute } from 'astro';
import { publicFilms, collections, url } from '../data/catalogue';
import pages from '../data/editorial-pages.json';

// Every indexable page. The 404 page and redirect stubs are deliberately absent.
export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('Set `site` in astro.config.mjs');
  const paths = [
    '',
    'library/',
    'essentials/',
    'collections/',
    'grey-area/',
    'a-z/',
    ...Object.keys(pages).map((page) => `${page}/`),
    'image-credits/',
    ...publicFilms.map((f) => `films/${f.slug}/`),
    ...collections.map((c) => `collections/${c.id}/`),
  ];
  const escape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return new Response(
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      [...new Set(paths)]
        .map(
          (p) => `<url><loc>${escape(new URL(url(p), site).href)}</loc></url>`,
        )
        .join('') +
      '</urlset>',
    { headers: { 'Content-Type': 'application/xml' } },
  );
};
