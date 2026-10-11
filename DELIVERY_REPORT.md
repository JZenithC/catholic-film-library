# Delivery and verification record

11 October 2026. Independent editorial judgments are research-based; they are not ecclesiastical approvals or claims that every compiler personally viewed every film.

## Publication

- Repository: https://github.com/JZenithC/catholic-film-library
- Configured Pages address: https://jzenithc.github.io/catholic-film-library/
- Hosting verification: pending the first deployment at the time of this source commit. This section will be updated after an actual public HTTP/browser check.

## Catalogue and coverage

The canonical inventory contains **142 distinct candidates: 38 PUBLISH, 101 HOLD, 3 REJECT**. All 121 supplied starting entries have a decision crosswalk; 21 additional distinct candidates were investigated. Public recommendations span nine production countries. The registry preserves 288 distinct source URLs across all decisions, including unpublished research. Only PUBLISH records enter the website and public export.

Each published profile includes attributed evidence, a review date, an inclusion argument, Catholic themes, a synopsis, viewing cautions, and historical context or artistic liberties where applicable. Unknown facts are omitted or explicitly uncertain. A film's production/catalogue year is not necessarily its first broadcast or release date. Primary catalogues, broadcasters, distributors, film institutions and criticism are distinguished in the evidence. The Library's interpretation remains its own judgment.

The research programme is not exhaustive. English Martyrs and Cristero War collections currently contain no accepted recommendations. Africa, Asian production, animation, Portuguese-language and Latin American cinema need stronger coverage. Many starting candidates remain held because adequate identity, historical or moral-framing evidence was not established; their specific reasons survive in the inventory. Regional availability and every alternate cut or dub were not verified. No global streaming-availability claim is made.

## Delivered product

65 static HTML pages: home, library, essentials, 17 collection pages, collection index, 38 profiles, A–Z index, selection principles, about, sources, corrections and a custom 404. Collections cover Christ, Our Lady, saints, martyrs, the Vendée, Cristeros, Spain's Civil War, English Martyrs, priests, religious life, missionaries, families, comedy, pre-1965 cinema, cinema since 1965, documentaries and television.

Search supports accents, original and alternative titles and thematic metadata. Seven composable filters cover country, language, subject, format, period, decade and collection. Sorting, reset, empty states, URL persistence, related films, spoiler disclosure, source links, issue-based corrections and a public metadata export are implemented. The catalogue remains readable without JavaScript. Canonical URLs, sitemap, robots rules, Movie structured data, social metadata and a PNG sharing card are included.

## Engineering checks

- Astro/TypeScript diagnostics: 30 files, zero errors, warnings or hints.
- Schema/content validation: 38 public records and 17 collections pass.
- ESLint: pass. Six unit tests: pass, including unsafe source schemes, duplicate/conflicting identities, search normalization, combined filters and deterministic sorting.
- Production build: 65 pages. Internal link/asset check: 2,590 references pass with the GitHub Pages base path.
- Production-build Playwright checks: desktop 1440×1000, tablet 820×1180, phone 390×844. Eighteen page/viewport axe scans: zero detected violations, horizontal overflows or title-card crowding failures. Search, query refresh, all seven filters, sorting, reset, empty results, mobile navigation and no-JavaScript content passed. See `research/browser-report.json`.
- Visual inspection covered desktop/tablet/mobile home, library, collection and film layouts. Small-text contrast, long cover titles, tablet column widths and heading order were corrected. Automated checks do not certify complete accessibility or substitute for screen-reader/user testing.
- Local simulated-mobile Lighthouse: homepage performance 99, catalogue 97; accessibility and best practices 100 on both; CLS zero. These are lab samples, not real-user measurements. The local SEO score of 92 reflected the preview origin's robots route; hosted verification is recorded separately when available. See `research/performance-report.json`.
- External reference probe: 141 public-profile URLs; 124 returned successful HTTP responses, 13 returned 403 restrictions and four had network/timeout failures. No remaining 404 response in that probe. Those 17 URLs are unresolved by the automated probe, not certified live. Research access and source-attribution records remain separate from HTTP availability. See `research/external-link-check.json`.

## Design and licensing

Ivory, forest green and burgundy, restrained gold, locally served serif/sans typography, generous spacing and original architectural title cards form the visual system. No film posters, stills or promotional imagery are reproduced. Original artwork avoids speculative image rights. Both font families' complete SIL OFL notices are shipped. Film titles and cited third-party sources remain their owners' material; this repository grants no rights over them. See `IMAGE_CREDITS.md`.

## Maintenance and remaining action

Editorial policy, methodology, contribution instructions, maintenance guidance, image credits, independent review and subsequent resolutions are committed with the data. `npm run catalogue` derives the public catalogue from the canonical inventory. The Actions workflow validates before publishing. Future additions require source review and an explicit publication decision.

No Founder decision is needed for routine implementation or publication. The Founder retains final editorial authority. Broader regional research, unresolved HOLD assessments, restricted external links and optional human accessibility testing remain disclosed limitations, not silently completed checklist items.
