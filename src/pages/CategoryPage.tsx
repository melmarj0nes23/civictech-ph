import type { MouseEvent } from 'react';
import { Footer } from '../components/Footer';
import { SiteHeader } from '../components/SiteHeader';
import {
  ARTICLES,
  CATEGORIES,
  getArticlePhoto,
  getCategoryBySlug,
  type CategorySlug,
} from '../data/articles';
import { type Lang } from '../data/i18n';
import type { InfoPageSlug } from '../data/infoPages';

const ACCENT = '#0B3D91';

interface CategoryPageProps {
  categorySlug: CategorySlug;
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  onBackHome: () => void;
  onOpenCivicTools: () => void;
  onOpenSubmit: (hash?: string) => void;
  onOpenCategory: (slug: CategorySlug) => void;
  onOpenArticle: (slug: string) => void;
  onOpenInfo: (slug: InfoPageSlug) => void;
}

export function CategoryPage({
  categorySlug,
  lang,
  onLangChange,
  onBackHome,
  onOpenCivicTools,
  onOpenSubmit,
  onOpenCategory,
  onOpenArticle,
  onOpenInfo,
}: CategoryPageProps) {
  const category = getCategoryBySlug(categorySlug) ?? CATEGORIES[0];
  const stories = ARTICLES.filter((a) => a.category === category.slug);

  const handleArticleClick = (slug: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenArticle(slug);
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#111', background: '#fff' }}>
      <SiteHeader
        lang={lang}
        onLangChange={onLangChange}
        onBackHome={onBackHome}
        onOpenCategory={onOpenCategory}
        onOpenCivicTools={onOpenCivicTools}
        activeCategory={category.slug}
      />

      <main style={{ maxWidth: 1240, margin: '0 auto', padding: '40px 24px 64px' }}>
        <div style={{ paddingBottom: 24, borderBottom: '2px solid #111', marginBottom: 32 }}>
          <p
            style={{
              margin: '0 0 8px',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: ACCENT,
            }}
          >
            civictech.ph · {lang === 'en' ? 'Section' : 'Seksyon'}
          </p>
          <h1
            className="directory-title"
            style={{
              margin: 0,
              fontFamily: 'Newsreader, Georgia, serif',
              fontWeight: 500,
              fontSize: 48,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
            }}
          >
            {category.label[lang]}
          </h1>
          <p style={{ margin: '12px 0 0', maxWidth: 680, fontSize: 16, lineHeight: 1.5, color: '#444' }}>
            {category.description[lang]}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 32,
          }}
        >
          {stories.map((story) => (
            <article key={story.slug}>
              <a
                href={story.slug === 'volunteers-national-budget' ? '/article' : `/article/${story.slug}`}
                onClick={handleArticleClick(story.slug)}
                style={{ display: 'block' }}
              >
                <div className="ph ph--photo" style={{ aspectRatio: '3 / 2' }}>
                  <img src={getArticlePhoto(story.slug)} alt={story.photoLabel[lang]} loading="lazy" />
                </div>
                <p
                  style={{
                    margin: '14px 0 6px',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: ACCENT,
                  }}
                >
                  {story.kicker[lang]}
                </p>
                <h2
                  style={{
                    margin: 0,
                    fontFamily: 'Newsreader, Georgia, serif',
                    fontSize: 24,
                    lineHeight: 1.2,
                    fontWeight: 500,
                  }}
                >
                  {story.title[lang]}
                </h2>
                <p style={{ margin: '10px 0 0', fontSize: 15, lineHeight: 1.5, color: '#444' }}>
                  {story.deck[lang]}
                </p>
                <p style={{ margin: '12px 0 0', fontSize: 13, color: '#555' }}>
                  {story.date[lang]} · {story.readTime[lang]}
                </p>
              </a>
            </article>
          ))}
        </div>
      </main>

      <Footer
        lang={lang}
        onBackHome={onBackHome}
        onOpenCivicTools={onOpenCivicTools}
        onOpenSubmit={onOpenSubmit}
        onOpenInfo={onOpenInfo}
      />
    </div>
  );
}
