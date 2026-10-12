# Changelog

## 2026-10-12 — catalogue, editorial position and new sections

### Catalogue

- 238 public films: 97 recommended and 141 in the grey area. Rejected lost films, unattested entries and films about modern or unapproved apparitions.
- Film pages have cast and crew, an age band with reasons, theological notes citing pre-conciliar authorities, "The history behind it" and "Making the film".
- Legion of Decency ratings for 66 films, each from the Legion's 1959 cumulative list or the trade press tables, shown in the facts panel.
- "Where to watch" on 101 film pages: free public-domain copies, disc editions and streaming, with the date checked.
- Every film page was copy-edited for plain, specific prose.

### Editorial position

- The site does not accept the Second Vatican Council or the reforms after it, and judges films by pre-conciliar Catholic teaching. Two exclusion rules: (a) subjects recognised as saint or blessed only after 1965; (b) films whose Catholic content is the post-conciliar Church presented as normal or exemplary. Only apparitions approved before the Council are covered.
- Post-conciliar bodies and documents are cited for facts only. Legion of Decency and other pre-1965 Catholic ratings count as evidence.
- Catholic-centred films only. The Sound of Music and On the Waterfront were removed.
- Grey area: status GREY with `grey: {kind, question}`, kinds `reservations` and `unverified`, a `/grey-area/` page and a box on each grey film page.

### New pages

- Saints (`/saints/`): 48 saints and blessed with dates, 1962 feast days, a short life and their films.
- Calendar (`/calendar/`): films for each month's feasts, plus Lent, Holy Week and Easter.
- Guides (`/guides/`): ten essays comparing the films on one subject.
- Films not included (`/not-included/`): 162 well-known films and the reason each is left out.
- Library filters for age and Legion of Decency rating. Homepage "More ways in" links.

### Design

- Cormorant Garamond and Source Sans 3, paper-and-ink palette. Homepage hero limited to public-domain and openly licensed posters; every poster links to its film. Films without a poster get a typographic title card. Header fits at 320 px.
- Posters for 186 public films, each with a `rightsCategory`. See IMAGE_CREDITS.md and `research/poster-rights-review.json`.

### Engineering

- Deploy workflow with least-privilege permissions and SHA-pinned actions; builds run catalogue, a stale-data check, astro check, lint, tests, build, check-links and check-leak, and deploy only from `main`.
- Dependabot for GitHub Actions, a rights-request issue template and a LICENSE.
- Schema checks for grey records, Legion ratings, watch links (HTTPS only), WebP headers and poster rights. `check-leak` confirms no HOLD or REJECT record reaches the build.

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
