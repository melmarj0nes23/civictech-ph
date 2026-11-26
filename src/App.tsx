import { useEffect, useState } from 'react';
import type { Lang } from './data/i18n';
import { applyDocumentSeo, ROUTE_SEO } from './data/seo';
import { ArticlePage } from './pages/ArticlePage';
import { DirectoryPage } from './pages/DirectoryPage';
import { HomePage } from './pages/HomePage';
import { SubmitPage } from './pages/SubmitPage';

type Page = 'home' | 'article' | 'civictools' | 'submit';

function getPageFromPath(): Page {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/article') return 'article';
  if (path === '/civictools/submit') return 'submit';
  if (path === '/civictools') return 'civictools';
  return 'home';
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
  const [page, setPage] = useState<Page>(getPageFromPath);
  const [lang, setLang] = useState<Lang>(getInitialLang);

  useEffect(() => {
    applyDocumentSeo(ROUTE_SEO[page], lang);
  }, [page, lang]);

  useEffect(() => {
    const onPopState = () => setPage(getPageFromPath());
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

  const navigate = (next: Page) => {
    const targetPath =
      next === 'home'
        ? '/'
        : next === 'submit'
          ? '/civictools/submit'
          : `/${next}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    setPage(next);
    window.scrollTo({ top: 0 });
  };

  if (page === 'article') {
    return (
      <ArticlePage
        lang={lang}
        onLangChange={handleLangChange}
        onBackHome={() => navigate('home')}
        onOpenCivicTools={() => navigate('civictools')}
      />
    );
  }

  if (page === 'submit') {
    return (
      <SubmitPage
        lang={lang}
        onLangChange={handleLangChange}
        onBackHome={() => navigate('home')}
        onBackDirectory={() => navigate('civictools')}
      />
    );
  }

  if (page === 'civictools') {
    return (
      <DirectoryPage
        lang={lang}
        onLangChange={handleLangChange}
        onBackHome={() => navigate('home')}
        onOpenSubmit={() => navigate('submit')}
      />
    );
  }

  return (
    <HomePage
      lang={lang}
      onLangChange={handleLangChange}
      onOpenArticle={() => navigate('article')}
      onOpenCivicTools={() => navigate('civictools')}
    />
  );
}

export default App;
