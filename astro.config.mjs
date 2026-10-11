import { defineConfig } from 'astro/config';

const base = '/catholic-film-library';

// Routes that have been removed from the site. Astro prefixes `base` to the
// source path but NOT to the destination, so destinations are written with
// the base (verified in the built output: dist/collections/before-1965/).
const redirects = Object.fromEntries(
  Object.entries({
    '/collections/before-1965': '/library/',
    '/collections/after-1965': '/library/',
    // Films withdrawn in the 2026-10-11 editorial pass.
    '/films/un-dios-prohibido': '/library/',
    '/films/triumph-of-the-heart': '/library/',
    '/films/on-the-waterfront': '/library/',
    '/films/the-sound-of-music': '/library/',
    '/films/padre-pio-miracle-man': '/library/',
    '/films/blessed-duns-scotus': '/library/',
    '/films/into-great-silence': '/library/',
    '/films/no-greater-love': '/library/',
    '/films/two-crowns': '/library/',
    // Withdrawn after the subtitle review (2026-10-11).
    '/films/leon-morin-priest': '/library/',
  }).map(([from, to]) => [from, `${base}${to}`]),
);

export default defineConfig({
  site: 'https://jzenithc.github.io',
  base,
  trailingSlash: 'always',
  output: 'static',
  redirects,
});
