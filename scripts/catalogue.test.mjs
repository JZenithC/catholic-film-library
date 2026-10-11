import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { generateCatalogue, buildCatalogue } from './catalogue.mjs';

const record = (id, status, extra = {}) => ({
  id,
  slug: id,
  title: id,
  status,
  year: 1950,
  format: 'Feature',
  historicalPeriod: 'Nineteenth century',
  collections: ['saints', 'before-1965', 'revolution'],
  synopsis: ['One.', 'Two.'],
  sources: [
    {
      title: `${id} record`,
      publisher: 'P',
      url: 'https://a.example/shared',
      claims: ['x'],
    },
    {
      title: 'Other',
      publisher: 'Q',
      url: `https://b.example/${id}`,
      claims: ['y'],
    },
  ],
  _notes: 'internal',
  _poster: { lead: 'x' },
  ...extra,
});

const greyField = {
  kind: 'unverified',
  question: 'Only the producers describe it.',
};

test('generator publishes PUBLISH and GREY records, strips _ fields and normalises vocabularies', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'cfl-catalogue-'));
  try {
    await mkdir(path.join(dir, 'research'));
    await mkdir(path.join(dir, 'src', 'data'), { recursive: true });
    const put = (rel, value) =>
      writeFile(path.join(dir, rel), JSON.stringify(value));
    const get = async (rel) =>
      JSON.parse(await readFile(path.join(dir, rel), 'utf8'));
    await put('research/inventory.json', [
      record('kept', 'PUBLISH'),
      record('held', 'HOLD'),
      record('refused', 'REJECT'),
      record('doubtful', 'GREY', { grey: greyField }),
      record('odd', 'PUBLISH', {
        format: 'Docudrama',
        historicalPeriod: 'Early modern era',
      }),
    ]);
    await put('src/data/posters.json', [{ id: 'kept' }]);
    await put('src/data/collections.json', [
      { id: 'saints', title: 'Saints' },
      { id: 'vendee', title: 'Vendée' },
      { id: 'cristeros', title: 'Cristeros' },
      { id: 'grey-only', title: 'Grey only' },
    ]);
    await put('research/starting-inventory-crosswalk.json', [
      { originalCandidate: 'Held', recordId: 'held', status: 'PUBLISH' },
    ]);
    await put('src/data/featured.json', ['odd', 'kept']);

    const result = await generateCatalogue({ root: dir });

    const films = await get('src/data/films.json');
    assert.deepEqual(
      films.map((f) => f.id),
      ['kept', 'doubtful', 'odd'],
    );
    const [kept, doubtful, odd] = films;
    assert.equal(kept.grey, null);
    assert.equal(odd.grey, null);
    assert.deepEqual(doubtful.grey, greyField);
    assert.equal(doubtful.status, 'GREY');
    assert.equal(doubtful.featured, undefined);
    assert.equal(
      Object.keys(doubtful).some((k) => k.startsWith('_')),
      false,
    );
    assert.equal(
      Object.keys(kept).some((k) => k.startsWith('_')),
      false,
    );
    assert.deepEqual(kept.collections, ['saints', 'vendee']);
    assert.equal(kept.format, 'Feature film');
    assert.equal(kept.historicalPeriod, '19th century');
    assert.equal(kept.synopsis, 'One.\n\nTwo.');
    assert.equal(kept.featured, 1);
    assert.equal(odd.featured, 0);
    assert.match(kept.imageRights, /^Poster/);
    assert.match(odd.imageRights, /^Original/);
    // Unknown values are left for the schema to reject, with a warning.
    assert.equal(odd.format, 'Docudrama');
    assert.equal(odd.historicalPeriod, 'Early modern era');
    assert.match(
      result.warnings.join('\n'),
      /odd: historicalPeriod "Early modern era"/,
    );

    const summary = await get('src/data/research-summary.json');
    assert.equal(summary.recommended, 2);
    assert.equal(summary.grey, 1);
    assert.equal(summary.hold, 1);
    assert.equal(summary.reject, 1);
    assert.equal(summary.publish, undefined);
    assert.deepEqual(summary.emptyCollections, ['Cristeros', 'Grey only']);

    const crosswalk = await get('research/starting-inventory-crosswalk.json');
    assert.equal(crosswalk[0].status, 'HOLD');

    const registry = await get('research/source-registry.json');
    const shared = registry.find((s) => s.url === 'https://a.example/shared');
    assert.deepEqual(
      shared.films.map((f) => [f.id, f.status, f.title]),
      [
        ['kept', 'PUBLISH', 'kept record'],
        ['held', 'HOLD', 'held record'],
        ['refused', 'REJECT', 'refused record'],
        ['doubtful', 'GREY', 'doubtful record'],
        ['odd', 'PUBLISH', 'odd record'],
      ],
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('a collection whose only films are grey is not empty', () => {
  const { summary } = buildCatalogue({
    inventory: [
      record('kept', 'PUBLISH', { collections: ['saints'] }),
      record('doubtful', 'GREY', { grey: greyField, collections: ['cristeros'] }),
    ],
    posters: [],
    collections: [
      { id: 'saints', title: 'Saints' },
      { id: 'cristeros', title: 'Cristeros' },
      { id: 'vendee', title: 'Vendée' },
    ],
    crosswalk: [],
    featured: ['kept'],
  });
  assert.deepEqual(summary.emptyCollections, ['Vendée']);
});

test('featured films must be PUBLISH; grey, held or unknown ids fail', () => {
  const build = (featured) =>
    buildCatalogue({
      inventory: [
        record('kept', 'PUBLISH'),
        record('doubtful', 'GREY', { grey: greyField }),
        record('held', 'HOLD'),
      ],
      posters: [],
      collections: [],
      crosswalk: [],
      featured,
    });
  assert.doesNotThrow(() => build(['kept']));
  assert.throws(() => build(['kept', 'doubtful']), /only PUBLISH.*doubtful \(GREY\)/);
  assert.throws(() => build(['held']), /held \(HOLD\)/);
  assert.throws(() => build(['missing']), /missing \(not in inventory\)/);
});

test('generator fails loudly on duplicate inventory ids', () => {
  assert.throws(
    () =>
      buildCatalogue({
        inventory: [record('a', 'PUBLISH'), record('a', 'HOLD')],
        posters: [],
        collections: [],
        crosswalk: [],
      }),
    /Duplicate inventory ids: a/,
  );
});
