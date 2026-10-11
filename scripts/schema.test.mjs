import test from 'node:test';
import assert from 'node:assert/strict';
import { validateCatalogue, sourceSchema } from './schema.mjs';
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
