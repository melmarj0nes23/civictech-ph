import type { MouseEvent } from 'react';
import { TRANSLATIONS, type Lang } from '../data/i18n';

const ACCENT = '#0B3D91';

interface ArticlePageProps {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  onBackHome: () => void;
  onOpenCivicTools: () => void;
}

export function ArticlePage({
  lang,
  onLangChange,
  onBackHome,
  onOpenCivicTools,
}: ArticlePageProps) {
  const t = TRANSLATIONS[lang];

  const handleBackHome = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onBackHome();
  };

  const handleOpenCivicTools = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenCivicTools();
  };

  const handleSwitchLang = (next: Lang) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onLangChange(next);
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#111', background: '#fff' }}>
      {/* Compact header */}
      <header style={{ borderBottom: '1px solid #E5E5E5' }}>
        <div className="compact-header-inner">
          <div className="compact-brand">
            <a
              href="/"
              onClick={handleBackHome}
              style={{
                display: 'inline-flex',
                alignItems: 'baseline',
                gap: 8,
                fontFamily: 'Newsreader, Georgia, serif',
                fontSize: 32,
                fontWeight: 600,
                letterSpacing: '-0.01em',
              }}
            >
              <img
                src="/logo.png"
                alt="Civic Tech logo"
                style={{ height: 28, width: 'auto', display: 'block', alignSelf: 'center' }}
              />
              Civic Tech
            </a>
            <span
              style={{
                fontSize: 11,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#555',
              }}
            >
              {t.byPrefix}{' '}
              <a
                href="https://bettergov.ph"
                target="_blank"
                rel="noreferrer"
                style={{ color: ACCENT, fontWeight: 600 }}
              >
                BetterGov.ph
              </a>
            </span>
          </div>
          <nav aria-label="Sections" className="compact-nav">
            <a href="/" onClick={handleBackHome} style={{ padding: '12px 0' }}>
              {t.nav.openData}
            </a>
            <a href="/" onClick={handleBackHome} style={{ padding: '12px 0' }}>
              {t.nav.budget}
            </a>
            <a href="/" onClick={handleBackHome} style={{ padding: '12px 0' }}>
              {t.nav.elections}
            </a>
            <a href="/" onClick={handleBackHome} style={{ padding: '12px 0' }}>
              {t.nav.policy}
            </a>
            <a href="/" onClick={handleBackHome} style={{ padding: '12px 0' }}>
              {t.nav.tools}
            </a>
            <a href="/" onClick={handleBackHome} style={{ padding: '12px 0' }}>
              {t.nav.opinion}
            </a>
          </nav>
          <div className="compact-actions" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <a
              href="/article"
              onClick={handleSwitchLang(lang === 'en' ? 'fil' : 'en')}
              style={{ fontSize: 13, color: '#555', fontWeight: 500 }}
            >
              {lang === 'en' ? 'FIL' : 'EN'}
            </a>
            <a href="/" onClick={handleBackHome} className="compact-subscribe">
              {t.subscribe}
            </a>
          </div>
        </div>
      </header>

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
            {t.article.kicker}
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
            {t.home.leadTitle}
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
            {t.home.leadDeck}
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
              <span style={{ color: '#111', fontWeight: 600 }}>{t.home.authorPlaceholder}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>{t.article.date}</span>
            <span aria-hidden="true">·</span>
            <span>{t.home.leadReadTime}</span>
          </div>
        </div>

        {/* Hero photo */}
        <figure style={{ maxWidth: 1240, margin: '0 auto', padding: '0 24px' }}>
          <div
            className="ph"
            style={{ aspectRatio: '16 / 8', width: '100%', flexDirection: 'column', gap: 8 }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <rect x="3" y="6" width="18" height="14" rx="2" />
              <circle cx="12" cy="13" r="3.5" />
              <path d="M8 6l1.5-2h5L16 6" />
            </svg>
            <span>{t.article.heroPhoto}</span>
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
                {t.article.dropCapLetter}
              </span>
              {t.article.p1Rest}
            </p>
            <p>{t.article.p2}</p>
            <p>{t.article.p3}</p>

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
                {t.article.quote}
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
                {t.article.quoteSource}
              </footer>
            </blockquote>

            <h2 style={{ margin: '0 0 16px', fontSize: 30, lineHeight: 1.2, fontWeight: 600 }}>
              {t.article.subhead}
            </h2>
            <p>{t.article.p4}</p>

            <figure style={{ margin: '36px 0' }}>
              <div className="ph" style={{ aspectRatio: '3 / 2' }}>
                {t.article.inlinePhoto}
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
            <a
              href="/"
              onClick={handleBackHome}
              style={{ display: 'block', padding: '16px 0', borderBottom: '1px solid #E5E5E5' }}
            >
              <div className="ph" style={{ aspectRatio: '3 / 2', marginBottom: 12, fontSize: 11 }}>
                {t.home.photoShort}
              </div>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'Newsreader, Georgia, serif',
                  fontSize: 19,
                  lineHeight: 1.25,
                  fontWeight: 500,
                }}
              >
                {t.home.latest2Title}
              </p>
            </a>
            <a
              href="/"
              onClick={handleBackHome}
              style={{ display: 'block', padding: '16px 0', borderBottom: '1px solid #E5E5E5' }}
            >
              <p
                style={{
                  margin: 0,
                  fontFamily: 'Newsreader, Georgia, serif',
                  fontSize: 19,
                  lineHeight: 1.25,
                  fontWeight: 500,
                }}
              >
                {t.home.top2Title}
              </p>
            </a>
            <a href="/" onClick={handleBackHome} style={{ display: 'block', padding: '16px 0' }}>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'Newsreader, Georgia, serif',
                  fontSize: 19,
                  lineHeight: 1.25,
                  fontWeight: 500,
                }}
              >
                {t.home.opinion1}
              </p>
            </a>
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
            className="ph"
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              flex: 'none',
              fontSize: 10,
              padding: 0,
            }}
          >
            {t.home.photoShort}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>{t.home.authorPlaceholder}</p>
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
          <a href="/" onClick={handleBackHome} style={{ display: 'block' }}>
            <div className="ph" style={{ aspectRatio: '3 / 2' }}>
              {t.home.latest1Photo}
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
              {t.nav.openData}
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
              {t.home.latest1Title}
            </p>
          </a>
          <a href="/" onClick={handleBackHome} style={{ display: 'block' }}>
            <div className="ph" style={{ aspectRatio: '3 / 2' }}>
              {t.home.latest3Photo}
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
              {t.nav.community}
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
              {t.home.latest3Title}
            </p>
          </a>
          <a href="/" onClick={handleBackHome} style={{ display: 'block' }}>
            <div className="ph" style={{ aspectRatio: '3 / 2' }}>
              {t.home.latest4Photo}
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
              {t.nav.digitalServices}
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
              {t.home.latest4Title}
            </p>
          </a>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid #E5E5E5' }}>
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            padding: 24,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            justifyContent: 'space-between',
            fontSize: 13,
            color: '#555',
          }}
        >
          <span>{t.article.footerText}</span>
          <span>
            <a href="/" onClick={handleBackHome} style={{ color: '#555' }}>
              {t.footer.editorialStandards}
            </a>{' '}
            &nbsp;·&nbsp;{' '}
            <a href="/" onClick={handleBackHome} style={{ color: '#555' }}>
              {t.footer.corrections}
            </a>{' '}
            &nbsp;·&nbsp;{' '}
            <a href="/" onClick={handleBackHome} style={{ color: '#555' }}>
              {t.article.sendTip}
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
