import raw from './saints.json';
import { publicFilms, type Film } from './catalogue';

export interface Reading {
  title: string;
  author?: string;
  year?: number;
  url?: string;
  note: string;
}
export interface Person {
  name: string;
  slug: string;
  subject?: string;
  films: string[];
  dates?: string;
  feast?: string;
  feastNote?: string;
  status?: string;
  bio: string;
  sources: { title: string; publisher: string; url: string }[];
  readings?: Reading[];
}
export interface Feast {
  name: string;
  slug: string;
  feast: string;
  feastNote?: string;
  films: string[];
  note: string;
  readings?: Reading[];
}
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
/** "02-11" -> "11 February"; anything else -> "". */
export const feastLabel = (feast?: string) => {
  const m = /^(\d{2})-(\d{2})$/.exec(feast ?? '');
  return m ? `${Number(m[2])} ${MONTHS[Number(m[1]) - 1]}` : '';
};
export const monthNames = MONTHS;
const byId = new Map(publicFilms.map((f) => [f.id, f]));
/** Public films for a list of ids, oldest first, unknown ids dropped. */
export const filmsFor = (ids: string[]) =>
  ids
    .map((id) => byId.get(id))
    .filter((f): f is Film => f !== undefined)
    .sort((a, b) => a.year - b.year);
const data = raw as { people: Person[]; feasts: Feast[] };
/** Saints and blessed with at least one public film, A–Z by name without the title. */
export const people = data.people
  .filter((p) => filmsFor(p.films).length > 0)
  .map((p) => ({ ...p, feastLabel: feastLabel(p.feast) }))
  .sort((a, b) =>
    a.name
      .replace(/^(St|Bl)\s+/, '')
      .localeCompare(b.name.replace(/^(St|Bl)\s+/, ''), 'en'),
  );
export const feasts = data.feasts
  .filter((f) => filmsFor(f.films).length > 0)
  .map((f) => ({ ...f, feastLabel: feastLabel(f.feast) }));
/** The saints a film is about. */
export const saintsFor = (film: Film) =>
  people.filter((p) => p.films.includes(film.id));
/**
 * Further reading for a film: the reading lists of the saints it is about, or,
 * when it is about no saint, of the feasts it is listed under. Duplicates dropped.
 */
export const readingsFor = (film: Film): Reading[] => {
  const fromPeople = saintsFor(film).flatMap((p) => p.readings ?? []);
  const list = fromPeople.length
    ? fromPeople
    : feasts.filter((f) => f.films.includes(film.id)).flatMap((f) => f.readings ?? []);
  const seen = new Set<string>();
  return list.filter((r) => !seen.has(r.title) && seen.add(r.title));
};