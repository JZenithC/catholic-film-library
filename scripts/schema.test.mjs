import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateCatalogue,
  validateCollections,
  lintStyle,
  sourceSchema,
} from './schema.mjs';
test('rejects HOLD data, uncertain image rights and duplicate slugs', () => {
  const bad = {
    id: 'a',
    slug: 'same',
    title: 'Unverified',
    year: 1950,
    status: 'HOLD',
    collections: ['fake'],
    imageRights: 'unknown',
  };
  const errors = validateCatalogue([bad, { ...bad, id: 'b' }], []).join('\n');
  assert.match(errors, /PUBLISH/);
  assert.match(errors, /imageRights/);
  assert.match(errors, /Duplicate slug/);
  assert.match(errors, /Unknown collection/);
});
test('references cannot inject executable URL schemes', () => {
  assert.equal(
    sourceSchema.safeParse({
      title: 'Test',
      publisher: 'Test',
      url: 'javascript:alert(1)',
      accessed: '2026-10-11',
      claims: ['test'],
    }).success,
    false,
  );
});
test('same original title and director cannot silently conflict in year', () => {
  const f = {
    title: 'Title',
    originalTitle: 'Original',
    directors: ['Director'],
    year: 1950,
  };
  assert.match(
    validateCatalogue([f, { ...f, year: 1951 }], []).join('\n'),
    /Conflicting release years/,
  );
});

const longText = 'A concrete, specific paragraph about the film. '.repeat(4);
const goodFilm = (overrides = {}) => ({
  id: 'good-film',
  slug: 'good-film',
  title: 'Good Film',
  originalTitle: 'Bon Film',
  alternateTitles: ['The Good Film'],
  year: 1950,
  format: 'Feature film',
  directors: ['A Director'],
  countries: ['France'],
  languages: ['French'],
  subjects: ['Priesthood'],
  collections: ['priesthood'],
  historicalPeriod: '20th century',
  status: 'PUBLISH',
  decision: 'PUBLISH: identity and treatment sources agree.',
  summary: 'A short logline.',
  synopsis: longText,
  inclusion: longText,
  themes: longText,
  advisories: 'Mild peril.',
  sources: [
    {
      title: 'Record',
      publisher: 'BFI',
      url: 'https://www.bfi.org.uk/film/good-film',
      accessed: '2026-10-11',
      claims: ['year', 'director'],
    },
    {
      title: 'Review',
      publisher: 'Decent Films',
      url: 'https://decentfilms.com/reviews/good-film',
      accessed: '2026-10-11',
      claims: ['treatment of the Mass'],
    },
  ],
  reviewed: '2026-10-11',
  imageRights:
    'Original Library typographic artwork; no film imagery reproduced.',
  ...overrides,
});
const collections = [{ id: 'priesthood', group: 'Subjects' }];
const check = (film) => validateCatalogue([film], collections).join('\n');

test('a well-formed record passes', () => {
  assert.equal(check(goodFilm()), '');
});
test('rejects formats and periods outside the controlled vocabularies', () => {
  assert.match(check(goodFilm({ format: 'Docudrama' })), /format/);
  assert.match(
    check(goodFilm({ historicalPeriod: 'Early modern era' })),
    /historicalPeriod/,
  );
  assert.equal(check(goodFilm({ format: 'Miniseries' })), '');
  assert.equal(check(goodFilm({ historicalPeriod: 'Early Church' })), '');
});
test('year ceiling is next year, computed', () => {
  const next = new Date().getFullYear() + 1;
  assert.equal(check(goodFilm({ year: next })), '');
  assert.match(check(goodFilm({ year: next + 1 })), /year/);
});
test('alternate titles may not repeat the title or original title', () => {
  assert.match(
    check(goodFilm({ alternateTitles: ['good film'] })),
    /Alternate title repeats/,
  );
  assert.match(
    check(goodFilm({ alternateTitles: ['Bon Film'] })),
    /Alternate title repeats/,
  );
});
test('empty languages only for silent features and documentaries', () => {
  assert.match(check(goodFilm({ languages: [] })), /Languages may be empty/);
  assert.equal(
    check(goodFilm({ languages: [], format: 'Silent feature' })),
    '',
  );
  assert.equal(check(goodFilm({ languages: [], format: 'Documentary' })), '');
});
test('sources need two distinct hosts, not just two URLs', () => {
  const film = goodFilm();
  film.sources[1].url = 'https://bfi.org.uk/another-page';
  assert.match(check(film), /two different hosts/);
});
test('the generic placeholder claim is rejected', () => {
  const film = goodFilm();
  film.sources[0].claims = [
    'identity or specific review concern; does not certify suitability',
  ];
  assert.match(check(film), /generic placeholder/);
});
test('collections need a known group', () => {
  assert.deepEqual(validateCollections(collections), []);
  assert.match(
    validateCollections([{ id: 'x', group: 'Eras' }]).join('\n'),
    /group "Eras"/,
  );
});
test('style lint warns but does not fail', () => {
  const film = goodFilm({
    themes: longText + ' It invites contemplation of its place here.',
  });
  assert.equal(check(film), '');
  assert.equal(lintStyle([film]).length, 2);
});

const words = (n) => Array.from({ length: n }, (_, i) => `word${i}`).join(' ');
const greyFilm = (overrides = {}) =>
  goodFilm({
    status: 'GREY',
    decision: 'GREY: only the producer has described its treatment.',
    grey: { kind: 'unverified', question: words(60) },
    ...overrides,
  });

test('a well-formed GREY record passes, with either kind', () => {
  assert.equal(check(greyFilm()), '');
  assert.equal(
    check(greyFilm({ grey: { kind: 'reservations', question: words(40) } })),
    '',
  );
  assert.equal(
    check(greyFilm({ grey: { kind: 'unverified', question: words(120) } })),
    '',
  );
  assert.equal(check(goodFilm({ grey: null })), '');
});
test('GREY records need a grey question of the right kind and length', () => {
  assert.match(check(greyFilm({ grey: undefined })), /without a grey question/);
  assert.match(check(greyFilm({ grey: null })), /without a grey question/);
  assert.match(
    check(greyFilm({ grey: { kind: 'doubtful', question: words(60) } })),
    /kind/,
  );
  assert.match(
    check(greyFilm({ grey: { kind: 'unverified', question: words(39) } })),
    /40–120 words \(has 39\)/,
  );
  assert.match(
    check(greyFilm({ grey: { kind: 'unverified', question: words(121) } })),
    /40–120 words \(has 121\)/,
  );
});
test('GREY records need every PUBLISH field and a GREY: decision', () => {
  assert.match(
    check(greyFilm({ decision: 'PUBLISH: looks fine.' })),
    /must start with "GREY:"/,
  );
  const { sources, ...withoutSources } = greyFilm();
  assert.ok(sources);
  assert.match(check(withoutSources), /sources/);
  assert.match(check(greyFilm({ inclusion: 'Short.' })), /Inadequate/);
});
test('only GREY records carry a question, and grey films are never featured', () => {
  assert.match(
    check(goodFilm({ grey: { kind: 'unverified', question: words(60) } })),
    /Only GREY records/,
  );
  assert.match(check(greyFilm({ featured: 0 })), /cannot be featured/);
  assert.match(check(goodFilm({ status: 'HOLD' })), /status/);
});
test('style lint covers the grey question', () => {
  const film = greyFilm({
    grey: { kind: 'unverified', question: `${words(50)} the Library` },
  });
  assert.deepEqual(lintStyle([film]), [
    'good-film grey.question: "the Library"',
  ]);
});
