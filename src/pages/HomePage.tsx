import type { MouseEvent } from 'react';
import { Footer } from '../components/Footer';
import { CATEGORIES, type CategorySlug } from '../data/articles';
import { TRANSLATIONS, type Lang } from '../data/i18n';
import type { InfoPageSlug } from '../data/infoPages';

const ACCENT = '#0B3D91';

interface HomePageProps {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  onOpenArticle: (slug: string) => void;
  onOpenCategory: (slug: CategorySlug) => void;
  onOpenCivicTools: () => void;
  onOpenSubmit: (hash?: string) => void;
  onOpenInfo: (slug: InfoPageSlug) => void;
}

export function HomePage({
  lang,
  onLangChange,
  onOpenArticle,
  onOpenCategory,
  onOpenCivicTools,
  onOpenSubmit,
  onOpenInfo,
}: HomePageProps) {
  const t = TRANSLATIONS[lang];

  const handleOpenArticle = (slug: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenArticle(slug);
  };

  const handleOpenCategory =
    (slug: CategorySlug) => (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      onOpenCategory(slug);
    };

  const handleOpenCivicTools = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenCivicTools();
  };

  const handleScrollNewsletter = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStayHome = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
  };

  const handleSwitchLang = (next: Lang) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onLangChange(next);
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#111', background: '#fff' }}>
      {/* Utility bar */}
      <div style={{ borderBottom: '1px solid #E5E5E5' }}>
        <div className="utility-bar-inner">
          <span className="utility-date">{t.dateLabel}</span>
          <div className="utility-actions">
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <a
                href="/"
                onClick={handleSwitchLang('en')}
                aria-current={lang === 'en' ? 'true' : undefined}
                style={{
                  color: lang === 'en' ? '#111' : '#555',
                  fontWeight: lang === 'en' ? 600 : 400,
                }}
              >
                {t.english}
              </a>
              <a
                href="/"
                onClick={handleSwitchLang('fil')}
                aria-current={lang === 'fil' ? 'true' : undefined}
                style={{
                  color: lang === 'fil' ? '#111' : '#555',
                  fontWeight: lang === 'fil' ? 600 : 400,
                }}
              >
                {t.filipino}
              </a>
              <a href="/" onClick={handleStayHome} style={{ color: '#555' }}>
                {t.signIn}
              </a>
            </div>
            <a
              href="/newsletter"
              onClick={handleScrollNewsletter}
              style={{
                background: '#0B3D91',
                color: '#fff',
                padding: '10px 16px',
                fontWeight: 600,
                fontSize: 13,
                minHeight: 44,
                boxSizing: 'border-box',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              {t.subscribe}
            </a>
          </div>
        </div>
      </div>

      {/* Masthead */}
      <header
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: '40px 24px 28px',
          textAlign: 'center',
        }}
      >
        <p className="masthead-date">{t.dateLabel}</p>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
          }}
        >
          <img
            src="/logo.png"
            alt="Civic Tech logo"
            className="masthead-logo"
            style={{ height: 64, width: 'auto', display: 'block' }}
          />
          <h1
            className="masthead-title"
            style={{
              margin: 0,
              fontFamily: 'Newsreader, Georgia, serif',
              fontWeight: 600,
              fontSize: 84,
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            Civic Tech
          </h1>
        </div>
        <p
          style={{
            margin: '14px 0 0',
            fontSize: 13,
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
          </a>{' '}
          &nbsp;·&nbsp; {t.taglineSuffix}
        </p>
      </header>

      {/* Section nav */}
      <nav
        aria-label="Sections"
        style={{ borderTop: '1px solid #111', borderBottom: '1px solid #E5E5E5' }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '4px 28px',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {CATEGORIES.map((cat) => (
            <a
              key={cat.slug}
              href={`/category/${cat.slug}`}
              onClick={handleOpenCategory(cat.slug)}
              style={{ padding: '14px 0' }}
            >
              {cat.label[lang]}
            </a>
          ))}
        </div>
      </nav>

      <main style={{ maxWidth: 1240, margin: '0 auto', padding: '36px 24px 0' }}>
        {/* Lead + rail */}
        <section
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 40,
            paddingBottom: 40,
            borderBottom: '1px solid #E5E5E5',
          }}
        >
          <article style={{ flex: '999 1 560px', minWidth: 0 }}>
            <a
              href="/article"
              onClick={handleOpenArticle('volunteers-national-budget')}
              style={{ display: 'block' }}
            >
              <div
                className="ph"
                style={{
                  aspectRatio: '16 / 9',
                  width: '100%',
                  flexDirection: 'column',
                  gap: 8,
                }}
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
                <span>{t.home.leadPhoto}</span>
              </div>
            </a>
            <p
              style={{
                margin: '20px 0 8px',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: ACCENT,
              }}
            >
              {t.nav.openData}
            </p>
            <h2
              className="hero-title"
              style={{
                margin: 0,
                fontFamily: 'Newsreader, Georgia, serif',
                fontWeight: 500,
                fontSize: 46,
                lineHeight: 1.08,
                letterSpacing: '-0.015em',
              }}
            >
              <a href="/article" onClick={handleOpenArticle('volunteers-national-budget')}>
                {t.home.leadTitle}
              </a>
            </h2>
            <p
              style={{
                margin: '14px 0 0',
                fontFamily: 'Newsreader, Georgia, serif',
                fontSize: 21,
                lineHeight: 1.45,
                color: '#333',
                maxWidth: 720,
              }}
            >
              {t.home.leadDeck}
            </p>
            <p style={{ margin: '16px 0 0', fontSize: 13, color: '#555' }}>
              {t.home.byWord}{' '}
              <span style={{ color: '#111', fontWeight: 600 }}>{t.home.authorPlaceholder}</span>{' '}
              &nbsp;·&nbsp; {t.home.leadReadTime}
            </p>
          </article>

          <aside
            aria-label={t.home.topStories}
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
                borderBottom: '2px solid #111',
                paddingBottom: 10,
              }}
            >
              {t.home.topStories}
            </p>
            <a
              href="/article/transparent-canvassing"
              onClick={handleOpenArticle('transparent-canvassing')}
              style={{
                display: 'flex',
                gap: 16,
                padding: '18px 0',
                borderBottom: '1px solid #E5E5E5',
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
                  {t.nav.elections}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'Newsreader, Georgia, serif',
                    fontSize: 20,
                    lineHeight: 1.25,
                    fontWeight: 500,
                  }}
                >
                  {t.home.top1Title}
                </p>
              </div>
              <div className="ph" style={{ width: 96, height: 96, flex: 'none', fontSize: 10 }}>
                {t.home.photoShort}
              </div>
            </a>
            <a
              href="/article/foi-explained"
              onClick={handleOpenArticle('foi-explained')}
              style={{
                display: 'flex',
                gap: 16,
                padding: '18px 0',
                borderBottom: '1px solid #E5E5E5',
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
                  {t.nav.policy}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'Newsreader, Georgia, serif',
                    fontSize: 20,
                    lineHeight: 1.25,
                    fontWeight: 500,
                  }}
                >
                  {t.home.top2Title}
                </p>
              </div>
              <div className="ph" style={{ width: 96, height: 96, flex: 'none', fontSize: 10 }}>
                {t.home.photoShort}
              </div>
            </a>
            <a
              href="/article/gov-ph-mobile"
              onClick={handleOpenArticle('gov-ph-mobile')}
              style={{
                display: 'flex',
                gap: 16,
                padding: '18px 0',
                borderBottom: '1px solid #E5E5E5',
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
                  {t.nav.digitalServices}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'Newsreader, Georgia, serif',
                    fontSize: 20,
                    lineHeight: 1.25,
                    fontWeight: 500,
                  }}
                >
                  {t.home.top3Title}
                </p>
              </div>
              <div className="ph" style={{ width: 96, height: 96, flex: 'none', fontSize: 10 }}>
                {t.home.photoShort}
              </div>
            </a>
            <a
              href="/article/spotting-scam-texts"
              onClick={handleOpenArticle('spotting-scam-texts')}
              style={{ display: 'flex', gap: 16, padding: '18px 0' }}
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
                  {t.nav.tools}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'Newsreader, Georgia, serif',
                    fontSize: 20,
                    lineHeight: 1.25,
                    fontWeight: 500,
                  }}
                >
                  {t.home.top4Title}
                </p>
              </div>
              <div className="ph" style={{ width: 96, height: 96, flex: 'none', fontSize: 10 }}>
                {t.home.photoShort}
              </div>
            </a>
          </aside>
        </section>

        {/* Latest */}
        <section
          aria-labelledby="latest"
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
            <a href="/" onClick={handleStayHome} style={{ fontSize: 13, color: '#555' }}>
              {t.home.viewAll}
            </a>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
              gap: 32,
            }}
          >
            <article>
              <a
                href="/article/mapping-public-transport"
                onClick={handleOpenArticle('mapping-public-transport')}
                style={{ display: 'block' }}
              >
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
                <h3
                  style={{
                    margin: 0,
                    fontFamily: 'Newsreader, Georgia, serif',
                    fontSize: 23,
                    lineHeight: 1.2,
                    fontWeight: 500,
                  }}
                >
                  {t.home.latest1Title}
                </h3>
                <p style={{ margin: '10px 0 0', fontSize: 15, lineHeight: 1.5, color: '#444' }}>
                  {t.home.latest1Deck}
                </p>
              </a>
            </article>
            <article>
              <a
                href="/article/reading-bicam-report"
                onClick={handleOpenArticle('reading-bicam-report')}
                style={{ display: 'block' }}
              >
                <div className="ph" style={{ aspectRatio: '3 / 2' }}>
                  {t.home.latest2Photo}
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
                  {t.nav.budget}
                </p>
                <h3
                  style={{
                    margin: 0,
                    fontFamily: 'Newsreader, Georgia, serif',
                    fontSize: 23,
                    lineHeight: 1.2,
                    fontWeight: 500,
                  }}
                >
                  {t.home.latest2Title}
                </h3>
                <p style={{ margin: '10px 0 0', fontSize: 15, lineHeight: 1.5, color: '#444' }}>
                  {t.home.latest2Deck}
                </p>
              </a>
            </article>
            <article>
              <a
                href="/article/barangay-procurement"
                onClick={handleOpenArticle('barangay-procurement')}
                style={{ display: 'block' }}
              >
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
                <h3
                  style={{
                    margin: 0,
                    fontFamily: 'Newsreader, Georgia, serif',
                    fontSize: 23,
                    lineHeight: 1.2,
                    fontWeight: 500,
                  }}
                >
                  {t.home.latest3Title}
                </h3>
                <p style={{ margin: '10px 0 0', fontSize: 15, lineHeight: 1.5, color: '#444' }}>
                  {t.home.latest3Deck}
                </p>
              </a>
            </article>
            <article>
              <a
                href="/article/one-login-gov"
                onClick={handleOpenArticle('one-login-gov')}
                style={{ display: 'block' }}
              >
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
                <h3
                  style={{
                    margin: 0,
                    fontFamily: 'Newsreader, Georgia, serif',
                    fontSize: 23,
                    lineHeight: 1.2,
                    fontWeight: 500,
                  }}
                >
                  {t.home.latest4Title}
                </h3>
                <p style={{ margin: '10px 0 0', fontSize: 15, lineHeight: 1.5, color: '#444' }}>
                  {t.home.latest4Deck}
                </p>
              </a>
            </article>
          </div>
        </section>

        {/* Feature band */}
        <section
          aria-labelledby="feature"
          style={{
            padding: '40px 0',
            borderBottom: '1px solid #E5E5E5',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 40,
            alignItems: 'center',
          }}
        >
          <div className="ph" style={{ flex: '999 1 560px', minWidth: 0, aspectRatio: '21 / 9' }}>
            {t.home.featurePhoto}
          </div>
          <div style={{ flex: '1 1 340px', minWidth: 0 }}>
            <p
              style={{
                margin: '0 0 10px',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: ACCENT,
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
                href="/article/last-mile-connectivity"
                onClick={handleOpenArticle('last-mile-connectivity')}
              >
                {t.home.featureTitle}
              </a>
            </h2>
            <p
              style={{
                margin: '14px 0 0',
                fontFamily: 'Newsreader, Georgia, serif',
                fontSize: 19,
                lineHeight: 1.5,
                color: '#333',
              }}
            >
              {t.home.featureDeck}
            </p>
            <p style={{ margin: '16px 0 0', fontSize: 13, color: '#555' }}>
              {t.home.byWord}{' '}
              <span style={{ color: '#111', fontWeight: 600 }}>{t.home.authorPlaceholder}</span>{' '}
              &nbsp;·&nbsp; {t.home.photographsBy}{' '}
              <span style={{ color: '#111', fontWeight: 600 }}>
                {t.home.photographerPlaceholder}
              </span>
            </p>
          </div>
        </section>

        {/* Opinion + Tools */}
        <section
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
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
                gap: 28,
                paddingTop: 16,
              }}
            >
              <a
                href="/article/open-data-habit"
                onClick={handleOpenArticle('open-data-habit')}
                style={{ display: 'block' }}
              >
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'Newsreader, Georgia, serif',
                    fontStyle: 'italic',
                    fontSize: 22,
                    lineHeight: 1.3,
                  }}
                >
                  {t.home.opinion1}
                </p>
                <p style={{ margin: '10px 0 0', fontSize: 13, color: '#555' }}>
                  {t.home.columnistPlaceholder}
                </p>
              </a>
              <a
                href="/article/volunteers-built-it"
                onClick={handleOpenArticle('volunteers-built-it')}
                style={{ display: 'block' }}
              >
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'Newsreader, Georgia, serif',
                    fontStyle: 'italic',
                    fontSize: 22,
                    lineHeight: 1.3,
                  }}
                >
                  {t.home.opinion2}
                </p>
                <p style={{ margin: '10px 0 0', fontSize: 13, color: '#555' }}>
                  {t.home.columnistPlaceholder}
                </p>
              </a>
              <a
                href="/article/ai-and-hearings"
                onClick={handleOpenArticle('ai-and-hearings')}
                style={{ display: 'block' }}
              >
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'Newsreader, Georgia, serif',
                    fontStyle: 'italic',
                    fontSize: 22,
                    lineHeight: 1.3,
                  }}
                >
                  {t.home.opinion3}
                </p>
                <p style={{ margin: '10px 0 0', fontSize: 13, color: '#555' }}>
                  {t.home.columnistPlaceholder}
                </p>
              </a>
            </div>
          </div>
          <aside aria-labelledby="tools" style={{ flex: '1 1 320px', minWidth: 0 }}>
            <h2
              id="tools"
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
              {t.home.civicTools}
            </h2>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              <li style={{ borderBottom: '1px solid #E5E5E5' }}>
                <a
                  href="https://data.bettergov.ph"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '14px 0',
                    fontSize: 15,
                    fontWeight: 500,
                  }}
                >
                  {t.home.tool1} <span aria-hidden="true" style={{ color: ACCENT }}>→</span>
                </a>
              </li>
              <li style={{ borderBottom: '1px solid #E5E5E5' }}>
                <a
                  href="https://budget.bettergov.ph"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '14px 0',
                    fontSize: 15,
                    fontWeight: 500,
                  }}
                >
                  {t.home.tool2} <span aria-hidden="true" style={{ color: ACCENT }}>→</span>
                </a>
              </li>
              <li style={{ borderBottom: '1px solid #E5E5E5' }}>
                <a
                  href="https://scamcheck.ph"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '14px 0',
                    fontSize: 15,
                    fontWeight: 500,
                  }}
                >
                  {t.home.tool3} <span aria-hidden="true" style={{ color: ACCENT }}>→</span>
                </a>
              </li>
              <li>
                <a
                  href="/civictools"
                  onClick={handleOpenCivicTools}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '14px 0',
                    fontSize: 15,
                    fontWeight: 500,
                  }}
                >
                  {t.home.tool4} <span aria-hidden="true" style={{ color: ACCENT }}>→</span>
                </a>
              </li>
            </ul>
          </aside>
        </section>

        {/* Newsletter */}
        <section
          id="newsletter"
          aria-labelledby="nl"
          style={{ padding: '56px 0', textAlign: 'center' }}
        >
          <h2
            id="nl"
            style={{
              margin: 0,
              fontFamily: 'Newsreader, Georgia, serif',
              fontSize: 36,
              fontWeight: 500,
              lineHeight: 1.15,
            }}
          >
            {t.home.nlTitle}
          </h2>
          <p
            style={{
              margin: '10px auto 0',
              maxWidth: 520,
              fontSize: 16,
              lineHeight: 1.5,
              color: '#444',
            }}
          >
            {t.home.nlDesc}
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            style={{
              margin: '24px auto 0',
              maxWidth: 520,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              textAlign: 'left',
            }}
          >
            <label
              htmlFor="nl-email"
              style={{
                position: 'absolute',
                width: 1,
                height: 1,
                overflow: 'hidden',
                clip: 'rect(0 0 0 0)',
              }}
            >
              {t.home.nlEmailLabel}
            </label>
            <input
              id="nl-email"
              type="email"
              placeholder={t.home.nlPlaceholder}
              style={{
                flex: '1 1 260px',
                minHeight: 48,
                padding: '0 16px',
                border: '1px solid #111',
                font: '400 16px Inter, sans-serif',
                boxSizing: 'border-box',
              }}
            />
            <button
              type="submit"
              style={{
                minHeight: 48,
                padding: '0 24px',
                border: 0,
                background: ACCENT,
                color: '#fff',
                font: '600 15px Inter, sans-serif',
                cursor: 'pointer',
              }}
            >
              {t.home.nlSignUp}
            </button>
          </form>
        </section>
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
