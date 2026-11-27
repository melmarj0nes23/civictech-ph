import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { ARTICLES, type ArticleItem } from '../data/articles';
import { DIRECTORY_ENTRIES } from '../data/directory';
import { getLocalizedSummary } from '../data/directoryI18n';
import { SECTOR_LABELS, STATUS_LABELS, type Lang } from '../data/i18n';

const ACCENT = '#0B3D91';

interface SearchModalProps {
  open: boolean;
  lang: Lang;
  onClose: () => void;
  onOpenArticle: (slug: string) => void;
  onOpenCivicTools: () => void;
}

export function SearchModal({
  open,
  lang,
  onClose,
  onOpenArticle,
  onOpenCivicTools,
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = requestAnimationFrame(() => inputRef.current?.focus());
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(timer);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  const trimmed = query.trim().toLowerCase();

  const matchingArticles = useMemo(() => {
    if (!trimmed) return ARTICLES.slice(0, 3);
    return ARTICLES.filter((a: ArticleItem) => {
      const hay = `${a.title[lang]} ${a.deck[lang]} ${a.kicker[lang]} ${a.title.en} ${a.deck.en}`.toLowerCase();
      return hay.includes(trimmed);
    }).slice(0, 4);
  }, [trimmed, lang]);

  const matchingDirectory = useMemo(() => {
    if (!trimmed) return DIRECTORY_ENTRIES.slice(0, 4);
    return DIRECTORY_ENTRIES.filter((entry) => {
      const summary = getLocalizedSummary(entry.slug, entry.summary, lang, entry.summaryFil);
      const sectors = entry.sectors.map((s) => `${s} ${SECTOR_LABELS[s][lang]}`).join(' ');
      const hay = `${entry.title} ${summary} ${entry.summary} ${sectors}`.toLowerCase();
      return hay.includes(trimmed);
    }).slice(0, 5);
  }, [trimmed, lang]);

  if (!open) return null;

  const handleArticle = (slug: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClose();
    onOpenArticle(slug);
  };

  const handleBrowseDirectory = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClose();
    onOpenCivicTools();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'en' ? 'Search Civic Tech' : 'Maghanap sa Civic Tech'}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '48px 16px 24px',
        boxSizing: 'border-box',
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(17, 17, 17, 0.45)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1101,
          width: '100%',
          maxWidth: 680,
          maxHeight: 'calc(100vh - 72px)',
          background: '#fff',
          border: '1px solid #E5E5E5',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.16)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Search bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 16px',
            borderBottom: '1px solid #E5E5E5',
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#555"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ flex: 'none' }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              lang === 'en'
                ? 'Search articles, civic tools, or CSOs…'
                : 'Maghanap ng mga artikulo, civic tool, o CSO…'
            }
            aria-label={
              lang === 'en'
                ? 'Search articles, civic tools, or CSOs'
                : 'Maghanap ng mga artikulo, civic tool, o CSO'
            }
            style={{
              flex: 1,
              minWidth: 0,
              border: 'none',
              outline: 'none',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 16,
              color: '#111',
              background: 'transparent',
            }}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label={lang === 'en' ? 'Close search' : 'Isara ang paghahanap'}
            style={{
              width: 36,
              height: 36,
              border: 'none',
              background: 'transparent',
              color: '#555',
              fontSize: 22,
              lineHeight: 1,
              cursor: 'pointer',
              flex: 'none',
            }}
          >
            ×
          </button>
        </div>

        {/* Results */}
        <div style={{ overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Articles */}
          <div>
            <p
              style={{
                margin: '0 0 8px',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#555',
              }}
            >
              {lang === 'en'
                ? trimmed
                  ? `Articles (${matchingArticles.length})`
                  : 'Featured Articles'
                : trimmed
                  ? `Mga Artikulo (${matchingArticles.length})`
                  : 'Mga Tampok na Artikulo'}
            </p>
            {matchingArticles.length === 0 ? (
              <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
                {lang === 'en' ? 'No matching articles.' : 'Walang tugmang artikulo.'}
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {matchingArticles.map((art) => (
                  <a
                    key={art.slug}
                    href={art.slug === 'volunteers-national-budget' ? '/article' : `/article/${art.slug}`}
                    onClick={handleArticle(art.slug)}
                    style={{
                      padding: '10px 0',
                      borderBottom: '1px solid #F0F0F0',
                      display: 'block',
                    }}
                  >
                    <p
                      style={{
                        margin: '0 0 3px',
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: ACCENT,
                      }}
                    >
                      {art.kicker[lang]}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontFamily: 'Newsreader, Georgia, serif',
                        fontSize: 18,
                        fontWeight: 500,
                        lineHeight: 1.25,
                        color: '#111',
                      }}
                    >
                      {art.title[lang]}
                    </p>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Directory */}
          <div>
            <p
              style={{
                margin: '0 0 8px',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#555',
              }}
            >
              {lang === 'en'
                ? trimmed
                  ? `Civic Tools & CSOs (${matchingDirectory.length})`
                  : 'Civic Tools & CSOs Directory'
                : trimmed
                  ? `Mga Civic Tool at CSO (${matchingDirectory.length})`
                  : 'Direktoryo ng mga Civic Tool at CSO'}
            </p>
            {matchingDirectory.length === 0 ? (
              <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
                {lang === 'en' ? 'No matching directory entries.' : 'Walang tugmang tool o CSO.'}
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {matchingDirectory.map((entry) => (
                  <a
                    key={entry.slug}
                    href={entry.website || '/civictools'}
                    target={entry.website ? '_blank' : undefined}
                    rel={entry.website ? 'noreferrer' : undefined}
                    onClick={
                      entry.website
                        ? undefined
                        : (e) => {
                            e.preventDefault();
                            onClose();
                            onOpenCivicTools();
                          }
                    }
                    style={{
                      padding: '10px 0',
                      borderBottom: '1px solid #F0F0F0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 12,
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#111' }}>
                        {entry.title}
                      </p>
                      <p
                        style={{
                          margin: '3px 0 0',
                          fontSize: 13,
                          lineHeight: 1.4,
                          color: '#555',
                        }}
                      >
                        {getLocalizedSummary(entry.slug, entry.summary, lang, entry.summaryFil)}
                      </p>
                    </div>
                    <span
                      style={{
                        flex: 'none',
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '3px 8px',
                        background: '#F4F6FA',
                        color: ACCENT,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {STATUS_LABELS[entry.status]?.[lang] ?? entry.status}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer link */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid #E5E5E5',
            background: '#FAFAFA',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span style={{ fontSize: 12, color: '#666' }}>
            {DIRECTORY_ENTRIES.length}{' '}
            {lang === 'en' ? 'civic tools & CSOs indexed' : 'nakalistang civic tool at CSO'}
          </span>
          <a
            href="/civictools"
            onClick={handleBrowseDirectory}
            style={{ fontSize: 13, fontWeight: 600, color: ACCENT }}
          >
            {lang === 'en' ? 'Browse full directory →' : 'Tingnan ang buong direktoryo →'}
          </a>
        </div>
      </div>
    </div>
  );
}
