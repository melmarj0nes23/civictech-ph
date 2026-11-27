import { useEffect, useState, type MouseEvent } from 'react';
import { Footer } from '../components/Footer';
import { NewsletterBand } from '../components/NewsletterBand';
import { SiteHeader } from '../components/SiteHeader';
import {
  ARTICLES,
  getArticleBySlug,
  getArticlePhoto,
  type CategorySlug,
} from '../data/articles';
import {
  mapD1RowToArticle,
  readCachedD1Articles,
  type CachedArticleItem,
  type D1ApiArticle,
} from '../data/articlesCache';
import { TRANSLATIONS, type Lang } from '../data/i18n';
import type { InfoPageSlug } from '../data/infoPages';

const ACCENT = '#0B3D91';

interface ArticlePageProps {
  articleSlug: string;
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  onBackHome: () => void;
  onOpenCivicTools: () => void;
  onOpenSubmit: (hash?: string) => void;
  onOpenCategory: (slug: CategorySlug) => void;
  onOpenArticle: (slug: string) => void;
  onOpenInfo: (slug: InfoPageSlug) => void;
}

export function ArticlePage({
  articleSlug,
  lang,
  onLangChange,
  onBackHome,
  onOpenCivicTools,
  onOpenSubmit,
  onOpenCategory,
  onOpenArticle,
  onOpenInfo,
}: ArticlePageProps) {
  const t = TRANSLATIONS[lang];
  const staticArticle = getArticleBySlug(articleSlug);
  const [d1Article, setD1Article] = useState<CachedArticleItem | null>(
    () => readCachedD1Articles()?.find((a) => a.slug === articleSlug) ?? null
  );
  const [readProgress, setReadProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setD1Article(readCachedD1Articles()?.find((a) => a.slug === articleSlug) ?? null);
    fetch(`/api/articles?slug=${encodeURIComponent(articleSlug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { ok?: boolean; article?: D1ApiArticle | null } | null) => {
        const a = data?.article;
        if (!a) return;
        setD1Article(mapD1RowToArticle(a));
      })
      .catch(() => {
        // ignore in local Vite dev
      });
  }, [articleSlug]);

  const article: CachedArticleItem = d1Article ?? staticArticle;

  useEffect(() => {
    if (d1Article) {
      document.title = `${d1Article.title[lang]} — Civic Tech`;
    }
  }, [d1Article, lang]);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const total = doc.scrollHeight - window.innerHeight;
      if (total <= 0) {
        setReadProgress(0);
        return;
      }
      setReadProgress(Math.min(100, Math.max(0, (scrollTop / total) * 100)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [articleSlug]);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleShareFb = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareX = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(article.title[lang]);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'noopener,noreferrer');
  };
  const isLead = article.slug === 'volunteers-national-budget';
  const otherArticles = ARTICLES.filter((a) => a.slug !== article.slug);
  const sameCategory = otherArticles.filter((a) => a.category === article.category);
  const diffCategory = otherArticles.filter((a) => a.category !== article.category);
  const relatedStories = [...sameCategory, ...diffCategory].slice(0, 3);
  const authorInitials = article.author[lang]
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  const handleOpenCivicTools = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenCivicTools();
  };

  const handleArticleClick = (slug: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenArticle(slug);
  };

  const firstPara = article.body[lang][0] ?? '';
  const dropCap = firstPara.charAt(0);
  const firstParaRest = firstPara.slice(1);

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#111', background: '#fff' }}>
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: `${readProgress}%`,
          height: 3,
          background: ACCENT,
          zIndex: 1050,
          transition: 'width 80ms linear',
          pointerEvents: 'none',
        }}
      />
      <SiteHeader
        lang={lang}
        onLangChange={onLangChange}
        onBackHome={onBackHome}
        onOpenCategory={onOpenCategory}
        onOpenCivicTools={onOpenCivicTools}
        activeCategory={article.category}
      />

      <article>
        {/* GovInsider-style centered 960px header + 16:9 hero */}
        <div style={{ maxWidth: 1020, margin: '0 auto', padding: '36px 24px 0' }}>
          <p
            style={{
              margin: '0 0 14px',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: ACCENT,
            }}
          >
            {article.kicker[lang]}
          </p>
          <h1
            className="article-title"
            style={{
              margin: 0,
              fontFamily: 'Newsreader, Georgia, serif',
              fontWeight: 600,
              fontSize: 50,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              color: '#111',
            }}
          >
            {article.title[lang]}
          </h1>

          {/* Byline + Date + Share */}
          <div
            style={{
              margin: '22px 0 0',
              padding: '14px 0',
              borderTop: '1px solid #E5E5E5',
              borderBottom: '1px solid #E5E5E5',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px 20px',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px 12px',
                alignItems: 'center',
                fontSize: 14,
                color: '#555',
              }}
            >
              <span>
                {t.home.byWord}{' '}
                <span style={{ color: ACCENT, fontWeight: 600 }}>{article.author[lang]}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>{article.date[lang]}</span>
              <span aria-hidden="true">·</span>
              <span>{article.readTime[lang]}</span>
            </div>

            <div aria-label="Share" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                type="button"
                aria-label={t.article.shareFb}
                onClick={handleShareFb}
                style={{
                  width: 34,
                  height: 34,
                  border: '1px solid #DADADA',
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#111',
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  aria-hidden="true"
                >
                  <path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6.5v3.5H9V21h3.5v-7.5H15l.5-3.5h-3V7a1 1 0 0 1 1-1H15z" />
                </svg>
              </button>
              <button
                type="button"
                aria-label={t.article.shareX}
                onClick={handleShareX}
                style={{
                  width: 34,
                  height: 34,
                  border: '1px solid #DADADA',
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#111',
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M4 4l16 16M20 4L4 20" />
                </svg>
              </button>
              <button
                type="button"
                aria-label={t.article.shareCopy}
                onClick={handleCopyLink}
                title={copied ? (lang === 'en' ? 'Link copied' : 'Nakopya ang link') : t.article.shareCopy}
                style={{
                  width: 34,
                  height: 34,
                  border: `1px solid ${copied ? ACCENT : '#DADADA'}`,
                  background: copied ? '#F4F6FA' : '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: copied ? ACCENT : '#111',
                }}
              >
                {copied ? (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    aria-hidden="true"
                  >
                    <path d="M10 14a4 4 0 0 0 5.6 0l3-3a4 4 0 0 0-5.6-5.6l-1 1" />
                    <path d="M14 10a4 4 0 0 0-5.6 0l-3 3a4 4 0 0 0 5.6 5.6l1-1" />
                  </svg>
                )}
              </button>
              {copied && (
                <span role="status" style={{ fontSize: 12, fontWeight: 600, color: ACCENT }}>
                  {lang === 'en' ? 'Copied' : 'Nakopya'}
                </span>
              )}
            </div>
          </div>

          {/* Bold sans-serif deck above hero */}
          <p
            className="article-deck"
            style={{
              margin: '22px 0 0',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 18,
              fontWeight: 600,
              lineHeight: 1.5,
              color: '#111',
            }}
          >
            {article.deck[lang]}
          </p>

          {/* 16:9 Hero photo */}
          <figure style={{ margin: '28px 0 0' }}>
            <div className="ph ph--photo" style={{ aspectRatio: '16 / 9', width: '100%' }}>
              <img src={article.photoUrl || getArticlePhoto(article.slug)} alt={article.photoLabel[lang]} />
            </div>
            {(isLead || article.photoLabel[lang]) && (
              <figcaption
                style={{
                  marginTop: 12,
                  paddingLeft: 12,
                  borderLeft: `2px solid ${ACCENT}`,
                  fontSize: 13,
                  fontStyle: 'italic',
                  lineHeight: 1.5,
                  color: '#555',
                }}
              >
                {isLead ? t.article.heroCaption : article.photoLabel[lang]}
              </figcaption>
            )}
          </figure>
        </div>

        {/* Reading column aligned to hero image width (960px) */}
        <div style={{ maxWidth: 1020, margin: '0 auto', padding: '36px 24px 0' }}>
          <div
            className="body"
            style={{
              fontFamily: 'Newsreader, Georgia, serif',
              fontSize: 20,
              lineHeight: 1.68,
              color: '#1A1A1A',
            }}
          >
            <p>
              <span
                className="article-dropcap"
                style={{
                  float: 'left',
                  fontSize: 76,
                  lineHeight: 0.85,
                  fontWeight: 600,
                  padding: '8px 10px 0 0',
                  color: ACCENT,
                }}
              >
                {dropCap}
              </span>
              {firstParaRest}
            </p>
            {article.body[lang].slice(1).map((para, i) => (
              <p key={i}>{para}</p>
            ))}

            {article.quote && (
              <blockquote
                style={{
                  margin: '40px 0',
                  padding: '28px 0',
                  borderTop: '2px solid #111',
                  borderBottom: '1px solid #E5E5E5',
                }}
              >
                <p
                  className="article-quote"
                  style={{
                    margin: 0,
                    fontSize: 30,
                    lineHeight: 1.3,
                    fontStyle: 'italic',
                    fontWeight: 500,
                  }}
                >
                  {article.quote.text[lang]}
                </p>
                <footer
                  style={{
                    marginTop: 14,
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 14,
                    color: '#555',
                    fontStyle: 'normal',
                  }}
                >
                  {article.quote.source[lang]}
                </footer>
              </blockquote>
            )}

            {isLead && (
              <>
                <h2 style={{ margin: '0 0 16px', fontSize: 30, lineHeight: 1.2, fontWeight: 600 }}>
                  {t.article.subhead}
                </h2>
                <p>{t.article.p4}</p>

                <figure style={{ margin: '36px 0' }}>
                  <div className="ph ph--photo" style={{ aspectRatio: '3 / 2' }}>
                    <img src="/images/election-observers.jpg" alt={t.article.inlinePhoto} loading="lazy" />
                  </div>
                  <figcaption
                    style={{
                      marginTop: 10,
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 13,
                      lineHeight: 1.5,
                      color: '#555',
                    }}
                  >
                    {t.article.inlineCaption}{' '}
                    <span style={{ color: '#777' }}>
                      {t.article.heroCreditPrefix} {t.home.photographerPlaceholder}
                    </span>
                  </figcaption>
                </figure>

                <p>{t.article.p5}</p>
              </>
            )}

            <div
              style={{
                margin: '40px 0 0',
                padding: 24,
                background: '#F4F6FA',
                borderLeft: `3px solid ${ACCENT}`,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <p
                style={{
                  margin: '0 0 6px',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: ACCENT,
                }}
              >
                {isLead || article.category === 'budget'
                  ? t.article.exploreEyebrow
                  : lang === 'en'
                    ? 'Civic Tech & CSO Directory'
                    : 'Direktoryo ng Civic Tech at CSO'}
              </p>
              <p style={{ margin: '0 0 16px', fontSize: 16, lineHeight: 1.5, color: '#222' }}>
                {isLead || article.category === 'budget'
                  ? t.article.exploreDesc
                  : lang === 'en'
                    ? 'Explore 217 civic technology projects and civil society organizations across the Philippines.'
                    : 'Tuklasin ang 217 proyekto ng civic technology at mga CSO sa buong Pilipinas.'}
              </p>
              <a
                href="/civictools"
                onClick={handleOpenCivicTools}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  minHeight: 44,
                  padding: '0 18px',
                  background: '#111',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {isLead || article.category === 'budget'
                  ? t.article.exploreCta
                  : lang === 'en'
                    ? 'Browse the directory →'
                    : 'Tingnan ang direktoryo →'}
              </a>
            </div>

            {/* Author box */}
            <div
              style={{
                margin: '40px 0 0',
                padding: '24px 0 0',
                borderTop: '1px solid #E5E5E5',
                display: 'flex',
                gap: 16,
                alignItems: 'center',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: '#F4F6FA',
                  border: '1px solid #D9E2F2',
                  color: ACCENT,
                  fontSize: 15,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 'none',
                }}
              >
                {authorInitials || 'CT'}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>{article.author[lang]}</p>
                <p style={{ margin: '4px 0 0', fontSize: 14, lineHeight: 1.5, color: '#555' }}>
                  {article.authorBio ||
                    (lang === 'en'
                      ? 'Independent reporting on open data, digital government, and civic technology in the Philippines.'
                      : 'Malayang pag-uulat tungkol sa open data, digital na gobyerno, at civic technology sa Pilipinas.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related stories grid (3 articles) */}
      <section
        aria-labelledby="related"
        style={{
          maxWidth: 1020,
          margin: '48px auto 0',
          padding: '40px 24px 0',
          borderTop: '1px solid #E5E5E5',
        }}
      >
        <h2
          id="related"
          style={{
            margin: '0 0 24px',
            fontFamily: 'Newsreader, Georgia, serif',
            fontSize: 26,
            fontWeight: 500,
            paddingBottom: 10,
            borderBottom: `2px solid ${ACCENT}`,
            display: 'inline-block',
          }}
        >
          {t.article.related}
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: 28,
          }}
        >
          {relatedStories.map((story) => (
            <a
              key={story.slug}
              href={`/article/${story.slug}`}
              onClick={handleArticleClick(story.slug)}
              className="story-card"
              style={{ display: 'block' }}
            >
              <div className="ph ph--photo" style={{ aspectRatio: '16 / 9' }}>
                <img src={getArticlePhoto(story.slug)} alt={story.photoLabel[lang]} loading="lazy" />
              </div>
              <p
                style={{
                  margin: '12px 0 6px',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: ACCENT,
                }}
              >
                {story.kicker[lang]}
              </p>
              <p
                className="story-title"
                style={{
                  margin: 0,
                  fontFamily: 'Newsreader, Georgia, serif',
                  fontSize: 20,
                  lineHeight: 1.25,
                  fontWeight: 500,
                }}
              >
                {story.title[lang]}
              </p>
              <p style={{ margin: '8px 0 0', fontSize: 12, color: '#666' }}>{story.date[lang]}</p>
            </a>
          ))}
        </div>
      </section>

      <div style={{ maxWidth: 1380, margin: '0 auto', padding: '0 24px' }}>
        <NewsletterBand lang={lang} />
      </div>

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
