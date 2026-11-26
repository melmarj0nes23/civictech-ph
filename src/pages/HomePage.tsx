import type { MouseEvent } from 'react';

const ACCENT = '#0B3D91';

interface HomePageProps {
  onOpenArticle: () => void;
  onOpenCivicTools: () => void;
}

export function HomePage({ onOpenArticle, onOpenCivicTools }: HomePageProps) {
  const handleOpenArticle = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenArticle();
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

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#111', background: '#fff' }}>
      {/* Utility bar */}
      <div style={{ borderBottom: '1px solid #E5E5E5' }}>
        <div className="utility-bar-inner">
          <span className="utility-date">Wednesday, 25 November 2026</span>
          <div className="utility-actions">
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <a href="/" onClick={handleStayHome} style={{ color: '#555' }}>
                English
              </a>
              <a href="/" onClick={handleStayHome} style={{ color: '#555' }}>
                Filipino
              </a>
              <a href="/" onClick={handleStayHome} style={{ color: '#555' }}>
                Sign in
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
              Subscribe
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
        <p className="masthead-date">Wednesday, 25 November 2026</p>
        <h1
          style={{
            margin: 0,
            fontFamily: 'Newsreader, Georgia, serif',
            fontWeight: 600,
            fontSize: 'clamp(44px, 8vw, 84px)',
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          Civic Tech
        </h1>
        <p
          style={{
            margin: '14px 0 0',
            fontSize: 13,
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
          </a>{' '}
          &nbsp;·&nbsp; Technology, data and open government in the Philippines
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
          <a href="/" onClick={handleStayHome} style={{ padding: '14px 0' }}>
            Open Data
          </a>
          <a href="/" onClick={handleStayHome} style={{ padding: '14px 0' }}>
            Budget
          </a>
          <a href="/" onClick={handleStayHome} style={{ padding: '14px 0' }}>
            Elections
          </a>
          <a href="/" onClick={handleStayHome} style={{ padding: '14px 0' }}>
            Policy
          </a>
          <a href="/" onClick={handleStayHome} style={{ padding: '14px 0' }}>
            Digital Services
          </a>
          <a href="/" onClick={handleStayHome} style={{ padding: '14px 0' }}>
            Tools
          </a>
          <a href="/" onClick={handleStayHome} style={{ padding: '14px 0' }}>
            Opinion
          </a>
          <a href="/" onClick={handleStayHome} style={{ padding: '14px 0' }}>
            Community
          </a>
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
            <a href="/article" onClick={handleOpenArticle} style={{ display: 'block' }}>
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
                <span>
                  Lead photo · Volunteers at a laptop-strewn table during a civic hackathon in
                  Manila
                </span>
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
              Open Data
            </p>
            <h2
              style={{
                margin: 0,
                fontFamily: 'Newsreader, Georgia, serif',
                fontWeight: 500,
                fontSize: 'clamp(28px, 4.5vw, 46px)',
                lineHeight: 1.08,
                letterSpacing: '-0.015em',
              }}
            >
              <a href="/article" onClick={handleOpenArticle}>
                The volunteers rebuilding how Filipinos read the national budget
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
              A loose network of engineers, researchers and students is turning thousands of pages
              of appropriations into something anyone can search, compare and question.
            </p>
            <p style={{ margin: '16px 0 0', fontSize: 13, color: '#555' }}>
              By <span style={{ color: '#111', fontWeight: 600 }}>[Author name]</span> &nbsp;·&nbsp;
              8 min read
            </p>
          </article>

          <aside
            aria-label="Top stories"
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
              Top stories
            </p>
            <a
              href="#"
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
                  Elections
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
                  What a transparent canvassing dashboard should actually show
                </p>
              </div>
              <div className="ph" style={{ width: 96, height: 96, flex: 'none', fontSize: 10 }}>
                Photo
              </div>
            </a>
            <a
              href="#"
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
                  Policy
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
                  Freedom of Information, explained: how to file a request that gets answered
                </p>
              </div>
              <div className="ph" style={{ width: 96, height: 96, flex: 'none', fontSize: 10 }}>
                Photo
              </div>
            </a>
            <a
              href="#"
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
                  Digital Services
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
                  Why so many .gov.ph websites still break on a phone
                </p>
              </div>
              <div className="ph" style={{ width: 96, height: 96, flex: 'none', fontSize: 10 }}>
                Photo
              </div>
            </a>
            <a href="#" style={{ display: 'flex', gap: 16, padding: '18px 0' }}>
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
                  Tools
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
                  A field guide to spotting scam texts that impersonate government agencies
                </p>
              </div>
              <div className="ph" style={{ width: 96, height: 96, flex: 'none', fontSize: 10 }}>
                Photo
              </div>
            </a>
          </aside>
        </section>

        {/* Latest --> */}
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
              Latest
            </h2>
            <a href="#" style={{ fontSize: 13, color: '#555' }}>
              View all →
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
                <h3
                  style={{
                    margin: 0,
                    fontFamily: 'Newsreader, Georgia, serif',
                    fontSize: 23,
                    lineHeight: 1.2,
                    fontWeight: 500,
                  }}
                >
                  Mapping public transport routes when the official data runs out
                </h3>
                <p style={{ margin: '10px 0 0', fontSize: 15, lineHeight: 1.5, color: '#444' }}>
                  How commuter-sourced maps are filling gaps that agencies have yet to publish.
                </p>
              </a>
            </article>
            <article>
              <a href="#" style={{ display: 'block' }}>
                <div className="ph" style={{ aspectRatio: '3 / 2' }}>
                  Photo · Session hall of the House of Representatives
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
                  Budget
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
                  Reading the bicam report: a line-by-line guide for first-timers
                </h3>
                <p style={{ margin: '10px 0 0', fontSize: 15, lineHeight: 1.5, color: '#444' }}>
                  The stage of the budget cycle where the biggest changes are made, and the least is
                  explained.
                </p>
              </a>
            </article>
            <article>
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
                <h3
                  style={{
                    margin: 0,
                    fontFamily: 'Newsreader, Georgia, serif',
                    fontSize: 23,
                    lineHeight: 1.2,
                    fontWeight: 500,
                  }}
                >
                  Inside a barangay that put its procurement records online
                </h3>
                <p style={{ margin: '10px 0 0', fontSize: 15, lineHeight: 1.5, color: '#444' }}>
                  What changed for residents once contracts and suppliers became searchable.
                </p>
              </a>
            </article>
            <article>
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
                <h3
                  style={{
                    margin: 0,
                    fontFamily: 'Newsreader, Georgia, serif',
                    fontSize: 23,
                    lineHeight: 1.2,
                    fontWeight: 500,
                  }}
                >
                  The case for one login across every government service
                </h3>
                <p style={{ margin: '10px 0 0', fontSize: 15, lineHeight: 1.5, color: '#444' }}>
                  Digital ID promises convenience. Here is what it has to get right on privacy first.
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
            Photo essay · Rice terraces at dawn, for a story on connectivity in upland provinces
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
              Long read
            </p>
            <h2
              id="feature"
              style={{
                margin: 0,
                fontFamily: 'Newsreader, Georgia, serif',
                fontSize: 'clamp(26px, 3.8vw, 36px)',
                lineHeight: 1.12,
                fontWeight: 500,
              }}
            >
              <a href="#">Last mile, last in line: who gets left out when services go online</a>
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
              A reporting trip through municipalities where the nearest stable signal is a jeepney
              ride away.
            </p>
            <p style={{ margin: '16px 0 0', fontSize: 13, color: '#555' }}>
              By <span style={{ color: '#111', fontWeight: 600 }}>[Author name]</span> &nbsp;·&nbsp;
              Photographs by <span style={{ color: '#111', fontWeight: 600 }}>[Photographer]</span>
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
              Opinion
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
                gap: 28,
                paddingTop: 16,
              }}
            >
              <a href="#" style={{ display: 'block' }}>
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'Newsreader, Georgia, serif',
                    fontStyle: 'italic',
                    fontSize: 22,
                    lineHeight: 1.3,
                  }}
                >
                  Open data is not a website. It is a habit.
                </p>
                <p style={{ margin: '10px 0 0', fontSize: 13, color: '#555' }}>[Columnist name]</p>
              </a>
              <a href="#" style={{ display: 'block' }}>
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'Newsreader, Georgia, serif',
                    fontStyle: 'italic',
                    fontSize: 22,
                    lineHeight: 1.3,
                  }}
                >
                  Volunteers built it. Now government has to maintain it.
                </p>
                <p style={{ margin: '10px 0 0', fontSize: 13, color: '#555' }}>[Columnist name]</p>
              </a>
              <a href="#" style={{ display: 'block' }}>
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'Newsreader, Georgia, serif',
                    fontStyle: 'italic',
                    fontSize: 22,
                    lineHeight: 1.3,
                  }}
                >
                  Let AI read the bills — but keep humans in the hearing room.
                </p>
                <p style={{ margin: '10px 0 0', fontSize: 13, color: '#555' }}>[Columnist name]</p>
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
              Civic tools
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
                  Open Data Portal <span aria-hidden="true" style={{ color: ACCENT }}>→</span>
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
                  Budget Explorer <span aria-hidden="true" style={{ color: ACCENT }}>→</span>
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
                  ScamCheck <span aria-hidden="true" style={{ color: ACCENT }}>→</span>
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
                  View All Tools <span aria-hidden="true" style={{ color: ACCENT }}>→</span>
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
            The Civic Tech Weekly
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
            Our editors&apos; picks on data, digital government and the people building public
            tools. Every Friday.
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
              Email address
            </label>
            <input
              id="nl-email"
              type="email"
              placeholder="you@example.com"
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
              Sign up
            </button>
          </form>
        </section>
      </main>

      {/* Footer */}
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
              An independent newsroom of BetterGov.ph, the volunteer-run movement for government
              transparency in the Philippines.
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48, fontSize: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontWeight: 600 }}>About</span>
              <a href="#" style={{ color: '#555' }}>
                Our mission
              </a>
              <a href="#" style={{ color: '#555' }}>
                Editorial standards
              </a>
              <a href="#" style={{ color: '#555' }}>
                Corrections
              </a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontWeight: 600 }}>Get involved</span>
              <a href="#" style={{ color: '#555' }}>
                Volunteer
              </a>
              <a href="#" style={{ color: '#555' }}>
                Send a tip
              </a>
              <a href="#" style={{ color: '#555' }}>
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
