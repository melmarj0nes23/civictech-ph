import { useEffect, useState, type FormEvent, type MouseEvent } from 'react';
import { Footer } from '../components/Footer';
import { SiteHeader } from '../components/SiteHeader';
import {
  ARTICLES,
  getArticlePhoto,
  getCategoryBySlug,
  type ArticleItem,
  type CategorySlug,
} from '../data/articles';
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
  const [d1Stories, setD1Stories] = useState<
    (ArticleItem & { photoUrl?: string; isLongRead?: boolean })[]
  >([]);

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
              is_long_read?: number;
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
              isLongRead: Boolean(a.is_long_read),
            }))
          );
        }
      )
      .catch(() => {
        // fallback to static articles in plain Vite dev
      });
  }, []);

  const d1Slugs = new Set(d1Stories.map((s) => s.slug));
  const feedStories: (ArticleItem & { photoUrl?: string; isLongRead?: boolean })[] = [
    ...d1Stories,
    ...ARTICLES.filter((a) => !d1Slugs.has(a.slug)),
  ];
  const leadStory = feedStories[0] ?? ARTICLES[0];
  const topStories = feedStories.slice(1, 5);
  const latestStories = feedStories.slice(5, 9);
  const longReadStory: ArticleItem & { photoUrl?: string; isLongRead?: boolean } =
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
    ...DIRECTORY_ENTRIES.filter((e) => e.kind === 'project' && e.website).slice(0, 1),
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
                  src={leadStory.photoUrl || getArticlePhoto(leadStory.slug)}
                  alt={leadStory.title[lang]}
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
              {getCategoryBySlug(leadStory.category)?.label[lang] ?? leadStory.kicker[lang]}
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
              <a href={`/article/${leadStory.slug}`} onClick={handleOpenArticle(leadStory.slug)}>
                {leadStory.title[lang]}
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
              {leadStory.deck[lang]}
            </p>
            <p style={{ margin: '16px 0 0', fontSize: 13, color: '#555' }}>
              {t.home.byWord}{' '}
              <span style={{ color: '#111', fontWeight: 600 }}>{leadStory.author[lang]}</span>{' '}
              &nbsp;·&nbsp; {leadStory.readTime[lang]}
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
            {topStories.map((story, idx) => (
              <a
                key={story.slug}
                href={`/article/${story.slug}`}
                onClick={handleOpenArticle(story.slug)}
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
                </div>
                <div className="ph ph--photo" style={{ width: 96, height: 96, flex: 'none' }}>
                  <img
                    src={story.photoUrl || getArticlePhoto(story.slug)}
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
            {latestStories.map((story) => (
              <article key={story.slug}>
                <a
                  href={`/article/${story.slug}`}
                  onClick={handleOpenArticle(story.slug)}
                  style={{ display: 'block' }}
                >
                  <div className="ph ph--photo" style={{ aspectRatio: '3 / 2' }}>
                    <img
                      src={story.photoUrl || getArticlePhoto(story.slug)}
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
                </a>
              </article>
            ))}
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
          <a
            href={`/article/${longReadStory.slug}`}
            onClick={handleOpenArticle(longReadStory.slug)}
            className="ph ph--photo"
            style={{ flex: '999 1 560px', minWidth: 0, aspectRatio: '21 / 9', display: 'block' }}
          >
            <img
              src={longReadStory.photoUrl || getArticlePhoto(longReadStory.slug)}
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
                href={`/article/${longReadStory.slug}`}
                onClick={handleOpenArticle(longReadStory.slug)}
              >
                {longReadStory.title[lang]}
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
              {longReadStory.deck[lang]}
            </p>
            <p style={{ margin: '16px 0 0', fontSize: 13, color: '#555' }}>
              {t.home.byWord}{' '}
              <span style={{ color: '#111', fontWeight: 600 }}>{longReadStory.author[lang]}</span>{' '}
              &nbsp;·&nbsp; {longReadStory.readTime[lang]}
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
              {opinionStories.map((story) => (
                <a
                  key={story.slug}
                  href={`/article/${story.slug}`}
                  onClick={handleOpenArticle(story.slug)}
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
                  <p style={{ margin: '10px 0 0', fontSize: 13, color: '#555' }}>
                    {story.author[lang]}
                  </p>
                </a>
              ))}
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
