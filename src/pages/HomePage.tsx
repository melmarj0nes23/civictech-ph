import { useEffect, useState, type MouseEvent } from 'react';
import { Footer } from '../components/Footer';
import { NewsletterBand } from '../components/NewsletterBand';
import { SiteHeader } from '../components/SiteHeader';
import {
  ARTICLES,
  getCategoryBySlug,
  type CategorySlug,
} from '../data/articles';
import { resolveArticleImage } from '../data/videoEmbed';
import {
  mapD1RowToArticle,
  readCachedD1Articles,
  writeCachedD1Articles,
  type CachedArticleItem,
  type D1ApiArticle,
} from '../data/articlesCache';
import { DIRECTORY_ENTRIES } from '../data/directory';
import { getLocalizedSummary } from '../data/directoryI18n';
import {
  formatTodayDate,
  SECTOR_LABELS,
  STATUS_LABELS,
  TRANSLATIONS,
  type Lang,
} from '../data/i18n';
import type { InfoPageSlug } from '../data/infoPages';

const ACCENT = '#0B3D91';

interface HomePageProps {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  onOpenArticle: (slug: string) => void;
  onOpenCategory: (slug: CategorySlug) => void;
  onOpenAllArticles?: () => void;
  onOpenCivicTools: () => void;
  onOpenSubmit: (hash?: string) => void;
  onOpenInfo: (slug: InfoPageSlug) => void;
}

export function HomePage({
  lang,
  onLangChange,
  onOpenArticle,
  onOpenCategory,
  onOpenAllArticles,
  onOpenCivicTools,
  onOpenSubmit,
  onOpenInfo,
}: HomePageProps) {
  const t = TRANSLATIONS[lang];
  const initialCached = readCachedD1Articles();
  const [d1Stories, setD1Stories] = useState<CachedArticleItem[]>(initialCached ?? []);
  const [loadingFeed, setLoadingFeed] = useState(initialCached === null);
  const [banners, setBanners] = useState<Array<{ imageUrl: string; linkUrl?: string; alt?: string }>>(() => {
    try {
      const raw = window.localStorage.getItem('civictech_homepage_banners_v1');
      const parsed = raw ? (JSON.parse(raw) as unknown) : null;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [bannerIdx, setBannerIdx] = useState(0);

  useEffect(() => {
    fetch('/api/banners')
      .then((r) => (r.ok ? r.json() : null))
      .then(
        (
          data: {
            ok?: boolean;
            banners?: Array<{ imageUrl: string; linkUrl?: string; alt?: string }>;
          } | null
        ) => {
          if (!data?.ok || !Array.isArray(data.banners)) return;
          setBanners(data.banners);
          try {
            window.localStorage.setItem('civictech_homepage_banners_v1', JSON.stringify(data.banners));
          } catch {
            // ignore
          }
        }
      )
      .catch(() => {
        // ignore
      });
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const id = window.setInterval(() => {
      setBannerIdx((prev) => (prev + 1) % banners.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, [banners.length]);

  useEffect(() => {
    fetch('/api/articles')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { ok?: boolean; articles?: D1ApiArticle[] } | null) => {
        if (!data?.ok || !data.articles) return;
        const mapped = data.articles.map(mapD1RowToArticle);
        setD1Stories(mapped);
        writeCachedD1Articles(mapped);
      })
      .catch(() => {
        // fallback to static articles in plain Vite dev
      })
      .finally(() => {
        setLoadingFeed(false);
      });
  }, []);

  const d1Slugs = new Set(d1Stories.map((s) => s.slug));
  const feedStories: CachedArticleItem[] = [
    ...d1Stories,
    ...ARTICLES.filter((a) => !d1Slugs.has(a.slug)),
  ];
  const leadStory = feedStories[0] ?? ARTICLES[0];
  const topStories = feedStories.slice(1, 6);
  const latestStories = feedStories.slice(6, 10);
  const longReadStory: CachedArticleItem =
    feedStories.find((s) => s.isLongRead) ??
    feedStories.find((s) => s.slug === 'last-mile-connectivity') ??
    ARTICLES.find((a) => a.slug === 'last-mile-connectivity') ??
    leadStory;
  const opinionStories = [
    ...feedStories.filter((s) => s.category === 'opinion'),
    ...ARTICLES.filter(
      (a) => a.category === 'opinion' && !feedStories.some((s) => s.slug === a.slug)
    ),
  ].slice(0, 3);

  const featuredTools = [
    ...DIRECTORY_ENTRIES.filter((e) => e.kind === 'project' && e.website).slice(0, 3),
    ...DIRECTORY_ENTRIES.filter((e) => e.kind === 'cso' && e.website).slice(0, 1),
  ];

  const handleOpenArticle = (slug: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenArticle(slug);
  };

  const handleOpenCivicTools = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenCivicTools();
  };

  const handleOpenAll = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenAllArticles?.();
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#111', background: '#fff' }}>
      <SiteHeader
        lang={lang}
        onLangChange={onLangChange}
        onBackHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onOpenCategory={onOpenCategory}
        onOpenCivicTools={onOpenCivicTools}
        onSubscribe={() =>
          document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' })
        }
      />

      {/* Edition utility strip */}
      <div className="edition-strip">
        <div className="edition-strip-inner">
          <span>{formatTodayDate(lang)}</span>
          <div className="edition-strip-right" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span>
              {lang === 'en'
                ? 'Philippine Civic Tech & Digital Government'
                : 'Civic Tech at Digital na Pamahalaan ng Pilipinas'}
            </span>
          </div>
        </div>
      </div>

      <main className="home-main" style={{ maxWidth: 1380, margin: '0 auto', padding: '24px 24px 0' }}>
        {/* Optional scrolling banner carousel */}
        {banners.length > 0 && (
          <section aria-label="Featured banners" style={{ marginBottom: 28 }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              {(() => {
                const active = banners[bannerIdx % banners.length];
                const img = (
                  <img
                    src={active.imageUrl}
                    alt={active.alt || 'Featured banner'}
                    style={{
                      width: '100%',
                      maxHeight: 260,
                      aspectRatio: '16 / 4',
                      objectFit: 'cover',
                      display: 'block',
                      border: '1px solid #E5E5E5',
                    }}
                  />
                );
                return active.linkUrl ? (
                  <a
                    href={active.linkUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'block', width: '100%' }}
                  >
                    {img}
                  </a>
                ) : (
                  <div style={{ width: '100%' }}>{img}</div>
                );
              })()}
            </div>

            {banners.length > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 6,
                  marginTop: 10,
                }}
              >
                {banners.map((_, i) => {
                  const isCurrent = i === bannerIdx % banners.length;
                  return (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Go to banner ${i + 1}`}
                      onClick={() => setBannerIdx(i)}
                      style={{
                        width: isCurrent ? 22 : 8,
                        height: 6,
                        borderRadius: 999,
                        border: 'none',
                        padding: 0,
                        background: isCurrent ? ACCENT : '#D4D4D4',
                        cursor: 'pointer',
                        transition: 'width 0.2s ease',
                      }}
                    />
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Lead + rail */}
        <section
          className="home-lead-section"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 40,
            paddingBottom: 40,
            borderBottom: '1px solid #E5E5E5',
          }}
        >
          <article className="story-card" style={{ flex: '999 1 560px', minWidth: 0 }}>
            <p
              style={{
                margin: '0 0 18px',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                borderBottom: `2px solid ${ACCENT}`,
                paddingBottom: 10,
              }}
            >
              {lang === 'en' ? 'Headlines' : 'Mga Balita'}
            </p>
            {loadingFeed ? (
              <div aria-busy="true" aria-label="Loading lead story">
                <div style={{ aspectRatio: '16 / 9', width: '100%', background: '#F4F6FA' }} />
                <div style={{ height: 14, width: 90, background: '#F4F6FA', margin: '20px 0 12px' }} />
                <div style={{ height: 42, width: '90%', background: '#F4F6FA', marginBottom: 10 }} />
                <div style={{ height: 42, width: '65%', background: '#F4F6FA', marginBottom: 16 }} />
                <div style={{ height: 22, width: '80%', background: '#F4F6FA' }} />
              </div>
            ) : (
              <>
                <a
                  href={`/article/${leadStory.slug}`}
                  onClick={handleOpenArticle(leadStory.slug)}
                  style={{ display: 'block' }}
                >
                  <div
                    className="ph ph--photo"
                    style={{
                      aspectRatio: '16 / 9',
                      width: '100%',
                    }}
                  >
                    <img
                      src={resolveArticleImage(leadStory.photoUrl, leadStory.slug)}
                      alt={leadStory.title[lang]}
                    />
                  </div>
                </a>
                {leadStory.photoLabel[lang] && (
                  <p style={{ margin: '8px 0 0', fontSize: 12, color: '#666', lineHeight: 1.4 }}>
                    {leadStory.photoLabel[lang]}
                  </p>
                )}
                <p
                  style={{
                    margin: '16px 0 8px',
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: ACCENT,
                  }}
                >
                  {getCategoryBySlug(leadStory.category)?.label[lang] ?? leadStory.kicker[lang]}
                </p>
                <h2
                  className="hero-title story-title"
                  style={{
                    margin: 0,
                    fontFamily: 'Newsreader, Georgia, serif',
                    fontWeight: 500,
                    fontSize: 46,
                    lineHeight: 1.08,
                    letterSpacing: '-0.015em',
                  }}
                >
                  <a href={`/article/${leadStory.slug}`} onClick={handleOpenArticle(leadStory.slug)}>
                    {leadStory.title[lang]}
                  </a>
                </h2>
                <p
                  className="home-lead-deck"
                  style={{
                    margin: '14px 0 0',
                    fontFamily: 'Newsreader, Georgia, serif',
                    fontSize: 21,
                    lineHeight: 1.45,
                    color: '#333',
                    maxWidth: 720,
                  }}
                >
                  {leadStory.deck[lang]}
                </p>
                <p style={{ margin: '16px 0 0', fontSize: 13, color: '#555' }}>
                  {t.home.byWord}{' '}
                  <span style={{ color: '#111', fontWeight: 600 }}>{leadStory.author[lang]}</span>{' '}
                  &nbsp;·&nbsp; {leadStory.readTime[lang]}
                </p>
              </>
            )}
          </article>

          <aside
            aria-label={t.home.topStories}
            className="home-top-rail"
            style={{
              flex: '1 1 320px',
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <p
              style={{
                margin: '0 0 4px',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                borderBottom: `2px solid ${ACCENT}`,
                paddingBottom: 10,
              }}
            >
              {t.home.topStories}
            </p>
            {topStories.map((story, idx) => (
              <a
                key={story.slug}
                href={`/article/${story.slug}`}
                onClick={handleOpenArticle(story.slug)}
                className="story-card"
                style={{
                  display: 'flex',
                  gap: 16,
                  padding: '18px 0',
                  borderBottom: idx < topStories.length - 1 ? '1px solid #E5E5E5' : 'none',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
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
                    {getCategoryBySlug(story.category)?.label[lang] ?? story.kicker[lang]}
                  </p>
                  <p
                    className="story-title"
                    style={{
                      margin: 0,
                      fontFamily: 'Newsreader, Georgia, serif',
                      fontSize: 19,
                      lineHeight: 1.25,
                      fontWeight: 500,
                    }}
                  >
                    {story.title[lang]}
                  </p>
                  <p style={{ margin: '6px 0 0', fontSize: 12, color: '#666' }}>
                    {story.date[lang]} · {story.readTime[lang]}
                  </p>
                </div>
                <div className="ph ph--photo top-story-thumb">
                  <img
                    src={resolveArticleImage(story.photoUrl, story.slug)}
                    alt={story.title[lang]}
                    loading="lazy"
                  />
                </div>
              </a>
            ))}
          </aside>
        </section>

        {/* Latest */}
        <section
          aria-labelledby="latest"
          className="home-section"
          style={{ padding: '40px 0', borderBottom: '1px solid #E5E5E5' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              borderBottom: '2px solid #111',
              paddingBottom: 10,
              marginBottom: 24,
            }}
          >
            <h2
              id="latest"
              style={{
                margin: 0,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              {t.home.latest}
            </h2>
            <a href="/category" onClick={handleOpenAll} style={{ fontSize: 13, fontWeight: 600, color: ACCENT }}>
              {t.home.viewAll}
            </a>
          </div>
          <div
            className="home-latest-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
              gap: 32,
            }}
          >
            {latestStories.map((story) => (
              <article key={story.slug}>
                <a
                  href={`/article/${story.slug}`}
                  onClick={handleOpenArticle(story.slug)}
                  className="story-card"
                  style={{ display: 'block' }}
                >
                  <div className="ph ph--photo" style={{ aspectRatio: '3 / 2' }}>
                    <img
                      src={resolveArticleImage(story.photoUrl, story.slug)}
                      alt={story.title[lang]}
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
                    {getCategoryBySlug(story.category)?.label[lang] ?? story.kicker[lang]}
                  </p>
                  <h3
                    className="story-title"
                    style={{
                      margin: 0,
                      fontFamily: 'Newsreader, Georgia, serif',
                      fontSize: 23,
                      lineHeight: 1.2,
                      fontWeight: 500,
                    }}
                  >
                    {story.title[lang]}
                  </h3>
                  <p style={{ margin: '10px 0 0', fontSize: 15, lineHeight: 1.5, color: '#444' }}>
                    {story.deck[lang]}
                  </p>
                  <p style={{ margin: '10px 0 0', fontSize: 12, color: '#666' }}>
                    <span style={{ fontWeight: 600, color: '#222' }}>{story.author[lang]}</span>
                    {' · '}
                    {story.date[lang]}
                  </p>
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* Feature band */}
        <section aria-labelledby="feature" className="long-read-band">
          <a
            href={`/article/${longReadStory.slug}`}
            onClick={handleOpenArticle(longReadStory.slug)}
            className="ph ph--photo"
            style={{ flex: '999 1 520px', minWidth: 0, aspectRatio: '21 / 9', display: 'block' }}
          >
            <img
              src={resolveArticleImage(longReadStory.photoUrl, longReadStory.slug)}
              alt={longReadStory.title[lang]}
              loading="lazy"
            />
          </a>
          <div style={{ flex: '1 1 340px', minWidth: 0 }}>
            <p
              style={{
                margin: '0 0 10px',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#8AB4FF',
              }}
            >
              {t.home.longRead}
            </p>
            <h2
              id="feature"
              className="feature-title"
              style={{
                margin: 0,
                fontFamily: 'Newsreader, Georgia, serif',
                fontSize: 36,
                lineHeight: 1.12,
                fontWeight: 500,
              }}
            >
              <a
                href={`/article/${longReadStory.slug}`}
                onClick={handleOpenArticle(longReadStory.slug)}
              >
                {longReadStory.title[lang]}
              </a>
            </h2>
            <p
              className="home-longread-deck"
              style={{
                margin: '14px 0 0',
                fontFamily: 'Newsreader, Georgia, serif',
                fontSize: 19,
                lineHeight: 1.5,
                color: '#D7E0EC',
              }}
            >
              {longReadStory.deck[lang]}
            </p>
            <p style={{ margin: '16px 0 0', fontSize: 13, color: '#9FB1C8' }}>
              {t.home.byWord}{' '}
              <span style={{ color: '#fff', fontWeight: 600 }}>{longReadStory.author[lang]}</span>{' '}
              &nbsp;·&nbsp; {longReadStory.readTime[lang]}
            </p>
          </div>
        </section>

        {/* Opinion + Tools */}
        <section
          className="home-section home-opinion-section"
          style={{
            padding: '40px 0',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 48,
            borderBottom: '1px solid #E5E5E5',
          }}
        >
          <div style={{ flex: '999 1 560px', minWidth: 0 }}>
            <h2
              style={{
                margin: '0 0 8px',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                borderBottom: '2px solid #111',
                paddingBottom: 10,
              }}
            >
              {t.nav.opinion}
            </h2>
            <div
              className="home-opinion-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
                gap: 28,
                paddingTop: 16,
              }}
            >
              {opinionStories.map((story) => {
                const initials = story.author[lang]
                  .split(/\s+/)
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((w) => w[0]?.toUpperCase() ?? '')
                  .join('');
                return (
                  <a
                    key={story.slug}
                    href={`/article/${story.slug}`}
                    onClick={handleOpenArticle(story.slug)}
                    className="story-card opinion-card"
                  >
                    <p
                      className="story-title"
                      style={{
                        margin: 0,
                        fontFamily: 'Newsreader, Georgia, serif',
                        fontStyle: 'italic',
                        fontSize: 22,
                        lineHeight: 1.3,
                      }}
                    >
                      {story.title[lang]}
                    </p>
                    <p
                      style={{
                        margin: '10px 0 0',
                        fontSize: 14,
                        lineHeight: 1.5,
                        color: '#444',
                      }}
                    >
                      {story.deck[lang]}
                    </p>
                    <div
                      style={{
                        marginTop: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          background: '#F4F6FA',
                          border: '1px solid #D9E2F2',
                          color: ACCENT,
                          fontSize: 10,
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flex: 'none',
                        }}
                      >
                        {initials || 'CT'}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>
                        {story.author[lang]}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
          <aside aria-labelledby="tools" style={{ flex: '1 1 320px', minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                borderBottom: '2px solid #111',
                paddingBottom: 10,
                marginBottom: 24,
              }}
            >
              <h2
                id="tools"
                style={{
                  margin: 0,
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                {t.home.civicTools}
              </h2>
              <a
                href="/civictools"
                onClick={handleOpenCivicTools}
                style={{ fontSize: 12, fontWeight: 600, color: ACCENT }}
              >
                {DIRECTORY_ENTRIES.length} {lang === 'en' ? 'entries →' : 'nakalista →'}
              </a>
            </div>
            <ul className="civic-tools-panel" style={{ listStyle: 'none', margin: 0 }}>
              {featuredTools.map((entry, idx) => (
                <li
                  key={entry.slug}
                  className={idx >= 2 ? 'civic-tool-mobile-only' : undefined}
                  style={{ borderBottom: '1px solid #E5E5E5' }}
                >
                  <a
                    href={entry.website || '/civictools'}
                    target={entry.website ? '_blank' : undefined}
                    rel={entry.website ? 'noreferrer' : undefined}
                    style={{
                      display: 'block',
                      padding: '14px 0',
                    }}
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
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        lineHeight: 1.45,
                        color: '#555',
                      }}
                    >
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
                  onClick={handleOpenCivicTools}
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
          </aside>
        </section>

        <NewsletterBand lang={lang} />
      </main>

      <Footer
        lang={lang}
        onBackHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onOpenCivicTools={onOpenCivicTools}
        onOpenSubmit={onOpenSubmit}
        onOpenInfo={onOpenInfo}
      />
    </div>
  );
}
