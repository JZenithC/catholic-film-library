export const normalize = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
export function selectFilms(films, query = {}) {
  const tokens = normalize(query.q).split(' ').filter(Boolean);
  const fields = {
    country: 'countries',
    language: 'languages',
    subject: 'subjects',
    format: 'format',
    period: 'historicalPeriod',
    collection: 'collections',
  };
  return films
    .filter((f) => {
      const searchable = normalize(
        [
          f.title,
          f.originalTitle,
          ...(f.alternateTitles ?? []),
          ...(f.directors ?? []),
          ...(f.countries ?? []),
          ...(f.languages ?? []),
          ...(f.subjects ?? []),
          ...(f.collections ?? []),
          f.themes ?? '',
          f.historicalPeriod,
        ].join(' '),
      );
      if (!tokens.every((t) => searchable.includes(t))) return false;
      if (query.decade && Math.floor(f.year / 10) * 10 !== Number(query.decade))
        return false;
      return Object.entries(fields).every(
        ([q, k]) =>
          !query[q] ||
          (Array.isArray(f[k]) ? f[k].includes(query[q]) : f[k] === query[q]),
      );
    })
    .sort((a, b) =>
      query.sort === 'oldest'
        ? a.year - b.year || a.title.localeCompare(b.title)
        : query.sort === 'newest'
          ? b.year - a.year || a.title.localeCompare(b.title)
          : query.sort === 'title'
            ? a.title.localeCompare(b.title, 'en')
            : (a.featured ?? 999) - (b.featured ?? 999) ||
              a.title.localeCompare(b.title, 'en'),
    );
}
