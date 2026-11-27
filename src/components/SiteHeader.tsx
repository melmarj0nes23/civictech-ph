import { Show, UserButton, useUser } from '@clerk/react';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import {
  ARTICLE_SUBCATEGORIES,
  getCategoryBySlug,
  TOP_NAV_CATEGORIES,
  type CategorySlug,
} from '../data/articles';
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

function AdminUserButton({ lang }: { lang: Lang }) {
  const { user } = useUser();
  const role = String(
    (user?.publicMetadata as { role?: string } | undefined)?.role || ''
  ).toLowerCase();
  const canPublish = role === 'admin' || role === 'editor';
  const isAdmin = role === 'admin';

  const navigateTo = (path: string) => {
    window.history.pushState(null, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0 });
  };

  return (
    <UserButton
      appearance={CLERK_THEME}
      userProfileProps={USER_PROFILE_PROPS}
      userProfileMode="navigation"
      userProfileUrl="/profile"
    >
      {(canPublish || isAdmin) && (
        <UserButton.MenuItems>
          {canPublish && (
            <UserButton.Action
              label="Newsroom"
              labelIcon={
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
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              }
              onClick={() => navigateTo('/write')}
            />
          )}
          {canPublish && (
            <UserButton.Action
              label="Newsletter"
              labelIcon={
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
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              }
              onClick={() => navigateTo('/profile?panel=newsletter')}
            />
          )}
          {isAdmin && (
            <UserButton.Action
              label={lang === 'en' ? 'Team Roles' : 'Mga Papel ng Team'}
              labelIcon={
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
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              }
              onClick={() => navigateTo('/profile?panel=team')}
            />
          )}
          {isAdmin && (
            <UserButton.Action
              label={lang === 'en' ? 'Manage Banner' : 'Pamahalaan ang Banner'}
              labelIcon={
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
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              }
              onClick={() => navigateTo('/profile?panel=banners')}
            />
          )}
        </UserButton.MenuItems>
      )}
    </UserButton>
  );
}

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
  const [articlesOpen, setArticlesOpen] = useState(false);
  const articlesMenuRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[lang];

  const isArticleSubActive = Boolean(
    activeCategory && ARTICLE_SUBCATEGORIES.includes(activeCategory)
  );

  useEffect(() => {
    if (!articlesOpen) return;
    const onPointerDown = (e: globalThis.MouseEvent) => {
      if (
        articlesMenuRef.current &&
        !articlesMenuRef.current.contains(e.target as Node)
      ) {
        setArticlesOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setArticlesOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [articlesOpen]);

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
    setArticlesOpen(false);
    onOpenCategory(slug);
  };

  const handleAllArticles = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setArticlesOpen(false);
    window.history.pushState(null, '', '/category');
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0 });
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

        {/* Desktop Categories: Articles ▾ Budget Videos Events Tools Opinion */}
        <nav aria-label="Sections" className="site-nav">
          <div
            ref={articlesMenuRef}
            className="site-nav-dropdown"
            onMouseEnter={() => setArticlesOpen(true)}
            onMouseLeave={() => setArticlesOpen(false)}
          >
            <button
              type="button"
              className="site-nav-dropdown-btn"
              aria-expanded={articlesOpen}
              aria-haspopup="menu"
              onClick={() => setArticlesOpen((prev) => !prev)}
              style={{
                color: isArticleSubActive ? ACCENT : undefined,
                fontWeight: isArticleSubActive ? 600 : undefined,
                borderBottom: isArticleSubActive
                  ? `2px solid ${ACCENT}`
                  : '2px solid transparent',
              }}
            >
              <span>{lang === 'en' ? 'Articles' : 'Mga Artikulo'}</span>
              <span aria-hidden="true" style={{ fontSize: 10, color: '#666' }}>
                ▾
              </span>
            </button>

            {articlesOpen && (
              <div className="site-nav-dropdown-menu" role="menu">
                {ARTICLE_SUBCATEGORIES.map((slug) => {
                  const cat = getCategoryBySlug(slug);
                  if (!cat) return null;
                  const isActive = activeCategory === cat.slug;
                  return (
                    <a
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      role="menuitem"
                      onClick={handleCategory(cat.slug)}
                      aria-current={isActive ? 'page' : undefined}
                      style={{
                        color: isActive ? ACCENT : undefined,
                        fontWeight: isActive ? 600 : undefined,
                        background: isActive ? '#F4F6FA' : undefined,
                      }}
                    >
                      {cat.label[lang]}
                    </a>
                  );
                })}
                <a
                  href="/category"
                  role="menuitem"
                  onClick={handleAllArticles}
                  className="site-nav-dropdown-all"
                >
                  {lang === 'en' ? 'All Articles →' : 'Lahat ng Artikulo →'}
                </a>
              </div>
            )}
          </div>

          {TOP_NAV_CATEGORIES.map((slug) => {
            const cat = getCategoryBySlug(slug);
            if (!cat) return null;
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
                <AdminUserButton lang={lang} />
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
                <AdminUserButton lang={lang} />
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
