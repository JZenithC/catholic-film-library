# Maintenance

The source repository is the durable record. The site is built as static HTML with Astro and TypeScript; no movie API or hosted database is required at runtime. Read README.md for the exact supported Node version, scripts and deployment variables in this checkout. Keep the lockfile committed.

## Run and verify

From the repository root, install the pinned dependency graph with `npm ci`. Use `npm run dev` for local editing. Before committing, run:

```sh
npm run check
npm run lint
npm run build
npm test
node scripts/check-links.mjs
```

Check package.json for any additional browser or lint commands delivered with the project. Passing a build does not prove the research, licensing or accessibility is correct. Inspect the generated site on phone, tablet and desktop sizes; check keyboard navigation, focus, search, combined filters, reset, sorting, an empty result and direct film URLs. Review screenshots after a visual change. Repeat targeted checks after a relevant correction.

## Add or update a film

1. Add a candidate to the structured research inventory first. Verify identity and distinguish remakes or television recuts. Use a stable ID; never reuse a removed film's ID for another work.
2. `research/inventory.json` is the canonical decision inventory. Copy the shape of a current record, not its claims or editorial decision. Start at HOLD and supply source records, access dates, supported claims and unresolved questions. Unknown identifying fields are permitted on internal HOLD records; `scripts/schema.mjs` enforces the stricter public profile contract.
3. Apply EDITORIAL_POLICY.md. Write original, specific summary and editorial text from substantive evidence. Omit unknown optional values. Preserve original-language and alternative titles, including accents.
4. Use existing collection identifiers. Distinguish production country, historical setting, release decade, language, subject and format. Do not turn every keyword into a new collection.
5. Record the decision and last genuine editorial review date. PUBLISH requires evidence, not simply completion of fields. Run `npm run catalogue` to regenerate `src/data/films.json` and `research/source-registry.json` from the canonical inventory. It selects only PUBLISH records and normalizes public facet labels. Do not edit generated public data independently. The initial batch JSON files are historical research snapshots, not live inputs. Ordinary maintenance uses only the canonical inventory.
6. Run validation, build and tests. Inspect the rendered film page, source list, search result, collection membership, related titles and public export before committing.

For a metadata correction, change only the verified value and record the reason and source. For an alternative title, append it to the relevant field; do not make a duplicate film record. For a new citation, include an exact URL, publisher, title, checked date and supported claims. Recheck the gate when new evidence affects suitability.

## Preserve links

Keep existing slugs when correcting display titles. If a slug must change, add a static redirect or equivalent compatibility page supported by the deployment and verify the old URL. GitHub Pages has no application server to resolve arbitrary server-side redirects. If a recommendation is withdrawn, preserve the research record, remove it from all recommendation surfaces, and decide explicitly whether the old route should show a neutral withdrawal notice or a useful 404. Do not silently redirect to a different film.

## Images and collections

Use the designed title-card system unless a new asset has documented rights. Update IMAGE_CREDITS.md and the film's image record together; optimize dimensions and file size; add suitable alt text and check the fallback. Bundling a font also requires a license record.

For a collection, add one stable identifier and a useful title, introduction and selection rule in the collection registry. Connect eligible films using that ID, then validate references and navigation. An empty collection should disclose the research gap without displaying HOLD titles as recommendations.

## Deploy safely

The user authorized a new, isolated `catholic-film-library` repository under the Founder's authenticated account. Confirm the account before creating or pushing a remote. Do not change unrelated repositories, workflows or runners.

Use the included GitHub Actions workflow and current official [Astro deployment documentation](https://docs.astro.build/en/guides/deploy/github/) and [GitHub Pages documentation](https://docs.github.com/en/pages). Set the actual site origin and repository base path as described in README.md. A project site must resolve its links, styles, images and search under that base path. A custom domain or root site requires a deliberate configuration change.

When authentication is unavailable, complete local checks and commits, report the exact blocker, and leave deployment unclaimed. Never invent a public URL. After deployment succeeds, open the actual site and test a direct film URL, a filtered catalogue URL, assets, navigation, refresh, 404, canonical metadata and sitemap. Record the URL and observed result. A green upload workflow alone does not prove the hosted application works.

## Routine care

- Review incoming evidence promptly; move a film to HOLD when a material unresolved concern warrants it.
- Recheck external links periodically and before asserting availability. Replace dead URLs with verified equivalents without erasing bibliographic provenance.
- Rotate reviews of older entries. Update a film's verification date only after an actual review, not because a new build ran.
- Review dependencies and security advisories at a sustainable interval, and promptly for relevant serious advisories. Update in a branch, inspect release notes, regenerate the lockfile, run checks and review the build. Do not apply breaking upgrades blindly.
- Keep research JSON, source records, asset credits and the lockfile in Git. Retain local backups or a second repository clone; a hosted site is not the source backup.
- Public JSON metadata is a reusable catalogue export, not a license to third-party artwork. Internal research exports must retain status and uncertainty so HOLD records cannot be mistaken for recommendations.
- Record substantial data, policy and behavior changes in CHANGELOG.md. Document remaining research and hosting limitations honestly.

## Posters and release covers

The asset manifest is `src/data/posters.json`; local files are in `public/posters/`. Verify a source image against the exact film, year, cast and director before adding it. Record the source page, image URL, artist/distributor credit, accurate poster/DVD/VHS kind, identity evidence and rights statement. Never describe a source's Wikipedia fair-use rationale as permission for this site. Preserve a separate contextual use assessment in `research/poster-rights-review.json`.

Serve a compressed image no larger than 500×750 pixels, preserve the full composition and never upscale. Run `npm run catalogue` after adding or removing a manifest record so the film's image-rights description remains consistent. Validation checks path safety, metadata, dimensions and asset existence; browser QA decodes every catalogue poster. Inspect a contact sheet for mismatched remakes, stills, icons and local screening overprints. Current poster coverage is 38/38; intentionally removing an image requires updating that coverage assertion in the browser check. A removed manifest entry automatically selects the title-card fallback.
