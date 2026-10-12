# Improvement report — editorial and design pass

Date: 11 October 2026. Branch: `improve/editorial-pass`. Status: **committed on this branch; not pushed or deployed.** The public site still shows the earlier version. For the deployment steps, see the last section.

This report is for the Founder. It covers what changed and why, before and after counts, the films added, removed and moved to the grey area, the rulings made, and what remains open. All figures come from the data files: "before" is the last commit (`2997caf`), "after" is the working tree on this branch.

## Update, 12 October: second pass

The figures in the sections below describe the first pass (deployed as `0b45cd1`). This update supersedes them.

**Catalogue now:** 417 researched films. 97 recommended and 141 grey area are public, which makes 238 public film pages. The grey area holds 79 with reservations and 62 unverified. 165 films are rejected and 14 are on hold. The first pass had 38 public films.

**Where the new films came from:** a discovery list of about 210 candidates, researched in three waves. Each film was ruled under the Founder's position. Old held films were resolved using:
- the Legion of Decency lists and *Motion Picture Exhibitor* volumes on archive.org;
- published scripts and reviews;
- subtitle files, read line by line where a question turned on dialogue.

Rulings and precedents are kept with the research notes.

**New rules applied in this pass:**
- Lost films are rejected.
- Entries with no evidence that the film exists are rejected.
- Apparitions count only if the Church approved them before the Council; films about modern or unapproved apparitions are rejected.
- A pre-conciliar bishop's prohibition of a film outweighs a more lenient rating.

**Film pages:** every public film now has an age band with reasons. The bands are All ages 35, 8+ 65, 12+ 92, 15+ 30 and Adults 16. Most pages also have:
- principal cast with roles (225) and key crew (223);
- "Theological notes" (228), citing only pre-conciliar authorities: Trent, the Roman Catechism, pre-1965 popes, the 1917 Code and the Catholic Encyclopedia;
- "The history behind it" (185);
- "Making the film" (236), covering production, release and contemporary Catholic reception.

Each of these was fact-checked against opened sources before merging. Claims that could not be confirmed were cut.

**Posters:** 186 of 238 public films have a poster or release cover:
- 144 non-free source images, each no more than 400 px wide;
- 23 distributor covers;
- 16 public domain;
- 3 openly licensed.

The rest show the title card. The homepage, collections index and collection headings now show linked poster thumbnails.

**Still open:**
- About 40 grey-area films have a specific question that their dialogue would settle. These are listed in the research notes and are the next job.
- Rossellini's *Acts of the Apostles* needs the correct subtitle file.
- 14 films are on hold for identity or content.

## Why

The first delivery had four problems:

- It did not state the Founder's position.
- It recommended several films built on post-conciliar canonisations or on the reformed Church.
- It included films that were not Catholic-centred.
- Its prose was self-congratulatory, with talk of "the Library", repeated disclaimers and filler piety.

Some of its posters were also blurred, watermarked or the wrong kind of image, and the homepage used a Rockwell poster as a hero image. This pass addresses each of these.

## What changed

### Editorial position and rules

- The site now says publicly that it does not accept the Second Vatican Council or the reforms after it, and that it judges films by Catholic teaching as it stood before the Council. A modern date neither qualifies nor disqualifies a film.
- There are two exclusion rules (Founder rulings, 2026-10-11):
  - (a) a film is excluded if its subject is recognised as saint or blessed only through a canonisation or beatification after 1965;
  - (b) a film is excluded if its Catholic content is the post-conciliar Church presented as normal or exemplary: the new liturgy, religious life as reformed, interreligious dialogue.
- Post-conciliar bodies and publications (CNS/USCCB ratings, post-1965 Vatican statements, the 1992 Catechism, the 1995 Vatican film list) are cited for facts only, never as approving evidence. Legion of Decency and other pre-1965 Catholic film-office ratings count as evidence.
- The reference texts are Vigilanti cura, Mediator Dei, Miranda prorsus, Mortalium animos, the Roman Catechism and Trent Session XXV.
- Scope is limited to Catholic-centred films (Founder decision).

### A new public outcome: the grey area

Besides Recommended (PUBLISH), a film can now be Grey area (GREY). It gets a full film page that opens with a box stating the question. There are two kinds:

- **With reservations:** a real doctrinal, moral or historical question.
- **Not yet verified:** the film is Catholic-centred, but no independent review has been found.

Grey films are kept out of the default library view, featured films, Start here and the homepage. They can be found through search (with the toggle), A–Z, collection sub-lists and `/grey-area/`. HOLD and REJECT remain hidden. In the data, a grey record has `grey: {kind, question}` and a decision beginning "GREY:", and `scripts/schema.mjs` and `scripts/validate.mjs` enforce this.

### Rewriting

Every public record was rewritten in a plain critic's voice. Film pages now use these headings: "Why watch it" ("Why it is worth knowing about" on grey pages), "The faith in the film", "The history", "What the film changes" and "Before you watch". Every public record has its own decision text, with no duplicates. A new file, `research/editorial-notes.json`, holds the editor's evidence notes and poster leads for 92 records.

### Facets and collections

- Format is a fixed list: Feature film, Silent feature, Documentary, Television film, Miniseries.
- Historical period is a fixed list: Biblical antiquity, Early Church, Middle Ages, then each century from the 16th to the 21st.
- Subjects use a controlled vocabulary.
- Collections are reorganised into three groups (Subjects, Histories, Kinds of film), with gap notes where a collection is empty or thin. The before-1965 and after-1965 collections were removed.

### Design

- New design system in `src/styles/global.css`: Cormorant Garamond and Source Sans 3 on a paper-and-ink palette.
- Visual pass (at the Founder's request, 12 October): the homepage now opens with three public-domain or openly licensed posters and a "Start here" poster shelf, collection tiles show three linked thumbnails, and collection pages have a poster strip in the heading. Every poster on the site links to its film's review. The three large images at the top of the homepage are limited to public-domain and openly licensed posters; the homepage "Start here" shelf, collection tiles and collection headings use linked thumbnails. Posters are never used as backgrounds, banners or social-preview images.
- New library sidebar filters and related-film scoring.
- New pages: A–Z, Start here and the grey area.
- The header fits at 320 px.

### Posters

Images were replaced with sharper, correct-edition posters, with public-domain and openly licensed images preferred. The watermarked and wrong-type images and the homepage Rockwell hero were removed. Every poster now has a `rightsCategory`. Films without a usable poster show a typographic title card. Details are in `IMAGE_CREDITS.md` and `research/poster-rights-review.json`.

### Engineering

- **Deploy workflow:** least-privilege permissions and SHA-pinned actions. The build step runs `catalogue`, a `git diff` check for stale generated data, `check`, `lint`, `test`, `build`, `check-links` and `check-leak`. Deployment happens only from `main`.
- **Repository additions:**
  - Dependabot for GitHub Actions;
  - a rights-request issue template;
  - `LICENSE`: MIT for code, CC BY 4.0 for research data and editorial text, posters excluded.
- **Validation:** schema enums, grey-record rules, WebP header checks, poster/rights consistency checks and a style lint (warnings only).
- **Smaller changes:**
  - `check-leak` skips redirect stubs;
  - search folds ß, æ and œ and matches word prefixes;
  - `browser-qa` takes its browser from `PLAYWRIGHT_CHROMIUM_EXECUTABLE`.
- **Redirects:** removed film URLs and the two removed collection URLs redirect to `/library/` (`astro.config.mjs`).

## Counts

| | Before | After |
|---|---|---|
| Candidates in `research/inventory.json` | 142 | 147 |
| PUBLISH (recommended) | 38 | 48 |
| GREY (grey area) | n/a | 20 |
| HOLD | 101 | 41 |
| REJECT | 3 | 38 |
| Public film pages | 38 | 68 |
| Collections | 17 | 15 |
| Posters | 38 (all films) | 65 (3 public films use a title card) |
| Poster files, total size | 965,184 bytes | 3,331,172 bytes |
| Distinct source URLs | 288 | 540 |
| Production countries of recommended films | 9 | 10 |
| Unit tests | 6 | 31 |
| Pages built | 66 | 95, plus 11 redirect stubs |

Changes in status, by record: 27 recommended films kept their status; 15 HOLD records became PUBLISH; 6 new candidates were added as PUBLISH; 18 HOLD and 2 PUBLISH records became GREY; 9 PUBLISH and 26 HOLD records became REJECT, including 2 removed as out of scope. The duplicate record `the-bells-of-nagasaki-1950` was merged into `bells-of-nagasaki`.

Recommended films now come from the Czech Republic, France, Germany, Italy, Luxembourg, Mexico, Spain, Switzerland, the United Kingdom and the United States. Poland no longer appears; Mexico and the Czech Republic are new. Grey-area films add Japan, Peru and Portugal.

Poster rights categories (65 posters):

| Category | Posters |
|---|---|
| Copyrighted, non-free source | 47 |
| Copyrighted, distributor | 11 |
| Public domain (US) | 3 |
| Public domain (worldwide) | 2 |
| Open licence | 2 |

Empty collections: The Cristero War, The Spanish Civil War, Documentaries.

## Films removed from the site

Each of these old URLs redirects to `/library/`.

| Film | Now | Reason |
|---|---|---|
| The Sound of Music (1965) | REJECT | Out of scope: not Catholic-centred |
| On the Waterfront (1954) | REJECT | Out of scope: not Catholic-centred |
| Padre Pio: Miracle Man (2000) | REJECT | Rule (a) |
| Two Crowns (2017) | REJECT | Rule (a) |
| Triumph of the Heart (2025) | REJECT | Rule (a) |
| Blessed Duns Scotus (2010) | REJECT | Rule (a) |
| Un Dios prohibido (2013) | REJECT | Rule (a) |
| Into Great Silence (2005) | REJECT | Rule (b): Carthusian liturgy as revised after the Council |
| No Greater Love (2009) | REJECT | Rule (b) |

## Films moved from recommended to the grey area

Both pages are kept.

- **The War of the Vendée (2012)**, not yet verified. No independent critic has assessed its history.
- **Don Bosco (1935)**, not yet verified. Pre-conciliar Catholic approval is known only at second hand.

## Films added

### Recommended (21)

- Our Lady of Fatima (1951)
- Joan of Arc (1948)
- Francis of Assisi (1961)
- Thérèse: The Story of Saint Thérèse of Lisieux (2004)
- A Man for All Seasons (1966)
- Becket (1964)
- The Carmelites / Le Dialogue des Carmélites (1960)
- The Scarlet and the Black (1983)
- The Ninth Day (2004)
- Quo Vadis (1951)
- Balarrasa (1951)
- The Fugitive (1947)
- Going My Way (1944)
- The Bells of St. Mary's (1945)
- Caterina da Siena (1947)
- Golgotha (1935)
- Miracle of Saint Thérèse / Procès au Vatican (1952)
- Teresa de Jesús (1962)
- The Gospel According to St. Matthew (1964)
- The King of Kings (1927)
- The Nun's Story (1959)

### Grey area (18 new, 20 in all)

**With reservations:**

- Apparitions at Fatima / Aparição (1991)
- Vaincre ou mourir (2023)
- Fabiola (1949)
- Léon Morin, Priest (1961)
- The Miracle of the Bells (1948)
- The Keys of the Kingdom (1944)
- God Needs Men (1950)
- The Unfrocked One (1954)
- Thérèse (1986)
- The Mission (1986)
- Le Sorcier du ciel (1949)

**Not yet verified:**

- Mary of Nazareth (2012)
- Un mulato llamado Martín (1975)
- St. John Baptist de La Salle (1964)
- Don Bosco (1988)
- Saint Rita (2004)
- Fátima, Terra de Fé! (1943)
- The Bells of Nagasaki (1950)
- The War of the Vendée (2012), moved from recommended
- Don Bosco (1935), moved from recommended

## Rulings

**Founder rulings (2026-10-11):**

- Exclusion rules (a) and (b).
- Catholic-centred scope.
- Post-conciliar sources are cited for facts only.

**Decisions made by the editor under the Founder's stated position.** These are recorded in each film's decision text, and the Founder may overturn any of them:

- **Rejected:**
  - Silence (2016): judged too grave to leave to the viewer, not a scope ruling;
  - La noche oscura (1989);
  - Jesus of Nazareth (1977);
  - Brother Sun, Sister Moon (1972);
  - Rome, Open City (1945).
- **Into Great Silence** rejected under rule (b): Carthusian liturgy revised after the Council.
- **The Gospel According to St. Matthew** kept as recommended. The claim that it appears on the 1995 Vatican list was removed, and the John XXIII dedication is stated neutrally.
- **The Nun's Story** recommended, for adults and older teens.
- **Mary of Nazareth** is grey (not yet verified), because its only reviews come from post-conciliar Catholic outlets.
- **Aparição** is grey (with reservations) because of its John Paul II coda.
- **Au revoir les enfants** rejected on scope. Its decision notes that it could move straight to PUBLISH if the Founder treats the priest's witness as central.
- **Cabrini** rejected: independent Catholic critics document that the film secularises its subject.

The 26 other HOLD-to-REJECT changes apply rule (a) or (b), or another documented reason. Each is stated in its decision text in `research/inventory.json`.

## Known limitations

- **No film was watched.** Every judgment rests on published criticism, histories, archive and production records and release details.
- **Open verification items.** Each of the 20 grey films states what would settle its question. Other open items are in the decision texts and in `research/editorial-notes.json`. HOLD records (41) are unresolved by definition.
- **Poster rights.** 58 of 65 posters are copyrighted. Their use rests on a fair use (US) or fair dealing (UK) assessment for criticism and review, not on a licence; see `research/poster-rights-review.json`. Rights holders can use the rights-request issue template. Twelve posters are narrower than 300 px, which validation reports as a warning.
- **Coverage.** Coverage is thin for Africa, animation and most Asian and Latin American cinema. Three collections are empty.
- **Browser QA.** Playwright needs a local Chromium (`npx playwright install chromium`, or `PLAYWRIGHT_CHROMIUM_EXECUTABLE`). `npm run test:browser` was run against the local build at desktop, tablet and phone widths: no failures, no horizontal overflow and no axe violations, and the screenshots (including the grey-area pages) were reviewed. No Lighthouse measurement was taken. Automated accessibility checks are not a certification.
- **Dependabot** watches GitHub Actions only. npm dependencies need manual review.
- **Hosted checks.** The hosted-verification and performance records in `research/` describe the earlier release.

## Local check results

These were run on the working tree on 11 October 2026, while this report was being written:

- `npm run catalogue`: generated 48 recommendations and 20 grey-area films from 147 candidates and 540 source records.
- `astro check`: 0 errors, 0 warnings, 0 hints.
- `node scripts/validate.mjs`: 68 public films, 15 collections and 65 posters valid. There were 12 warnings for narrow posters and no style warnings.
- `npm test`: 31 of 31 pass.
- `npm run lint`: pass.
- `npm run build`: 95 pages, plus 11 redirect stubs.
- `check-links`: 5,368 local references valid.
- `check-leak`: no HOLD or REJECT record in the build (94 indexable pages, 68 film pages, 79 hidden records checked).

The workflow's stale-data check (`git diff --exit-code -- src/data research`) only means something after the changes are committed. Run `npm run catalogue` once more before committing so the generated files match the inventory.

## How to deploy

The work is committed on `improve/editorial-pass` but not pushed. Only a push to `main` deploys.

1. Review the changes on `improve/editorial-pass`. The decisions listed under "Rulings" are the ones that most need the Founder's confirmation.
2. Run `npm run catalogue`, then commit on the branch, including the generated files in `src/data/` and `research/`.
3. Push the branch and open a pull request. The workflow builds and checks the branch without deploying.
4. When the checks pass, merge into `main`. The workflow then builds again and deploys to GitHub Pages.
5. On the live site (https://jzenithc.github.io/catholic-film-library/), check:
   - the homepage, the library with and without the grey-area toggle, a recommended film, a grey film, `/grey-area/`, A–Z and Start here;
   - an old removed URL such as `/films/the-sound-of-music/`, which should redirect to `/library/`;
   - the 404 page and the sitemap.

   Record the results.
