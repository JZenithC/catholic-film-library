# The Catholic Film Library

A Traditional Catholic Guide to Cinema. An independent static reference library with a pre-conciliar Catholic editorial perspective, film posters and release covers, and research-backed film profiles.

Repository: https://github.com/JZenithC/catholic-film-library

## Run locally

Use Node.js 24 LTS and npm. Install the exact dependency set with `npm ci`. Set `ASTRO_TELEMETRY_DISABLED=1` in your shell, then run `npm run dev`. The site uses the `/catholic-film-library/` base path even locally.

```sh
npm ci
npm run check
npm test
npm run build
node scripts/check-links.mjs
```

The public site is generated in `dist/`. No runtime API, database, analytics or remote font service is needed. `src/data/films.json` contains only accepted films. `research/inventory.json` preserves accepted, held and rejected candidates. Never copy the research inventory into a client script.

## Content and architecture

- Astro 7 static generation, TypeScript and Zod validation.
- Home, catalogue, essentials, 17 collections, film profiles, title index, selection principles, about, research, corrections and 404 pages.
- Browser-local accent-insensitive search; filters for period, decade, country, subject, format, language and collection; deterministic sorting and shareable query URLs.
- Public metadata export at `catalogue.json`; no internal rejected or pending records in it.
- Individually attributed source claims and last-review dates on profiles.
- Locally hosted, compressed posters and release covers with individual credits; original title-art fallback; local SIL OFL fonts. See `IMAGE_CREDITS.md` and `/image-credits/`.

## Editorial integrity

Read `EDITORIAL_POLICY.md` before changing a recommendation. A synopsis, studio endorsement or film's reputation alone is insufficient. A publication decision is the Library's judgment, not ecclesiastical approval. No compiler claims to have personally watched every film. The Founder retains final authority.

The scope is a systematic research programme, not a claim of exhaustive coverage. See `RESEARCH_METHODOLOGY.md`, `research/*-notes.md`, `research/INDEPENDENT_REVIEW.md` and `DELIVERY_REPORT.md` for actual coverage, gaps and verification limits. The larger requested research programme must not be represented as complete merely because the application builds.

## Browser checks

Install Chromium using `npx playwright install chromium`, then run `node scripts/browser-qa.mjs`. This launches a temporary local server with the production base path, tests desktop/tablet/phone, runs axe WCAG checks, tests search and filters, and records screenshots. The script defaults to `../../work` for local QA artifacts. Set `PLAYWRIGHT_BROWSERS_PATH` if browsers were installed outside Playwright's default directory. See the script for the checked viewports and interactions. Automation is not a complete accessibility certification.

## Deployment

The workflow in `.github/workflows/deploy.yml` follows the current official Astro GitHub Pages guide, checked on 11 October 2026: https://docs.astro.build/en/guides/deploy/github/ . It validates content, checks types, runs unit tests, builds and checks internal links before deployment. Use GitHub Actions as the Pages source. Only pushes to `main` deploy; pull requests validate without deploying.

Production origin and base path are in `astro.config.mjs`, `sitemap.xml.ts` and `robots.txt.ts`. If the domain changes, update all three and the source links. See `MAINTENANCE.md` for safe content and dependency changes.
