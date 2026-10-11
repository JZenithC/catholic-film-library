import { films, collections, url } from '../data/catalogue';
export const GET = () => {
  const paths = [
    '',
    'library/',
    'essentials/',
    'collections/',
    'a-z/',
    'principles/',
    'about/',
    'sources/',
    'corrections/',
    ...films.map((f) => `films/${f.slug}/`),
    ...collections.map((c) => `collections/${c.id}/`),
  ];
  return new Response(
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      paths
        .map((p) => `<url><loc>https://jzenithc.github.io${url(p)}</loc></url>`)
        .join('') +
      '</urlset>',
    { headers: { 'Content-Type': 'application/xml' } },
  );
};
