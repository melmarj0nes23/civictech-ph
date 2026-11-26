import { useEffect, useState } from 'react';
import { ArticlePage } from './pages/ArticlePage';
import { DirectoryPage } from './pages/DirectoryPage';
import { HomePage } from './pages/HomePage';

type Page = 'home' | 'article' | 'civictools';

function getPageFromPath(): Page {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/article') return 'article';
  if (path === '/civictools') return 'civictools';
  return 'home';
}

export function App() {
  const [page, setPage] = useState<Page>(getPageFromPath);

  useEffect(() => {
    const onPopState = () => setPage(getPageFromPath());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (next: Page) => {
    const targetPath = next === 'home' ? '/' : `/${next}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    setPage(next);
    window.scrollTo({ top: 0 });
  };

  if (page === 'article') {
    return (
      <ArticlePage
        onBackHome={() => navigate('home')}
        onOpenCivicTools={() => navigate('civictools')}
      />
    );
  }

  if (page === 'civictools') {
    return <DirectoryPage onBackHome={() => navigate('home')} />;
  }

  return (
    <HomePage
      onOpenArticle={() => navigate('article')}
      onOpenCivicTools={() => navigate('civictools')}
    />
  );
}

export default App;
