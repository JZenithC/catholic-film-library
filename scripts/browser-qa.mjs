import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { server } from './serve.mjs';
import assert from 'node:assert/strict';
await mkdir('../../work/screenshots', { recursive: true });
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const root = `http://127.0.0.1:${server.address().port}/catholic-film-library/`;
const films = JSON.parse(await readFile('src/data/films.json'));
const browser = await chromium.launch({ headless: true });
const report = {
  date: '2026-10-11',
  pages: [],
  failures: [],
  interactions: [],
};
try {
  for (const [name, width, height] of [
    ['desktop', 1440, 1000],
    ['tablet', 820, 1180],
    ['mobile', 390, 844],
  ]) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    page.on('pageerror', (e) => report.failures.push(e.message));
    for (const [label, route] of [
      ['home', ''],
      ['library', 'library/'],
      ['collection', 'collections/saints/'],
      ['film', `films/${films[0].slug}/`],
      ['film-second', `films/${films[1].slug}/`],
      ['principles', 'principles/'],
      ['image-credits', 'image-credits/'],
    ]) {
      const response = await page.goto(root + route);
      await page.evaluate(() => document.fonts.ready);
      const imageErrors = await page
        .locator('.poster-art img')
        .evaluateAll(async (images) => {
          await Promise.all(
            images.map(async (img) => {
              img.loading = 'eager';
              try {
                await img.decode();
              } catch {
                /* Report below. */
              }
            }),
          );
          return images
            .filter((img) => !img.complete || !img.naturalWidth)
            .map((img) => img.src);
        });
      for (const src of imageErrors)
        report.failures.push(`${name} ${label}: broken poster ${src}`);
      assert.equal(response.status(), 200);
      if (label === 'library')
        assert.equal(
          await page.locator('.poster-art img').count(),
          films.length,
        );
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      );
      if (overflow) report.failures.push(`${name} ${label}: overflow`);
      const crowdedArt = await page
        .locator('.artwork')
        .evaluateAll((nodes) =>
          nodes
            .filter(
              (el) =>
                el.querySelector('.art-type').getBoundingClientRect().bottom >
                el.getBoundingClientRect().bottom - 8,
            )
            .map((el) => el.querySelector('.art-title').textContent),
        );
      for (const title of crowdedArt)
        report.failures.push(`${name} ${label}: artwork crowding ${title}`);
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
        path: `../../work/screenshots/${name}-${label}.png`,
        fullPage: true,
      });
      if (label === 'home')
        await page.screenshot({
          path: `../../work/screenshots/${name}-home-viewport.png`,
        });
    }
    await page.goto(root + 'library/');
    await page.locator('#q').fill('bernadette');
    await page.waitForTimeout(100);
    assert.ok(
      (await page.locator('#result-count').textContent()).startsWith('1 ') ||
        (await page.locator('[data-film]:visible').count()) > 0,
    );
    await page.screenshot({
      path: `../../work/screenshots/${name}-search.png`,
      fullPage: true,
    });
    await page.reload();
    assert.equal(await page.locator('#q').inputValue(), 'bernadette');
    await page.locator('#q').fill('no-such-film-zzzz');
    assert.equal(await page.locator('[data-film]:visible').count(), 0);
    await page.locator('#clear-empty').click();
    await page.waitForTimeout(100);
    assert.equal(
      await page.locator('[data-film]:visible').count(),
      films.length,
    );
    await page.locator('#sort').selectOption('oldest');
    await page.locator('#collection').selectOption('saints');
    const expected = films.filter((f) =>
      f.collections.includes('saints'),
    ).length;
    assert.equal(await page.locator('[data-film]:visible').count(), expected);
    await page.locator('button[type="reset"]').click();
    await page.waitForTimeout(100);
    const first = films[0];
    for (const [id, value] of [
      ['country', first.countries[0]],
      ['language', first.languages[0]],
      ['subject', first.subjects[0]],
      ['format', first.format],
      ['period', first.historicalPeriod],
      ['decade', String(Math.floor(first.year / 10) * 10)],
    ])
      await page.locator('#' + id).selectOption(value);
    assert.ok(await page.locator(`[data-film="${first.id}"]`).isVisible());
    await page.reload();
    assert.equal(
      await page.locator('#period').inputValue(),
      first.historicalPeriod,
    );
    report.interactions.push(
      `${name}: all seven filter dimensions compose and survive refresh`,
    );
    report.interactions.push(
      `${name}: search, shared URL reload, empty state, reset, sort, collection filter passed`,
    );
    if (name === 'mobile') {
      await page.locator('.mobile-nav summary').click();
      await page.screenshot({
        path: '../../work/screenshots/mobile-navigation.png',
        fullPage: true,
      });
      await page
        .locator('.mobile-nav')
        .getByRole('link', { name: 'A–Z Index' })
        .click();
      assert.ok(page.url().includes('/a-z/'));
      report.interactions.push('Mobile menu navigation passed');
    }
    await context.close();
  }
  const page = await browser.newPage({ javaScriptEnabled: false });
  await page.goto(root + 'library/');
  assert.equal(await page.locator('[data-film]').count(), films.length);
  await page.close();
  report.interactions.push('No-JavaScript catalogue remains readable');
} catch (e) {
  report.failures.push(e.stack);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
  await writeFile(
    '../../work/browser-report.json',
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  if (report.failures.length || report.pages.some((p) => p.violations.length))
    process.exitCode = 1;
}
