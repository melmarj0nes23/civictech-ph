import type { Lang, Localized } from './i18n';

export interface PageSeo {
  path: string;
  title: Localized;
  description: Localized;
  type: 'website' | 'article';
}

export const SITE_URL = 'https://civictech-ph.pages.dev';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;

export const ROUTE_SEO: Record<'home' | 'civictools' | 'submit' | 'article', PageSeo> = {
  home: {
    path: '/',
    title: {
      en: 'Civic Tech - An Independent Newsroom by BetterGov.ph',
      fil: 'Civic Tech - Malayang Newsroom ng BetterGov.ph',
    },
    description: {
      en: 'A directory of Philippine civic tech projects and Civil Society Organizations (CSOs) across 15 sectors, plus independent reporting on open data and digital government.',
      fil: 'Direktoryo ng mga proyektong civic tech at Civil Society Organization (CSO) sa 15 sektor sa Pilipinas, kasama ang malayang pag-uulat sa bukas na datos at digital na gobyerno.',
    },
    type: 'website',
  },
  civictools: {
    path: '/civictools',
    title: {
      en: 'Civic Tech & CSO Directory — Civic Tech by BetterGov.ph',
      fil: 'Direktoryo ng Civic Tech at CSO — Civic Tech ng BetterGov.ph',
    },
    description: {
      en: 'Explore 200+ Philippine civic tech projects and Civil Society Organizations (CSOs) across 15 public-interest sectors.',
      fil: 'Tuklasin ang 200+ proyektong civic tech at Civil Society Organization (CSO) sa 15 sektor sa Pilipinas.',
    },
    type: 'website',
  },
  submit: {
    path: '/civictools/submit',
    title: {
      en: 'Submit a Project or CSO — Civic Tech by BetterGov.ph',
      fil: 'Magsumite ng Proyekto o CSO — Civic Tech ng BetterGov.ph',
    },
    description: {
      en: 'Share a Philippine civic tech project or Civil Society Organization (CSO) for the civictech.ph directory.',
      fil: 'Magbahagi ng proyektong civic tech o Civil Society Organization (CSO) para sa direktoryo ng civictech.ph.',
    },
    type: 'website',
  },
  article: {
    path: '/article',
    title: {
      en: 'The volunteers rebuilding how Filipinos read the national budget — Civic Tech',
      fil: 'Ang mga boluntaryong nagbabago kung paano binabasa ng Pilipino ang pambansang badyet — Civic Tech',
    },
    description: {
      en: 'A loose network of engineers, researchers and students is turning thousands of pages of appropriations into something anyone can search, compare and question.',
      fil: 'Isang grupo ng mga inhinyero, mananaliksik at estudyante ang nagpapalit sa libu-libong pahina ng badyet upang madaling mahanap, maikumpara at mausisa ng sinuman.',
    },
    type: 'article',
  },
};

export function applyDocumentSeo(seo: PageSeo, lang: Lang = 'en') {
  const title = seo.title[lang];
  const description = seo.description[lang];
  document.documentElement.lang = lang === 'fil' ? 'tl' : 'en';
  document.title = title;

  const setMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
    let el = document.head.querySelector<HTMLMetaElement>(selector);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMeta('meta[name="description"]', 'name', 'description', description);
  setMeta('meta[property="og:type"]', 'property', 'og:type', seo.type);
  setMeta('meta[property="og:url"]', 'property', 'og:url', `${SITE_URL}${seo.path}`);
  setMeta('meta[property="og:title"]', 'property', 'og:title', title);
  setMeta('meta[property="og:description"]', 'property', 'og:description', description);
  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', `${SITE_URL}${seo.path}`);
}
