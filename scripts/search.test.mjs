import test from 'node:test';
import assert from 'node:assert/strict';
import { selectFilms, normalize } from '../src/scripts/search.mjs';
const films = [
  {
    id: 'a',
    title: 'Thérèse',
    originalTitle: 'Teresa',
    alternateTitles: ['Little Flower'],
    directors: ['René'],
    countries: ['France'],
    languages: ['French'],
    subjects: ['Thérèse of Lisieux'],
    collections: ['saints'],
    historicalPeriod: '19th century',
    format: 'Feature',
    year: 1986,
  },
  {
    id: 'b',
    title: 'Bernadette',
    alternateTitles: [],
    directors: ['Jean'],
    countries: ['France'],
    languages: ['French'],
    subjects: ['Lourdes'],
    collections: ['mary'],
    historicalPeriod: '19th century',
    format: 'Feature',
    year: 1943,
  },
  {
    id: 'c',
    title: 'A Film',
    alternateTitles: [],
    directors: ['John'],
    countries: ['Italy'],
    languages: ['Italian'],
    subjects: ['Priesthood'],
    collections: ['priesthood'],
    historicalPeriod: '20th century',
    format: 'Documentary',
    year: 2004,
  },
  {
    id: 'd',
    title: 'Into Great Silence',
    originalTitle: 'Die große Stille',
    alternateTitles: [],
    directors: ['Philip Gröning'],
    countries: ['Germany'],
    languages: ['French'],
    subjects: ['Contemplative life'],
    collections: ['religious-life'],
    historicalPeriod: '21st century',
    format: 'Documentary',
    year: 2005,
  },
  {
    id: 'e',
    title: 'Cœur de mère',
    alternateTitles: ['Encyclopædia'],
    directors: ['Anon'],
    countries: ['Belgium'],
    languages: ['French'],
    subjects: ['Family'],
    collections: ['families'],
    historicalPeriod: '20th century',
    format: 'Feature film',
    year: 1951,
  },
];
const ids = (list) => list.map((f) => f.id);
test('accent-insensitive search covers original and alternative titles', () => {
  assert.equal(selectFilms(films, { q: 'therese' })[0].id, 'a');
  assert.equal(selectFilms(films, { q: 'THÉRÈSE' })[0].id, 'a');
  assert.equal(selectFilms(films, { q: 'Little Flower' })[0].id, 'a');
  assert.equal(selectFilms(films, { q: 'teresa' })[0].id, 'a');
  assert.equal(selectFilms(films, { q: 'rene' })[0].id, 'a');
  assert.deepEqual(ids(selectFilms(films, { q: 'die stille' })), ['d']);
  assert.equal(normalize('St. Mary’s'), 'st marys');
});
test('ß and ligatures fold to their spelled-out forms', () => {
  assert.equal(normalize('Große'), 'grosse');
  assert.equal(normalize('Cœur Encyclopædia'), 'coeur encyclopaedia');
  assert.deepEqual(ids(selectFilms(films, { q: 'grosse' })), ['d']);
  assert.deepEqual(ids(selectFilms(films, { q: 'große' })), ['d']);
  assert.deepEqual(ids(selectFilms(films, { q: 'coeur' })), ['e']);
  assert.deepEqual(ids(selectFilms(films, { q: 'encyclopaedia' })), ['e']);
  assert.deepEqual(ids(selectFilms(films, { q: 'groning' })), ['d']);
});
test('tokens match the start of words, not arbitrary substrings', () => {
  assert.deepEqual(ids(selectFilms(films, { q: 'bern' })), ['b']);
  assert.deepEqual(ids(selectFilms(films, { q: 'sil' })), ['d']);
  // "ilm" is inside "Film" but starts no word.
  assert.equal(selectFilms(films, { q: 'ilm' }).length, 0);
  // "ess" is inside "Priesthood"/"Teresa" etc. but starts no word.
  assert.equal(selectFilms(films, { q: 'ess' }).length, 0);
});
test('multiple tokens must all match (AND)', () => {
  assert.deepEqual(ids(selectFilms(films, { q: 'little fl' })), ['a']);
  assert.equal(selectFilms(films, { q: 'little bernadette' }).length, 0);
  assert.deepEqual(ids(selectFilms(films, { q: 'france lourdes' })), ['b']);
});
test('filters compose by AND and empty results remain empty', () => {
  assert.deepEqual(
    ids(selectFilms(films, { country: 'France', collection: 'mary' })),
    ['b'],
  );
  assert.equal(
    selectFilms(films, { country: 'Italy', language: 'French' }).length,
    0,
  );
  assert.equal(selectFilms(films, { q: 'nonexistent' }).length, 0);
});
test('decades and sorting are deterministic', () => {
  assert.deepEqual(ids(selectFilms(films, { sort: 'oldest' })), [
    'b',
    'e',
    'a',
    'c',
    'd',
  ]);
  assert.deepEqual(ids(selectFilms(films, { sort: 'newest', decade: '1980' })), [
    'a',
  ]);
});
test('grey-area films appear only when included', () => {
  const withGrey = [
    ...films,
    {
      ...films[1],
      id: 'g',
      title: 'Bernadette of the Grey',
      grey: 'reservations',
      year: 1960,
    },
  ];
  assert.deepEqual(ids(selectFilms(withGrey, { q: 'bernadette' })), ['b']);
  assert.deepEqual(ids(selectFilms(withGrey, { q: 'bernadette', grey: '' })), [
    'b',
  ]);
  assert.deepEqual(
    ids(selectFilms(withGrey, { q: 'bernadette', grey: '1', sort: 'oldest' })),
    ['b', 'g'],
  );
  assert.equal(selectFilms(withGrey, {}).length, films.length);
  assert.equal(selectFilms(withGrey, { grey: '1' }).length, films.length + 1);
  // Other filters still compose with the toggle.
  assert.deepEqual(
    ids(selectFilms(withGrey, { grey: '1', collection: 'mary', decade: '1960' })),
    ['g'],
  );
  // `grey: null` (a recommended film) is never filtered out.
  assert.equal(
    selectFilms([{ ...films[0], grey: null }], {}).length,
    1,
  );
});
