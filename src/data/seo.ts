export interface PageSeo {
  path: string;
  title: string;
  description: string;
  type: 'website' | 'article';
}

export const SITE_URL = 'https://civictech.ph';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;

export const ROUTE_SEO: Record<'home' | 'civictools' | 'article', PageSeo> = {
  home: {
    path: '/',
    title: 'Civic Tech - An Independent Newsroom by BetterGov.ph',
    description:
      'A directory of Philippine civic tech projects and Civil Society Organizations (CSOs) across 15 sectors, plus independent reporting on open data and digital government.',
    type: 'website',
  },
  civictools: {
    path: '/civictools',
    title: 'Civic Tech & CSO Directory (15 Sectors) — Civic Tech by BetterGov.ph',
    description:
      'Explore 200+ Philippine civic tech projects and Civil Society Organizations (CSOs) across 15 public-interest sectors.',
    type: 'website',
  },
  article: {
    path: '/article',
    title: 'The volunteers rebuilding how Filipinos read the national budget — Civic Tech',
    description:
      'A loose network of engineers, researchers and students is turning thousands of pages of appropriations into something anyone can search, compare and question.',
    type: 'article',
  },
};

export function applyDocumentSeo(seo: PageSeo) {
  document.title = seo.title;

  const setMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
    let el = document.head.querySelector<HTMLMetaElement>(selector);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMeta('meta[name="description"]', 'name', 'description', seo.description);
  setMeta('meta[property="og:type"]', 'property', 'og:type', seo.type);
  setMeta('meta[property="og:url"]', 'property', 'og:url', `${SITE_URL}${seo.path}`);
  setMeta('meta[property="og:title"]', 'property', 'og:title', seo.title);
  setMeta('meta[property="og:description"]', 'property', 'og:description', seo.description);
  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', seo.title);
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', seo.description);

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', `${SITE_URL}${seo.path}`);
}
