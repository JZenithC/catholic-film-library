# Poster update — 11 October 2026

All 38 published film profiles now have an actual release poster or video-release cover. The same artwork appears on the homepage, library, essentials, collections and related-film cards. Original title cards remain a future fallback. No film decisions or editorial text were changed.

All 38 source images were downloaded and visually checked against their film titles and identities. They are locally hosted WebP files, at most 500×750 pixels, preserving the complete image without cropping or upscaling. The entire set is 965,184 bytes. Main images load eagerly; catalogue images load lazily with intrinsic dimensions to reserve layout space.

Each image has its source, accurate poster/cover label, available credit, source rights statement and contextual use assessment recorded in `src/data/posters.json` and `research/poster-rights-review.json`. Profiles link to individual credits on the new public `/image-credits/` page. Copyrighted artwork is used as limited illustration of substantive film criticism, not claimed as freely licensed or authorized by Wikipedia. Source-stated US public-domain claims retain their jurisdictional limits. See `IMAGE_CREDITS.md`.

Validation: Astro/TypeScript (32 files) zero errors/warnings/hints; content/asset validation passed; ESLint passed; six unit tests passed; 66-page production build passed. The internal link/asset check passed. Twenty-one desktop/tablet/phone page scans, including the new credits page, found zero automated accessibility violations, broken poster images or overflow. All 38 catalogue images decoded at every tested viewport. Search, filters, query refresh, reset, sorting, navigation and no-JavaScript readability still passed. See `research/poster-browser-report.json`.

Previous performance measurements in DELIVERY_REPORT.md describe the original release. The current image update was verified separately below.

## Verified public deployment

Product commit: `b8406c5266c29241808271ef14a86da61c150344`. GitHub Actions build and deployment succeeded: https://github.com/JZenithC/catholic-film-library/actions/runs/38165748390 . Public site: https://jzenithc.github.io/catholic-film-library/ .

All 38 hosted poster URLs returned HTTP 200 with WebP content. Eight additional live desktop/phone views (homepage, catalogue, film profile, credits) passed image decoding and accessibility checks with no page errors or overflow. Both catalogue views contained all 38 real images. The profile source-credit link was verified. See `research/poster-hosted-report.json`.

A fresh hosted simulated-mobile Lighthouse sample scored 100 for performance, accessibility, best practices and SEO on both home and catalogue. LCP was 1.7 seconds and 1.5 seconds respectively; CLS was zero. These are lab samples, not guarantees for all devices or networks. See `research/poster-performance.json`. No Founder action is required.
