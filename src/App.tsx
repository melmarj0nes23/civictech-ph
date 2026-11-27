import { useEffect, useState } from 'react';
import {
  CATEGORIES,
  getArticleBySlug,
  getCategoryBySlug,
  type CategorySlug,
} from './data/articles';
import type { Lang } from './data/i18n';
import { INFO_PAGES, type InfoPageSlug } from './data/infoPages';
import { applyDocumentSeo, ROUTE_SEO } from './data/seo';
import { ArticlePage } from './pages/ArticlePage';
import { AuthPage } from './pages/AuthPage';
import { CategoryPage } from './pages/CategoryPage';
import { DirectoryPage } from './pages/DirectoryPage';
import { HomePage } from './pages/HomePage';
import { InfoPage } from './pages/InfoPage';
import { SubmitPage } from './pages/SubmitPage';

type RouteState =
  | { kind: 'home' }
  | { kind: 'civictools' }
  | { kind: 'submit' }
  | { kind: 'auth'; mode: 'login' | 'signup' }
  | { kind: 'category'; slug: CategorySlug }
  | { kind: 'article'; slug: string }
  | { kind: 'info'; slug: InfoPageSlug };

function getRouteFromPath(): RouteState {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/login') return { kind: 'auth', mode: 'login' };
  if (path === '/signup') return { kind: 'auth', mode: 'signup' };
  if (path === '/civictools/submit') return { kind: 'submit' };
  if (path === '/civictools') return { kind: 'civictools' };
  if (
    path === '/mission' ||
    path === '/editorial-standards' ||
    path === '/corrections' ||
    path === '/volunteer'
  ) {
    return { kind: 'info', slug: path.slice(1) as InfoPageSlug };
  }
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
    if (route.kind === 'info') {
      const info = INFO_PAGES[route.slug];
      applyDocumentSeo(
        {
          path: `/${info.slug}`,
          title: {
            en: `${info.title.en} — Civic Tech by BetterGov.ph`,
            fil: `${info.title.fil} — Civic Tech ng BetterGov.ph`,
          },
          description: info.deck,
          type: 'website',
        },
        lang
      );
      return;
    }
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
    if (route.kind === 'auth') {
      applyDocumentSeo(
        {
          path: route.mode === 'login' ? '/login' : '/signup',
          title: {
            en:
              route.mode === 'login'
                ? 'Login — Civic Tech by BetterGov.ph'
                : 'Sign up — Civic Tech by BetterGov.ph',
            fil:
              route.mode === 'login'
                ? 'Mag-login — Civic Tech ng BetterGov.ph'
                : 'Mag-sign up — Civic Tech ng BetterGov.ph',
          },
          description: {
            en: 'Sign in or create a Civic Tech by BetterGov.ph reader account.',
            fil: 'Mag-sign in o gumawa ng Civic Tech ng BetterGov.ph account.',
          },
          type: 'website',
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

  const navigate = (next: RouteState, hash?: string) => {
    let targetPath = '/';
    if (next.kind === 'civictools') targetPath = '/civictools';
    else if (next.kind === 'submit') targetPath = '/civictools/submit';
    else if (next.kind === 'auth') targetPath = next.mode === 'login' ? '/login' : '/signup';
    else if (next.kind === 'info') targetPath = `/${next.slug}`;
    else if (next.kind === 'category') targetPath = `/category/${next.slug}`;
    else if (next.kind === 'article') {
      targetPath =
        next.slug === 'volunteers-national-budget'
          ? '/article'
          : `/article/${next.slug}`;
    }

    const fullUrl = hash ? `${targetPath}${hash}` : targetPath;
    if (window.location.pathname + window.location.hash !== fullUrl) {
      window.history.pushState(null, '', fullUrl);
    }
    setRoute(next);
    if (hash) {
      requestAnimationFrame(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
      });
    } else {
      window.scrollTo({ top: 0 });
    }
  };

  if (route.kind === 'auth') {
    return (
      <AuthPage
        mode={route.mode}
        lang={lang}
        onLangChange={handleLangChange}
        onBackHome={() => navigate({ kind: 'home' })}
        onOpenCivicTools={() => navigate({ kind: 'civictools' })}
        onOpenSubmit={(hash) => navigate({ kind: 'submit' }, hash)}
        onOpenCategory={(slug) => navigate({ kind: 'category', slug })}
        onOpenInfo={(slug) => navigate({ kind: 'info', slug })}
        onSwitchMode={(mode) => navigate({ kind: 'auth', mode })}
      />
    );
  }

  if (route.kind === 'info') {
    return (
      <InfoPage
        slug={route.slug}
        lang={lang}
        onLangChange={handleLangChange}
        onBackHome={() => navigate({ kind: 'home' })}
        onOpenCivicTools={() => navigate({ kind: 'civictools' })}
        onOpenSubmit={(hash) => navigate({ kind: 'submit' }, hash)}
        onOpenCategory={(slug) => navigate({ kind: 'category', slug })}
        onOpenInfo={(slug) => navigate({ kind: 'info', slug })}
      />
    );
  }

  if (route.kind === 'article') {
    return (
      <ArticlePage
        articleSlug={route.slug}
        lang={lang}
        onLangChange={handleLangChange}
        onBackHome={() => navigate({ kind: 'home' })}
        onOpenCivicTools={() => navigate({ kind: 'civictools' })}
        onOpenSubmit={(hash) => navigate({ kind: 'submit' }, hash)}
        onOpenCategory={(slug) => navigate({ kind: 'category', slug })}
        onOpenArticle={(slug) => navigate({ kind: 'article', slug })}
        onOpenInfo={(slug) => navigate({ kind: 'info', slug })}
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
        onOpenCivicTools={() => navigate({ kind: 'civictools' })}
        onOpenSubmit={(hash) => navigate({ kind: 'submit' }, hash)}
        onOpenCategory={(slug) => navigate({ kind: 'category', slug })}
        onOpenArticle={(slug) => navigate({ kind: 'article', slug })}
        onOpenInfo={(slug) => navigate({ kind: 'info', slug })}
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
        onOpenSubmit={(hash) => navigate({ kind: 'submit' }, hash)}
        onOpenCategory={(slug) => navigate({ kind: 'category', slug })}
        onOpenInfo={(slug) => navigate({ kind: 'info', slug })}
      />
    );
  }

  if (route.kind === 'civictools') {
    return (
      <DirectoryPage
        lang={lang}
        onLangChange={handleLangChange}
        onBackHome={() => navigate({ kind: 'home' })}
        onOpenSubmit={(hash) => navigate({ kind: 'submit' }, hash)}
        onOpenCategory={(slug) => navigate({ kind: 'category', slug })}
        onOpenInfo={(slug) => navigate({ kind: 'info', slug })}
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
      onOpenSubmit={(hash) => navigate({ kind: 'submit' }, hash)}
      onOpenInfo={(slug) => navigate({ kind: 'info', slug })}
    />
  );
}

export default App;
