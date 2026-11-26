import { useMemo, useState, type MouseEvent } from 'react';
import { DIRECTORY_ENTRIES } from '../data/directory';
import type { EntryKind } from '../data/schema';
import { SECTORS, type Sector } from '../data/sectors';

const ACCENT = '#0B3D91';
const PAGE_SIZE = 24;

interface DirectoryPageProps {
  onBackHome: () => void;
}

export function DirectoryPage({ onBackHome }: DirectoryPageProps) {
  const [search, setSearch] = useState('');
  const [kindFilter, setKindFilter] = useState<EntryKind | 'all'>('all');
  const [sectorFilter, setSectorFilter] = useState<Sector | 'all'>('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const handleBackHome = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onBackHome();
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
      return (
        entry.title.toLowerCase().includes(q) ||
        entry.summary.toLowerCase().includes(q) ||
        (entry.owner?.toLowerCase().includes(q) ?? false) ||
        entry.sectors.some((s) => s.toLowerCase().includes(q)) ||
        entry.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [search, kindFilter, sectorFilter]);

  const visibleEntries = filtered.slice(0, visibleCount);
  const projectCount = DIRECTORY_ENTRIES.filter((e) => e.kind === 'project').length;
  const csoCount = DIRECTORY_ENTRIES.filter((e) => e.kind === 'cso').length;

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#111', background: '#fff' }}>
      {/* Compact header */}
      <header style={{ borderBottom: '1px solid #E5E5E5' }}>
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            padding: '12px 24px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px 32px',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <a
              href="/"
              onClick={handleBackHome}
              style={{
                fontFamily: 'Newsreader, Georgia, serif',
                fontSize: 32,
                fontWeight: 600,
                letterSpacing: '-0.01em',
              }}
            >
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
              by{' '}
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
          <nav
            aria-label="Sections"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '4px 24px',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <a href="/" onClick={handleBackHome} style={{ padding: '12px 0' }}>
              Open Data
            </a>
            <a href="/" onClick={handleBackHome} style={{ padding: '12px 0' }}>
              Budget
            </a>
            <a href="/" onClick={handleBackHome} style={{ padding: '12px 0' }}>
              Elections
            </a>
            <a href="/" onClick={handleBackHome} style={{ padding: '12px 0' }}>
              Policy
            </a>
            <a href="/" onClick={handleBackHome} style={{ padding: '12px 0' }}>
              Tools
            </a>
            <a href="/" onClick={handleBackHome} style={{ padding: '12px 0' }}>
              Opinion
            </a>
          </nav>
          <a
            href="/"
            onClick={handleBackHome}
            style={{
              background: ACCENT,
              color: '#fff',
              padding: '0 16px',
              minHeight: 44,
              display: 'inline-flex',
              alignItems: 'center',
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            Subscribe
          </a>
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
              civictech.ph · 15 Sectors
            </p>
            <h1
              style={{
                margin: 0,
                fontFamily: 'Newsreader, Georgia, serif',
                fontWeight: 500,
                fontSize: 48,
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
              }}
            >
              Civic Tech &amp; CSO Directory
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
              {DIRECTORY_ENTRIES.length} civic tech projects and Civil Society Organizations
              migrated from OpenBayan.org and organized across 15 Philippine sectors.
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
            Submit via GitHub →
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
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 8,
              fontSize: 16,
              color: '#333',
            }}
          >
            <span>Show</span>
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
                padding: '4px 6px 4px 2px',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 16,
                fontWeight: 600,
                color: '#111',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Entries ({DIRECTORY_ENTRIES.length})</option>
              <option value="project">Civic Tech Projects ({projectCount})</option>
              <option value="cso">CSOs ({csoCount})</option>
            </select>

            <span>in</span>
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
                padding: '4px 6px 4px 2px',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 16,
                fontWeight: 600,
                color: '#111',
                cursor: 'pointer',
              }}
            >
              <option value="all">Every Sector</option>
              {SECTORS.map((sector) => (
                <option key={sector} value={sector}>
                  {sector} ({sectorCounts.get(sector) ?? 0})
                </option>
              ))}
            </select>
          </div>

          <input
            type="search"
            aria-label="Search projects and CSOs"
            placeholder="Search projects, CSOs, or tags..."
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
              No matching entries found.
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
              Reset filters
            </button>
          </div>
        ) : (
          <>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: '#555' }}>
              Showing {visibleEntries.length} of {filtered.length} entries
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
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
                        {entry.sectors.join(' · ')}
                      </p>
                      <span
                        style={{
                          fontSize: 12,
                          color: '#555',
                          textTransform: 'capitalize',
                          flexShrink: 0,
                        }}
                      >
                        {entry.status}
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
                      {entry.summary}
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
                          Visit →
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
                  Show more ({filtered.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </main>

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
          <span>Civic Tech is an independent newsroom &amp; directory of BetterGov.ph.</span>
          <span>
            <a href="/" onClick={handleBackHome} style={{ color: '#555' }}>
              Newsroom
            </a>{' '}
            &nbsp;·&nbsp;{' '}
            <a
              href="https://github.com/bettergovph/openbayan.org"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#555' }}
            >
              OpenBayan.org GitHub
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
