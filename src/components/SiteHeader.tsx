import { Show, UserButton } from '@clerk/react';
import { useState, type MouseEvent } from 'react';
import { CATEGORIES, type CategorySlug } from '../data/articles';
import { TRANSLATIONS, type Lang } from '../data/i18n';
import { MobileAuthButton, MobileMenu } from './MobileMenu';
import { SearchModal } from './SearchModal';

const ACCENT = '#0B3D91';
const HAS_CLERK = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

const CLERK_THEME = {
  variables: {
    colorPrimary: ACCENT,
    colorText: '#111111',
    colorTextSecondary: '#555555',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '14px',
    borderRadius: '0px',
  },
  elements: {
    userButtonPopoverCard: {
      borderRadius: '0px',
      border: '1px solid #E5E5E5',
      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
    },
    userButtonPopoverActionButton: {
      borderRadius: '0px',
      fontSize: '14px',
    },
  },
} as const;

const USER_PROFILE_PROPS = {
  appearance: {
    variables: {
      colorPrimary: ACCENT,
      colorText: '#111111',
      colorTextSecondary: '#555555',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '14px',
      borderRadius: '0px',
    },
    elements: {
      cardBox: {
        borderRadius: '0px',
        border: '1px solid #E5E5E5',
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.16)',
      },
      headerTitle: {
        fontFamily: 'Newsreader, Georgia, serif',
        fontWeight: 600,
      },
      navbarButton: {
        borderRadius: '0px',
        fontSize: '14px',
      },
      formButtonPrimary: {
        borderRadius: '0px',
        fontSize: '14px',
      },
    },
  },
} as const;

interface SiteHeaderProps {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  onBackHome: () => void;
  onOpenCategory: (slug: CategorySlug) => void;
  onOpenCivicTools: () => void;
  onSubscribe?: () => void;
  activeCategory?: CategorySlug;
}

export function SiteHeader({
  lang,
  onLangChange,
  onBackHome,
  onOpenCategory,
  onOpenCivicTools,
  onSubscribe,
  activeCategory,
}: SiteHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const t = TRANSLATIONS[lang];

  const handleOpenAuthPage = () => {
    window.history.pushState(null, '', '/login');
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0 });
  };

  const handleOpenArticle = (slug: string) => {
    const path = slug === 'volunteers-national-budget' ? '/article' : `/article/${slug}`;
    window.history.pushState(null, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0 });
  };

  const handleBackHome = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onBackHome();
  };

  const handleCategory = (slug: CategorySlug) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenCategory(slug);
  };

  const handleSwitchLang = (next: Lang) => (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onLangChange(next);
  };

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          borderBottom: '1px solid #E5E5E5',
          background: '#fff',
        }}
      >
        <div className="site-header-inner">
          <MobileMenu
            lang={lang}
            onLangChange={onLangChange}
            onOpenCategory={onOpenCategory}
            onSubscribe={onSubscribe ?? onBackHome}
            onOpenSearch={() => setSearchOpen(true)}
            onOpenCivicTools={onOpenCivicTools}
            onBackHome={onBackHome}
          />

        {/* Brand */}
        <div className="site-brand">
          <a
            href="/"
            onClick={handleBackHome}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'Newsreader, Georgia, serif',
              fontSize: 32,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: '#111',
              whiteSpace: 'nowrap',
            }}
          >
            <img
              src="/logo.png"
              alt="Civic Tech logo"
              className="site-brand-logo"
            />
            Civic Tech
          </a>
          <span className="site-brand-sub">
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

        {/* Desktop Categories */}
        <nav aria-label="Sections" className="site-nav">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <a
                key={cat.slug}
                href={`/category/${cat.slug}`}
                onClick={handleCategory(cat.slug)}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  color: isActive ? ACCENT : undefined,
                  fontWeight: isActive ? 600 : undefined,
                  borderBottom: isActive ? `2px solid ${ACCENT}` : '2px solid transparent',
                }}
              >
                {cat.label[lang]}
              </a>
            );
          })}
        </nav>

        {/* Desktop Right Actions (GovInsider layout: Search, Language, Login / Sign Up) */}
        <div className="site-actions">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="site-search-link"
            style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}
            aria-label={lang === 'en' ? 'Open search' : 'Buksan ang paghahanap'}
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
            <span>{lang === 'en' ? 'Search' : 'Hanapin'}</span>
          </button>

          <button
            type="button"
            onClick={handleSwitchLang(lang === 'en' ? 'fil' : 'en')}
            className="site-lang-btn"
            aria-label={lang === 'en' ? 'Switch language to Filipino' : 'Switch language to English'}
            title={lang === 'en' ? 'Switch to Filipino' : 'Switch to English'}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 8l6 6" />
              <path d="M4 14l6-6 2-3" />
              <path d="M2 5h12" />
              <path d="M7 2h1" />
              <path d="M22 22l-5-10-5 10" />
              <path d="M14 18h6" />
            </svg>
            <span>{lang === 'en' ? 'EN' : 'FIL'}</span>
            <span aria-hidden="true" style={{ fontSize: 10, color: '#666' }}>
              ▾
            </span>
          </button>

          {HAS_CLERK ? (
            <>
              <Show when="signed-out">
                <a
                  href="/login"
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenAuthPage();
                  }}
                  className="site-auth-btn"
                >
                  {lang === 'en' ? 'Login / Sign up' : 'Mag-login'}
                </a>
              </Show>
              <Show when="signed-in">
                <UserButton
                  appearance={CLERK_THEME}
                  userProfileProps={USER_PROFILE_PROPS}
                  userProfileMode="navigation"
                  userProfileUrl="/profile"
                />
              </Show>
            </>
          ) : (
            <a
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                handleOpenAuthPage();
              }}
              className="site-auth-btn"
            >
              {lang === 'en' ? 'Login / Sign up' : 'Mag-login'}
            </a>
          )}
        </div>

        {HAS_CLERK ? (
          <>
            <Show when="signed-out">
              <MobileAuthButton lang={lang} onClick={handleOpenAuthPage} />
            </Show>
            <Show when="signed-in">
              <div className="mobile-user-btn">
                <UserButton
                  appearance={CLERK_THEME}
                  userProfileProps={USER_PROFILE_PROPS}
                  userProfileMode="navigation"
                  userProfileUrl="/profile"
                />
              </div>
            </Show>
          </>
        ) : (
          <MobileAuthButton lang={lang} onClick={handleOpenAuthPage} />
        )}
      </div>
    </header>

    <SearchModal
      open={searchOpen}
      lang={lang}
      onClose={() => setSearchOpen(false)}
      onOpenArticle={handleOpenArticle}
      onOpenCivicTools={onOpenCivicTools}
    />
  </>
  );
}
