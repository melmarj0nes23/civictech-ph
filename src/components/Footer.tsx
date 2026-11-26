import type { MouseEvent } from 'react';
import { TRANSLATIONS, type Lang } from '../data/i18n';

interface FooterProps {
  lang: Lang;
  onBackHome: () => void;
}

export function Footer({ lang, onBackHome }: FooterProps) {
  const t = TRANSLATIONS[lang];

  const handleBackHome = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onBackHome();
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
  );
}
