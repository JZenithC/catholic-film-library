# Independent review pass

Reviewed: 11 October 2026. Snapshot: 21 public films; research inventory 139 records (21 PUBLISH, 116 HOLD, 2 REJECT). Work was changing during this review; findings below identify the inspected state and need closure against the final build.

## Scope and independence

This was a separate audit pass by the policy/research reviewer, not an ecclesiastical judgment or a claim of personal film viewing. The reviewer authored the policy documents and two additional public profiles (Don Bosco, La mies es mucha); review of those portions is self-review, not independent corroboration. The other profiles and application were prepared by other team members. This report does not claim a full filmographic or WCAG audit.

Inspected public film JSON, research decisions, catalogue filtering, film-page rendering, schema rules, layout font imports and asset inventory. Opened representative desktop, tablet and phone screenshots of the homepage, library and film page. Rechecked selected external sources through the web tool. No external source failure below is treated as proof that the underlying claim is false.

## Findings requiring correction

### P1 — A known religious-representation controversy is absent from The Passion of the Christ profile

The profile discusses violence and extra-scriptural inventions but not the portrayal of Jesus' Jewish opponents. Its own cited [Decent Films article](https://decentfilms.com/articles/passion_meaning) expressly identifies concerns about that portrayal and links further analysis. This omission conflicts with the policy's material-controversy question. The Founder's positive example does not waive that question.

**Correction:** add a concise, attributed account of the specific concern and the grounds for the Library's retained recommendation. Distinguish individual dramatic portrayals from claims about Jewish people collectively. Follow the article's linked discussion and cite the relevant analysis; do not assert that all objections are settled or that the film has been ecclesiastically certified. Controversy alone does not require rejection.

### P1 — The inspected catalogue does not satisfy the requested breadth/completeness

The 21-film snapshot includes production countries in Europe and the United States; no published Asian, African or Latin American production was present. Several requested historical collections are unpopulated. Preserving 116 holds is prudent, but candidate triage is not equivalent to completing substantive research on them. The brief explicitly rejects the usual 20–30-film endpoint.

**Correction:** continue substantive original-language research and resolve sufficiently promising candidates without weakening publication gates. If practical limits remain at delivery, state that the acceptance criterion is unmet rather than reporting the entire project complete. Keep scoped coverage and evidence gaps visible. There is no legitimate numeric shortcut to this finding.

### P2 — Asset inventory contradicts bundled font implementation

IMAGE_CREDITS.md says fonts are only system fonts and no files are redistributed. Layout.astro imports Fontsource Cormorant Garamond and Source Sans 3, and public/licenses contains their license files.

**Correction:** replace the inaccurate row with separate actual font records, including upstream provenance, copyright/license, package version, local license-file location and self-hosting basis. Keep system fallback fonts as a separate note. Original title artwork remains a sound image-rights approach.

### P2 — Duplicate film-format labels and inconsistent period vocabulary fragment filters

The raw facet values include both `Feature` and `Feature film`, although these are not different formats. Periods include `20th century`, `Twentieth century`, `Twentieth-century Italy`, `Contemporary` and other overlapping descriptions.

**Correction:** normalize format values; use stable period IDs or a small consistent vocabulary for filtering, with precise historical setting retained in prose. Add schema constraints so later entries cannot recreate the split. Do not falsely change the underlying format to meet the enum.

### P2 — Theme search is not implemented in the inspected search payload

library.astro serializes title variants, people, subjects and other metadata but omits `themes`. A phrase such as `redemptive suffering`, recorded in The Song of Bernadette's themes and absent from its other searchable fields, cannot match that film through theme search.

**Correction:** serialize normalized theme text and include it in the search matching function. Add one meaningful test for a theme unique to a profile rather than merely a title duplicate.

### P2 — Some recently added profiles do not meet the current schema/evidence gate

At inspection, On the Waterfront and The Sound of Music each had only one source, and both had empty production-country/language arrays. Triumph of the Heart also lacked a production country. The schema requires two distinct sources and a nonempty country. Omitting unverified facts is preferable to guessing, but the public record should not bypass the project's own identity gate.

**Correction:** add credible independent identity evidence where available; populate only supported metadata; rerun validation. Do not treat filming location as production country. An accessible detailed review provides genuine treatment evidence but need not supply every identifying field. This finding may overlap concurrent metadata work and must be rechecked.

### P2 — Repeated generic decision text obscures application of the rubric

Six inventory entries repeat one identical publication decision, four repeat a second, and four repeat a third. Their public inclusion essays are more specific, but the internal decision does not show how material reservations were resolved. The policy asks for reasoned treatment of eight questions.

**Correction:** retain a short title-specific decision that identifies decisive Catholic content, the strongest evidence and any resolved reservation. A structured per-question note is useful where applicable; do not invent a clean bill of health for questions not actually researched. Generic disclaimers about ecclesiastical authority need not be duplicated as the substance of the decision.

### P2 — Screenshot acceptance must use a consistent final build

Earlier desktop/library and phone/home/library screenshots visibly crop long title artwork or collide with the year/footer. The later desktop film screenshot shows the revised cards without those collisions, but the set inspected contained mixed versions (11-film library screenshots alongside later expanded collection counts). The developer had already identified and was fixing the problem.

**Correction:** regenerate all required views from the final dataset and CSS, then inspect long titles at phone widths. Do not count an old screenshot as proof that a later build was reviewed. The final screenshot inspection, rather than merely the CSS patch, closes this issue.

### P3 — 1965 collection boundary is incompletely applied

The `after-1965` collection is publicly titled “Catholic Cinema from 1965,” while The Sound of Music (1965) is not assigned to it.

**Correction:** apply the stated inclusive boundary consistently, or change the collection rule and label together. The “Before 1965” collection explicitly ends in 1964 and is clear.

### P3 — Tablet homepage essentials composition is uneven

At the 820px screenshot width, four essentials become a three-card row followed by a single left-aligned card, producing a large empty field. Text remains readable, and this is a composition issue rather than evidence of functional failure.

**Correction:** consider a two-by-two essentials grid at this width while retaining suitable column counts for the full catalogue.

## Sample source and factual checks

- [BFI: The Passion of the Christ](https://www.bfi.org.uk/film/8af21713-3207-513e-b78c-f4b4cfd9904b/the-passion-of-the-christ) resolves. [BBFC's record](https://www.bbfc.co.uk/release/the-passion-of-the-christ-q29sbgvjdglvbjpwwc0znja4mjg) supports graphic violence and suicide advisories. Its page combines multiple releases; the displayed 2003 production year and 2026 rerelease must not replace the film's 2004 release identity.
- [Fremantle's Clare and Francis page](https://catalog.fremantlemediaitalygroup.it/clare-and-francis/) supports 2007, Italian language, Fabrizio Costa and a two-part miniseries. Its description explicitly identifies religious vows. This corroborates identity and subject, not doctrinal certification.
- The [Register DVD review URL](https://www.ncregister.com/features/dvd-picks-passes-11-23-2008-uie10gii) returned a tool cache miss during this audit. Mark this as an access limitation; it does not establish a dead URL. Preserve another accessible record of the critical evidence where feasible.
- [The Sound of Music review](https://decentfilms.com/reviews/soundofmusic) supports postulancy, reverence toward religious life, the train departure and displacement of Father Wasner by Max. No contrary claim was found in that sample. Its positive assessment does not remove the need for independent identity metadata.
- [On the Waterfront review](https://decentfilms.com/reviews/onthewaterfront) supports Father Corridan as a model, the Christological dockside sermon and the distinction between the film's ending and the historical whistleblower's outcome.
- [Triumph of the Heart review](https://www.ncregister.com/news/triumph-of-the-heart-maximilian-kolbe) supports 2025 identity and expressly acknowledges conjectural bunker dialogue. The profile correctly makes that limitation visible.
- [Ineffabilis Deus](https://www.papalencyclicals.net/pius09/p9ineff.htm) supports the Duns Scotus page's description of the Immaculate Conception; [Mediator Dei](https://www.vatican.va/content/pius-xii/en/encyclicals/documents/hf_p-xii_enc_20111947_mediator-dei.html) resolves as the cited preconciliar liturgical text. Neither text approves a film.

## Checks without findings

The inspected public dataset contained no duplicate ID or slug and no HOLD/REJECT status. catalogue.ts filters PUBLISH records, and film routes and related-title selection use that filtered list. Distinct Don Bosco productions are not automatically duplicates. Public prose generally separates dramatization and interpretation, avoids numerical orthodoxy scores and explicitly disclaims ecclesiastical approval. The quiet typographic design is coherent; readable article hierarchy and the absence of uncertain film-poster reuse are strengths.

These observations are bounded checks, not a declaration that all factual claims, keyboard paths, contrast ratios, deployment behavior or acceptance criteria pass. Corrections should be recorded below or in a later dated audit addendum after verification.

## Engineering addendum — 11 October 2026, 30-film snapshot

### Executed verification

This reviewer ran `npm run check`, `npm test`, `npm run build`, `node scripts/check-links.mjs` and `npm run lint` against the local repository without installing packages. The successful check/build used `ASTRO_TELEMETRY_DISABLED=1`, as documented: the initial check encountered an environment permission error attempting to create Astro's telemetry configuration under AppData. The rerun checked 29 Astro files with zero errors, warnings or hints and validated 30 films / 17 collections. All four unit tests passed. The build emitted 57 pages and the link checker passed 1,957 internal references. Lint passed. These counts identify the audited snapshot; later catalogue additions require their own validation.

### Reproduced findings and correction status

- **P2 — Source URL protocol validation (corrected and independently retested).** The original source schema accepted `javascript:alert(1)` as a valid source URL through unrestricted `z.url()`. This was a link-safety weakness for future editorial imports, not evidence of a malicious current entry. The updated schema restricts protocols to HTTP/HTTPS. Repeating the in-memory probe now returns `false`.
- **P2 — Conflicting release-year duplicates (corrected and independently retested).** A clone of the first published film with a distinct ID/slug and a one-year date change originally passed validation, since identity keys included year. The revised check compares normalized work title plus directors and reports `Conflicting release years for The Passion of the Christ: 2004 and 2005`. The unmodified 30-film dataset still returns zero validation errors. This catches that attack; it does not establish perfect fuzzy identity detection across unrelated aliases/transliterations.
- **P2 — Research import can silently erase a delivered catalogue (open at inspection).** `scripts/import-research.mjs` reads three `../../work/research-*.json` files outside the repository, ignores ENOENT for each, and unconditionally writes its accumulated list to both `src/data/films.json` and `research/inventory.json`. In a normal standalone checkout with none of these external files, invoking it produces empty datasets; with one batch absent it silently removes that batch. This finding follows directly from the control flow; the destructive invocation was intentionally not run against shared output. Require every expected input before writing anything, accept explicit input paths or use committed research files, and document whether the script is a bootstrap import or the maintained source-of-truth pipeline. Post-import corrections must not be silently overwritten.
- **P3 — Link-checker scope is narrower than deployment acceptance.** The checker verifies root-relative href/src references against the configured base and local output. It does not establish production HTTP status, external source availability, fragment validity, social crawler rendering, or host configuration. Preserve it as a useful build check but report the separate hosted smoke test explicitly.

### Routing, search and keyboard observations

The full independent loopback HTTP attempt could not proceed: Chromium launched, but an in-process local preview returned `net::ERR_NETWORK_ACCESS_DENIED` during navigation. This is an agent environment restriction, not an observed application failure. The lead implementer reports a separate real HTTP browser run with eighteen viewport/page cases and zero recorded issues; that report is not represented here as this reviewer's independent execution.

A small supplemental test used Playwright request fulfillment to serve the actual compiled files without a network connection. This verified client behavior only, not the server's status handling: a direct library query restored `redemptive suffering` and displayed two matching films; invalid collection/sort values fell back to all thirty films and the featured ordering control; the compiled 404 page's two recovery links both retained `/catholic-film-library/`; the first Tab reached Skip to content and Enter updated the `#main` fragment; mobile Menu opened with Enter and the following Tab reached its first navigation link. Escape did not close the native details menu, which is not by itself a conformance failure for this disclosure implementation. No comprehensive screen-reader or all-keyboard-path certification is implied.

Source inspection confirms themes are now included in the embedded search payload, invalid select values are normalized, popstate reloads controls, and URL state uses URLSearchParams rather than HTML insertion. Public prose is rendered through Astro's escaping; embedded JSON replaces less-than signs before insertion. The public routes consume PUBLISH-filtered data. No current exploit or active-content source was found in the inspected catalogue.

### Deployment configuration

The inspected workflow runs check, lint, tests, build and local link verification before deployment, and skips deployment for pull requests. Node 24 matches the package engines requirement. Its `actions/checkout@v7`, `withastro/action@v6`, and `actions/deploy-pages@v5` versions match the [current official Astro GitHub Pages guidance](https://docs.astro.build/en/guides/deploy/github/); the configurable build command is supported by the [official Astro action](https://github.com/withastro/action). Configuration uses `https://jzenithc.github.io` and `/catholic-film-library/`. Source and compiled recovery/navigation links inspected here preserve that base. This audit does not establish that the remote repository, Pages settings, deployment permissions or production domain are functional; a successful live release and HTTP smoke test remain separate evidence.

### Historical-period facet advice

Normalize the public facet to Biblical antiquity, Middle Ages, Early modern era, 19th century, 20th century, 19th–20th centuries, and 21st century where the represented period is established. Preserve detailed original wording in research records or profile prose. Use 19th–20th centuries only when the portrayed events span that boundary (for example the Maria Goretti narrative), not merely because a subject lived across it. Into Great Silence's observed modern monastery can use 21st century; the unstable word Contemporary should not stand in for a permanent date. The facet concerns depicted setting, not film release, and biblical/medieval divisions are broad discovery aids rather than new historical findings. Where an event span is uncertain, preserve the uncertainty instead of manufacturing a narrower date.

The two reproduced schema defects are resolved in the inspected version. The import hazard remains the material engineering finding at the time of this addendum. An expanded catalogue and an independently observed production release are outside the evidence asserted by these local checks.
