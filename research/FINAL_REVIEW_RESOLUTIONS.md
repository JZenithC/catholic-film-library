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
