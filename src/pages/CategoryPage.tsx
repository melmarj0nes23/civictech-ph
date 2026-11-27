import { useEffect, useState, type MouseEvent } from 'react';
import { Footer } from '../components/Footer';
import { SiteHeader } from '../components/SiteHeader';
import {
  ARTICLES,
  CATEGORIES,
  getArticlePhoto,
  getCategoryBySlug,
  type ArticleItem,
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
  const [d1Stories, setD1Stories] = useState<(ArticleItem & { photoUrl?: string })[]>([]);

  useEffect(() => {
    fetch(`/api/articles?category=${encodeURIComponent(category.slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(
        (
          data: {
            ok?: boolean;
            articles?: Array<{
              slug: string;
              category: CategorySlug;
              kicker_en: string;
              kicker_fil: string;
              title_en: string;
              title_fil: string;
              deck_en: string;
              deck_fil: string;
              body_en: string;
              body_fil: string;
              author_name: string;
              photo_url: string;
              created_at: string;
            }>;
          } | null
        ) => {
          if (!data?.ok || !data.articles) return;
          setD1Stories(
            data.articles.map((a) => ({
              slug: a.slug,
              category: a.category,
              kicker: { en: a.kicker_en, fil: a.kicker_fil || a.kicker_en },
              title: { en: a.title_en, fil: a.title_fil || a.title_en },
              deck: { en: a.deck_en, fil: a.deck_fil || a.deck_en },
              author: { en: a.author_name, fil: a.author_name },
              date: { en: a.created_at.slice(0, 10), fil: a.created_at.slice(0, 10) },
              readTime: { en: '4 min read', fil: '4 minutong pagbabasa' },
              photoLabel: { en: a.title_en, fil: a.title_fil || a.title_en },
              body: {
                en: a.body_en.split(/\n\n+/),
                fil: (a.body_fil || a.body_en).split(/\n\n+/),
              },
              photoUrl: a.photo_url,
            }))
          );
        }
      )
      .catch(() => {
        // fallback to static articles in local Vite dev
      });
  }, [category.slug]);

  const stories: (ArticleItem & { photoUrl?: string })[] = [
    ...d1Stories,
    ...ARTICLES.filter((a) => a.category === category.slug),
  ];

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
                  <img
                    src={story.photoUrl || getArticlePhoto(story.slug)}
                    alt={story.photoLabel[lang]}
                    loading="lazy"
                  />
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
