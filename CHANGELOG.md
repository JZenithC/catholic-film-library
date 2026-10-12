# Changelog

## 2026-10-12 (third update): new films, posters and rule (a) wording

- 315 public films: 117 recommended and 198 in the grey area.
- Fifteen films added:
  - Recommended: The Eternal Gift (1940), a filmed Solemn High Mass with Sheen's commentary; Embezzled Heaven (1958); and the silent The Confession (1920).
  - Grey area: Hill Number One, Journey of Faith, Christ in Bronze, Brighton Rock, The Heart of the Matter, Mass of the Ages Parts 2 and 3, and films on the monks of Saint-Benoît-du-Lac, Norcia, Silverstream and Le Barroux and on the Chartres pilgrimage.
- Saint Rita (2004) and Claret (2021) recommended after a reading of their dialogue.
- Posters for 40 more films (282 in all), and larger copies of 64 small ones.
- "Where to watch" on 205 film pages.
- Rule (a) reworded. Beatifications and canonisations by the post-conciliar popes are reported as declarations and not accepted as such, and nobody is called saint or blessed on their strength. Films not included, How films are chosen, the collection notes and the film pages that mention Juan Diego, the Fátima children and the Korean martyrs now say this.

## 2026-10-12 (second update) — posters, where to watch, saints, reading and new pages

- 300 public films: 112 recommended and 188 in the grey area.
- Period reviews and Catholic ratings found for grey-area films in Spanish, Uruguayan, Canadian and French Catholic papers: Sor intrépida, Cerca de la ciudad, Un missionnaire, Un traje blanco, El pórtico de la gloria and La vie de Jésus (1951) are now recommended. La voce del silenzio carries a stated reservation from a 1956 review. Several others gained supporting notices and a Legion rating.
- Films on hold resolved: Santa Cecilia (1911) recommended; seven films to the grey area; the 2025 Compiègne documentary rejected under rule (b); lost and non-Catholic films rejected. Eleven stay on hold, each with what would settle it.
- Posters for 56 more films (242 in all), each checked against the film's billing.
- "Where to watch" on 181 film pages, up from 108.
- Saints: eleven added (Cyril and Methodius, Benedict, Stephen of Hungary, Nicholas of Flüe, Margaret Mary Alacoque, Gabriel of Our Lady of Sorrows, James, Francis Xavier, Dominic, Maxentia and Cecilia), and the new films attached to their saints and feasts.
- Further reading on every saint's page and on film pages: pre-1965 lives, the saints' own writings, the Douay-Rheims and papal documents, each link opened.
- Five new guides: the Passion, Mexican and Spanish religious cinema, convents, the apostles, and missionaries.
- New pages: Watching with children (`/family/`), New films (`/new/`) with an RSS feed (`/feed.xml`), and a printable list (`/print/`).

## 2026-10-12 — catalogue, editorial position and new sections

### Catalogue

- 293 public films: 105 recommended and 188 in the grey area. Rejected lost films, unattested entries and films about modern or unapproved apparitions.
- 72 further films researched, among them silent lives of saints, Mexican, Spanish and Italian religious films of the 1940s and 1950s, and recent biblical and saints' films: 55 added (5 recommended, 50 grey), 11 held and 6 rejected.
- Film pages have cast and crew, an age band with reasons, theological notes citing pre-conciliar authorities, "The history behind it" and "Making the film".
- Legion of Decency ratings for 72 films, each from the Legion's 1959 cumulative list or the trade press tables, shown in the facts panel.
- "Where to watch" on 108 film pages: free public-domain copies, disc editions and streaming, with the date checked.
- Grey-area films with no independent review were checked against their dialogue where subtitles exist. Several moved to recommended, among them My Name Is Bernadette, Marie de Nazareth and Cyril and Methodius: The Apostles of the Slavs; the rest keep their reservation with the relevant lines cited.
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
- Films not included (`/not-included/`): 164 well-known films and the reason each is left out.
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
