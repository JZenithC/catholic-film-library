import type { APIRoute } from 'astro';
import { publicFilms, url } from '../data/catalogue';
import added from '../data/additions.json';

// RSS 2.0 feed of the 60 most recently added films.
export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('Set `site` in astro.config.mjs');
  const dates = added as Record<string, string>;
  const escape = (s: string) =>
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  const abs = (p: string) => new URL(url(p), site).href;
  const rfc822 = (d: string) => new Date(`${d}T12:00:00Z`).toUTCString();
  const items = publicFilms
    .filter((f) => dates[f.id])
    .sort(
      (a, b) =>
        dates[b.id].localeCompare(dates[a.id]) || a.title.localeCompare(b.title, 'en'),
    )
    .slice(0, 60);
  const latest = items[0] ? dates[items[0].id] : '2026-10-11';
  const body = items
    .map((f) => {
      const link = abs(`films/${f.slug}/`);
      const kind = f.grey ? 'Grey area' : 'Recommended';
      return `<item><title>${escape(`${f.title} (${f.year})`)}</title><link>${link}</link><guid isPermaLink="true">${link}</guid><pubDate>${rfc822(dates[f.id])}</pubDate><category>${kind}</category><description>${escape(`${kind}. ${f.summary}`)}</description></item>`;
    })
    .join('');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>The Catholic Film Library: new films</title><link>${abs('new/')}</link><atom:link href="${abs('feed.xml')}" rel="self" type="application/rss+xml"/><description>Films newly added to the Catholic Film Library.</description><language>en-gb</language><lastBuildDate>${rfc822(latest)}</lastBuildDate>${body}</channel></rss>`,
    { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } },
  );
};
