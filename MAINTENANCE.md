# Maintenance

The source repository is the durable record. The site is static HTML built with Astro and TypeScript, and no movie API or hosted database is needed at runtime. README.md gives the supported Node version, the scripts and the deployment settings. Keep the lockfile committed.

## Run and verify

From the repository root, install the pinned dependency graph with `npm ci` and use `npm run dev` for local editing. Before committing, run the same sequence as the deploy workflow:

```sh
npm run catalogue
git diff --exit-code -- src/data research   # after committing your inventory change: nothing should be stale
npm run check
npm run lint
npm test
npm run build
npm run check:build                          # check-links, then check-leak
```

`npm run check` runs `astro check` and `scripts/validate.mjs`. Validation fails on schema errors, broken poster or rights consistency and invalid WebP files. It prints warnings for disliked phrases (the style lint) and for posters narrower than 300 px. `check-leak` fails if any HOLD or REJECT id or slug appears in the build, if a public record has no page, or if the sitemap and pages disagree. It skips Astro's redirect stubs.

A passing build does not prove that the research, licensing or accessibility is right. After a visual change, run `npm run test:browser` (see README.md; it needs a local Chromium or `PLAYWRIGHT_CHROMIUM_EXECUTABLE`) and look at the screenshots. Check phone (down to 320 px), tablet and desktop widths, keyboard navigation and focus, search with and without the grey-area toggle, combined filters, reset, an empty result and direct film URLs.

## Add or update a film

1. Add the candidate to `research/inventory.json` first. Verify its identity and distinguish remakes and television recuts. Use a stable id and never reuse a removed film's id.
2. Copy the shape of a current record, not its claims or decision. Start at HOLD, with sources, access dates, the claims each source supports and the open questions. Record evidence notes and poster leads in `research/editorial-notes.json`.
3. Apply EDITORIAL_POLICY.md, including the two exclusion rules. Check every saint's or blessed's canonisation or beatification date. Write original, specific text in a plain critic's voice. Omit unknown optional values, and keep original-language and alternative titles with their accents.
4. Use the controlled vocabularies in `scripts/schema.mjs`:
   - format: Feature film, Silent feature, Documentary, Television film or Miniseries;
   - historical period: Biblical antiquity, Early Church, Middle Ages, 16th century to 21st century (the depicted setting, not the release date);
   - subjects: reuse an existing subject label where one fits.

   `npm run catalogue` maps a few legacy spellings onto these values and warns about any period it cannot map.
5. Use existing collection ids. Do not turn keywords into new collections.
6. Set the status:
   - PUBLISH for a recommendation;
   - GREY with `grey: {kind: "reservations" | "unverified", question}` and a decision beginning `GREY:` (the question must be 40–120 words and say what would settle it);
   - HOLD or REJECT, with the reason in the decision.
7. Run `npm run catalogue` to regenerate `src/data/films.json`, `src/data/research-summary.json`, `research/source-registry.json` and the crosswalk statuses. Never edit generated data by hand.
8. Run the checks above. Look at the rendered film page, its sources, search, collection membership, related films and `catalogue.json` before committing.

For a metadata correction, change only the verified value and record the reason and source. For a new citation, give the exact URL, publisher, title, access date and the claims it supports. Recheck the gate when new evidence affects the decision.

## Featured films

`src/data/featured.json` is an ordered list of film ids for the homepage and Start here. It may list only PUBLISH films, and `npm run catalogue` stops with an error otherwise.

## Preserve links

Keep existing slugs when correcting display titles. When a film leaves the site (moved to HOLD or REJECT), add its old path to the `redirects` map in `astro.config.mjs` so that it redirects to `/library/`, then build and confirm that the redirect stub exists in `dist/`. Do not redirect to a different film. A film moved between PUBLISH and GREY keeps its page and needs no redirect.

## Posters and collections

The poster manifest is `src/data/posters.json`; the files are in `public/posters/`. Before adding an image, verify it against the exact film, year, cast and director, and prefer the original release poster of the right edition. Prefer public-domain and openly licensed images. Record the source page, image URL, creator or rights holder, credit, kind (poster, DVD or VHS cover), identity evidence and rights statement. Every poster needs a `rightsCategory`:

- `public-domain-worldwide`;
- `public-domain-us`;
- `open-licence`;
- `copyrighted-distributor`;
- `copyrighted-nonfree-source`.

A Wikipedia fair-use rationale is not permission for this site. Put the contextual use assessment in `research/poster-rights-review.json` and update IMAGE_CREDITS.md.

Images must be WebP, no larger than 600 × 900 px, with the full composition preserved and never upscaled. Validation reads the WebP header and checks that the dimensions match the manifest. Run `npm run catalogue` after adding or removing a poster so that the film's `imageRights` text matches. Validation fails if they disagree. A film with no poster gets the typographic title card. Every poster on the site links to its film's review. The three large images at the top of the homepage are limited to public-domain and openly licensed posters; the homepage "Start here" shelf, collection tiles and collection headings use linked thumbnails. Posters are never used as backgrounds, banners or social-preview images.

For a collection, add a stable id, a title, an introduction, a selection rule and one of the three groups (Subjects, Histories, Kinds of film) in `src/data/collections.json`. A collection with no recommended film needs a `gap` note explaining what is missing and why. Do not list HOLD titles as recommendations.

## Deploy safely

Deployment is from `main` only. Work on a branch, open a pull request so the workflow validates it, and merge to `main` to deploy. Confirm the GitHub account before pushing, and do not change unrelated repositories, workflows or runners.

Use the included workflow, the official [Astro deployment documentation](https://docs.astro.build/en/guides/deploy/github/) and the [GitHub Pages documentation](https://docs.github.com/en/pages). The actions are pinned to commit SHAs, and Dependabot proposes updates monthly. Review each update's release notes before merging it. A custom domain or root site needs a deliberate change to the base path in `astro.config.mjs`, the sitemap, robots and `scripts/check-leak.mjs`.

When authentication is unavailable, finish the local checks, report the blocker and do not claim a deployment. After a deployment succeeds, open the live site and test a direct film URL, a grey-area film, a filtered library URL, a redirected old film URL, assets, navigation, 404, canonical metadata and the sitemap. A green workflow alone does not prove the site works.

## Routine care

- Review incoming evidence promptly. Move a film to GREY or HOLD when a material concern warrants it, and work through the open verification items in `research/editorial-notes.json`.
- Recheck external links periodically (`scripts/check-external.mjs`). Replace dead URLs with verified equivalents and keep the bibliographic details.
- Update a film's review date only after an actual review, not because a new build ran.
- Review npm dependencies and security advisories at a sustainable interval, and promptly for serious advisories. Dependabot covers GitHub Actions only, so check npm dependencies by hand: update in a branch, read the release notes, regenerate the lockfile and run all checks.
- Keep research JSON, source records, poster credits and the lockfile in Git. A hosted site is not a backup.
- `catalogue.json` is a metadata export, not a licence to film artwork (see LICENSE).
- Record substantial data, policy and behaviour changes in CHANGELOG.md.
- Rights holders can use the "Image or rights request" issue template. Act on removal requests promptly.
