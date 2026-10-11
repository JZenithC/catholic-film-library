/**
 * Generate the public catalogue from the research inventory.
 *
 *   research/inventory.json  ->  src/data/films.json          (PUBLISH and GREY)
 *                            ->  src/data/research-summary.json
 *                            ->  research/source-registry.json (all statuses, labelled)
 *                            ->  research/starting-inventory-crosswalk.json (status refresh)
 *
 * Usage: `node scripts/catalogue.mjs [repo-root]` (defaults to the repository
 * containing this script). The logic is exported for tests.
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { PERIODS, PUBLIC_STATUSES } from './schema.mjs';

/** Used only when src/data/featured.json is absent. Must all be PUBLISH. */
export const DEFAULT_FEATURED = [
  'the-song-of-bernadette',
  'monsieur-vincent',
  'the-flowers-of-st-francis',
  'diary-of-a-country-priest',
  'the-passion-of-the-christ',
  'a-man-for-all-seasons',
  'the-reluctant-saint',
  'le-dialogue-des-carmelites',
  'i-confess',
  'the-passion-of-joan-of-arc',
];
/** Legacy free-text periods mapped onto the controlled vocabulary. */
export const LEGACY_PERIODS = {
  Contemporary: '21st century',
  'Contemporary London': '21st century',
  'Biblical and apostolic era': 'Biblical antiquity',
  'Nineteenth century': '19th century',
  'Nineteenth-century Piedmont': '19th century',
  'Medieval Christendom': 'Middle Ages',
  'Medieval Assisi': 'Middle Ages',
  'Late thirteenth and early fourteenth centuries': 'Middle Ages',
  'Sixteenth-century Spain': '16th century',
  'Sixteenth-century Rome': '16th century',
  'Turn of the twentieth century': '20th century',
  '19th–20th centuries': '20th century',
  'Late nineteenth and twentieth centuries': '20th century',
  'Second World War': '20th century',
  'Twentieth century': '20th century',
  'Twentieth-century Spain': '20th century',
  'Twentieth-century Italy': '20th century',
  'Post-war Europe': '20th century',
  'Austria before the Second World War': '20th century',
  'Japan before and after the atomic bombing of 1945': '20th century',
};
/** Unambiguous spelling variants of controlled formats. Unknown formats are left for the schema to flag. */
export const FORMAT_SYNONYMS = {
  Feature: 'Feature film',
  'Documentary feature': 'Documentary',
};
export const DROPPED_COLLECTIONS = new Set(['before-1965', 'after-1965']);
export const RENAMED_COLLECTIONS = { revolution: 'vendee' };
const RIGHTS_POSTER =
  'Poster or release-cover artwork; individual source and editorial-use assessment in image credits.';
const RIGHTS_NONE =
  'Original Library typographic artwork; no film imagery reproduced.';
const PROSE = [
  'synopsis',
  'inclusion',
  'themes',
  'history',
  'production',
  'doctrine',
  'liberties',
  'advisories',
];
const LISTS = [
  'alternateTitles',
  'directors',
  'countries',
  'languages',
  'subjects',
  'collections',
];

export function assertUniqueIds(inventory) {
  const seen = new Set();
  const dupes = new Set();
  for (const record of inventory) {
    if (!record.id) throw new Error('Inventory record without an id');
    if (seen.has(record.id)) dupes.add(record.id);
    seen.add(record.id);
  }
  if (dupes.size)
    throw new Error(`Duplicate inventory ids: ${[...dupes].join(', ')}`);
}

export function normalisePeriod(value) {
  if (PERIODS.includes(value)) return { value };
  if (Object.hasOwn(LEGACY_PERIODS, value))
    return { value: LEGACY_PERIODS[value] };
  return { value, unmapped: true };
}

/** Turn one PUBLISH or GREY inventory record into a public films.json record. */
export function toPublicFilm(record, { posterIds, featured, warn }) {
  const out = Object.fromEntries(
    Object.entries(record).filter(([k]) => !k.startsWith('_')),
  );
  for (const k of PROSE)
    if (Array.isArray(out[k])) out[k] = out[k].join('\n\n');
  for (const k of LISTS) out[k] ??= [];
  out.format = FORMAT_SYNONYMS[out.format] ?? out.format;
  const period = normalisePeriod(out.historicalPeriod);
  if (period.unmapped)
    warn(
      `${out.id}: historicalPeriod "${out.historicalPeriod}" is not in the controlled list; fix it in research/inventory.json`,
    );
  out.historicalPeriod = period.value;
  out.collections = [
    ...new Set(
      out.collections
        .filter((c) => !DROPPED_COLLECTIONS.has(c))
        .map((c) => RENAMED_COLLECTIONS[c] ?? c),
    ),
  ];
  out.imageRights = posterIds.has(out.id) ? RIGHTS_POSTER : RIGHTS_NONE;
  // Every public film carries `grey`: null when recommended, else its question.
  if (out.status !== 'GREY') out.grey = null;
  delete out.featured;
  const index = featured.indexOf(out.id);
  if (index >= 0) out.featured = index;
  return out;
}

/** Pure transformation: inputs in, outputs out. */
export function buildCatalogue({
  inventory,
  posters,
  collections,
  crosswalk,
  featured = DEFAULT_FEATURED,
}) {
  assertUniqueIds(inventory);
  const warnings = [];
  const warn = (message) => warnings.push(message);
  const posterIds = new Set(posters.map((p) => p.id));
  const byId = new Map(inventory.map((f) => [f.id, f]));
  // Featured films must be recommended; a grey-area film is never featured.
  const notRecommended = featured.filter((id) => byId.get(id)?.status !== 'PUBLISH');
  if (notRecommended.length)
    throw new Error(
      `featured.json may list only PUBLISH films: ${notRecommended
        .map((id) => `${id} (${byId.get(id)?.status ?? 'not in inventory'})`)
        .join(', ')}`,
    );
  const films = inventory
    .filter((f) => PUBLIC_STATUSES.includes(f.status))
    .map((f) => toPublicFilm(f, { posterIds, featured, warn }));
  const recommended = films.filter((f) => f.status === 'PUBLISH');
  const newCrosswalk = crosswalk.map((record) => {
    const film = byId.get(record.recordId);
    if (!film)
      throw new Error('Unaccounted initial candidate ' + record.recordId);
    return { ...record, status: film.status };
  });
  const summary = {
    initial: crosswalk.length,
    candidates: inventory.length,
    additional: inventory.length - crosswalk.length,
    recommended: recommended.length,
    grey: films.length - recommended.length,
    hold: inventory.filter((f) => f.status === 'HOLD').length,
    reject: inventory.filter((f) => f.status === 'REJECT').length,
    countries: [...new Set(recommended.flatMap((f) => f.countries))].sort(),
    // A collection with only grey-area films is not empty.
    emptyCollections: collections
      .filter((c) => !films.some((f) => f.collections.includes(c.id)))
      .map((c) => c.title),
  };
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
      // The top-level title is the first record's; each film keeps its own.
      entry.films.push({
        id: film.id,
        status: film.status,
        title: source.title,
        claims: source.claims,
      });
    }
  return {
    films,
    summary,
    registry: [...registry.values()],
    crosswalk: newCrosswalk,
    warnings,
  };
}

const json = (value) => JSON.stringify(value, null, 2) + '\n';

/** Read inputs under `root`, generate, and (unless write is false) write outputs. */
export async function generateCatalogue({ root, write = true } = {}) {
  const read = async (rel) =>
    JSON.parse(await readFile(path.join(root, rel), 'utf8'));
  let featured = DEFAULT_FEATURED;
  try {
    featured = await read('src/data/featured.json');
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
  if (!Array.isArray(featured) || featured.some((x) => typeof x !== 'string'))
    throw new Error('src/data/featured.json must be an array of film ids');
  const result = buildCatalogue({
    inventory: await read('research/inventory.json'),
    posters: await read('src/data/posters.json'),
    collections: await read('src/data/collections.json'),
    crosswalk: await read('research/starting-inventory-crosswalk.json'),
    featured,
  });
  if (write) {
    const out = (rel, value) => writeFile(path.join(root, rel), json(value));
    await out('src/data/films.json', result.films);
    await out('research/starting-inventory-crosswalk.json', result.crosswalk);
    await out('src/data/research-summary.json', result.summary);
    await out('research/source-registry.json', result.registry);
  }
  return result;
}

const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  const root = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const result = await generateCatalogue({ root });
  for (const w of result.warnings) console.warn(`warn  ${w}`);
  console.log(
    `Generated ${result.summary.recommended} recommendations and ${result.summary.grey} grey-area films from ${result.summary.candidates} candidates and ${result.registry.length} source records.`,
  );
}
