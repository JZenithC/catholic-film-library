import raw from './films.json';
import groups from './collections.json';
export interface Source {
  title: string;
  publisher: string;
  url: string;
  accessed: string;
  claims: string[] | string;
}
export type GreyKind = 'reservations' | 'unverified';
export interface Grey {
  kind: GreyKind;
  question: string;
}
export interface Film {
  id: string;
  slug: string;
  title: string;
  originalTitle?: string;
  alternateTitles: string[];
  year: number;
  format: string;
  directors: string[];
  countries: string[];
  languages: string[];
  subjects: string[];
  collections: string[];
  historicalPeriod: string;
  status: 'PUBLISH' | 'GREY';
  decision: string;
  grey: Grey | null;
  summary: string;
  synopsis: string;
  inclusion: string;
  themes: string;
  history?: string;
  liberties?: string;
  advisories: string;
  sources: Source[];
  reviewed: string;
  runtime?: number;
  featured?: number;
  imageRights?: string;
}
export type CollectionGroup = 'Subjects' | 'Histories' | 'Kinds of film';
export interface Collection {
  id: string;
  group: CollectionGroup;
  title: string;
  description: string;
  gap?: string;
}
export const groupOrder: CollectionGroup[] = [
  'Subjects',
  'Histories',
  'Kinds of film',
];
/** Every public film: recommended and grey-area. Each has its own page. */
export const publicFilms = (raw as unknown as Film[]).filter(
  (f) => f.status === 'PUBLISH' || f.status === 'GREY',
);
/** Recommended films only: the default for lists, home and featured. */
export const films = publicFilms.filter((f) => f.status === 'PUBLISH');
export const greyFilms = publicFilms.filter((f) => f.status === 'GREY');
export const greyLabels: Record<GreyKind, string> = {
  reservations: 'With reservations',
  unverified: 'Not yet verified',
};
export const collections = groups as Collection[];
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const url = (path = '') => `${base}/${path.replace(/^\//, '')}`;
const byFeatured = (a: Film, b: Film) =>
  (a.featured ?? 999) - (b.featured ?? 999) ||
  a.title.localeCompare(b.title, 'en');
export const featured = [...films].sort(byFeatured);
/** All public films in featured order: recommended first, then grey-area. */
export const publicInOrder = [...featured, ...[...greyFilms].sort(byFeatured)];
/** Recommended films in a collection. */
export const filmsIn = (collectionId: string) =>
  films.filter((f) => f.collections.includes(collectionId));
/** Grey-area films in a collection. */
export const greyIn = (collectionId: string) =>
  greyFilms.filter((f) => f.collections.includes(collectionId));
/** Split a prose field on blank lines into paragraphs. */
export const paragraphs = (text?: string) =>
  String(text ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
export const plural = (n: number, word: string) =>
  `${n} ${n === 1 ? word : `${word}s`}`;
/** Count line for a collection tile, e.g. "4 films, 1 in the grey area". */
export const collectionCount = (collectionId: string) => {
  const n = filmsIn(collectionId).length;
  const g = greyIn(collectionId).length;
  if (!n && !g) return '';
  if (!n) return plural(g, 'grey-area film');
  return g ? `${plural(n, 'film')}, ${g} in the grey area` : plural(n, 'film');
};
const kindLabels: Record<string, string> = {
  poster: 'Poster',
  'dvd cover': 'DVD cover',
  'vhs cover': 'VHS cover',
  'video cover': 'Video cover',
  'blu-ray cover': 'Blu-ray cover',
  'lobby card': 'Lobby card',
};
/** Human label for an image kind, e.g. "DVD cover". */
export const kindLabel = (kind: string) => {
  const k = kind.trim().toLowerCase();
  return kindLabels[k] ?? k.charAt(0).toUpperCase() + k.slice(1);
};
/** A short attribution for an image credit line, e.g. "via Wikipedia". */
export const creditShort = (credit: string) => {
  const first = credit.split(';')[0].trim().replace(/\.$/, '');
  const via = first.indexOf(' via ');
  if (via >= 0) return first.slice(via + 1);
  if (/\b(by|edition|illustration|artwork)\b/i.test(first)) return first;
  const match = credit.match(/\bvia ([^;.]+)/);
  return match ? `via ${match[1].trim()}` : first;
};
