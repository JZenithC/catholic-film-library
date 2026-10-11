# Poster update — 11 October 2026

All 38 published film profiles now have an actual release poster or video-release cover. The same artwork appears on the homepage, library, essentials, collections and related-film cards. Original title cards remain a future fallback. No film decisions or editorial text were changed.

All 38 source images were downloaded and visually checked against their film titles and identities. They are locally hosted WebP files, at most 500×750 pixels, preserving the complete image without cropping or upscaling. The entire set is 965,184 bytes. Main images load eagerly; catalogue images load lazily with intrinsic dimensions to reserve layout space.

Each image has its source, accurate poster/cover label, available credit, source rights statement and contextual use assessment recorded in `src/data/posters.json` and `research/poster-rights-review.json`. Profiles link to individual credits on the new public `/image-credits/` page. Copyrighted artwork is used as limited illustration of substantive film criticism, not claimed as freely licensed or authorized by Wikipedia. Source-stated US public-domain claims retain their jurisdictional limits. See `IMAGE_CREDITS.md`.

Validation: Astro/TypeScript (32 files) zero errors/warnings/hints; content/asset validation passed; ESLint passed; six unit tests passed; 66-page production build passed. The internal link/asset check passed. Twenty-one desktop/tablet/phone page scans, including the new credits page, found zero automated accessibility violations, broken poster images or overflow. All 38 catalogue images decoded at every tested viewport. Search, filters, query refresh, reset, sorting, navigation and no-JavaScript readability still passed. See `research/poster-browser-report.json`.

Hosted verification will be appended after the GitHub Pages deployment. Previous performance measurements in DELIVERY_REPORT.md describe the original release and are not a claim about this image update.
