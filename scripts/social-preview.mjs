import { chromium } from '@playwright/test';
import { server } from './serve.mjs';
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.goto(
    `http://127.0.0.1:${server.address().port}/catholic-film-library/social.svg`,
  );
  await page.screenshot({ path: 'public/social.png' });
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
