import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const baseHtmlPath = path.join(distDir, 'index.html');

const SITE_URL = 'https://civictech-ph.pages.dev';
const OG_IMAGE = `${SITE_URL}/logo.png`;

const ROUTES = [
  {
    path: '/',
    title: 'Civic Tech - An Independent Newsroom by BetterGov.ph',
    description:
      'A directory of Philippine civic tech projects and Civil Society Organizations (CSOs) across 15 sectors, plus independent reporting on open data and digital government.',
    type: 'website',
  },
  {
    path: '/civictools',
    title: 'Civic Tech & CSO Directory — Civic Tech by BetterGov.ph',
    description:
      'Explore 200+ Philippine civic tech projects and Civil Society Organizations (CSOs) across 15 public-interest sectors.',
    type: 'website',
  },
  {
    path: '/civictools/submit',
    title: 'Submit a Project or CSO — Civic Tech by BetterGov.ph',
    description:
      'Share a Philippine civic tech project or Civil Society Organization (CSO) for the civictech.ph directory.',
    type: 'website',
  },
  {
    path: '/article',
    title: 'The volunteers rebuilding how Filipinos read the national budget — Civic Tech',
    description:
      'A loose network of engineers, researchers and students is turning thousands of pages of appropriations into something anyone can search, compare and question.',
    type: 'article',
  },
];

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function injectRouteSeo(html, route) {
  const fullUrl = `${SITE_URL}${route.path}`;
  const title = escapeHtml(route.title);
  const desc = escapeHtml(route.description);

  let out = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  out = out.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${desc}" />`
  );
  out = out.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${fullUrl}" />`
  );
  out = out.replace(
    /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:type" content="${route.type}" />`
  );
  out = out.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${fullUrl}" />`
  );
  out = out.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${title}" />`
  );
  out = out.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${desc}" />`
  );
  out = out.replace(
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image" content="${OG_IMAGE}" />`
  );
  out = out.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${title}" />`
  );
  out = out.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${desc}" />`
  );
  out = out.replace(
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`
  );

  return out;
}

const baseHtml = fs.readFileSync(baseHtmlPath, 'utf8');

for (const route of ROUTES) {
  const html = injectRouteSeo(baseHtml, route);
  if (route.path === '/') {
    fs.writeFileSync(baseHtmlPath, html, 'utf8');
  } else {
    const routeDir = path.join(distDir, route.path.replace(/^\//, ''));
    fs.mkdirSync(routeDir, { recursive: true });
    fs.writeFileSync(path.join(routeDir, 'index.html'), html, 'utf8');
  }
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map(
  (r) => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${today}</lastmod>
  </url>`
).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8');

console.log(`Pre-rendered SEO HTML for ${ROUTES.length} routes + sitemap.xml`);
