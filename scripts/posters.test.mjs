import test from 'node:test';
import assert from 'node:assert/strict';
import {
  readdir,
  readFile,
  mkdtemp,
  mkdir,
  writeFile,
  rm,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TextEncoder } from 'node:util';
import { readWebpSize } from './webp.mjs';
import { validatePosters, RIGHTS_POSTER, RIGHTS_NONE } from './validate.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const postersDir = path.join(root, 'public', 'posters');

test('every committed poster has a parseable WebP header', async () => {
  const files = (await readdir(postersDir)).filter((f) => f.endsWith('.webp'));
  assert.ok(files.length > 0);
  for (const file of files) {
    const size = readWebpSize(await readFile(path.join(postersDir, file)));
    assert.ok(size.width > 0 && size.height > 0, file);
    assert.match(size.format, /^VP8[LX ]?$/);
  }
});

test('WebP parser handles VP8L and VP8X headers and rejects other files', () => {
  const riff = (chunk, body) => {
    const bytes = new Uint8Array(30 + body.length);
    bytes.set(new TextEncoder().encode('RIFF'), 0);
    bytes.set(new TextEncoder().encode('WEBP' + chunk), 8);
    bytes.set(body, 20);
    return bytes;
  };
  // VP8L: signature 0x2f, then 14-bit (width - 1) and 14-bit (height - 1).
  const bits = (300 - 1) | ((450 - 1) << 14);
  const vp8l = riff('VP8L', [
    0x2f,
    bits & 255,
    (bits >> 8) & 255,
    (bits >> 16) & 255,
    (bits >>> 24) & 255,
  ]);
  assert.deepEqual(readWebpSize(vp8l), {
    width: 300,
    height: 450,
    format: 'VP8L',
  });
  // VP8X: 4 flag bytes, then 24-bit (width - 1) and (height - 1) at offset 24.
  const vp8x = riff('VP8X', [
    0,
    0,
    0,
    0,
    599 & 255,
    599 >> 8,
    0,
    899 & 255,
    899 >> 8,
    0,
  ]);
  assert.deepEqual(readWebpSize(vp8x), {
    width: 600,
    height: 900,
    format: 'VP8X',
  });
  const png = new Uint8Array(40);
  png.set([0x89, 0x50, 0x4e, 0x47]);
  assert.throws(() => readWebpSize(png), /RIFF/);
});

test('poster validation checks the real file, https links and rights in both directions', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'cfl-posters-'));
  try {
    await mkdir(path.join(dir, 'posters'));
    const real = (await readdir(postersDir)).find((f) => f.endsWith('.webp'));
    const bytes = await readFile(path.join(postersDir, real));
    const size = readWebpSize(bytes);
    await writeFile(path.join(dir, 'posters', 'a.webp'), bytes);
    await writeFile(
      path.join(dir, 'posters', 'b.webp'),
      'this is not a WebP file at all, honestly',
    );
    const poster = (id, extra = {}) => ({
      id,
      src: `posters/${id}.webp`,
      width: size.width,
      height: size.height,
      kind: 'poster',
      credit: 'Credit',
      sourcePage: 'https://example.org/page',
      filePage: 'https://example.org/file',
      sourceRightsStatement: 'Statement',
      usageBasis: 'Basis',
      reviewed: '2026-10-11',
      rightsCategory: 'copyrighted-nonfree-source',
      identityEvidence: 'Evidence',
      ...extra,
    });
    const films = [
      { id: 'a', status: 'PUBLISH', imageRights: RIGHTS_POSTER },
      { id: 'b', status: 'PUBLISH', imageRights: RIGHTS_POSTER },
      { id: 'c', status: 'PUBLISH', imageRights: RIGHTS_POSTER },
      { id: 'd', status: 'PUBLISH', imageRights: RIGHTS_NONE },
    ];
    const ok = await validatePosters([poster('a')], [films[0]], dir);
    assert.deepEqual(ok.errors, []);
    const { errors } = await validatePosters(
      [
        poster('a', {
          width: size.width + 1,
          filePage: 'http://example.org/x',
        }),
        poster('b', { credit: ' ' }),
        poster('d'),
      ],
      films,
      dir,
    );
    const text = errors.join('\n');
    assert.match(text, /do not match the file.*: a/);
    assert.match(text, /filePage must be https: a/);
    assert.match(text, /not a valid WebP.*: b/);
    assert.match(text, /Missing poster credit: b/);
    assert.match(text, /no poster but imageRights claims poster artwork: c/);
    assert.match(text, /has a poster but imageRights does not say so: d/);

    // Grey-area films may have posters, and the same rights checks apply.
    const grey = (id, imageRights) => ({ id, status: 'GREY', imageRights });
    const greyOk = await validatePosters(
      [poster('a')],
      [grey('a', RIGHTS_POSTER)],
      dir,
    );
    assert.deepEqual(greyOk.errors, []);
    const greyText = (
      await validatePosters(
        [poster('a')],
        [grey('a', RIGHTS_NONE), grey('c', RIGHTS_POSTER)],
        dir,
      )
    ).errors.join('\n');
    assert.match(greyText, /has a poster but imageRights does not say so: a/);
    assert.match(greyText, /no poster but imageRights claims poster artwork: c/);
    // HOLD and REJECT films may not have posters.
    const held = await validatePosters(
      [poster('a')],
      [{ id: 'a', status: 'HOLD', imageRights: RIGHTS_POSTER }],
      dir,
    );
    assert.match(held.errors.join('\n'), /neither PUBLISH nor GREY: a/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
