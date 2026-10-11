import { readFile, writeFile } from 'node:fs/promises';
const inventory = JSON.parse(await readFile('research/inventory.json', 'utf8'));
const priority = [
  'the-song-of-bernadette',
  'monsieur-vincent',
  'the-flowers-of-st-francis',
  'diary-of-a-country-priest',
  'the-passion-of-the-christ',
  'the-reluctant-saint',
  'into-great-silence',
  'i-confess',
  'the-passion-of-joan-of-arc',
];
const periods = {
  Contemporary: '21st century',
  'Biblical and apostolic era': 'Biblical antiquity',
  'Nineteenth century': '19th century',
  'Medieval Christendom': 'Middle Ages',
  'Medieval Assisi': 'Middle Ages',
  'Late thirteenth and early fourteenth centuries': 'Middle Ages',
  '17th century': 'Early modern era',
  'Early modern Catholic world': 'Early modern era',
  'Turn of the twentieth century': '19th–20th centuries',
  'Second World War': '20th century',
  'Twentieth century': '20th century',
  'Post-war Europe': '20th century',
  'Austria before the Second World War': '20th century',
  'Twentieth-century Italy': '20th century',
  'Nineteenth-century Piedmont': '19th century',
};
const films = inventory
  .filter((f) => f.status === 'PUBLISH')
  .map((f) => {
    const out = { ...f };
    for (const k of [
      'synopsis',
      'inclusion',
      'themes',
      'history',
      'liberties',
      'advisories',
    ])
      if (Array.isArray(out[k])) out[k] = out[k].join('\n\n');
    for (const k of [
      'alternateTitles',
      'directors',
      'countries',
      'languages',
      'subjects',
      'collections',
    ])
      out[k] ??= [];
    if (out.format === 'Feature') out.format = 'Feature film';
    if (out.format === 'Documentary feature') out.format = 'Documentary';
    out.historicalPeriod =
      periods[out.historicalPeriod] ?? out.historicalPeriod;
    out.imageRights =
      'Original Library typographic artwork; no film imagery reproduced.';
    const index = priority.indexOf(out.slug);
    if (index >= 0) out.featured = index;
    return out;
  });
await writeFile('src/data/films.json', JSON.stringify(films, null, 2) + '\n');
const collections = JSON.parse(
  await readFile('src/data/collections.json', 'utf8'),
);
const crosswalk = JSON.parse(
  await readFile('research/starting-inventory-crosswalk.json', 'utf8'),
);
for (const record of crosswalk) {
  const film = inventory.find((f) => f.id === record.recordId);
  if (!film) throw Error('Unaccounted initial candidate ' + record.recordId);
  record.status = film.status;
}
await writeFile(
  'research/starting-inventory-crosswalk.json',
  JSON.stringify(crosswalk, null, 2) + '\n',
);
await writeFile(
  'src/data/research-summary.json',
  JSON.stringify(
    {
      initial: crosswalk.length,
      candidates: inventory.length,
      additional: inventory.length - crosswalk.length,
      publish: films.length,
      hold: inventory.filter((f) => f.status === 'HOLD').length,
      reject: inventory.filter((f) => f.status === 'REJECT').length,
      countries: [...new Set(films.flatMap((f) => f.countries))].sort(),
      emptyCollections: collections
        .filter((c) => !films.some((f) => f.collections.includes(c.id)))
        .map((c) => c.title),
    },
    null,
    2,
  ) + '\n',
);
const registry = new Map();
for (const film of inventory)
  for (const source of film.sources ?? []) {
    let entry = registry.get(source.url);
    if (!entry) {
      entry = {
        ...source,
        licensing:
          source.licensing ??
          'Reference link only; no source text or image reproduction rights asserted.',
        films: [],
      };
      registry.set(source.url, entry);
    }
    entry.films.push({
      id: film.id,
      status: film.status,
      claims: source.claims,
    });
  }
await writeFile(
  'research/source-registry.json',
  JSON.stringify([...registry.values()], null, 2) + '\n',
);
console.log(
  `Generated ${films.length} recommendations from ${inventory.length} candidates and ${registry.size} source records.`,
);
