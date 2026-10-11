# Research methodology

Research snapshot: 11 October 2026, revised in the editorial pass of that date.

This is a documented, selective research programme. It does not prove that every Catholic film has been found or every edition examined. `research/inventory.json` records a decision for every candidate, and `research/editorial-notes.json` records the editor's evidence notes, open verification items and poster leads. Read the published selection together with those files; the size of the catalogue is not a measure of quality.

No film was watched for this catalogue. Every judgment rests on published criticism, histories, archive and production records and release details.

## Three evidentiary questions

**Identity.** Establish the work: original and translated titles, first release year, director, country, language and format. Prefer national film archives, film institutes, production records and official distributors. Record territorial premieres, restorations and television recuts instead of forcing conflicting dates into one unexplained value.

**Religious treatment.** Find substantive criticism or detailed production evidence describing how the film presents belief, religious life and moral choices. A synopsis, trailer, promotional quote or religious distributor's brand cannot establish this on its own. Published criticism supports a research-based judgment; it must not be rewritten as the researcher's own viewing.

**History and doctrine.** Use primary historical documents, responsible scholarship and the pre-conciliar reference texts listed in EDITORIAL_POLICY.md. Filmographic metadata proves neither accuracy nor orthodoxy. Establish the historical claim independently of the film, attribute disputed readings, and keep inference separate from evidence.

## Candidate workflow

1. Preserve every supplied candidate, including uncertain spellings and dates. Assign a stable id, link aliases to one work and merge duplicates with both source sets kept.
2. Establish identity, and distinguish remakes, alternate cuts, miniseries and feature compilations. Do not fill missing fields with plausible guesses.
3. Apply the scope rule and the two exclusion rules first. Check the date of any canonisation or beatification, and whether the film's Catholic content is the post-conciliar Church presented as normal or exemplary.
4. Record each source's title, publisher, exact URL, access date and the claims it supports. Keep reuse restrictions separate from factual citations.
5. Read the treatment evidence and apply the eight questions in EDITORIAL_POLICY.md. Record both favourable evidence and objections, and say whether a whole source, an excerpt or only search metadata was seen. Search snippets do not count as a review.
6. Write original, film-specific prose in a plain critic's voice. Quote only when necessary and within permitted limits.
7. Assign PUBLISH, GREY (with its kind and question), HOLD or REJECT with a concrete reason. For GREY and HOLD, state the evidence that would settle the matter. For REJECT, say whether the reason is scope, an exclusion rule or a demonstrated problem.
8. Run `npm run catalogue` and the checks, and review the rendered page, sources, advisories, related films and collections. Commit the decision and its evidence together.

## Source quality and conflicts

- **Pre-1965 Catholic film offices.** Legion of Decency ratings and the reviews of other national Catholic film offices before 1965 are evidence of how a film was judged under the old standard. Prefer the office's own published text to a second-hand summary.
- **Post-conciliar Catholic bodies and outlets.** CNS/USCCB ratings, Vatican statements after 1965, the 1992 Catechism and the 1995 Vatican film list can be cited for facts only, never as approving evidence. A film supported only by such sources is GREY (not yet verified) at most. Mary of Nazareth is an example.
- **Producers and distributors** are authoritative for their own production details but have an interest in promotion. Seek independent interpretation. The same applies to a religious order that sponsored or distributes a film about its founder.
- **National film institutes and archives** can establish identity; they do not confer religious approval.
- **Independent critics**, Catholic or not, offer an attributable judgment, not the site's standard.
- **Audience-rating boards** support specific content advisories. They do not establish Catholic fidelity.
- **Crowd-edited databases and lists** can suggest leads. Verify important claims against stronger sources.
- Two sites repeating the same press release are not independent corroboration.
- When sources disagree, record the discrepancy and the reason for preferring one. Leave a material uncertainty on GREY or HOLD.
- A working URL does not prove that every claim attached to it is supported. Read the text.

## Coverage and gaps

The research covers silent cinema to the present: features, television films, miniseries and documentaries, from Europe, the Americas, Asia and Africa. Query French, Spanish, Italian, Portuguese and Polish titles and sources where useful. Do not imply that a national catalogue was searched exhaustively because one record in it was consulted.

The collection gap notes in `src/data/collections.json` record the current gaps. As of this snapshot:

- **Cristeros and the Spanish Civil War.** The known films (For Greater Glory, Un Dios prohibido) are excluded under rule (a), because their subjects were canonised or beatified after the Council. Older films on these subjects are still to be found or assessed.
- **Documentaries.** Into Great Silence and No Greater Love are excluded under rule (b), and the 1940s Portuguese Fátima documentaries remain under review.
- **English Martyrs.** A Man for All Seasons is now recommended, and other candidates are on hold.
- **Grey area.** Most grey films are "not yet verified". Each grey question says which review, rating or documented viewing would settle it.

Africa, Asian production, animation and Latin American cinema remain thinly covered.

## Review dates and preservation

An access date records a source check, not a viewing. A review date records an assessment of the evidence then available, not current availability. Verify viewing links by territory before claiming availability. Prefer durable detail pages to generic homepages, and keep the bibliographic details when a URL changes. Cited external pages remain their owners' works.

Keep ids and slugs stable. Version control is the correction history; record substantive factual and editorial changes in CHANGELOG.md. Recheck disputed entries promptly and do not pretend the whole catalogue was reverified on every build.
