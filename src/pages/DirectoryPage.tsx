import { useMemo, useState, type MouseEvent } from 'react';
import { DIRECTORY_ENTRIES } from '../data/directory';
import { getLocalizedSummary } from '../data/directoryI18n';
import {
  SECTOR_LABELS,
  STATUS_LABELS,
  TRANSLATIONS,
  type Lang,
} from '../data/i18n';
import type { EntryKind } from '../data/schema';
import { SECTORS, type Sector } from '../data/sectors';

const ACCENT = '#0B3D91';
const PAGE_SIZE = 24;

interface DirectoryPageProps {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  onBackHome: () => void;
}

export function DirectoryPage({ lang, onLangChange, onBackHome }: DirectoryPageProps) {
  const t = TRANSLATIONS[lang];
  const [search, setSearch] = useState('');
  const [kindFilter, setKindFilter] = useState<EntryKind | 'all'>('all');
  const [sectorFilter, setSectorFilter] = useState<Sector | 'all'>('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const handleBackHome = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onBackHome();
  };

  const handleSwitchLang = (next: Lang) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onLangChange(next);
  };

  const sectorCounts = useMemo(() => {
    const map = new Map<Sector, number>();
    for (const s of SECTORS) map.set(s, 0);
    for (const entry of DIRECTORY_ENTRIES) {
      if (kindFilter !== 'all' && entry.kind !== kindFilter) continue;
      for (const s of entry.sectors) {
        map.set(s, (map.get(s) ?? 0) + 1);
      }
    }
    return map;
  }, [kindFilter]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return DIRECTORY_ENTRIES.filter((entry) => {
      if (kindFilter !== 'all' && entry.kind !== kindFilter) return false;
      if (sectorFilter !== 'all' && !entry.sectors.includes(sectorFilter)) return false;
      if (!q) return true;
      const localizedSummary = getLocalizedSummary(
        entry.slug,
        entry.summary,
        lang,
        entry.summaryFil
      ).toLowerCase();
      return (
        entry.title.toLowerCase().includes(q) ||
        localizedSummary.includes(q) ||
        (entry.owner?.toLowerCase().includes(q) ?? false) ||
        entry.sectors.some(
          (s) => s.toLowerCase().includes(q) || SECTOR_LABELS[s][lang].toLowerCase().includes(q)
        ) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [search, kindFilter, sectorFilter, lang]);

  const visibleEntries = filtered.slice(0, visibleCount);
  const projectCount = DIRECTORY_ENTRIES.filter((e) => e.kind === 'project').length;
  const csoCount = DIRECTORY_ENTRIES.filter((e) => e.kind === 'cso').length;

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <a
              href="/civictools"
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

      <main style={{ maxWidth: 1240, margin: '0 auto', padding: '40px 24px 64px' }}>
        {/* Header block */}
        <div
          style={{
            paddingBottom: 28,
            borderBottom: '1px solid #E5E5E5',
            marginBottom: 28,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 20,
          }}
        >
          <div>
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
              {t.directory.kicker}
            </p>
            <h1
              className="directory-title"
              style={{
                margin: 0,
                fontFamily: 'Newsreader, Georgia, serif',
                fontWeight: 500,
                fontSize: 48,
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
              }}
            >
              {t.directory.title}
            </h1>
            <p
              style={{
                margin: '12px 0 0',
                maxWidth: 680,
                fontSize: 16,
                lineHeight: 1.5,
                color: '#444',
              }}
            >
              {DIRECTORY_ENTRIES.length} {t.directory.subtitleSuffix}
            </p>
          </div>

          <a
            href="https://github.com/melmarj0nes23/civictech-ph/issues/new?template=submit-entry.yml"
            target="_blank"
            rel="noreferrer"
            style={{
              background: ACCENT,
              color: '#fff',
              padding: '0 18px',
              minHeight: 44,
              display: 'inline-flex',
              alignItems: 'center',
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            {t.directory.submitViaGithub}
          </a>
        </div>

        {/* Inline Sentence Filter + Search */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 20,
            borderBottom: '1px solid #E5E5E5',
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
              alignItems: 'center',
              gap: 8,
              fontSize: 16,
              color: '#333',
              maxWidth: '100%',
              minWidth: 0,
            }}
          >
            <span className="filter-show-label">{t.directory.showWord}</span>
            <select
              aria-label="Filter by type"
              value={kindFilter}
              onChange={(e) => {
                setKindFilter(e.target.value as EntryKind | 'all');
                setVisibleCount(PAGE_SIZE);
              }}
              style={{
                border: 'none',
                borderBottom: '1px solid #DADADA',
                background: 'transparent',
                padding: '4px 4px 4px 0',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 16,
                fontWeight: 600,
                color: '#111',
                cursor: 'pointer',
                minWidth: 0,
                flexShrink: 1,
                textOverflow: 'ellipsis',
              }}
            >
              <option value="all">
                {t.directory.allEntries} ({DIRECTORY_ENTRIES.length})
              </option>
              <option value="project">
                {t.directory.civicTechProjects} ({projectCount})
              </option>
              <option value="cso">
                {t.directory.csos} ({csoCount})
              </option>
            </select>

            <span style={{ flexShrink: 0 }}>{t.directory.inWord}</span>
            <select
              aria-label="Filter by sector"
              value={sectorFilter}
              onChange={(e) => {
                setSectorFilter(e.target.value as Sector | 'all');
                setVisibleCount(PAGE_SIZE);
              }}
              style={{
                border: 'none',
                borderBottom: '1px solid #DADADA',
                background: 'transparent',
                padding: '4px 4px 4px 0',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 16,
                fontWeight: 600,
                color: '#111',
                cursor: 'pointer',
                minWidth: 0,
                flexShrink: 1,
                textOverflow: 'ellipsis',
              }}
            >
              <option value="all">{t.directory.everySector}</option>
              {SECTORS.map((sector) => (
                <option key={sector} value={sector}>
                  {SECTOR_LABELS[sector][lang]} ({sectorCounts.get(sector) ?? 0})
                </option>
              ))}
            </select>
          </div>

          <input
            type="search"
            className="directory-search"
            aria-label={t.directory.searchPlaceholder}
            placeholder={t.directory.searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            style={{
              flex: '1 1 260px',
              maxWidth: 360,
              minHeight: 40,
              padding: '0 12px',
              border: '1px solid #DADADA',
              font: '400 14px Inter, sans-serif',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Results Grid */}
        {filtered.length === 0 ? (
          <div
            style={{
              padding: '56px 24px',
              textAlign: 'center',
              border: '1px solid #E5E5E5',
            }}
          >
            <p
              style={{
                margin: '0 0 12px',
                fontFamily: 'Newsreader, Georgia, serif',
                fontSize: 22,
              }}
            >
              {t.directory.noResults}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setKindFilter('all');
                setSectorFilter('all');
              }}
              style={{
                padding: '10px 18px',
                border: '1px solid #111',
                background: '#fff',
                font: '500 13px Inter, sans-serif',
                cursor: 'pointer',
              }}
            >
              {t.directory.resetFilters}
            </button>
          </div>
        ) : (
          <>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: '#555' }}>
              {t.directory.showing} {visibleEntries.length} {t.directory.ofWord} {filtered.length}{' '}
              {t.directory.entriesWord}
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
                gap: 24,
              }}
            >
              {visibleEntries.map((entry) => (
                <article
                  key={entry.slug}
                  style={{
                    border: '1px solid #E5E5E5',
                    padding: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 16,
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 8,
                        gap: 8,
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: ACCENT,
                        }}
                      >
                        {entry.sectors.map((s) => SECTOR_LABELS[s][lang]).join(' · ')}
                      </p>
                      <span
                        style={{
                          fontSize: 12,
                          color: '#555',
                          flexShrink: 0,
                        }}
                      >
                        {STATUS_LABELS[entry.status]?.[lang] ?? entry.status}
                      </span>
                    </div>
                    <h2
                      style={{
                        margin: '0 0 8px',
                        fontFamily: 'Newsreader, Georgia, serif',
                        fontWeight: 500,
                        fontSize: 24,
                        lineHeight: 1.2,
                      }}
                    >
                      {entry.title}
                    </h2>
                    <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: '#444' }}>
                      {getLocalizedSummary(entry.slug, entry.summary, lang, entry.summaryFil)}
                    </p>
                  </div>

                  <div
                    style={{
                      paddingTop: 14,
                      borderTop: '1px solid #E5E5E5',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 12,
                      fontSize: 13,
                      color: '#555',
                    }}
                  >
                    <span
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {entry.owner || entry.maintainers[0] || 'BetterGov.ph'}
                    </span>
                    <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
                      {entry.repoUrl && (
                        <a
                          href={entry.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: '#555', fontWeight: 500 }}
                        >
                          GitHub
                        </a>
                      )}
                      {(entry.website || entry.demo || entry.repoUrl) && (
                        <a
                          href={entry.website || entry.demo || entry.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: ACCENT, fontWeight: 600 }}
                        >
                          {t.directory.visit}
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {visibleCount < filtered.length && (
              <div style={{ marginTop: 32, textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  style={{
                    minHeight: 44,
                    padding: '0 24px',
                    border: '1px solid #111',
                    background: '#fff',
                    color: '#111',
                    font: '600 14px Inter, sans-serif',
                    cursor: 'pointer',
                  }}
                >
                  {t.directory.showMore} ({filtered.length - visibleCount} {t.directory.remaining})
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <footer style={{ borderTop: '1px solid #111', marginTop: 8 }}>
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            padding: '36px 24px 48px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 32,
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ flex: '1 1 320px' }}>
            <p
              style={{
                margin: 0,
                fontFamily: 'Newsreader, Georgia, serif',
                fontSize: 32,
                fontWeight: 600,
              }}
            >
              Civic Tech
            </p>
            <p
              style={{
                margin: '8px 0 0',
                fontSize: 14,
                lineHeight: 1.5,
                color: '#555',
                maxWidth: 380,
              }}
            >
              {t.footer.desc}
            </p>
          </div>
          <div className="footer-links">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontWeight: 600 }}>{t.footer.about}</span>
              <a href="/" onClick={handleBackHome} style={{ color: '#555' }}>
                {t.footer.ourMission}
              </a>
              <a href="/" onClick={handleBackHome} style={{ color: '#555' }}>
                {t.footer.editorialStandards}
              </a>
              <a href="/" onClick={handleBackHome} style={{ color: '#555' }}>
                {t.footer.corrections}
              </a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontWeight: 600 }}>{t.footer.getInvolved}</span>
              <a href="/" onClick={handleBackHome} style={{ color: '#555' }}>
                {t.footer.volunteer}
              </a>
              <a href="/" onClick={handleBackHome} style={{ color: '#555' }}>
                {t.footer.sendATip}
              </a>
              <a href="/" onClick={handleBackHome} style={{ color: '#555' }}>
                {t.footer.contact}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
