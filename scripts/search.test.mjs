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
];
test('accent-insensitive search covers original and alternative titles', () => {
  assert.equal(selectFilms(films, { q: 'therese' })[0].id, 'a');
  assert.equal(selectFilms(films, { q: 'Little Flower' })[0].id, 'a');
  assert.equal(selectFilms(films, { q: 'rene' })[0].id, 'a');
  assert.equal(normalize('St. Mary’s'), 'st marys');
});
test('filters compose by AND and empty results remain empty', () => {
  assert.deepEqual(
    selectFilms(films, { country: 'France', collection: 'mary' }).map(
      (f) => f.id,
    ),
    ['b'],
  );
  assert.equal(
    selectFilms(films, { country: 'Italy', language: 'French' }).length,
    0,
  );
  assert.equal(selectFilms(films, { q: 'nonexistent' }).length, 0);
});
test('decades and sorting are deterministic', () => {
  assert.deepEqual(
    selectFilms(films, { sort: 'oldest' }).map((f) => f.id),
    ['b', 'a', 'c'],
  );
  assert.deepEqual(
    selectFilms(films, { sort: 'newest', decade: '1980' }).map((f) => f.id),
    ['a'],
  );
});
