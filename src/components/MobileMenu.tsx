import { useEffect, useState, type MouseEvent } from 'react';
import { CATEGORIES, type CategorySlug } from '../data/articles';
import { TRANSLATIONS, type Lang } from '../data/i18n';

const ACCENT = '#0B3D91';

interface MobileMenuProps {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  onOpenCategory: (slug: CategorySlug) => void;
  onSubscribe: () => void;
  onOpenSearch?: () => void;
  onOpenCivicTools?: () => void;
  onBackHome?: () => void;
}

interface MobileAuthButtonProps {
  lang: Lang;
  onClick?: () => void;
}

export function MobileAuthButton({ lang, onClick }: MobileAuthButtonProps) {
  return (
    <a
      href="/"
      className="mobile-auth-btn"
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
    >
      {lang === 'en' ? 'Login / Sign up' : 'Mag-login'}
    </a>
  );
}

export function MobileMenu({
  lang,
  onLangChange,
  onOpenCategory,
  onSubscribe,
  onOpenSearch,
  onOpenCivicTools,
  onBackHome,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const handleCategory = (slug: CategorySlug) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    onOpenCategory(slug);
  };

  const handleLang = (next: Lang) => (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onLangChange(next);
    setOpen(false);
  };

  const handleSubscribe = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    onSubscribe();
  };

  const handleCivicTools = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    onOpenCivicTools?.();
  };

  const handleHome = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    onBackHome?.();
  };

  return (
    <>
      <button
        type="button"
        className="mobile-burger-btn"
        aria-label={lang === 'en' ? 'Open menu' : 'Buksan ang menu'}
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lang === 'en' ? 'Mobile navigation' : 'Nabigasyon sa mobile'}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
          }}
        >
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(17, 17, 17, 0.45)',
            }}
          />
          <div
            style={{
              position: 'relative',
              zIndex: 1001,
              width: 300,
              maxWidth: '85vw',
              height: '100%',
              background: '#fff',
              borderRight: '1px solid #E5E5E5',
              boxShadow: '4px 0 24px rgba(0, 0, 0, 0.12)',
              overflowY: 'auto',
              padding: '12px 20px 32px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            {/* Drawer header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: 12,
                borderBottom: '1px solid #E5E5E5',
              }}
            >
              <a
                href="/"
                onClick={handleHome}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: 'Newsreader, Georgia, serif',
                  fontSize: 24,
                  fontWeight: 600,
                  color: '#111',
                }}
              >
                <img
                  src="/logo.png"
                  alt="Civic Tech logo"
                  style={{ height: 24, width: 'auto', display: 'block' }}
                />
                Civic Tech
              </a>
              <button
                type="button"
                aria-label={lang === 'en' ? 'Close menu' : 'Isara ang menu'}
                onClick={() => setOpen(false)}
                style={{
                  width: 44,
                  height: 44,
                  marginRight: -10,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: 'none',
                  color: '#111',
                  fontSize: 24,
                  lineHeight: 1,
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            {/* Subscribe CTA + Search */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a
                href="/#newsletter"
                onClick={handleSubscribe}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  minHeight: 44,
                  background: ACCENT,
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 14,
                  boxSizing: 'border-box',
                }}
              >
                {t.subscribe}
              </a>
              {onOpenSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onOpenSearch();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    width: '100%',
                    minHeight: 42,
                    border: '1px solid #D4D4D4',
                    background: '#fff',
                    color: '#111',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  {lang === 'en' ? 'Search articles & tools' : 'Maghanap ng artikulo at tool'}
                </button>
              )}
            </div>

            {/* Language switcher */}
            <div style={{ borderBottom: '1px solid #E5E5E5', paddingBottom: 16 }}>
              <p
                style={{
                  margin: '0 0 10px',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#555',
                }}
              >
                {lang === 'en' ? 'Language' : 'Wika'}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button
                  type="button"
                  onClick={handleLang('en')}
                  aria-pressed={lang === 'en'}
                  style={{
                    minHeight: 40,
                    border: lang === 'en' ? `1px solid ${ACCENT}` : '1px solid #D4D4D4',
                    background: lang === 'en' ? '#F4F6FA' : '#fff',
                    color: lang === 'en' ? ACCENT : '#111',
                    fontWeight: lang === 'en' ? 600 : 500,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  {t.english}
                </button>
                <button
                  type="button"
                  onClick={handleLang('fil')}
                  aria-pressed={lang === 'fil'}
                  style={{
                    minHeight: 40,
                    border: lang === 'fil' ? `1px solid ${ACCENT}` : '1px solid #D4D4D4',
                    background: lang === 'fil' ? '#F4F6FA' : '#fff',
                    color: lang === 'fil' ? ACCENT : '#111',
                    fontWeight: lang === 'fil' ? 600 : 500,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  {t.filipino}
                </button>
              </div>
            </div>

            {/* Article categories */}
            <nav aria-label={lang === 'en' ? 'Categories' : 'Mga Kategorya'}>
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
                {lang === 'en' ? 'Categories' : 'Mga Kategorya'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {CATEGORIES.map((cat) => (
                  <a
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    onClick={handleCategory(cat.slug)}
                    style={{
                      padding: '11px 0',
                      borderBottom: '1px solid #F0F0F0',
                      fontSize: 15,
                      fontWeight: 500,
                      color: '#111',
                    }}
                  >
                    {cat.label[lang]}
                  </a>
                ))}
              </div>
            </nav>

            {onOpenCivicTools && (
              <div>
                <a
                  href="/civictools"
                  onClick={handleCivicTools}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    background: '#F4F6FA',
                    fontSize: 14,
                    fontWeight: 600,
                    color: ACCENT,
                  }}
                >
                  <span>{t.directory.title}</span>
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
