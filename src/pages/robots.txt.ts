export const GET = () =>
  new Response(
    'User-agent: *\nAllow: /\nSitemap: https://jzenithc.github.io/catholic-film-library/sitemap.xml\n',
    { headers: { 'Content-Type': 'text/plain' } },
  );
