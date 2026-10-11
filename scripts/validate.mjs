import { readFile, access } from 'node:fs/promises';
import { validateCatalogue } from './schema.mjs';
const films = JSON.parse(
  await readFile(new URL('../src/data/films.json', import.meta.url)),
);
const collections = JSON.parse(
  await readFile(new URL('../src/data/collections.json', import.meta.url)),
);
const errors = validateCatalogue(films, collections);
const posters = JSON.parse(
  await readFile(new URL('../src/data/posters.json', import.meta.url)),
);
const seen = new Set();
for (const poster of posters) {
  if (seen.has(poster.id)) errors.push(`Duplicate poster: ${poster.id}`);
  seen.add(poster.id);
  if (!films.some((f) => f.id === poster.id))
    errors.push(`Unknown poster film: ${poster.id}`);
  if (!/^posters\/[a-z0-9-]+\.webp$/.test(poster.src))
    errors.push(`Unsafe poster path: ${poster.id}`);
  for (const field of [
    'credit',
    'kind',
    'sourceRightsStatement',
    'usageBasis',
    'identityEvidence',
  ])
    if (!poster[field]?.trim())
      errors.push(`Missing poster ${field}: ${poster.id}`);
  for (const field of ['sourcePage', 'imageUrl'])
    if (!/^https:\/\//.test(poster[field] ?? ''))
      errors.push(`Invalid poster ${field}: ${poster.id}`);
  if (!(
    poster.width > 0 &&
    poster.height > 0 &&
    poster.width <= 500 &&
    poster.height <= 750
  ))
    errors.push(`Invalid poster dimensions: ${poster.id}`);
  try {
    await access(new URL(`../public/${poster.src}`, import.meta.url));
  } catch {
    errors.push(`Missing poster asset: ${poster.id}`);
  }
}
for (const film of films)
  if (film.imageRights.startsWith('Poster') && !seen.has(film.id))
    errors.push(`Missing poster credit: ${film.id}`);
if (!films.length) errors.push('The public catalogue is empty.');
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(
  `Validated ${films.length} public films, ${collections.length} collections. Human source-attribution and theological review remain separate requirements.`,
);
