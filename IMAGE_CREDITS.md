# Image credits and permissions inventory

Film posters and release covers illustrate the film pages and catalogue cards; they are never used as homepage decoration. Films without a suitable correct-edition image show a typographic title card. A religious subject or historic release date does not establish image reuse rights.

## Poster and release-cover records

`src/data/posters.json` is the complete per-film asset manifest: local filename, dimensions, original image URL, source page, artist/distributor/source credit, image kind, source rights statement, identity evidence, review date and contextual use assessment. `research/poster-rights-review.json` preserves the four-factor review and individual source limitations. The website exposes acknowledgements at `/image-credits/` and on every illustrated profile.

Some sources state United States public-domain status; this is recorded with its stated basis, without assuming worldwide public-domain status. Copyrighted images are small identifying illustrations accompanying substantive noncommercial film criticism, with a whole composition retained for recognition and credits. The Library relies on a contextual fair-use/fair-dealing assessment, not a claim of permission, a transferable Wikipedia rationale, or an open license. Creative artwork and possible image-licensing markets weigh against unlicensed use and are acknowledged in the assessment. The UK and US primary guidance was checked on 11 October 2026: https://www.gov.uk/guidance/exceptions-to-copyright and https://www.copyright.gov/fair-use/ . Applicability depends on the particular use and jurisdiction.

Files are locally served WebP derivatives, reduced to at most 600×900 pixels without upscaling or cropping; copyrighted images added on 11 October 2026 were kept to about 400 pixels wide, or their smaller source size. No watermark is removed. No original-resolution downloads, poster sales or image licensing are offered. Third-party artwork is excluded from any reuse rights in site code or original design. Rights holders can request correction or removal with the repository's rights-request issue form (https://github.com/JZenithC/catholic-film-library/issues/new/choose). Removal means deleting the manifest entry and image, regenerating the catalogue, and deploying; the title-card fallback then appears.

## Current asset classes

| Asset                                          | Origin                                                      | Usage basis                                           | Attribution / restrictions                                                                                  |
| ---------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Film title cards                               | Original HTML/CSS/SVG composition in this repository        | Created for this project; no third-party poster image | Describe as a title card made for this site; never an official poster                                                 |
| Film posters and release covers | Individually recorded sources in `src/data/posters.json` | Source-stated US public domain where documented; otherwise limited editorial criticism/review assessment | Third-party copyright retained; source availability and attribution are not permission; see individual records |
| Library wordmark, ornament and favicon         | Original geometric/typographic site design                  | Created for this project                              | No claim to ownership of common religious symbols or film titles                                            |
| Cormorant Garamond (400, 400 italic, 500, 600) | Cormorant Project Authors; `@fontsource/cormorant-garamond` | SIL Open Font License 1.1, checked 2026-10-11         | Locally bundled WOFF files; complete notice at `public/licenses/cormorant-garamond.txt`; no modification    |
| Source Sans 3 (400, 600)                       | `@fontsource/source-sans-3`                                 | SIL Open Font License 1.1, checked 2026-10-11         | Locally bundled WOFF files; complete package notice at `public/licenses/source-sans-3.txt`; no modification |
| Georgia / Arial fallback                       | Visitor operating system                                    | CSS references only                                   | Fallback when bundled fonts cannot load                                                                     |

This inventory must be reconciled with actual shipped assets before every publication. Any added third-party image or bundled font needs an individual record below; a general statement of good intentions is insufficient. The repository does not assert that third-party film names or external source pages are owned by the Library.

## Required record for a new external asset

Record local filename, creator, work title, source-page URL, direct source where needed, copyright holder if known, exact license/version or permission document, date checked, allowed use, modifications, required credit, and where that credit appears. For a public-domain work, explain the applicable basis and jurisdiction rather than inferring status from age alone. Check the digital reproduction's stated terms too.

Do not copy posters from search engines, IMDb, TMDB, archives or distributors without a defensible usage basis. Do not assume attribution cures missing permission. Keep permission evidence in the research records. Use the original title-card fallback when rights are uncertain; never ship a broken image, fabricated film still or imitation official poster. Preserve accessible alternatives when replacing a card with an image.

External links to legitimate publishers or distributors do not transfer rights to their graphics. Do not hotlink their images. No affiliate links, advertising pixels or analytics assets are part of the initial policy.
