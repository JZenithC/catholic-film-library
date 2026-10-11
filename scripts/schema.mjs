import { z } from 'zod';

/** Controlled vocabularies (see the record guide). */
export const FORMATS = [
  'Feature film',
  'Silent feature',
  'Documentary',
  'Television film',
  'Miniseries',
];
export const PERIODS = [
  'Biblical antiquity',
  'Early Church',
  'Middle Ages',
  '16th century',
  '17th century',
  '18th century',
  '19th century',
  '20th century',
  '21st century',
];
export const COLLECTION_GROUPS = ['Subjects', 'Histories', 'Kinds of film'];
/** Formats for which an empty `languages` list is legitimate. */
export const LANGUAGELESS_FORMATS = ['Silent feature', 'Documentary'];
/** Template text that once stood in for real source claims. */
export const GENERIC_CLAIM =
  'identity or specific review concern; does not certify suitability';
export const MAX_YEAR = new Date().getFullYear() + 1;
/** Statuses that reach the public site: recommended, and grey-area films. */
export const PUBLIC_STATUSES = ['PUBLISH', 'GREY'];
export const GREY_KINDS = ['reservations', 'unverified'];
/** Age bands for the suitability line on each film page. */
export const AGE_BANDS = ['All ages', '8+', '12+', '15+', 'Adults'];
/** Word range for the public grey-area question. */
export const GREY_QUESTION_WORDS = { min: 40, max: 120 };

/** Phrases the Founder dislikes. Reported as warnings, never as failures. */
export const STYLE_PATTERN =
  /the Library|ecclesiastical approval|imprimatur|prepared adult viewers|cautious traditional Catholic audience|invites contemplation|its place here/gi;
const PLACEHOLDER_PATTERN =
  /lorem ipsum|TODO|TBD|guaranteed orthodox|free of controversy|Church approved/i;
const PROSE_FIELDS = [
  'summary',
  'synopsis',
  'inclusion',
  'themes',
  'history',
  'production',
  'doctrine',
  'liberties',
  'advisories',
];

const nonempty = z.string().trim().min(1);
const claim = nonempty.refine(
  (value) => value.trim().toLowerCase() !== GENERIC_CLAIM,
  'Source claims must state what this source supports, not the generic placeholder',
);
export const sourceSchema = z.object({
  title: nonempty,
  publisher: nonempty,
  url: z
    .url()
    .refine(
      (value) => ['https:', 'http:'].includes(new URL(value).protocol),
      'Source links must use HTTP or HTTPS',
    ),
  accessed: z.iso.date(),
  claims: z.union([claim, z.array(claim).min(1)]),
});
export const filmSchema = z.object({
  id: nonempty,
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: nonempty,
  originalTitle: z.string().optional(),
  alternateTitles: z.array(nonempty),
  year: z.number().int().min(1895).max(MAX_YEAR),
  format: z.enum(FORMATS),
  directors: z.array(nonempty).min(1),
  countries: z.array(nonempty).min(1),
  languages: z.array(nonempty),
  subjects: z.array(nonempty).min(1),
  collections: z.array(nonempty).min(1),
  historicalPeriod: z.enum(PERIODS),
  status: z.enum(PUBLIC_STATUSES),
  decision: nonempty,
  grey: z
    .object({ kind: z.enum(GREY_KINDS), question: nonempty })
    .strict()
    .nullable()
    .optional(),
  summary: nonempty,
  synopsis: nonempty,
  inclusion: nonempty,
  themes: nonempty,
  history: z.string().optional(),
  production: z.string().optional(),
  doctrine: z.string().optional(),
  cast: z
    .array(z.object({ name: nonempty, role: nonempty.optional() }).strict())
    .optional(),
  crew: z
    .array(z.object({ job: nonempty, names: z.array(nonempty).min(1) }).strict())
    .optional(),
  suitability: z
    .object({ age: z.enum(AGE_BANDS), note: nonempty })
    .strict()
    .optional(),
  liberties: z.string().optional(),
  advisories: nonempty,
  sources: z.array(sourceSchema).min(2),
  reviewed: z.iso.date(),
  runtime: z.number().positive().optional(),
  featured: z.number().optional(),
  imageRights: z.enum([
    'Original Library typographic artwork; no film imagery reproduced.',
    'Poster or release-cover artwork; individual source and editorial-use assessment in image credits.',
  ]),
});

const fold = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
    .toLowerCase();
export const hostOf = (value) => {
  try {
    return new URL(value).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return undefined;
  }
};
const prose = (film) =>
  [...PROSE_FIELDS.map((k) => film[k]), film.grey?.question, film.suitability?.note]
    .filter((v) => typeof v === 'string')
    .join(' ');
export const wordCount = (text) =>
  String(text ?? '').trim().split(/\s+/).filter(Boolean).length;

/** Rules that span several fields, applied in addition to filmSchema. */
function crossFieldErrors(film) {
  const errors = [];
  const name = film.title ?? film.id;
  const own = new Set([fold(film.title), fold(film.originalTitle)]);
  const seenAlt = new Set();
  for (const alt of film.alternateTitles ?? []) {
    const key = fold(alt);
    if (own.has(key))
      errors.push(
        `Alternate title repeats title or original title on ${name}: ${alt}`,
      );
    else if (seenAlt.has(key))
      errors.push(`Duplicate alternate title on ${name}: ${alt}`);
    seenAlt.add(key);
  }
  if (
    Array.isArray(film.languages) &&
    film.languages.length === 0 &&
    !LANGUAGELESS_FORMATS.includes(film.format)
  )
    errors.push(
      `Languages may be empty only for ${LANGUAGELESS_FORMATS.join(' or ')}: ${name} (${film.format})`,
    );
  const sources = film.sources ?? [];
  if (new Set(sources.map((s) => s.url)).size < 2)
    errors.push(`Insufficient distinct sources: ${name}`);
  if (new Set(sources.map((s) => hostOf(s.url)).filter(Boolean)).size < 2)
    errors.push(`Sources must come from at least two different hosts: ${name}`);
  // A grey-area film states its question publicly; a recommended film has none.
  if (film.status === 'GREY') {
    if (!film.grey) errors.push(`GREY record without a grey question: ${name}`);
    else {
      const words = wordCount(film.grey.question);
      const { min, max } = GREY_QUESTION_WORDS;
      if (words < min || words > max)
        errors.push(
          `Grey question must be ${min}–${max} words (has ${words}): ${name}`,
        );
    }
    if (!/^GREY:/.test(film.decision ?? ''))
      errors.push(`GREY decision must start with "GREY:": ${name}`);
    if (film.featured !== undefined)
      errors.push(`A grey-area film cannot be featured: ${name}`);
  } else if (film.grey)
    errors.push(`Only GREY records may carry a grey question: ${name}`);
  return errors;
}

export function validateCatalogue(films, collections) {
  const errors = [];
  const ids = new Set(),
    slugs = new Set(),
    identities = new Set(),
    works = new Map();
  for (const f of films) {
    const key =
      fold(f.originalTitle || f.title) +
      '|' +
      [...(f.directors ?? [])].sort().join('|').toLowerCase();
    if (works.has(key) && works.get(key) !== f.year)
      errors.push(
        `Conflicting release years for ${f.title}: ${works.get(key)} and ${f.year}`,
      );
    works.set(key, f.year);
  }
  for (const film of films) {
    const parsed = filmSchema.safeParse(film);
    if (!parsed.success) errors.push(`${film.title}: ${parsed.error.message}`);
    errors.push(...crossFieldErrors(film));
    for (const [key, set, value] of [
      ['id', ids, film.id],
      ['slug', slugs, film.slug],
      ['identity', identities, `${fold(film.title)}|${film.year}`],
    ]) {
      if (set.has(value)) errors.push(`Duplicate ${key}: ${value}`);
      set.add(value);
    }
    for (const c of film.collections ?? [])
      if (!collections.some((x) => x.id === c))
        errors.push(`Unknown collection ${c} on ${film.title}`);
    if (PLACEHOLDER_PATTERN.test(prose(film)))
      errors.push(`Placeholder or unsupported claim in ${film.title}`);
    if (
      (film.inclusion ?? '').length < 100 ||
      (film.synopsis ?? '').length < 100
    )
      errors.push(`Inadequate editorial profile: ${film.title}`);
  }
  return errors;
}

/** Collections must have a unique id and a known group. */
export function validateCollections(collections) {
  const errors = [];
  const ids = new Set();
  for (const c of collections) {
    if (!c.id?.trim()) errors.push('Collection without id');
    if (ids.has(c.id)) errors.push(`Duplicate collection: ${c.id}`);
    ids.add(c.id);
    if (!COLLECTION_GROUPS.includes(c.group))
      errors.push(
        `Collection ${c.id} has group "${c.group}"; expected one of ${COLLECTION_GROUPS.join(', ')}`,
      );
  }
  return errors;
}

/** Soft style lint: returns warnings for disliked phrases in public prose. */
export function lintStyle(films) {
  const warnings = [];
  for (const film of films)
    for (const field of [...PROSE_FIELDS, 'grey.question']) {
      const text =
        field === 'grey.question' ? film.grey?.question : film[field];
      if (typeof text !== 'string') continue;
      for (const m of text.matchAll(STYLE_PATTERN))
        warnings.push(`${film.id} ${field}: "${m[0]}"`);
    }
  return warnings;
}
