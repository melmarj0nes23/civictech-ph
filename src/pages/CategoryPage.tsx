import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import { Footer } from '../components/Footer';
import { SiteHeader } from '../components/SiteHeader';
import {
  ARTICLES,
  CATEGORIES,
  getArticlePhoto,
  getCategoryBySlug,
  type CategorySlug,
} from '../data/articles';
import {
  mapD1RowToArticle,
  readCachedD1Articles,
  writeCachedD1Articles,
  type CachedArticleItem,
  type D1ApiArticle,
} from '../data/articlesCache';
import { DIRECTORY_ENTRIES } from '../data/directory';
import { getLocalizedSummary } from '../data/directoryI18n';
import { SECTOR_LABELS, STATUS_LABELS, TRANSLATIONS, type Lang } from '../data/i18n';
import type { InfoPageSlug } from '../data/infoPages';

const ACCENT = '#0B3D91';

interface CategoryPageProps {
  categorySlug: CategorySlug | 'all';
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
  const isAll = categorySlug === 'all';
  const t = TRANSLATIONS[lang];
  const category = isAll ? null : getCategoryBySlug(categorySlug) ?? CATEGORIES[0];
  const [d1Stories, setD1Stories] = useState<CachedArticleItem[]>(
    () => readCachedD1Articles() ?? []
  );
  const [visibleCount, setVisibleCount] = useState(12);

  const randomTools = useMemo(() => {
    const pool = DIRECTORY_ENTRIES.filter((e) => Boolean(e.website));
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, 16);
  }, [categorySlug]);

  useEffect(() => {
    setVisibleCount(12);
    fetch('/api/articles')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { ok?: boolean; articles?: D1ApiArticle[] } | null) => {
        if (!data?.ok || !data.articles) return;
        const mapped = data.articles.map(mapD1RowToArticle);
        setD1Stories(mapped);
        writeCachedD1Articles(mapped);
      })
      .catch(() => {
        // fallback to static articles in local Vite dev
      });
  }, [categorySlug]);

  const d1Slugs = new Set(d1Stories.map((s) => s.slug));
  const allStories: CachedArticleItem[] = [
    ...d1Stories,
    ...ARTICLES.filter((a) => !d1Slugs.has(a.slug)),
  ];
  const stories = isAll ? allStories : allStories.filter((a) => a.category === category!.slug);
  const visibleStories = stories.slice(0, visibleCount);
  const hasMore = stories.length > visibleCount;
  const moreStories = isAll
    ? []
    : allStories.filter((a) => a.category !== category!.slug).slice(0, 4);

  const handleArticleClick = (slug: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenArticle(slug);
  };

  const handleOpenCivicToolsClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenCivicTools();
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
        activeCategory={category?.slug}
      />

      <main
        className="category-main"
        style={{
          width: '100%',
          maxWidth: 1240,
          margin: '0 auto',
          padding: '40px 24px 72px',
          flex: '1 0 auto',
          boxSizing: 'border-box',
        }}
      >
        <div className="category-header" style={{ paddingBottom: 24, borderBottom: '2px solid #111', marginBottom: 32 }}>
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
            civictech.ph · {isAll ? (lang === 'en' ? 'Archive' : 'Arkibo') : lang === 'en' ? 'Section' : 'Seksyon'}
          </p>
          <h1
            className="directory-title category-title"
            style={{
              margin: 0,
              fontFamily: 'Newsreader, Georgia, serif',
              fontWeight: 500,
              fontSize: 48,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
            }}
          >
            {isAll ? (lang === 'en' ? 'All Articles' : 'Lahat ng Artikulo') : category!.label[lang]}
          </h1>
          <p
            className="category-desc"
            style={{ margin: '12px 0 0', maxWidth: 680, fontSize: 16, lineHeight: 1.5, color: '#444' }}
          >
            {isAll
              ? lang === 'en'
                ? 'All published reporting, explainers, and analysis across every section.'
                : 'Lahat ng nailathalang ulat, paliwanag, at pagsusuri sa bawat seksyon.'
              : category!.description[lang]}
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'flex-start' }}>
          {/* Main section feed */}
          <div style={{ flex: '999 1 560px', minWidth: 0 }}>
            {visibleStories.length === 0 ? (
              <p style={{ margin: 0, fontSize: 15, color: '#555' }}>
                {lang === 'en'
                  ? 'No articles published in this section yet.'
                  : 'Wala pang nailathalang artikulo sa seksyong ito.'}
              </p>
            ) : (
              <>
                {visibleStories.map((story, idx) => (
                <article
                  key={story.slug}
                  className="category-story"
                  style={{
                    padding: idx === 0 ? '0 0 24px' : '24px 0',
                    borderBottom: '1px solid #E5E5E5',
                  }}
                >
                  <a
                    href={story.slug === 'volunteers-national-budget' ? '/article' : `/article/${story.slug}`}
                    onClick={handleArticleClick(story.slug)}
                    className="story-card category-story-link"
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 24,
                      alignItems: 'flex-start',
                    }}
                  >
                    <div
                      className="ph ph--photo category-story-thumb"
                      style={{ flex: '1 1 240px', maxWidth: 320, aspectRatio: '3 / 2' }}
                    >
                      <img
                        src={story.photoUrl || getArticlePhoto(story.slug)}
                        alt={story.photoLabel[lang]}
                        loading="lazy"
                      />
                    </div>
                    <div className="category-story-body" style={{ flex: '999 1 280px', minWidth: 0 }}>
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
                        className="story-title category-story-title"
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
                      <p
                        className="category-story-deck"
                        style={{ margin: '10px 0 0', fontSize: 15, lineHeight: 1.5, color: '#444' }}
                      >
                        {story.deck[lang]}
                      </p>
                      <p className="category-story-meta" style={{ margin: '12px 0 0', fontSize: 13, color: '#555' }}>
                        <span style={{ fontWeight: 600, color: '#222' }}>{story.author[lang]}</span>
                        {' · '}
                        {story.date[lang]} · {story.readTime[lang]}
                      </p>
                    </div>
                  </a>
                </article>
              ))}
              {hasMore && (
                <div style={{ marginTop: 28 }}>
                  <button
                    type="button"
                    onClick={() => setVisibleCount((n) => n + 12)}
                    style={{
                      minHeight: 44,
                      padding: '0 22px',
                      border: '1px solid #111',
                      background: '#fff',
                      color: '#111',
                      fontFamily: 'inherit',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {lang === 'en'
                      ? `Show more (${stories.length - visibleCount} remaining)`
                      : `Magpakita pa (${stories.length - visibleCount} natitira)`}
                  </button>
                </div>
              )}
              </>
            )}
          </div>

          {/* Right rail: Latest across Civic Tech + Other sections */}
          <aside style={{ flex: '1 1 300px', minWidth: 0 }}>
            {!isAll && moreStories.length > 0 && (
              <>
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
              </>
            )}

            {isAll && (
              <div className="category-tools-rail" style={{ marginTop: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    borderBottom: '2px solid #111',
                    paddingBottom: 10,
                    marginBottom: 4,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {t.home.civicTools}
                  </p>
                  <a
                    href="/civictools"
                    onClick={handleOpenCivicToolsClick}
                    style={{ fontSize: 12, fontWeight: 600, color: ACCENT }}
                  >
                    {DIRECTORY_ENTRIES.length} {lang === 'en' ? 'entries →' : 'nakalista →'}
                  </a>
                </div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {randomTools.map((entry) => (
                    <li key={entry.slug} style={{ borderBottom: '1px solid #E5E5E5' }}>
                      <a
                        href={entry.website || '/civictools'}
                        target={entry.website ? '_blank' : undefined}
                        rel={entry.website ? 'noreferrer' : undefined}
                        style={{ display: 'block', padding: '14px 0' }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 8,
                            marginBottom: 4,
                          }}
                        >
                          <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>
                            {entry.title}
                          </span>
                          <span
                            style={{
                              flex: 'none',
                              fontSize: 11,
                              fontWeight: 600,
                              padding: '2px 7px',
                              background: '#F4F6FA',
                              color: ACCENT,
                            }}
                          >
                            {STATUS_LABELS[entry.status]?.[lang] ?? entry.status}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.45, color: '#555' }}>
                          {getLocalizedSummary(entry.slug, entry.summary, lang, entry.summaryFil)}
                        </p>
                        {entry.sectors[0] && (
                          <p
                            style={{
                              margin: '6px 0 0',
                              fontSize: 11,
                              fontWeight: 600,
                              letterSpacing: '0.06em',
                              textTransform: 'uppercase',
                              color: '#666',
                            }}
                          >
                            {SECTOR_LABELS[entry.sectors[0]]?.[lang] ?? entry.sectors[0]}
                          </p>
                        )}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      href="/civictools"
                      onClick={handleOpenCivicToolsClick}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 12,
                        padding: '14px 0',
                        fontSize: 14,
                        fontWeight: 600,
                        color: ACCENT,
                      }}
                    >
                      {t.home.tool4} <span aria-hidden="true">→</span>
                    </a>
                  </li>
                </ul>
              </div>
            )}
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
