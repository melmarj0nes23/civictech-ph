import { useEffect, useState } from 'react';
import {
  CATEGORIES,
  getArticleBySlug,
  getCategoryBySlug,
  type CategorySlug,
} from './data/articles';
import type { Lang } from './data/i18n';
import { applyDocumentSeo, ROUTE_SEO } from './data/seo';
import { ArticlePage } from './pages/ArticlePage';
import { CategoryPage } from './pages/CategoryPage';
import { DirectoryPage } from './pages/DirectoryPage';
import { HomePage } from './pages/HomePage';
import { SubmitPage } from './pages/SubmitPage';

type RouteState =
  | { kind: 'home' }
  | { kind: 'civictools' }
  | { kind: 'submit' }
  | { kind: 'category'; slug: CategorySlug }
  | { kind: 'article'; slug: string };

function getRouteFromPath(): RouteState {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/civictools/submit') return { kind: 'submit' };
  if (path === '/civictools') return { kind: 'civictools' };
  if (path === '/article') return { kind: 'article', slug: 'volunteers-national-budget' };
  if (path.startsWith('/article/')) {
    return { kind: 'article', slug: path.slice('/article/'.length) };
  }
  if (path.startsWith('/category/')) {
    const slug = path.slice('/category/'.length);
    const cat = getCategoryBySlug(slug);
    if (cat) return { kind: 'category', slug: cat.slug };
  }
  return { kind: 'home' };
}

function getInitialLang(): Lang {
  try {
    const saved = window.localStorage.getItem('civictech-lang');
    if (saved === 'fil' || saved === 'en') return saved;
  } catch {
    // ignore storage access errors
  }
  return 'en';
}

export function App() {
  const [route, setRoute] = useState<RouteState>(getRouteFromPath);
  const [lang, setLang] = useState<Lang>(getInitialLang);

  useEffect(() => {
    if (route.kind === 'category') {
      const cat = getCategoryBySlug(route.slug) ?? CATEGORIES[0];
      applyDocumentSeo(
        {
          path: `/category/${cat.slug}`,
          title: {
            en: `${cat.label.en} — Civic Tech by BetterGov.ph`,
            fil: `${cat.label.fil} — Civic Tech ng BetterGov.ph`,
          },
          description: cat.description,
          type: 'website',
        },
        lang
      );
      return;
    }
    if (route.kind === 'article') {
      const art = getArticleBySlug(route.slug);
      applyDocumentSeo(
        {
          path:
            art.slug === 'volunteers-national-budget'
              ? '/article'
              : `/article/${art.slug}`,
          title: {
            en: `${art.title.en} — Civic Tech`,
            fil: `${art.title.fil} — Civic Tech`,
          },
          description: art.deck,
          type: 'article',
        },
        lang
      );
      return;
    }
    applyDocumentSeo(ROUTE_SEO[route.kind], lang);
  }, [route, lang]);

  useEffect(() => {
    const onPopState = () => setRoute(getRouteFromPath());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleLangChange = (nextLang: Lang) => {
    setLang(nextLang);
    try {
      window.localStorage.setItem('civictech-lang', nextLang);
    } catch {
      // ignore storage access errors
    }
  };

  const navigate = (next: RouteState) => {
    let targetPath = '/';
    if (next.kind === 'civictools') targetPath = '/civictools';
    else if (next.kind === 'submit') targetPath = '/civictools/submit';
    else if (next.kind === 'category') targetPath = `/category/${next.slug}`;
    else if (next.kind === 'article') {
      targetPath =
        next.slug === 'volunteers-national-budget'
          ? '/article'
          : `/article/${next.slug}`;
    }

    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    setRoute(next);
    window.scrollTo({ top: 0 });
  };

  if (route.kind === 'article') {
    return (
      <ArticlePage
        articleSlug={route.slug}
        lang={lang}
        onLangChange={handleLangChange}
        onBackHome={() => navigate({ kind: 'home' })}
        onOpenCivicTools={() => navigate({ kind: 'civictools' })}
        onOpenCategory={(slug) => navigate({ kind: 'category', slug })}
        onOpenArticle={(slug) => navigate({ kind: 'article', slug })}
      />
    );
  }

  if (route.kind === 'category') {
    return (
      <CategoryPage
        categorySlug={route.slug}
        lang={lang}
        onLangChange={handleLangChange}
        onBackHome={() => navigate({ kind: 'home' })}
        onOpenCategory={(slug) => navigate({ kind: 'category', slug })}
        onOpenArticle={(slug) => navigate({ kind: 'article', slug })}
      />
    );
  }

  if (route.kind === 'submit') {
    return (
      <SubmitPage
        lang={lang}
        onLangChange={handleLangChange}
        onBackHome={() => navigate({ kind: 'home' })}
        onBackDirectory={() => navigate({ kind: 'civictools' })}
        onOpenCategory={(slug) => navigate({ kind: 'category', slug })}
      />
    );
  }

  if (route.kind === 'civictools') {
    return (
      <DirectoryPage
        lang={lang}
        onLangChange={handleLangChange}
        onBackHome={() => navigate({ kind: 'home' })}
        onOpenSubmit={() => navigate({ kind: 'submit' })}
        onOpenCategory={(slug) => navigate({ kind: 'category', slug })}
      />
    );
  }

  return (
    <HomePage
      lang={lang}
      onLangChange={handleLangChange}
      onOpenArticle={(slug) => navigate({ kind: 'article', slug })}
      onOpenCategory={(slug) => navigate({ kind: 'category', slug })}
      onOpenCivicTools={() => navigate({ kind: 'civictools' })}
    />
  );
}

export default App;
