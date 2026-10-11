import { z } from 'zod';
const nonempty = z.string().trim().min(1);
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
  claims: z.union([nonempty, z.array(nonempty).min(1)]),
});
export const filmSchema = z.object({
  id: nonempty,
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: nonempty,
  originalTitle: z.string().optional(),
  alternateTitles: z.array(nonempty),
  year: z.number().int().min(1895).max(2026),
  format: nonempty,
  directors: z.array(nonempty).min(1),
  countries: z.array(nonempty).min(1),
  languages: z.array(nonempty),
  subjects: z.array(nonempty).min(1),
  collections: z.array(nonempty).min(1),
  historicalPeriod: nonempty,
  status: z.literal('PUBLISH'),
  decision: nonempty,
  summary: nonempty,
  synopsis: nonempty,
  inclusion: nonempty,
  themes: nonempty,
  history: z.string().optional(),
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
export function validateCatalogue(films, collections) {
  const errors = [];
  const ids = new Set(),
    slugs = new Set(),
    identities = new Set(),
    works = new Map();
  for (const f of films) {
    const name = (f.originalTitle || f.title || '')
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase();
    const key =
      name + '|' + [...(f.directors ?? [])].sort().join('|').toLowerCase();
    if (works.has(key) && works.get(key) !== f.year)
      errors.push(
        `Conflicting release years for ${f.title}: ${works.get(key)} and ${f.year}`,
      );
    works.set(key, f.year);
  }
  for (const film of films) {
    const parsed = filmSchema.safeParse(film);
    if (!parsed.success) errors.push(`${film.title}: ${parsed.error.message}`);
    for (const [key, set, value] of [
      ['id', ids, film.id],
      ['slug', slugs, film.slug],
      [
        'identity',
        identities,
        `${film.title
          ?.normalize('NFD')
          .replace(/\p{Diacritic}/gu, '')
          .toLowerCase()}|${film.year}`,
      ],
    ]) {
      if (set.has(value)) errors.push(`Duplicate ${key}: ${value}`);
      set.add(value);
    }
    for (const c of film.collections ?? [])
      if (!collections.some((x) => x.id === c))
        errors.push(`Unknown collection ${c} on ${film.title}`);
    const prose = [
      'summary',
      'synopsis',
      'inclusion',
      'themes',
      'history',
      'liberties',
      'advisories',
    ]
      .map((k) => film[k] ?? '')
      .join(' ');
    if (
      /lorem ipsum|TODO|TBD|guaranteed orthodox|free of controversy|Church approved/i.test(
        prose,
      )
    )
      errors.push(`Placeholder or unsupported claim in ${film.title}`);
    if (
      (film.inclusion ?? '').length < 100 ||
      (film.synopsis ?? '').length < 100
    )
      errors.push(`Inadequate editorial profile: ${film.title}`);
    if (new Set((film.sources ?? []).map((s) => s.url)).size < 2)
      errors.push(`Insufficient distinct sources: ${film.title}`);
  }
  return errors;
}
