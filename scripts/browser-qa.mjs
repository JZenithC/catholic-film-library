/**
 * Browser QA against the built site in dist/ (run `npm run build` first).
 * Writes screenshots and browser-report.json to test-results/browser-qa/
 * (gitignored), or to $BROWSER_QA_OUT. Set PLAYWRIGHT_CHROMIUM_EXECUTABLE to
 * use an installed Chromium/Chrome instead of Playwright's download.
 */
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { server } from './serve.mjs';
import assert from 'node:assert/strict';

const out = path.resolve(
  process.env.BROWSER_QA_OUT ?? 'test-results/browser-qa',
);
const shots = path.join(out, 'screenshots');
await mkdir(shots, { recursive: true });
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const root = `http://127.0.0.1:${server.address().port}/catholic-film-library/`;
const films = JSON.parse(await readFile('src/data/films.json'));
const collections = JSON.parse(await readFile('src/data/collections.json'));
const posters = JSON.parse(await readFile('src/data/posters.json'));
// Grey-area cards are in the library too, hidden until included.
const publishedIds = new Set(
  films
    .filter((f) => f.status === 'PUBLISH' || f.status === 'GREY')
    .map((f) => f.id),
);
const expectedPosters = posters.filter((p) => publishedIds.has(p.id)).length;
const firstCollection =
  collections.find((c) => films.some((f) => f.collections.includes(c.id))) ??
  collections[0];
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
    : {}),
});
const report = {
  date: new Date().toISOString().slice(0, 10),
  pages: [],
  failures: [],
  interactions: [],
};
const routes = [
  ['home', ''],
  ['library', 'library/'],
  ['collections', 'collections/'],
  ['collection', `collections/${firstCollection.id}/`],
  ['film', `films/${films[0].slug}/`],
  ['essentials', 'essentials/'],
  ['a-z', 'a-z/'],
  ['principles', 'principles/'],
  ['image-credits', 'image-credits/'],
];
try {
  for (const [name, width, height] of [
    ['desktop', 1440, 1000],
    ['tablet', 820, 1180],
    ['mobile', 390, 844],
  ]) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    page.on('pageerror', (e) => report.failures.push(e.message));
    for (const [label, route] of routes) {
      const response = await page.goto(root + route);
      assert.equal(
        response.status(),
        200,
        `${route} returned ${response.status()}`,
      );
      await page.evaluate(() => document.fonts.ready);
      // Every <img> on the page must load and decode.
      const imageErrors = await page
        .locator('img')
        .evaluateAll(async (images) => {
          await Promise.all(
            images.map(async (img) => {
              img.loading = 'eager';
              try {
                await img.decode();
              } catch {
                /* Reported below. */
              }
            }),
          );
          return images
            .filter((img) => !img.complete || !img.naturalWidth)
            .map((img) => img.currentSrc || img.src);
        });
      for (const src of imageErrors)
        report.failures.push(`${name} ${label}: image failed to decode ${src}`);
      if (label === 'library') {
        const count = await page
          .locator('img[src*="/posters/"]')
          .evaluateAll(
            (images) =>
              new Set(images.map((img) => img.getAttribute('src'))).size,
          );
        if (count !== expectedPosters)
          report.failures.push(
            `${name} library: ${count} distinct poster images, expected ${expectedPosters} (posters.json entries for published films)`,
          );
      }
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      );
      if (overflow) report.failures.push(`${name} ${label}: overflow`);
      const axe = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      report.pages.push({
        viewport: name,
        page: label,
        overflow,
        violations: axe.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => n.target),
        })),
      });
      await page.screenshot({
        path: path.join(shots, `${name}-${label}.png`),
        fullPage: true,
      });
      if (label === 'home')
        await page.screenshot({
          path: path.join(shots, `${name}-home-viewport.png`),
        });
    }
    // Search smoke test, if the library still exposes the #q field and [data-film] cards.
    await page.goto(root + 'library/');
    if (
      (await page.locator('#q').count()) &&
      (await page.locator('[data-film]').count())
    ) {
      await page.locator('#q').fill(films[0].title);
      await page.waitForTimeout(150);
      assert.ok(
        await page.locator(`[data-film="${films[0].id}"]`).isVisible(),
        `Searching for "${films[0].title}" hides it`,
      );
      await page.locator('#q').fill('no-such-film-zzzz');
      await page.waitForTimeout(150);
      assert.equal(await page.locator('[data-film]:visible').count(), 0);
      report.interactions.push(`${name}: title search and empty state passed`);
    } else report.interactions.push(`${name}: search UI not found; skipped`);
    await context.close();
  }
  const page = await browser.newPage({ javaScriptEnabled: false });
  await page.goto(root + 'library/');
  for (const film of films)
    assert.ok(
      (await page.locator(`a[href$="/films/${film.slug}/"]`).count()) > 0,
      `No-JavaScript library is missing a link to ${film.slug}`,
    );
  await page.close();
  report.interactions.push('No-JavaScript library links to every film');
} catch (e) {
  report.failures.push(e.stack);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
  await writeFile(
    path.join(out, 'browser-report.json'),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  console.log(`Report and screenshots: ${out}`);
  if (report.failures.length || report.pages.some((p) => p.violations.length))
    process.exitCode = 1;
}
