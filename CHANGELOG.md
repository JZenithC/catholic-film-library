# Changelog

## 2026-10-11 — editorial and design pass (branch `improve/editorial-pass`, not yet deployed)

See IMPROVEMENT_REPORT.md for the full account, counts and film lists.

### Catalogue and film pages (12 October)

- Researched about 210 more candidates in three waves and resolved the old holds. The site now has 238 public films: 97 recommended and 141 grey area.
- Rejected lost films, unattested entries, and films about modern or unapproved apparitions.
- Film pages gained the following, each fact-checked against opened sources:
  - cast and crew;
  - an age band with reasons;
  - theological notes citing pre-conciliar authorities only;
  - "The history behind it" and "Making the film".
- "How films are chosen" now states the apparition rule and explains the age guidance.
- Added a Conversion collection.
- Added posters for 92 more films across this pass (29 earlier, 63 now); 186 public films have one.
### Design (12 October)

- Homepage: hero with three public-domain or openly licensed posters, a "Start here" poster shelf in place of the numbered list, and collection tiles with three linked poster thumbnails. Collections index uses the same tiles; collection pages show up to four posters beside the heading. Every poster on the site links to its film's review. The three large images at the top of the homepage are limited to public-domain and openly licensed posters; the homepage "Start here" shelf, collection tiles and collection headings use linked thumbnails. Posters are never used as backgrounds, banners or social-preview images. Rights assessment updated in research/poster-rights-review.json.

### Editorial

- Stated the Founder's position publicly: the site does not accept the Second Vatican Council or the reforms after it, and judges films by pre-conciliar Catholic teaching. Added two exclusion rules (Founder rulings): (a) subjects recognised as saint or blessed only by a canonisation or beatification after 1965; (b) films whose Catholic content is the post-conciliar Church presented as normal or exemplary.
- Restricted post-conciliar bodies and publications (CNS/USCCB, post-1965 Vatican statements, the 1992 Catechism, the 1995 Vatican film list) to factual citation. Legion of Decency and other pre-1965 Catholic film-office ratings are accepted as evidence. Added Mortalium animos and the Roman Catechism to the reference texts.
- Narrowed scope to Catholic-centred films. Removed The Sound of Music and On the Waterfront.
- Added the grey-area outcome (status GREY, record field `grey: {kind, question}`, kinds "reservations" and "unverified"), a `/grey-area/` page and a grey-area box on film pages.
- Removed nine films from the site and redirected their URLs to `/library/`. Moved The War of the Vendée and Don Bosco (1935) to the grey area. Added 21 recommended films and 18 grey-area films.
- Rewrote every published record in a plain critic's voice, with new page headings. Added `research/editorial-notes.json`.
- Normalised format, historical period and subject vocabularies. Reorganised the collections into three groups (Subjects, Histories, Kinds of film) with gap notes, and removed the before-1965 and after-1965 collections.

### Design

- New design system in `src/styles/global.css`: Cormorant Garamond and Source Sans 3, paper-and-ink palette. No images on the homepage; posters only on film pages and cards.
- Library sidebar filters, related-film scoring, a new A–Z page, Start here page and grey-area page, and a header that fits at 320 px.

### Posters

- Replaced low-resolution, watermarked and wrong-type images, including the homepage Rockwell hero, with sharper correct-edition posters, preferring public-domain and openly licensed images. Every poster has a `rightsCategory`. Films without a usable poster show a typographic title card. See IMAGE_CREDITS.md and `research/poster-rights-review.json`.

### Engineering

- Deploy workflow: least-privilege permissions, SHA-pinned actions, and a build step that runs catalogue, a stale-data `git diff` check, check, lint, test, build, check-links and check-leak. Deploys only from `main`.
- Added Dependabot for GitHub Actions, a rights-request issue template and a LICENSE (MIT for code, CC BY 4.0 for research text, posters excluded).
- Schema enums for format, period and collection group. Validation of grey records, WebP headers, poster/rights consistency and a style lint (warnings only).
- New `scripts/check-leak.mjs`, which skips redirect stubs. Search folds ß, æ and œ and matches word prefixes. `browser-qa` accepts `PLAYWRIGHT_CHROMIUM_EXECUTABLE` and writes to `test-results/browser-qa/`.

## 2026-10-11 — posters and release covers

- Replaced generated title cards with sourced posters or release covers for all 38 films then published, including the homepage, catalogue, essentials, collections and related films. (Several of these images were later replaced or withdrawn in the editorial pass above.)
- Added local compressed WebP assets, uncropped image proportions, intrinsic dimensions, lazy loading and priority loading for main images.
- Added individual source credits, artwork-type labels and editorial-use assessments, with a public poster-credits page.
- Extended validation and responsive browser checks to cover poster files and decoding. Kept title cards for records without an image.

## 2026-10-11 — initial implementation and research

- Created the static Astro architecture and the original editorial design.
- Added candidate decisions, source evidence and primary doctrinal references.
- Implemented all required page types, 17 thematic routes, search, filters and exports.
- Added schema, search, base-path and browser accessibility tests.
- Created the separate JZenithC/catholic-film-library repository.

See DELIVERY_REPORT.md for that release's verified publication status. This entry is not a claim that the whole international research programme is complete.
