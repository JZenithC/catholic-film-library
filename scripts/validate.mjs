import { readFile } from 'node:fs/promises';
import { validateCatalogue } from './schema.mjs';
const films = JSON.parse(
  await readFile(new URL('../src/data/films.json', import.meta.url)),
);
const collections = JSON.parse(
  await readFile(new URL('../src/data/collections.json', import.meta.url)),
);
const errors = validateCatalogue(films, collections);
if (!films.length) errors.push('The public catalogue is empty.');
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(
  `Validated ${films.length} public films, ${collections.length} collections. Human source-attribution and theological review remain separate requirements.`,
);
