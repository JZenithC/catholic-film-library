# Contributing

Contributions should improve evidence, clarity or access. Read EDITORIAL_POLICY.md before proposing a recommendation, especially the pre-conciliar standard, the scope rule and the two exclusion rules. The editor has final editorial authority.

## Report an error or suggest a film

Use the repository's "Correct a film record" or "Suggest a film" issue template. Rights holders should use the "Image or rights request" template. Blank issues are disabled.

Include the film title, the year if known, the affected page or id, the exact statement at issue, the proposed correction, and a credible source URL or full bibliographic reference. Explain what the source establishes. For a suggestion, separate evidence about the film's identity from evidence about how it treats the faith. Before suggesting a film about a saint or blessed, check the date of the canonisation or beatification: a subject raised to the altars only after 1965 is excluded. Mention the edition, language, region and running time if the issue concerns a particular cut.

Pre-1965 Catholic film-office ratings (such as the Legion of Decency) are welcome evidence. Reviews from post-conciliar Catholic outlets can establish what a film contains, but they cannot by themselves support a recommendation.

Do not include private personal information, copyrighted films, pirated links, long copied passages or unsupported accusations. Source-led disagreement is welcome. A suggestion is not a promise of inclusion.

## Make a repository change

1. Create a focused branch. Edit `research/inventory.json` (and `research/editorial-notes.json` where useful), then run `npm run catalogue`. Do not edit the generated files in `src/data/` by hand. Keep layout changes separate where practical.
2. New candidates start on HOLD. Apply the documented gates before changing a record to PUBLISH or GREY, and keep the reasons for earlier decisions.
3. Write original text in a plain critic's voice, separate fact from interpretation, and add specific advisories supported by evidence. Do not claim to have watched a film unless you did.
4. Keep stable ids and URLs. Add an alternate title rather than duplicating a film. If a film leaves the site, add a redirect (see MAINTENANCE.md). Follow MAINTENANCE.md for posters and collections.
5. Run `npm run check`, `npm run lint`, `npm test`, `npm run build` and `npm run check:build`. Review the affected pages in a browser, including at phone width and with the keyboard. Record what you actually tested.
6. Open a focused pull request explaining the changed claim or behaviour, the evidence, the editorial effect and the checks run. Do not mark unperformed checks as done.

Code is under MIT and research text under CC BY 4.0 (see LICENSE). Source material keeps its original rights. Supply licensing evidence for contributed images and fonts. A citation is not permission to reuse artwork.
