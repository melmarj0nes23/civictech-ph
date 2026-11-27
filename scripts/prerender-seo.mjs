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
  ...[
    ['open-data', 'Open Data'],
    ['budget', 'Budget'],
    ['elections', 'Elections'],
    ['policy', 'Policy'],
    ['digital-services', 'Digital Services'],
    ['tools', 'Tools'],
    ['opinion', 'Opinion'],
    ['community', 'Community'],
  ].map(([slug, label]) => ({
    path: `/category/${slug}`,
    title: `${label} — Civic Tech by BetterGov.ph`,
    description: `${label} reporting, tools, and analysis from Civic Tech by BetterGov.ph.`,
    type: 'website',
  })),
  ...[
    ['transparent-canvassing', 'What a transparent canvassing dashboard should actually show'],
    ['foi-explained', 'Freedom of Information, explained: how to file a request that gets answered'],
    ['gov-ph-mobile', 'Why so many .gov.ph websites still break on a phone'],
    ['spotting-scam-texts', 'A field guide to spotting scam texts that impersonate government agencies'],
    ['mapping-public-transport', 'Mapping public transport routes when the official data runs out'],
    ['reading-bicam-report', 'Reading the bicam report: a line-by-line guide for first-timers'],
    ['barangay-procurement', 'Inside a barangay that put its procurement records online'],
    ['one-login-gov', 'The case for one login across every government service'],
    ['last-mile-connectivity', 'Last mile, last in line: who gets left out when services go online'],
    ['open-data-habit', 'Open data is not a website. It is a habit.'],
    ['volunteers-built-it', 'Volunteers built it. Now government has to maintain it.'],
    ['ai-and-hearings', 'Let AI read the bills — but keep humans in the hearing room.'],
  ].map(([slug, title]) => ({
    path: `/article/${slug}`,
    title: `${title} — Civic Tech`,
    description: `${title} — Civic Tech by BetterGov.ph.`,
    type: 'article',
  })),
  ...[
    ['login', 'Login', 'Sign in to your Civic Tech by BetterGov.ph account.'],
    ['signup', 'Sign up', 'Create a Civic Tech by BetterGov.ph account.'],
    ['mission', 'Our mission', 'An open, volunteer-run hub connecting Filipinos with civic technology, civil society organizations, and independent reporting on public data.'],
    ['editorial-standards', 'Editorial standards', 'How we report, verify data, separate opinion from reporting, and maintain independence across Civic Tech.'],
    ['corrections', 'Corrections', 'When we get a fact, link, or directory detail wrong, we fix it promptly and note the change openly.'],
    ['volunteer', 'Volunteer', 'Help build, curate, and document Philippine civic technology with BetterGov.ph.'],
  ].map(([slug, title, description]) => ({
    path: `/${slug}`,
    title: `${title} — Civic Tech by BetterGov.ph`,
    description,
    type: 'website',
  })),
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
