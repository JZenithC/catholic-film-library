import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
export const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, 'http://localhost').pathname,
    );
    if (!pathname.startsWith('/catholic-film-library/')) {
      if (pathname !== '/') throw Error('Outside project base path');
      res.writeHead(302, { Location: '/catholic-film-library/' });
      res.end();
      return;
    }
    let relative = pathname.slice('/catholic-film-library/'.length);
    if (!relative || relative.endsWith('/')) relative += 'index.html';
    const file = path.resolve(root, relative);
    if (!file.startsWith(root + path.sep)) throw Error('path');
    const mime = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'text/javascript',
      '.json': 'application/json',
      '.svg': 'image/svg+xml',
      '.woff2': 'font/woff2',
      '.xml': 'application/xml',
      '.txt': 'text/plain',
      '.png': 'image/png',
      '.webp': 'image/webp',
    };
    res.setHeader(
      'Content-Type',
      mime[path.extname(file)] ?? 'application/octet-stream',
    );
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(await readFile(path.join(root, '404.html')));
  }
});
if (process.argv[1]?.endsWith('serve.mjs'))
  server.listen(4322, '127.0.0.1', () =>
    console.log(
      'Library preview: http://127.0.0.1:4322/catholic-film-library/',
    ),
  );
