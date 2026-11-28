import { AuthenticateWithRedirectCallback } from '@clerk/react';
import { useEffect, useState } from 'react';
import {
  ARTICLES,
  CATEGORIES,
  getCategoryBySlug,
  type CategorySlug,
} from './data/articles';
import { readCachedD1Articles } from './data/articlesCache';
import type { Lang } from './data/i18n';
import { INFO_PAGES, type InfoPageSlug } from './data/infoPages';
import { applyDocumentSeo, ROUTE_SEO } from './data/seo';
import { ArticlePage } from './pages/ArticlePage';
import { AuthPage } from './pages/AuthPage';
import { AuthorPage } from './pages/AuthorPage';
import { CategoryPage } from './pages/CategoryPage';
import { ContactPage } from './pages/ContactPage';
import { DirectoryPage } from './pages/DirectoryPage';
import { HomePage } from './pages/HomePage';
import { InfoPage } from './pages/InfoPage';
import { ProfilePage } from './pages/ProfilePage';
import { SubmitPage } from './pages/SubmitPage';
import { WritePage } from './pages/WritePage';

type RouteState =
  | { kind: 'home' }
  | { kind: 'civictools' }
  | { kind: 'submit' }
  | { kind: 'auth'; mode: 'login' | 'signup' }
  | { kind: 'profile' }
  | { kind: 'write' }
  | { kind: 'sso-callback' }
  | { kind: 'category'; slug: CategorySlug | 'all' }
  | { kind: 'article'; slug: string }
  | { kind: 'author'; slug: string }
  | { kind: 'contact' }
  | { kind: 'info'; slug: InfoPageSlug };

function getRouteFromPath(): RouteState {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/sso-callback') return { kind: 'sso-callback' };
  if (path === '/profile') return { kind: 'profile' };
  if (path === '/write') return { kind: 'write' };
  if (path === '/contact') return { kind: 'contact' };
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
  if (path.startsWith('/author/')) {
    return { kind: 'author', slug: path.slice('/author/'.length) };
  }
  if (path === '/category') return { kind: 'category', slug: 'all' };
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
    if (route.kind === 'sso-callback') return;
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
      if (route.slug === 'all') {
        applyDocumentSeo(
          {
            path: '/category',
            title: {
              en: 'All Articles — Civic Tech by BetterGov.ph',
              fil: 'Lahat ng Artikulo — Civic Tech ng BetterGov.ph',
            },
            description: {
              en: 'All published reporting, explainers, and analysis across every Civic Tech PH section.',
              fil: 'Lahat ng nailathalang ulat, paliwanag, at pagsusuri sa bawat seksyon ng Civic Tech PH.',
            },
            type: 'website',
          },
          lang
        );
        return;
      }
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
    if (route.kind === 'contact') {
      applyDocumentSeo(
        {
          path: '/contact',
          title: {
            en: 'Contact & News Tips — Civic Tech by BetterGov.ph',
            fil: 'Makipag-ugnayan — Civic Tech ng BetterGov.ph',
          },
          description: {
            en: 'Send a story tip, correction, or inquiry to the Civic Tech PH editorial team.',
            fil: 'Magpadala ng tip sa balita, pagwawasto, o tanong sa patnugutan ng Civic Tech PH.',
          },
          type: 'website',
        },
        lang
      );
      return;
    }
    if (route.kind === 'author') {
      applyDocumentSeo(
        {
          path: `/author/${route.slug}`,
          title: {
            en: 'Author Archive — Civic Tech by BetterGov.ph',
            fil: 'Arkibo ng May-akda — Civic Tech ng BetterGov.ph',
          },
          description: {
            en: 'Stories and reporting from Civic Tech PH contributors.',
            fil: 'Mga artikulo at ulat mula sa mga tagapag-ambag ng Civic Tech PH.',
          },
          type: 'website',
        },
        lang
      );
      return;
    }
    if (route.kind === 'article') {
      const cached = readCachedD1Articles()?.find((a) => a.slug === route.slug);
      const art = cached ?? ARTICLES.find((a) => a.slug === route.slug);
      applyDocumentSeo(
        art
          ? {
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
            }
          : {
              path: `/article/${route.slug}`,
              title: {
                en: 'Civic Tech — By BetterGov.ph',
                fil: 'Civic Tech — Ng BetterGov.ph',
              },
              description: ROUTE_SEO.home.description,
              type: 'article',
            },
        lang
      );
      return;
    }
    if (route.kind === 'write') {
      applyDocumentSeo(
        {
          path: '/write',
          title: {
            en: 'Newsroom Studio — Civic Tech by BetterGov.ph',
            fil: 'Newsroom Studio — Civic Tech ng BetterGov.ph',
          },
          description: {
            en: 'Publish and manage Civic Tech by BetterGov.ph articles.',
            fil: 'Mag-publish at pamahalaan ang mga artikulo sa Civic Tech.',
          },
          type: 'website',
        },
        lang
      );
      return;
    }
    if (route.kind === 'profile') {
      applyDocumentSeo(
        {
          path: '/profile',
          title: {
            en: 'Account Profile — Civic Tech by BetterGov.ph',
            fil: 'Profile ng Account — Civic Tech ng BetterGov.ph',
          },
          description: {
            en: 'Manage your Civic Tech by BetterGov.ph reader account and preferences.',
            fil: 'Pamahalaan ang iyong Civic Tech ng BetterGov.ph account.',
          },
          type: 'website',
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
    else if (next.kind === 'sso-callback') targetPath = '/sso-callback';
    else if (next.kind === 'profile') targetPath = '/profile';
    else if (next.kind === 'write') targetPath = '/write';
    else if (next.kind === 'auth') targetPath = next.mode === 'login' ? '/login' : '/signup';
    else if (next.kind === 'info') targetPath = `/${next.slug}`;
    else if (next.kind === 'category') {
      targetPath = next.slug === 'all' ? '/category' : `/category/${next.slug}`;
    }
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

  if (route.kind === 'sso-callback') {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 14,
          color: '#555',
        }}
      >
        <AuthenticateWithRedirectCallback signInForceRedirectUrl="/" signUpForceRedirectUrl="/" />
      </div>
    );
  }

  if (route.kind === 'write') {
    return (
      <WritePage
        lang={lang}
        onLangChange={handleLangChange}
        onBackHome={() => navigate({ kind: 'home' })}
        onOpenCivicTools={() => navigate({ kind: 'civictools' })}
        onOpenSubmit={(hash) => navigate({ kind: 'submit' }, hash)}
        onOpenCategory={(slug) => navigate({ kind: 'category', slug })}
        onOpenInfo={(slug) => navigate({ kind: 'info', slug })}
        onOpenArticle={(slug) => navigate({ kind: 'article', slug })}
        onOpenLogin={() => navigate({ kind: 'auth', mode: 'login' })}
      />
    );
  }

  if (route.kind === 'profile') {
    return (
      <ProfilePage
        lang={lang}
        onLangChange={handleLangChange}
        onBackHome={() => navigate({ kind: 'home' })}
        onOpenCivicTools={() => navigate({ kind: 'civictools' })}
        onOpenSubmit={(hash) => navigate({ kind: 'submit' }, hash)}
        onOpenCategory={(slug) => navigate({ kind: 'category', slug })}
        onOpenInfo={(slug) => navigate({ kind: 'info', slug })}
        onOpenLogin={() => navigate({ kind: 'auth', mode: 'login' })}
        onOpenWrite={() => navigate({ kind: 'write' })}
      />
    );
  }

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

  if (route.kind === 'contact') {
    return (
      <ContactPage
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

  if (route.kind === 'author') {
    return (
      <AuthorPage
        authorSlug={route.slug}
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
      onOpenAllArticles={() => navigate({ kind: 'category', slug: 'all' })}
      onOpenCivicTools={() => navigate({ kind: 'civictools' })}
      onOpenSubmit={(hash) => navigate({ kind: 'submit' }, hash)}
      onOpenInfo={(slug) => navigate({ kind: 'info', slug })}
    />
  );
}

export default App;
