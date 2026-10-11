import { readFile, writeFile } from 'node:fs/promises';
const films = JSON.parse(await readFile('src/data/films.json', 'utf8'));
const urls = [...new Set(films.flatMap((f) => f.sources.map((s) => s.url)))];
const results = [];
let cursor = 0;
async function worker() {
  while (cursor < urls.length) {
    const url = urls[cursor++];
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(15000),
        headers: { 'User-Agent': 'CatholicFilmLibrary-LinkCheck/1.0' },
        redirect: 'follow',
      });
      await response.body?.cancel();
      results.push({
        url,
        status: response.status,
        finalURL: response.url,
        checked: '2026-10-11',
      });
    } catch (e) {
      results.push({
        url,
        status: 'unresolved',
        error: e.message,
        checked: '2026-10-11',
      });
    }
  }
}
await Promise.all(Array.from({ length: 6 }, worker));
await writeFile(
  'research/external-link-check.json',
  JSON.stringify(results, null, 2),
);
console.log(
  JSON.stringify(
    {
      checked: results.length,
      ok: results.filter((r) => r.status >= 200 && r.status < 400).length,
      attention: results.filter((r) => !(r.status >= 200 && r.status < 400)),
    },
    null,
    2,
  ),
);
