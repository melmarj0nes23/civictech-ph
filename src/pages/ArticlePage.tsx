import type { MouseEvent } from 'react';

const ACCENT = '#0B3D91';

interface ArticlePageProps {
  onBackHome: () => void;
  onOpenCivicTools: () => void;
}

export function ArticlePage({ onBackHome, onOpenCivicTools }: ArticlePageProps) {
  const handleBackHome = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onBackHome();
  };

  const handleOpenCivicTools = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenCivicTools();
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
          <nav aria-label="Sections" className="compact-nav">
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
          <a href="/" onClick={handleBackHome} className="compact-subscribe">
            Subscribe
          </a>
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
            Open Data · Feature
          </p>
          <h1
            style={{
              margin: 0,
              fontFamily: 'Newsreader, Georgia, serif',
              fontWeight: 500,
              fontSize: 'clamp(32px, 5.5vw, 58px)',
              lineHeight: 1.06,
              letterSpacing: '-0.02em',
            }}
          >
            The volunteers rebuilding how Filipinos read the national budget
          </h1>
          <p
            style={{
              margin: '20px auto 0',
              maxWidth: 680,
              fontFamily: 'Newsreader, Georgia, serif',
              fontSize: 'clamp(18px, 2.5vw, 22px)',
              lineHeight: 1.45,
              color: '#333',
            }}
          >
            A loose network of engineers, researchers and students is turning thousands of pages of
            appropriations into something anyone can search, compare and question.
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
              By <span style={{ color: '#111', fontWeight: 600 }}>[Author name]</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>25 November 2026</span>
            <span aria-hidden="true">·</span>
            <span>8 min read</span>
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
            <span>
              Hero photo · Volunteers at a laptop-strewn table during a civic hackathon in Manila
            </span>
          </div>
          <figcaption style={{ marginTop: 10, fontSize: 13, lineHeight: 1.5, color: '#555' }}>
            Volunteers compare appropriations line items during a weekend build session.{' '}
            <span style={{ color: '#777' }}>Photo: [Photographer] for Civic Tech</span>
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
              aria-label="Share on Facebook"
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
              aria-label="Share on X"
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
              aria-label="Copy link"
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
                E
              </span>
              very year, the General Appropriations Act arrives as a wall of PDFs. For most
              citizens — and many journalists — the question of where public money goes ends there,
              at a document too large to read and too fragmented to search.
            </p>
            <p>
              That is the problem a group of volunteers set out to fix. Working evenings and
              weekends, they extract tables from scanned pages, reconcile agency names that change
              from year to year, and publish the result as open data that anyone can download.
            </p>
            <p>
              [Article body continues. Replace with the reported story — interviews, context on the
              budget cycle, and what the data now makes possible for reporters and local officials.]
            </p>

            <blockquote
              style={{
                margin: '40px 0',
                padding: '28px 0',
                borderTop: '2px solid #111',
                borderBottom: '1px solid #E5E5E5',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 'clamp(22px, 3.5vw, 30px)',
                  lineHeight: 1.3,
                  fontStyle: 'italic',
                  fontWeight: 500,
                }}
              >
                “If people can’t find the line item, they can’t ask the question.”
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
                — [Name], volunteer data lead
              </footer>
            </blockquote>

            <h2 style={{ margin: '0 0 16px', fontSize: 30, lineHeight: 1.2, fontWeight: 600 }}>
              From PDF to public record
            </h2>
            <p>
              [Section copy. Explain the pipeline in plain language: how documents are collected,
              checked against official sources, and versioned so changes between the proposed and
              enacted budget are visible.]
            </p>

            <figure style={{ margin: '36px 0' }}>
              <div className="ph" style={{ aspectRatio: '3 / 2' }}>
                Inline photo · A volunteer marking up a printed budget document
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
                [Caption]. <span style={{ color: '#777' }}>Photo: [Photographer]</span>
              </figcaption>
            </figure>

            <p>[Section copy continues.]</p>

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
                Explore the data
              </p>
              <p style={{ margin: '0 0 16px', fontSize: 16, lineHeight: 1.5, color: '#222' }}>
                Search every line item in the national budget on the BetterGov.ph Open Data Portal.
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
                Open the Budget Explorer →
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
              Related
            </h2>
            <a
              href="#"
              style={{ display: 'block', padding: '16px 0', borderBottom: '1px solid #E5E5E5' }}
            >
              <div className="ph" style={{ aspectRatio: '3 / 2', marginBottom: 12, fontSize: 11 }}>
                Photo
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
                Reading the bicam report: a line-by-line guide for first-timers
              </p>
            </a>
            <a
              href="#"
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
                Freedom of Information, explained: how to file a request that gets answered
              </p>
            </a>
            <a href="#" style={{ display: 'block', padding: '16px 0' }}>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'Newsreader, Georgia, serif',
                  fontSize: 19,
                  lineHeight: 1.25,
                  fontWeight: 500,
                }}
              >
                Open data is not a website. It is a habit.
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
            Photo
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>[Author name]</p>
            <p style={{ margin: '4px 0 0', fontSize: 14, lineHeight: 1.5, color: '#555' }}>
              [Short bio — beat, background and how to reach them.]
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
          More from Civic Tech
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: 32,
          }}
        >
          <a href="#" style={{ display: 'block' }}>
            <div className="ph" style={{ aspectRatio: '3 / 2' }}>
              Photo · Jeepney traffic along a Manila avenue
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
              Open Data
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
              Mapping public transport routes when the official data runs out
            </p>
          </a>
          <a href="#" style={{ display: 'block' }}>
            <div className="ph" style={{ aspectRatio: '3 / 2' }}>
              Photo · Barangay hall with residents queuing outside
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
              Community
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
              Inside a barangay that put its procurement records online
            </p>
          </a>
          <a href="#" style={{ display: 'block' }}>
            <div className="ph" style={{ aspectRatio: '3 / 2' }}>
              Photo · Close-up of a phone showing an e-government app
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
              Digital Services
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
              The case for one login across every government service
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
          <span>Civic Tech is an independent newsroom of BetterGov.ph.</span>
          <span>
            <a href="#" style={{ color: '#555' }}>
              Editorial standards
            </a>{' '}
            &nbsp;·&nbsp;{' '}
            <a href="#" style={{ color: '#555' }}>
              Corrections
            </a>{' '}
            &nbsp;·&nbsp;{' '}
            <a href="#" style={{ color: '#555' }}>
              Send a tip
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
