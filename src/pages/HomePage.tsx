import { useState, type FormEvent, type MouseEvent } from 'react';
import { Footer } from '../components/Footer';
import { SiteHeader } from '../components/SiteHeader';
import { getArticlePhoto, type CategorySlug } from '../data/articles';
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
  const [nlEmail, setNlEmail] = useState('');
  const [nlSubmitting, setNlSubmitting] = useState(false);
  const [nlSubscribed, setNlSubscribed] = useState<string | null>(null);
  const featuredTools = [
    ...DIRECTORY_ENTRIES.filter((e) => e.kind === 'project' && e.website).slice(0, 3),
    ...DIRECTORY_ENTRIES.filter((e) => e.kind === 'cso' && e.website).slice(0, 1),
  ];

  const handleNlSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const clean = nlEmail.trim();
    if (!clean) return;
    setNlSubmitting(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: clean, lang }),
      });
      if (res.ok) {
        setNlSubscribed(clean);
        return;
      }
    } catch {
      // Fallback when running plain Vite dev server without Pages Functions
    } finally {
      setNlSubmitting(false);
    }
    setNlSubscribed(clean);
  };

  const handleOpenArticle = (slug: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenArticle(slug);
  };

  const handleOpenCivicTools = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenCivicTools();
  };

  const handleStayHome = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
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

      {/* Dateline */}
      <div
        className="home-dateline"
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: '14px 24px 0',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          alignItems: 'center',
          fontSize: 12,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#555',
        }}
      >
        <span>{formatTodayDate(lang)}</span>
      </div>

      <main style={{ maxWidth: 1240, margin: '0 auto', padding: '24px 24px 0' }}>
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
                className="ph ph--photo"
                style={{
                  aspectRatio: '16 / 9',
                  width: '100%',
                }}
              >
                <img
                  src={getArticlePhoto('volunteers-national-budget')}
                  alt={t.home.leadPhoto}
                />
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
              <div className="ph ph--photo" style={{ width: 96, height: 96, flex: 'none' }}>
                <img src={getArticlePhoto('transparent-canvassing')} alt={t.home.top1Title} loading="lazy" />
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
              <div className="ph ph--photo" style={{ width: 96, height: 96, flex: 'none' }}>
                <img src={getArticlePhoto('foi-explained')} alt={t.home.top2Title} loading="lazy" />
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
              <div className="ph ph--photo" style={{ width: 96, height: 96, flex: 'none' }}>
                <img src={getArticlePhoto('gov-ph-mobile')} alt={t.home.top3Title} loading="lazy" />
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
              <div className="ph ph--photo" style={{ width: 96, height: 96, flex: 'none' }}>
                <img src={getArticlePhoto('spotting-scam-texts')} alt={t.home.top4Title} loading="lazy" />
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
                <div className="ph ph--photo" style={{ aspectRatio: '3 / 2' }}>
                  <img src={getArticlePhoto('mapping-public-transport')} alt={t.home.latest1Photo} loading="lazy" />
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
                <div className="ph ph--photo" style={{ aspectRatio: '3 / 2' }}>
                  <img src={getArticlePhoto('reading-bicam-report')} alt={t.home.latest2Photo} loading="lazy" />
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
                <div className="ph ph--photo" style={{ aspectRatio: '3 / 2' }}>
                  <img src={getArticlePhoto('barangay-procurement')} alt={t.home.latest3Photo} loading="lazy" />
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
                <div className="ph ph--photo" style={{ aspectRatio: '3 / 2' }}>
                  <img src={getArticlePhoto('one-login-gov')} alt={t.home.latest4Photo} loading="lazy" />
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
          <div className="ph ph--photo" style={{ flex: '999 1 560px', minWidth: 0, aspectRatio: '21 / 9' }}>
            <img src={getArticlePhoto('last-mile-connectivity')} alt={t.home.featurePhoto} loading="lazy" />
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
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {featuredTools.map((entry) => (
                <li key={entry.slug} style={{ borderBottom: '1px solid #E5E5E5' }}>
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
          {nlSubscribed ? (
            <div
              role="status"
              style={{
                margin: '24px auto 0',
                maxWidth: 520,
                padding: '14px 16px',
                background: '#F4F6FA',
                borderLeft: `3px solid ${ACCENT}`,
                textAlign: 'left',
                fontSize: 14,
                lineHeight: 1.5,
                color: '#1A1A1A',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>
                {lang === 'en'
                  ? `Subscribed (${nlSubscribed}) — preview confirmation.`
                  : `Naka-subscribe na (${nlSubscribed}) — preview confirmation.`}
              </span>
              <button
                type="button"
                onClick={() => {
                  setNlSubscribed(null);
                  setNlEmail('');
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: ACCENT,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {lang === 'en' ? 'Change email' : 'Palitan ang email'}
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleNlSubmit}
              className="newsletter-form"
              style={{
                margin: '24px auto 0',
                maxWidth: 520,
                display: 'flex',
                flexWrap: 'nowrap',
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
                required
                value={nlEmail}
                onChange={(e) => setNlEmail(e.target.value)}
                placeholder={t.home.nlPlaceholder}
                style={{
                  flex: '1 1 0',
                  minWidth: 0,
                  minHeight: 48,
                  padding: '0 16px',
                  border: '1px solid #111',
                  font: '400 16px Inter, sans-serif',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="submit"
                disabled={nlSubmitting}
                className="newsletter-submit"
                style={{
                  flex: 'none',
                  minHeight: 48,
                  padding: '0 24px',
                  border: 0,
                  background: ACCENT,
                  color: '#fff',
                  font: '600 15px Inter, sans-serif',
                  whiteSpace: 'nowrap',
                  cursor: nlSubmitting ? 'wait' : 'pointer',
                  opacity: nlSubmitting ? 0.7 : 1,
                }}
              >
                {nlSubmitting ? (lang === 'en' ? 'Saving…' : 'Sine-save…') : t.home.nlSignUp}
              </button>
            </form>
          )}
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
