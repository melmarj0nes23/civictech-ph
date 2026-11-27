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
    fetch('/api/articles')
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

  const d1Slugs = new Set(d1Stories.map((s) => s.slug));
  const allStories: (ArticleItem & { photoUrl?: string })[] = [
    ...d1Stories,
    ...ARTICLES.filter((a) => !d1Slugs.has(a.slug)),
  ];
  const stories = allStories.filter((a) => a.category === category.slug);
  const moreStories = allStories.filter((a) => a.category !== category.slug).slice(0, 4);

  const handleArticleClick = (slug: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenArticle(slug);
  };

  const handleCategoryClick = (slug: CategorySlug) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenCategory(slug);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#111',
        background: '#fff',
      }}
    >
      <SiteHeader
        lang={lang}
        onLangChange={onLangChange}
        onBackHome={onBackHome}
        onOpenCategory={onOpenCategory}
        onOpenCivicTools={onOpenCivicTools}
        activeCategory={category.slug}
      />

      <main
        style={{
          width: '100%',
          maxWidth: 1240,
          margin: '0 auto',
          padding: '40px 24px 72px',
          flex: '1 0 auto',
          boxSizing: 'border-box',
        }}
      >
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

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'flex-start' }}>
          {/* Main section feed */}
          <div style={{ flex: '999 1 560px', minWidth: 0 }}>
            {stories.length === 0 ? (
              <p style={{ margin: 0, fontSize: 15, color: '#555' }}>
                {lang === 'en'
                  ? 'No articles published in this section yet.'
                  : 'Wala pang nailathalang artikulo sa seksyong ito.'}
              </p>
            ) : (
              stories.map((story, idx) => (
                <article
                  key={story.slug}
                  style={{
                    padding: idx === 0 ? '0 0 24px' : '24px 0',
                    borderBottom: '1px solid #E5E5E5',
                  }}
                >
                  <a
                    href={story.slug === 'volunteers-national-budget' ? '/article' : `/article/${story.slug}`}
                    onClick={handleArticleClick(story.slug)}
                    className="story-card"
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 24,
                      alignItems: 'flex-start',
                    }}
                  >
                    <div
                      className="ph ph--photo"
                      style={{ flex: '1 1 240px', maxWidth: 320, aspectRatio: '3 / 2' }}
                    >
                      <img
                        src={story.photoUrl || getArticlePhoto(story.slug)}
                        alt={story.photoLabel[lang]}
                        loading="lazy"
                      />
                    </div>
                    <div style={{ flex: '999 1 280px', minWidth: 0 }}>
                      <p
                        style={{
                          margin: '0 0 6px',
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
                        className="story-title"
                        style={{
                          margin: 0,
                          fontFamily: 'Newsreader, Georgia, serif',
                          fontSize: 26,
                          lineHeight: 1.18,
                          fontWeight: 500,
                        }}
                      >
                        {story.title[lang]}
                      </h2>
                      <p style={{ margin: '10px 0 0', fontSize: 15, lineHeight: 1.5, color: '#444' }}>
                        {story.deck[lang]}
                      </p>
                      <p style={{ margin: '12px 0 0', fontSize: 13, color: '#555' }}>
                        <span style={{ fontWeight: 600, color: '#222' }}>{story.author[lang]}</span>
                        {' · '}
                        {story.date[lang]} · {story.readTime[lang]}
                      </p>
                    </div>
                  </a>
                </article>
              ))
            )}
          </div>

          {/* Right rail: Latest across Civic Tech + Other sections */}
          <aside style={{ flex: '1 1 300px', minWidth: 0 }}>
            <p
              style={{
                margin: '0 0 4px',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                borderBottom: '2px solid #111',
                paddingBottom: 10,
              }}
            >
              {lang === 'en' ? 'More from Civic Tech' : 'Iba pang balita'}
            </p>
            <div>
              {moreStories.map((story, idx) => (
                <a
                  key={story.slug}
                  href={`/article/${story.slug}`}
                  onClick={handleArticleClick(story.slug)}
                  className="story-card"
                  style={{
                    display: 'flex',
                    gap: 14,
                    padding: '16px 0',
                    borderBottom: idx < moreStories.length - 1 ? '1px solid #E5E5E5' : 'none',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: '0 0 4px',
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: ACCENT,
                      }}
                    >
                      {getCategoryBySlug(story.category)?.label[lang] ?? story.kicker[lang]}
                    </p>
                    <p
                      className="story-title"
                      style={{
                        margin: 0,
                        fontFamily: 'Newsreader, Georgia, serif',
                        fontSize: 18,
                        lineHeight: 1.25,
                        fontWeight: 500,
                      }}
                    >
                      {story.title[lang]}
                    </p>
                  </div>
                  <div className="ph ph--photo" style={{ width: 80, height: 80, flex: 'none' }}>
                    <img
                      src={story.photoUrl || getArticlePhoto(story.slug)}
                      alt={story.title[lang]}
                      loading="lazy"
                    />
                  </div>
                </a>
              ))}
            </div>

            <div style={{ marginTop: 28 }}>
              <p
                style={{
                  margin: '0 0 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  borderBottom: '2px solid #111',
                  paddingBottom: 10,
                }}
              >
                {lang === 'en' ? 'Sections' : 'Mga Seksyon'}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {CATEGORIES.filter((c) => c.slug !== category.slug).map((c) => (
                  <a
                    key={c.slug}
                    href={`/category/${c.slug}`}
                    onClick={handleCategoryClick(c.slug)}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid #D4D4D4',
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#111',
                      background: '#fff',
                    }}
                  >
                    {c.label[lang]}
                  </a>
                ))}
              </div>
            </div>
          </aside>
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
