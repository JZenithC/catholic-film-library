import raw from './films.json';
import groups from './collections.json';
export interface Source {
  title: string;
  publisher: string;
  url: string;
  accessed: string;
  claims: string[] | string;
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
  status: 'PUBLISH' | 'HOLD' | 'REJECT';
  decision: string;
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
  imageRights: string;
}
export const films = (raw as Film[]).filter((f) => f.status === 'PUBLISH');
export const collections = groups;
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const url = (path = '') => `${base}/${path.replace(/^\//, '')}`;
export const featured = [...films].sort(
  (a, b) => (a.featured ?? 999) - (b.featured ?? 999),
);
