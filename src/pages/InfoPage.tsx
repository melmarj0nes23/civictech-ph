import type { MouseEvent } from 'react';
import { Footer } from '../components/Footer';
import { SiteHeader } from '../components/SiteHeader';
import { type CategorySlug } from '../data/articles';
import { type Lang } from '../data/i18n';
import { INFO_PAGES, type InfoPageSlug } from '../data/infoPages';

const ACCENT = '#0B3D91';

interface InfoPageProps {
  slug: InfoPageSlug;
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  onBackHome: () => void;
  onOpenCivicTools: () => void;
  onOpenSubmit: (hash?: string) => void;
  onOpenCategory: (slug: CategorySlug) => void;
  onOpenInfo: (slug: InfoPageSlug) => void;
}

export function InfoPage({
  slug,
  lang,
  onLangChange,
  onBackHome,
  onOpenCivicTools,
  onOpenSubmit,
  onOpenCategory,
  onOpenInfo,
}: InfoPageProps) {
  const page = INFO_PAGES[slug];

  const handleCta = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!page.cta) return;
    if (page.cta.route === 'civictools') onOpenCivicTools();
    else if (page.cta.route === 'submit') {
      const hashIdx = page.cta.href.indexOf('#');
      onOpenSubmit(hashIdx >= 0 ? page.cta.href.slice(hashIdx) : undefined);
    } else onBackHome();
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#111', background: '#fff' }}>
      <SiteHeader
        lang={lang}
        onLangChange={onLangChange}
        onBackHome={onBackHome}
        onOpenCategory={onOpenCategory}
        onOpenCivicTools={onOpenCivicTools}
      />

      <main className="info-main" style={{ maxWidth: 740, margin: '0 auto', padding: '48px 24px 72px' }}>
        <p
          style={{
            margin: '0 0 12px',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: ACCENT,
          }}
        >
          {page.kicker[lang]}
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
          {page.title[lang]}
        </h1>
        <p
          className="article-deck"
          style={{
            margin: '18px 0 0',
            fontFamily: 'Newsreader, Georgia, serif',
            fontSize: 21,
            lineHeight: 1.45,
            color: '#333',
            paddingBottom: 28,
            borderBottom: '1px solid #E5E5E5',
          }}
        >
          {page.deck[lang]}
        </p>

        <div
          className="body info-body"
          style={{
            marginTop: 32,
            fontFamily: 'Newsreader, Georgia, serif',
            fontSize: 20,
            lineHeight: 1.65,
            color: '#1A1A1A',
          }}
        >
          {page.sections.map((section) => (
            <section key={section.heading.en} style={{ marginBottom: 32 }}>
              <h2
                style={{
                  margin: '0 0 14px',
                  fontSize: 28,
                  lineHeight: 1.2,
                  fontWeight: 600,
                }}
              >
                {section.heading[lang]}
              </h2>
              {section.paragraphs[lang].map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </section>
          ))}
        </div>

        {page.cta && (
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #E5E5E5' }}>
            <a
              href={page.cta.href}
              onClick={handleCta}
              className="info-cta"
              style={{
                background: ACCENT,
                color: '#fff',
                padding: '0 20px',
                minHeight: 44,
                display: 'inline-flex',
                alignItems: 'center',
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {page.cta.label[lang]}
            </a>
          </div>
        )}
      </main>

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
