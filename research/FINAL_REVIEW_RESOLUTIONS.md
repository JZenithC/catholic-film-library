# Review findings and resolutions — 11 October 2026

The independent reports record findings against intermediate snapshots. This file records the lead editor/engineer's subsequent corrections; it does not replace the reviewers' original findings.

## Editorial and factual

- All 121 starting entries map to a distinct decision in `starting-inventory-crosswalk.json`; the canonical inventory contains 142 distinct candidates. The duplicate Pius X discovery was merged with both source sets retained.
- The selection expanded from the reviewed 21-film snapshot to 38 recommendations. Nine production countries are represented. The public Sources page identifies gaps rather than claiming exhaustive international coverage. The English Martyrs and Cristero collections remain empty.
- The Passion of the Christ now records the documented controversy about its portrayal of Jewish opponents, distinguishes the criticism from the Library's interpretation, and expressly rejects collective Jewish guilt.
- Duns Scotus uses the primary festival catalogue's 2010 identification, with the 2011 award/catalogue distinction and the unverified exact first-release date disclosed. The public fact label is “Year,” avoiding a false claim of an exact release date for every production.
- No Greater Love explicitly identifies the prioress's speculation about unbelief and death, explains its context within the Resurrection structure, and limits the recommendation to prepared adults. It and Into Great Silence are not described as records of universally pre-conciliar practice.
- Rai primary sources supply Don Bosco's original title, 2004 television identity and broadcast dates; BFI corroborates No Greater Love's identity.
- Ten final metadata patches added edition-aware language evidence and corrected original-title fields. The patch evidence is preserved in `metadata-corrections.json` and merged into the canonical inventory; sources do not conflate an English dub with an original language.
- Stronger source-based reviews resolved Un Dios prohibido and The War of the Vendée. The latter's composite events and contested historical interpretation are disclosed. Quo Vadis remains HOLD with a specific question about moral framing.
- Several failed citation URLs were replaced with live institutional records or removed when adequate remaining evidence existed. HTTP restrictions and timeouts are recorded separately from confirmed dead links.

## Engineering and design

- Constrained source URLs to HTTP(S), preventing executable source links. Added regression coverage.
- Added conflicting-year detection for the same normalized original title and directors, with regression coverage.
- Included themes in the searchable metadata, normalized period/type synonyms, and corrected the 1965 collection boundary.
- Removed the dangerous external-input bootstrap importer from the delivered application. `npm run catalogue` uses the committed canonical inventory; public data and the source registry are generated together.
- Updated the font inventory and shipped both complete SIL OFL license notices.
- Darkened small gold text after automated contrast failures. Subsequent automated scans reported no WCAG A/AA violations in tested pages.
- Refined long title-card typography and the tablet two-column layout after screenshot review. Added an artwork-bounds check to catch crowding beyond ordinary horizontal-overflow tests.
- Preloaded the actual above-the-fold local font files; measured layout shift fell to zero in local Lighthouse runs. No content was removed to improve scores.
- Added sequential heading structure on catalogue/collection pages and a PNG social card.

Final command results, screenshots, hosted verification and remaining limitations are recorded in DELIVERY_REPORT.md and the JSON audit reports. Neither automated accessibility tools nor a research-only editorial assessment constitutes universal certification.

## Addendum — editorial and design pass, 11 October 2026

The text above is left as written. The later editorial pass (branch `improve/editorial-pass`; see `IMPROVEMENT_REPORT.md`) supersedes several of the resolutions:

- **Policy.** The site now states the Founder's pre-conciliar position publicly and applies two exclusion rules: subjects canonised or beatified only after 1965, and the post-conciliar Church presented as normal or exemplary. Post-conciliar bodies and publications are cited for facts only.
- **Films resolved above and later removed.** Blessed Duns Scotus, No Greater Love, Into Great Silence, Un Dios prohibido, Triumph of the Heart, Padre Pio: Miracle Man and Two Crowns are now REJECT under those rules. The Sound of Music and On the Waterfront left the site as out of scope. Their URLs redirect to `/library/`. The metadata and caveat work recorded above for these films no longer appears on the site; it is kept in `research/inventory.json`.
- **The War of the Vendée** moved from recommended to grey area ("not yet verified"): no independent critic has assessed its history. Don Bosco (1935) also moved to the grey area.
- **Quo Vadis** is now PUBLISH. The moral-framing question was resolved against the AFI Catalog synopsis and two substantive essays.
- **Counts.** The inventory now holds 147 candidates; the current status counts are in `src/data/research-summary.json`. The duplicate Bells of Nagasaki record (`the-bells-of-nagasaki-1950`) was merged into `bells-of-nagasaki`. The English Martyrs collection now has one recommended film (A Man for All Seasons). The Cristero War, Spanish Civil War and Documentaries collections are empty, with gap notes.
- **The 1965 boundary.** The before-1965 and after-1965 collections were removed, and their URLs redirect to `/library/`.
- **Engineering and design.** The title-card typography and the tablet layout described above were replaced by a new design system. The homepage carries no images, and posters appear only on film pages and cards. The deploy workflow now also regenerates the catalogue, fails on stale generated data and runs `check-leak`.

The Passion of the Christ resolution stands. Its decision now cites the Roman Catechism on who bears the guilt of the Passion.
