/**
 * Post-build check (run after `npm run build`; part of CI, not `npm test`).
 *
 *  - No HOLD/REJECT record's id or slug appears in any built page or data file.
 *  - Every built film page belongs to a public (PUBLISH or GREY) record, and
 *    every public record has a built page.
 *  - Every sitemap entry exists in dist/, and every indexable page is listed.
 *
 * Usage: node scripts/check-leak.mjs [dist-dir] (default: dist)
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { PUBLIC_STATUSES } from './schema.mjs';

export const BASE = '/catholic-film-library';
const TEXT = /\.(html|json|xml|txt|js|css|webmanifest)$/;
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

async function walk(dir, files = []) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) await walk(full, files);
    else files.push(full);
  }
  return files;
}
const isRedirectStub = (html) =>
  /^<!doctype html><title>Redirecting to:/i.test(html.trim());

export async function checkLeak({ distDir, inventory, base = BASE }) {
  const failures = [];
  // Grey-area films are public pages, so they are treated like PUBLISH.
  const isPublic = (f) => PUBLIC_STATUSES.includes(f.status);
  const published = inventory.filter(isPublic);
  const hidden = inventory.filter((f) => !isPublic(f));
  const publishedSlugs = new Set(published.map((f) => f.slug));
  const publicTokens = new Set(published.flatMap((f) => [f.id, f.slug]));
  // A hidden token that is also a published id/slug (or is a single common
  // word) is only searched for in unambiguous reference contexts.
  const patterns = [];
  for (const record of hidden)
    for (const token of new Set([record.id, record.slug].filter(Boolean))) {
      if (publicTokens.has(token)) continue;
      const t = escapeRe(token);
      const contexts = [
        `/films/${t}/`,
        `data-film="${t}"`,
        `"id":\\s*"${t}"`,
        `"slug":\\s*"${t}"`,
        `posters/${t}\\.webp`,
      ];
      if (token.includes('-')) contexts.push(`(?<![a-z0-9-])${t}(?![a-z0-9-])`);
      patterns.push([token, record.status, new RegExp(contexts.join('|'))]);
    }

  const files = await walk(distDir);
  const rel = (f) => path.relative(distDir, f).split(path.sep).join('/');
  const pages = new Set();
  for (const file of files) {
    const name = rel(file);
    if (name.startsWith('posters/')) {
      const id = name.slice('posters/'.length).replace(/\.webp$/, '');
      if (!publicTokens.has(id))
        failures.push(`Poster for an unpublished record in dist: ${name}`);
    }
    if (!TEXT.test(name)) continue;
    const text = await readFile(file, 'utf8');
    // Redirect stubs for withdrawn films keep their old public URLs working;
    // naming the old slug there is the point, not a leak.
    if (name.endsWith('index.html') && isRedirectStub(text)) continue;
    // External links (e.g. a festival page at /film/don-bosco/) are not leaks.
    const own = text.replace(/https?:\/\/[^\s"'<>)]+/g, (u) =>
      u.includes(base + '/') ? u : '',
    );
    for (const [token, status, re] of patterns)
      if (re.test(own))
        failures.push(`${status} record "${token}" appears in ${name}`);
    if (name.endsWith('index.html') && !isRedirectStub(text))
      pages.add(name.slice(0, -'index.html'.length));
  }

  const filmPages = [...pages].filter((p) => /^films\/[^/]+\/$/.test(p));
  for (const page of filmPages) {
    const slug = page.split('/')[1];
    if (!publishedSlugs.has(slug))
      failures.push(`Film page without a PUBLISH or GREY record: ${page}`);
  }
  for (const slug of publishedSlugs)
    if (!pages.has(`films/${slug}/`))
      failures.push(`Public record has no built page: films/${slug}/`);

  let sitemap = '';
  try {
    sitemap = await readFile(path.join(distDir, 'sitemap.xml'), 'utf8');
  } catch {
    failures.push('dist/sitemap.xml is missing');
  }
  const listed = new Set();
  for (const [, loc] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const pathname = decodeURIComponent(new URL(loc).pathname);
    if (!pathname.startsWith(base + '/')) {
      failures.push(`Sitemap entry outside ${base}/: ${loc}`);
      continue;
    }
    const page = pathname.slice(base.length + 1);
    listed.add(page);
    if (!pages.has(page)) failures.push(`Sitemap entry has no page: ${loc}`);
  }
  for (const page of pages)
    if (!listed.has(page) && page !== '404/')
      failures.push(`Page missing from sitemap: ${page || '(home)'}`);
  if (listed.has('404/')) failures.push('Sitemap lists the 404 page');

  try {
    const catalogue = JSON.parse(
      await readFile(path.join(distDir, 'catalogue.json'), 'utf8'),
    );
    for (const entry of catalogue)
      if (!publishedSlugs.has(entry.slug))
        failures.push(
          `catalogue.json lists a record that is neither PUBLISH nor GREY: ${entry.id}`,
        );
  } catch (e) {
    failures.push(`catalogue.json unreadable: ${e.message}`);
  }
  return {
    failures,
    stats: {
      files: files.length,
      pages: pages.size,
      filmPages: filmPages.length,
      sitemap: listed.size,
      hiddenRecords: hidden.length,
    },
  };
}

const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  const distDir = path.resolve(process.argv[2] ?? 'dist');
  const inventory = JSON.parse(
    await readFile('research/inventory.json', 'utf8'),
  );
  const { failures, stats } = await checkLeak({ distDir, inventory });
  if (failures.length) {
    console.error(failures.join('\n'));
    process.exit(1);
  }
  console.log(
    `No unpublished records in the build: ${stats.files} files, ${stats.pages} pages (${stats.filmPages} films), ${stats.sitemap} sitemap entries, ${stats.hiddenRecords} HOLD/REJECT records checked.`,
  );
}
