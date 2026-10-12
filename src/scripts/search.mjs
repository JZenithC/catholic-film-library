const ligatures = { ß: 'ss', ẞ: 'ss', æ: 'ae', Æ: 'ae', œ: 'oe', Œ: 'oe' };
export const normalize = (value) =>
  String(value ?? '')
    .replace(/[ßẞæÆœŒ]/g, (c) => ligatures[c])
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
/** Age bands from youngest to oldest. */
export const AGE_ORDER = ['All ages', '8+', '12+', '15+', 'Adults'];
/** True when every query token is the start of some word in `words`. */
export const matchesTokens = (words, tokens) =>
  tokens.every((t) => words.some((w) => w.startsWith(t)));
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
      // Grey-area films are shown only when asked for (`grey=1`).
      if (f.grey && !query.grey) return false;
      if (tokens.length) {
        const words = normalize(
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
        ).split(' ');
        if (!matchesTokens(words, tokens)) return false;
      }
      if (query.decade && Math.floor(f.year / 10) * 10 !== Number(query.decade))
        return false;
      // An age choice keeps films suitable at that age or younger.
      if (query.age) {
        const max = AGE_ORDER.indexOf(query.age);
        const band = AGE_ORDER.indexOf(f.age ?? '');
        if (max >= 0 && (band < 0 || band > max)) return false;
      }
      if (query.legion && f.legion !== query.legion) return false;
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
