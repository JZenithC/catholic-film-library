import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  validateCatalogue,
  validateCollections,
  lintStyle,
  PUBLIC_STATUSES,
} from './schema.mjs';
import { readWebpSize } from './webp.mjs';

export const POSTER_MAX = { width: 600, height: 900 };
export const POSTER_MIN_WARN_WIDTH = 300;
export const RIGHTS_POSTER =
  'Poster or release-cover artwork; individual source and editorial-use assessment in image credits.';
export const RIGHTS_NONE =
  'Original Library typographic artwork; no film imagery reproduced.';
const REQUIRED_POSTER_FIELDS = [
  'id',
  'src',
  'width',
  'height',
  'kind',
  'credit',
  'sourcePage',
  'sourceRightsStatement',
  'usageBasis',
  'reviewed',
  'rightsCategory',
];
const isBlank = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === 'string' && !value.trim());

/**
 * Validate poster records against the public films (PUBLISH and GREY) and the
 * real files. Rights checks apply to both statuses alike.
 * @param {object[]} posters  src/data/posters.json
 * @param {object[]} films    src/data/films.json
 * @param {string} publicDir  directory that holds `posters/*.webp`
 */
export async function validatePosters(posters, films, publicDir) {
  const errors = [];
  const warnings = [];
  const publicFilms = films.filter((f) => PUBLIC_STATUSES.includes(f.status));
  const filmIds = new Set(publicFilms.map((f) => f.id));
  const otherIds = new Set(films.map((f) => f.id));
  const seen = new Set();
  for (const poster of posters) {
    const id = poster.id ?? '(no id)';
    if (seen.has(poster.id)) errors.push(`Duplicate poster: ${id}`);
    seen.add(poster.id);
    if (!filmIds.has(poster.id))
      errors.push(
        otherIds.has(poster.id)
          ? `Poster for a film that is neither PUBLISH nor GREY: ${id}`
          : `Unknown poster film: ${id}`,
      );
    for (const field of REQUIRED_POSTER_FIELDS)
      if (isBlank(poster[field])) errors.push(`Missing poster ${field}: ${id}`);
    if (!/^https:\/\//.test(poster.sourcePage ?? ''))
      errors.push(`Poster sourcePage must be https: ${id}`);
    for (const field of ['filePage', 'imageUrl'])
      if (poster[field] !== undefined && !/^https:\/\//.test(poster[field]))
        errors.push(`Poster ${field} must be https: ${id}`);
    const { width, height } = poster;
    if (!(
      Number.isInteger(width) &&
      Number.isInteger(height) &&
      width > 0 &&
      height > 0 &&
      width <= POSTER_MAX.width &&
      height <= POSTER_MAX.height
    ))
      errors.push(
        `Invalid poster dimensions ${width}×${height} (max ${POSTER_MAX.width}×${POSTER_MAX.height}): ${id}`,
      );
    else if (width < POSTER_MIN_WARN_WIDTH)
      warnings.push(
        `Poster narrower than ${POSTER_MIN_WARN_WIDTH}px (${width}×${height}): ${id}`,
      );
    if (!/^posters\/[a-z0-9-]+\.webp$/.test(poster.src ?? '')) {
      errors.push(`Unsafe poster path: ${id}`);
      continue;
    }
    let bytes;
    try {
      bytes = await readFile(path.join(publicDir, poster.src));
    } catch {
      errors.push(`Missing poster asset: ${id}`);
      continue;
    }
    let real;
    try {
      real = readWebpSize(bytes);
    } catch (e) {
      errors.push(`Poster is not a valid WebP file (${e.message}): ${id}`);
      continue;
    }
    if (real.width !== width || real.height !== height)
      errors.push(
        `Poster dimensions in posters.json (${width}×${height}) do not match the file (${real.width}×${real.height}): ${id}`,
      );
    if (poster.bytes !== undefined && poster.bytes !== bytes.length)
      warnings.push(
        `Poster byte size in posters.json (${poster.bytes}) differs from the file (${bytes.length}): ${id}`,
      );
  }
  for (const film of publicFilms) {
    const has = seen.has(film.id);
    if (has && film.imageRights !== RIGHTS_POSTER)
      errors.push(
        `Film has a poster but imageRights does not say so: ${film.id}`,
      );
    if (!has && film.imageRights !== RIGHTS_NONE)
      errors.push(
        `Film has no poster but imageRights claims poster artwork: ${film.id}`,
      );
  }
  return { errors, warnings };
}

/** Validate the whole data set rooted at `root` (the repository). */
export async function validateProject(root) {
  const read = async (rel) =>
    JSON.parse(await readFile(path.join(root, rel), 'utf8'));
  const films = await read('src/data/films.json');
  const collections = await read('src/data/collections.json');
  const posters = await read('src/data/posters.json');
  const errors = [
    ...validateCollections(collections),
    ...validateCatalogue(films, collections),
  ];
  const warnings = lintStyle(films).map((w) => `Style: ${w}`);
  const poster = await validatePosters(
    posters,
    films,
    path.join(root, 'public'),
  );
  errors.push(...poster.errors);
  warnings.push(...poster.warnings);
  if (!films.length) errors.push('The public catalogue is empty.');
  return { errors, warnings, films, collections, posters };
}

const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const { errors, warnings, films, collections, posters } =
    await validateProject(root);
  if (warnings.length)
    console.warn(
      `${warnings.length} warning(s):\n` +
        warnings.map((w) => `  warn  ${w}`).join('\n'),
    );
  if (errors.length) {
    console.error(
      `${errors.length} error(s):\n` +
        errors.map((e) => `  error ${e}`).join('\n'),
    );
    process.exit(1);
  }
  console.log(
    `Validated ${films.length} public films, ${collections.length} collections and ${posters.length} posters. Human source-attribution and theological review remain separate requirements.`,
  );
}
