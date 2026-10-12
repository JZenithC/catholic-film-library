# The Catholic Film Library

An independent static guide to films about the Catholic faith. The site does not accept the Second Vatican Council or the reforms that followed it, and judges films by Catholic teaching as it stood before the Council. See `EDITORIAL_POLICY.md`.

Repository: https://github.com/JZenithC/catholic-film-library

## Run locally

Use Node.js 24 LTS and npm. Install the exact dependency set with `npm ci`. Set `ASTRO_TELEMETRY_DISABLED=1` in your shell, then run `npm run dev`. The site uses the `/catholic-film-library/` base path even locally.

```sh
npm ci
npm run catalogue      # regenerate public data from research/inventory.json
npm run check          # astro check, then content, poster and rights validation
npm run lint
npm test
npm run build
npm run check:build    # internal links, then the unpublished-record leak check
```

The public site is generated in `dist/`. No runtime API, database, analytics or remote font service is needed.

## Data

- `research/inventory.json` is the canonical record of every candidate. Each has a status (PUBLISH, GREY, HOLD or REJECT) and a decision text.
- `npm run catalogue` writes `src/data/films.json` (PUBLISH and GREY records only), `src/data/research-summary.json`, `research/source-registry.json` and the status column of `research/starting-inventory-crosswalk.json`. Do not edit those files by hand. The deploy workflow fails if they are stale.
- `src/data/featured.json` lists the homepage's featured films (recommended films only). `src/data/collections.json` holds the collections, `src/data/grey-area.json` the text of the grey-area page and `src/data/editorial-pages.json` the principles, about, sources and corrections pages.
- `src/data/saints.json` holds the saints index and the movable-feast entries of the calendar; `src/data/guides.json` the guides; `src/data/not-included.json` the films-not-included page; `src/data/additions.json` the date each film was published, kept by `npm run catalogue` for the New films page and `feed.xml`. Saints and feasts carry optional `readings` (further reading). Film records carry optional `legion` (Legion of Decency rating) and `watch`/`watchChecked` (where to watch) fields.
- `research/editorial-notes.json` holds evidence notes and poster leads for each record. It is not published on the site.
- Never copy the research inventory into a client script. HOLD and REJECT records must not reach the build, and `scripts/check-leak.mjs` enforces this.

## What the site shows

There are three public outcomes:

- **Recommended** (PUBLISH).
- **Grey area** (GREY). This is a full film page that opens with a box stating the open question. The record carries `grey: {kind, question}`, where `kind` is either `reservations` (a real doctrinal, moral or historical question) or `unverified` (Catholic-centred, but not yet independently reviewed). Grey films are left out of the default library view, featured films, Start here and the homepage. You can find them through search with the grey-area toggle, the A–Z page, collection sub-lists and `/grey-area/`.
- HOLD and REJECT records are not published.

Current counts are in `src/data/research-summary.json`.

## Content and architecture

- Astro 7 static generation, TypeScript and Zod validation (`scripts/schema.mjs`, `scripts/validate.mjs`).
- Pages: home, library (with sidebar filters), Start here (`/essentials/`), collections in three groups, film pages, A–Z, grey area, saints, calendar, guides, films not included, watching with children (`/family/`), new films (`/new/`, with an RSS feed at `/feed.xml`), a printable list (`/print/`), how films are chosen, about, sources, corrections, image credits and a custom 404. Withdrawn film and collection URLs redirect to `/library/` (see `astro.config.mjs`).
- Search runs locally in the browser. It ignores accents, folds ß, æ and œ, and matches word prefixes. You can filter by period, decade, country, subject, format, language and collection, and the query URLs can be shared.
- The schema enforces controlled vocabularies for format, historical period and collection group.
- There is a public metadata export at `catalogue.json` (recommended and grey-area records only).
- The design system is in `src/styles/global.css`. It uses Cormorant Garamond and Source Sans 3 (self-hosted, SIL OFL) and a paper-and-ink palette. Every poster on the site links to its film's review. The three large images at the top of the homepage are limited to public-domain and openly licensed posters; the homepage "Start here" shelf, collection tiles and collection headings use linked thumbnails. Posters are never used as backgrounds, banners or social-preview images. A film without a poster gets a typographic title card.
- Posters and release covers are local WebP files, each with its own credit and rights category. See `IMAGE_CREDITS.md`, `research/poster-rights-review.json` and `/image-credits/`.

## Licence

Code and original design are under MIT. Research data and original editorial text are under CC BY 4.0. Film posters and other film imagery are excluded from both. See `LICENSE`.

## Editorial integrity

Read `EDITORIAL_POLICY.md` before changing a decision. The film pages are written from published criticism, histories, archive records and release details; no film was watched for this site. A recommendation is an editorial judgment, not ecclesiastical approval.

The research is selective, not exhaustive. See `RESEARCH_METHODOLOGY.md` and the gap notes on each collection.

## Browser checks

Run `npm run build`, then `npm run test:browser` (`scripts/browser-qa.mjs`). The script serves `dist/` locally under the production base path, checks desktop, tablet and phone layouts and runs axe WCAG scans. It also exercises search and filters and decodes every poster. Screenshots and `browser-report.json` go to `test-results/browser-qa/`, or to `$BROWSER_QA_OUT` if set. It needs a local Chromium: either run `npx playwright install chromium` or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to an installed Chromium or Chrome. Automated checks do not amount to an accessibility certification.

## Deployment

`.github/workflows/deploy.yml` builds on every push and pull request and deploys to GitHub Pages only from `main`. The actions are pinned to commit SHAs. The workflow is read-only by default, and only the deploy job gets Pages and OIDC permissions. The build step runs these in order:

1. `npm run catalogue`
2. `git diff --exit-code -- src/data research` (fails if the generated data is stale)
3. `npm run check`
4. `npm run lint`
5. `npm test`
6. `npm run build`
7. `check-links`
8. `check-leak`

Dependabot (`.github/dependabot.yml`) proposes monthly updates to the pinned actions. Use GitHub Actions as the Pages source.

The production origin and base path are set in `astro.config.mjs`, `src/pages/sitemap.xml.ts`, `src/pages/robots.txt.ts` and `scripts/check-leak.mjs`. If the domain changes, update all of them. See `MAINTENANCE.md` for content and dependency changes.
