import type { MouseEvent } from 'react';
import { TRANSLATIONS, type Lang } from '../data/i18n';
import type { InfoPageSlug } from '../data/infoPages';

interface FooterProps {
  lang: Lang;
  onBackHome: () => void;
  onOpenCivicTools: () => void;
  onOpenSubmit: (hash?: string) => void;
  onOpenInfo: (slug: InfoPageSlug) => void;
}

export function Footer({
  lang,
  onBackHome,
  onOpenCivicTools,
  onOpenSubmit,
  onOpenInfo,
}: FooterProps) {
  const t = TRANSLATIONS[lang];

  const handleBackHome = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onBackHome();
  };

  const handleOpenCivicTools = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenCivicTools();
  };

  const handleOpenSubmit =
    (hash?: string) => (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      onOpenSubmit(hash);
    };

  const handleOpenInfo =
    (slug: InfoPageSlug) => (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      onOpenInfo(slug);
    };

  return (
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
            <a href="/" onClick={handleBackHome}>
              Civic Tech
            </a>
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
            <span style={{ fontWeight: 600 }}>{t.footer.directory}</span>
            <a href="/civictools" onClick={handleOpenCivicTools} style={{ color: '#555' }}>
              {t.footer.civicTools}
            </a>
            <a href="/civictools/submit" onClick={handleOpenSubmit()} style={{ color: '#555' }}>
              {t.footer.submitEntry}
            </a>
            <a
              href="/civictools/submit#update"
              onClick={handleOpenSubmit('#update')}
              style={{ color: '#555' }}
            >
              {t.footer.postUpdate}
            </a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontWeight: 600 }}>{t.footer.about}</span>
            <a href="/mission" onClick={handleOpenInfo('mission')} style={{ color: '#555' }}>
              {t.footer.ourMission}
            </a>
            <a
              href="/editorial-standards"
              onClick={handleOpenInfo('editorial-standards')}
              style={{ color: '#555' }}
            >
              {t.footer.editorialStandards}
            </a>
            <a href="/corrections" onClick={handleOpenInfo('corrections')} style={{ color: '#555' }}>
              {t.footer.corrections}
            </a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontWeight: 600 }}>{t.footer.getInvolved}</span>
            <a href="/volunteer" onClick={handleOpenInfo('volunteer')} style={{ color: '#555' }}>
              {t.footer.volunteer}
            </a>
            <a href="/" onClick={handleBackHome} style={{ color: '#555' }}>
              {t.footer.sendATip}
            </a>
            <a href="/" onClick={handleBackHome} style={{ color: '#555' }}>
              {t.footer.contact}
            </a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontWeight: 600 }}>{t.footer.source}</span>
            <a
              href="https://github.com/melmarj0nes23/civictech-ph"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#555' }}
            >
              {t.footer.github}
            </a>
            <a
              href="https://github.com/melmarj0nes23/civictech-ph/issues"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#555' }}
            >
              {t.footer.reportProblem}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
