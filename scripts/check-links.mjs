import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
const base = '/catholic-film-library';
let links = 0;
const failures = [];
async function walk(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) await walk(full);
    else if (item.name.endsWith('.html')) {
      const html = await readFile(full, 'utf8');
      for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
        const href = m[1];
        if (!href.startsWith('/')) continue;
        if (!href.startsWith(base + '/')) {
          failures.push(`${full}: wrong base ${href}`);
          continue;
        }
        let target = decodeURIComponent(
          href.split(/[?#]/)[0].slice(base.length),
        );
        if (target.endsWith('/')) target += 'index.html';
        try {
          await stat(path.join(root, target));
        } catch {
          failures.push(`${full}: missing ${href}`);
        }
        links++;
      }
    }
  }
}
await walk(root);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(
  `Validated ${links} local asset and page references under ${base}/.`,
);
