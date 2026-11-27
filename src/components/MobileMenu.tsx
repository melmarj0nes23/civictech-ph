import { useEffect, useState, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import {
  ARTICLE_SUBCATEGORIES,
  getCategoryBySlug,
  TOP_NAV_CATEGORIES,
  type CategorySlug,
} from '../data/articles';
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
      href="/login"
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
  const [langOpen, setLangOpen] = useState(false);
  const [articlesOpen, setArticlesOpen] = useState(false);
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
    setLangOpen(false);
  };

  const handleSubscribe = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    onSubscribe();
  };

  const handleNavigatePath = (path: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    window.history.pushState(null, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0 });
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

      {open &&
        createPortal(
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

            {/* Search -> Language -> Subscribe */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                paddingBottom: 16,
                borderBottom: '1px solid #E5E5E5',
              }}
            >
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
                    minHeight: 40,
                    border: 'none',
                    background: 'transparent',
                    color: '#111',
                    fontFamily: 'inherit',
                    fontWeight: 500,
                    fontSize: 14,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                >
                  <svg
                    width="16"
                    height="16"
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
                  {lang === 'en' ? 'Search' : 'Hanapin'}
                </button>
              )}

              <div>
                <button
                  type="button"
                  onClick={() => setLangOpen((prev) => !prev)}
                  aria-expanded={langOpen}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    minHeight: 44,
                    padding: '0 14px',
                    border: '1px solid #D4D4D4',
                    background: '#fff',
                    color: '#111',
                    fontFamily: 'inherit',
                    fontSize: 14,
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                >
                  <span>
                    <strong style={{ fontWeight: 600 }}>
                      {lang === 'en' ? 'Language:' : 'Wika:'}
                    </strong>{' '}
                    {lang === 'en' ? t.english : t.filipino}
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    style={{
                      transform: langOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 150ms ease',
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {langOpen && (
                  <div
                    style={{
                      border: '1px solid #D4D4D4',
                      borderTop: 'none',
                      background: '#fff',
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleLang('en')}
                      aria-pressed={lang === 'en'}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 14px',
                        border: 'none',
                        borderBottom: '1px solid #F0F0F0',
                        background: lang === 'en' ? '#F4F6FA' : '#fff',
                        color: lang === 'en' ? ACCENT : '#111',
                        fontFamily: 'inherit',
                        fontWeight: lang === 'en' ? 600 : 400,
                        fontSize: 14,
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
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 14px',
                        border: 'none',
                        background: lang === 'fil' ? '#F4F6FA' : '#fff',
                        color: lang === 'fil' ? ACCENT : '#111',
                        fontFamily: 'inherit',
                        fontWeight: lang === 'fil' ? 600 : 400,
                        fontSize: 14,
                        cursor: 'pointer',
                      }}
                    >
                      {t.filipino}
                    </button>
                  </div>
                )}
              </div>

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
            </div>

            {/* Article categories */}
            <nav aria-label={lang === 'en' ? 'Categories' : 'Mga Kategorya'}>
              <p
                style={{
                  margin: '0 0 6px',
                  paddingBottom: 8,
                  borderBottom: '1px solid #111',
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: ACCENT,
                }}
              >
                {lang === 'en' ? 'Categories' : 'Mga Kategorya'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <button
                  type="button"
                  onClick={() => setArticlesOpen((prev) => !prev)}
                  aria-expanded={articlesOpen}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '11px 0',
                    border: 'none',
                    borderBottom: '1px solid #F0F0F0',
                    background: 'transparent',
                    fontFamily: 'inherit',
                    fontSize: 15,
                    fontWeight: 500,
                    color: '#111',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span>{lang === 'en' ? 'Articles' : 'Mga Artikulo'}</span>
                  <span aria-hidden="true" style={{ fontSize: 11, color: '#666' }}>
                    {articlesOpen ? '▴' : '▾'}
                  </span>
                </button>
                {articlesOpen && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      paddingLeft: 14,
                      background: '#FAFAFA',
                      borderBottom: '1px solid #F0F0F0',
                    }}
                  >
                    {ARTICLE_SUBCATEGORIES.map((slug) => {
                      const cat = getCategoryBySlug(slug);
                      if (!cat) return null;
                      return (
                        <a
                          key={cat.slug}
                          href={`/category/${cat.slug}`}
                          onClick={handleCategory(cat.slug)}
                          style={{
                            padding: '9px 0',
                            borderBottom: '1px solid #EFEFEF',
                            fontSize: 14,
                            fontWeight: 500,
                            color: '#222',
                          }}
                        >
                          {cat.label[lang]}
                        </a>
                      );
                    })}
                    <a
                      href="/category"
                      onClick={handleNavigatePath('/category')}
                      style={{
                        padding: '9px 0',
                        fontSize: 14,
                        fontWeight: 600,
                        color: ACCENT,
                      }}
                    >
                      {lang === 'en' ? 'All Articles →' : 'Lahat ng Artikulo →'}
                    </a>
                  </div>
                )}

                {TOP_NAV_CATEGORIES.map((slug) => {
                  const cat = getCategoryBySlug(slug);
                  if (!cat) return null;
                  return (
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
                  );
                })}
              </div>
            </nav>

            {onOpenCivicTools && (
              <nav
                aria-label={lang === 'en' ? 'Directory' : 'Direktoryo'}
                style={{ marginTop: 12 }}
              >
                <p
                  style={{
                    margin: '0 0 6px',
                    paddingBottom: 8,
                    borderBottom: '1px solid #111',
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: ACCENT,
                  }}
                >
                  {lang === 'en' ? 'Directory' : 'Direktoryo'}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <a
                    href="/civictools?kind=project"
                    onClick={handleNavigatePath('/civictools?kind=project')}
                    style={{
                      padding: '11px 0',
                      borderBottom: '1px solid #F0F0F0',
                      fontSize: 15,
                      fontWeight: 500,
                      color: '#111',
                    }}
                  >
                    {lang === 'en' ? 'Civic Tech Tools' : 'Mga Civic Tech Tool'}
                  </a>
                  <a
                    href="/civictools?kind=cso"
                    onClick={handleNavigatePath('/civictools?kind=cso')}
                    style={{
                      padding: '11px 0',
                      borderBottom: '1px solid #F0F0F0',
                      fontSize: 15,
                      fontWeight: 500,
                      color: '#111',
                    }}
                  >
                    {lang === 'en' ? 'CSO Listing' : 'Listahan ng mga CSO'}
                  </a>
                  <a
                    href="/civictools/submit"
                    onClick={handleNavigatePath('/civictools/submit')}
                    style={{
                      padding: '11px 0',
                      borderBottom: '1px solid #F0F0F0',
                      fontSize: 15,
                      fontWeight: 500,
                      color: '#111',
                    }}
                  >
                    {lang === 'en' ? 'Submit Project' : 'Mag-submit ng Proyekto'}
                  </a>
                </div>
              </nav>
            )}
          </div>
        </div>,
          document.body
        )}
    </>
  );
}
