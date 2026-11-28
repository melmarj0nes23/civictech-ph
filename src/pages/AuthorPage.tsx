import { useEffect, useState, type MouseEvent } from 'react';
import { Footer } from '../components/Footer';
import { NewsletterBand } from '../components/NewsletterBand';
import { SiteHeader } from '../components/SiteHeader';
import { ARTICLES, type CategorySlug } from '../data/articles';
import {
  mapD1RowToArticle,
  readCachedD1Articles,
  writeCachedD1Articles,
  type CachedArticleItem,
  type D1ApiArticle,
} from '../data/articlesCache';
import type { Lang } from '../data/i18n';
import type { InfoPageSlug } from '../data/infoPages';
import { resolveArticleImage } from '../data/videoEmbed';

const ACCENT = '#0B3D91';

export function slugifyAuthor(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface AuthorPageProps {
  authorSlug: string;
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  onBackHome: () => void;
  onOpenCivicTools: () => void;
  onOpenSubmit: (hash?: string) => void;
  onOpenCategory: (slug: CategorySlug) => void;
  onOpenArticle: (slug: string) => void;
  onOpenInfo: (slug: InfoPageSlug) => void;
}

export function AuthorPage({
  authorSlug,
  lang,
  onLangChange,
  onBackHome,
  onOpenCivicTools,
  onOpenSubmit,
  onOpenCategory,
  onOpenArticle,
  onOpenInfo,
}: AuthorPageProps) {
  const [d1Stories, setD1Stories] = useState<CachedArticleItem[]>(
    () => readCachedD1Articles() ?? []
  );

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
        // fallback to static articles in local Vite dev
      });
  }, [authorSlug]);

  const d1Slugs = new Set(d1Stories.map((s) => s.slug));
  const allStories: CachedArticleItem[] = [
    ...d1Stories,
    ...ARTICLES.filter((a) => !d1Slugs.has(a.slug)),
  ];

  const matching = allStories.filter(
    (s) =>
      slugifyAuthor(s.author.en) === authorSlug ||
      slugifyAuthor(s.author.fil) === authorSlug
  );

  const authorName =
    matching[0]?.author[lang] ||
    authorSlug
      .split('-')
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ''))
      .join(' ');

  const authorBio =
    matching.find((s) => s.authorBio)?.authorBio ||
    (lang === 'en'
      ? 'Contributor reporting on Philippine civic technology, open data, and digital governance.'
      : 'Tagapag-ambag na nag-uulat tungkol sa civic technology, open data, at digital na pamamahala.');

  const initials = authorName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  useEffect(() => {
    document.title = `${authorName} — Civic Tech by BetterGov.ph`;
  }, [authorName]);

  const handleArticleClick = (slug: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenArticle(slug);
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
      />

      <main
        style={{
          width: '100%',
          maxWidth: 1020,
          margin: '0 auto',
          padding: '40px 24px 32px',
          flex: '1 0 auto',
          boxSizing: 'border-box',
        }}
      >
        <div className="category-desk-band">
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
            <div
              aria-hidden="true"
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#fff',
                border: `2px solid ${ACCENT}`,
                color: ACCENT,
                fontSize: 20,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 'none',
              }}
            >
              {initials || 'CT'}
            </div>
            <div style={{ minWidth: 0, flex: '1 1 280px' }}>
              <p
                style={{
                  margin: '0 0 6px',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: ACCENT,
                }}
              >
                {lang === 'en' ? 'Author Archive' : 'Arkibo ng May-akda'} · {matching.length}{' '}
                {matching.length === 1
                  ? lang === 'en'
                    ? 'story'
                    : 'artikulo'
                  : lang === 'en'
                    ? 'stories'
                    : 'mga artikulo'}
              </p>
              <h1
                style={{
                  margin: 0,
                  fontFamily: 'Newsreader, Georgia, serif',
                  fontSize: 38,
                  fontWeight: 600,
                  lineHeight: 1.12,
                }}
              >
                {authorName}
              </h1>
              <p style={{ margin: '10px 0 0', fontSize: 15, lineHeight: 1.55, color: '#444' }}>
                {authorBio}
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 32 }}>
          {matching.length === 0 ? (
            <p style={{ margin: 0, fontSize: 15, color: '#555' }}>
              {lang === 'en'
                ? 'No published stories found for this author yet.'
                : 'Wala pang nailathalang kuwento para sa may-akdang ito.'}
            </p>
          ) : (
            matching.map((story, idx) => (
              <article
                key={story.slug}
                style={{
                  padding: idx === 0 ? '0 0 24px' : '24px 0',
                  borderBottom: idx === matching.length - 1 ? 'none' : '1px solid #E5E5E5',
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
                    style={{ flex: '1 1 220px', maxWidth: 280, aspectRatio: '3 / 2' }}
                  >
                    <img
                      src={resolveArticleImage(story.photoUrl, story.slug)}
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
                        fontSize: 25,
                        lineHeight: 1.2,
                        fontWeight: 500,
                      }}
                    >
                      {story.title[lang]}
                    </h2>
                    <p style={{ margin: '10px 0 0', fontSize: 15, lineHeight: 1.5, color: '#444' }}>
                      {story.deck[lang]}
                    </p>
                    <p style={{ margin: '10px 0 0', fontSize: 12, color: '#666' }}>
                      {story.date[lang]} · {story.readTime[lang]}
                    </p>
                  </div>
                </a>
              </article>
            ))
          )}
        </div>
      </main>

      <div
        style={{
          width: '100%',
          maxWidth: 1380,
          margin: '32px auto 48px',
          padding: '0 24px',
          boxSizing: 'border-box',
        }}
      >
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
