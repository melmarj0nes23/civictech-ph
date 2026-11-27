import type { MouseEvent } from 'react';
import { Footer } from '../components/Footer';
import { SiteHeader } from '../components/SiteHeader';
import {
  ARTICLES,
  getArticleBySlug,
  getArticlePhoto,
  type CategorySlug,
} from '../data/articles';
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
  const article = getArticleBySlug(articleSlug);
  const isLead = article.slug === 'volunteers-national-budget';
  const relatedStories = ARTICLES.filter(
    (a) => a.slug !== article.slug && a.slug !== 'volunteers-national-budget'
  ).slice(0, 3);
  const moreStories = ARTICLES.filter((a) => a.slug !== article.slug).slice(3, 6);

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
      <SiteHeader
        lang={lang}
        onLangChange={onLangChange}
        onBackHome={onBackHome}
        onOpenCategory={onOpenCategory}
        onOpenCivicTools={onOpenCivicTools}
        activeCategory={article.category}
      />

      <article>
        {/* Headline block */}
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '56px 24px 32px', textAlign: 'center' }}>
          <p
            style={{
              margin: '0 0 16px',
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
              fontWeight: 500,
              fontSize: 58,
              lineHeight: 1.06,
              letterSpacing: '-0.02em',
            }}
          >
            {article.title[lang]}
          </h1>
          <p
            className="article-deck"
            style={{
              margin: '20px auto 0',
              maxWidth: 680,
              fontFamily: 'Newsreader, Georgia, serif',
              fontSize: 22,
              lineHeight: 1.45,
              color: '#333',
            }}
          >
            {article.deck[lang]}
          </p>
          <div
            style={{
              margin: '28px 0 0',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px 20px',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 14,
              color: '#555',
            }}
          >
            <span>
              {t.home.byWord}{' '}
              <span style={{ color: '#111', fontWeight: 600 }}>{article.author[lang]}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>{article.date[lang]}</span>
            <span aria-hidden="true">·</span>
            <span>{article.readTime[lang]}</span>
          </div>
        </div>

        {/* Hero photo */}
        <figure style={{ maxWidth: 1240, margin: '0 auto', padding: '0 24px' }}>
          <div
            className="ph ph--photo"
            style={{ aspectRatio: '16 / 8', width: '100%' }}
          >
            <img src={getArticlePhoto(article.slug)} alt={article.photoLabel[lang]} />
          </div>
          <figcaption style={{ marginTop: 10, fontSize: 13, lineHeight: 1.5, color: '#555' }}>
            {t.article.heroCaption}{' '}
            <span style={{ color: '#777' }}>
              {t.article.heroCreditPrefix} {t.home.photographerPlaceholder} {t.article.heroCreditSuffix}
            </span>
          </figcaption>
        </figure>

        {/* Body + rail */}
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            padding: '48px 24px 0',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '32px 56px',
            justifyContent: 'center',
          }}
        >
          <aside aria-label="Share" className="share-rail">
            <button
              type="button"
              aria-label={t.article.shareFb}
              style={{
                width: 44,
                height: 44,
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
                width="18"
                height="18"
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
              style={{
                width: 44,
                height: 44,
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
                width="16"
                height="16"
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
              onClick={() => navigator.clipboard?.writeText(window.location.href)}
              style={{
                width: 44,
                height: 44,
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
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M10 14a4 4 0 0 0 5.6 0l3-3a4 4 0 0 0-5.6-5.6l-1 1" />
                <path d="M14 10a4 4 0 0 0-5.6 0l-3 3a4 4 0 0 0 5.6 5.6l1-1" />
              </svg>
            </button>
          </aside>

          <div
            className="body"
            style={{
              flex: '0 1 680px',
              minWidth: 0,
              fontFamily: 'Newsreader, Georgia, serif',
              fontSize: 20,
              lineHeight: 1.65,
              color: '#1A1A1A',
            }}
          >
            <p>
              <span
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
                {t.article.exploreEyebrow}
              </p>
              <p style={{ margin: '0 0 16px', fontSize: 16, lineHeight: 1.5, color: '#222' }}>
                {t.article.exploreDesc}
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
                {t.article.exploreCta}
              </a>
            </div>
          </div>

          <aside aria-labelledby="related" style={{ flex: '0 1 300px', minWidth: 0 }}>
            <h2
              id="related"
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
              {t.article.related}
            </h2>
            {relatedStories.map((story, idx) => (
              <a
                key={story.slug}
                href={`/article/${story.slug}`}
                onClick={handleArticleClick(story.slug)}
                style={{
                  display: 'block',
                  padding: '16px 0',
                  borderBottom: idx < relatedStories.length - 1 ? '1px solid #E5E5E5' : 'none',
                }}
              >
                {idx === 0 && (
                  <div className="ph ph--photo" style={{ aspectRatio: '3 / 2', marginBottom: 12 }}>
                    <img src={getArticlePhoto(story.slug)} alt={story.photoLabel[lang]} loading="lazy" />
                  </div>
                )}
                <p
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
              </a>
            ))}
          </aside>
        </div>

        {/* Author box */}
        <div
          style={{
            maxWidth: 680,
            margin: '48px auto 0',
            padding: '28px 24px',
            borderTop: '1px solid #E5E5E5',
            display: 'flex',
            gap: 20,
            alignItems: 'center',
          }}
        >
          <div
            className="ph ph--photo"
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              flex: 'none',
            }}
          >
            <img src="/images/election-observers.jpg" alt={article.author[lang]} loading="lazy" />
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>{article.author[lang]}</p>
            <p style={{ margin: '4px 0 0', fontSize: 14, lineHeight: 1.5, color: '#555' }}>
              {t.article.authorBio}
            </p>
          </div>
        </div>
      </article>

      {/* More from Civic Tech */}
      <section
        aria-labelledby="more"
        style={{
          maxWidth: 1240,
          margin: '40px auto 0',
          padding: '40px 24px 56px',
          borderTop: '1px solid #111',
        }}
      >
        <h2
          id="more"
          style={{
            margin: '0 0 24px',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          {t.article.moreHeading}
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: 32,
          }}
        >
          {moreStories.map((story) => (
            <a
              key={story.slug}
              href={`/article/${story.slug}`}
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
              <p
                style={{
                  margin: 0,
                  fontFamily: 'Newsreader, Georgia, serif',
                  fontSize: 22,
                  lineHeight: 1.2,
                  fontWeight: 500,
                }}
              >
                {story.title[lang]}
              </p>
            </a>
          ))}
        </div>
      </section>

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
