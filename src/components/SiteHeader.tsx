import type { MouseEvent } from 'react';
import { CATEGORIES, type CategorySlug } from '../data/articles';
import { TRANSLATIONS, type Lang } from '../data/i18n';
import { MobileAuthButton, MobileMenu } from './MobileMenu';

const ACCENT = '#0B3D91';

interface SiteHeaderProps {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  onBackHome: () => void;
  onOpenCategory: (slug: CategorySlug) => void;
  onOpenCivicTools: () => void;
  onSubscribe?: () => void;
}

export function SiteHeader({
  lang,
  onLangChange,
  onBackHome,
  onOpenCategory,
  onOpenCivicTools,
  onSubscribe,
}: SiteHeaderProps) {
  const t = TRANSLATIONS[lang];

  const handleBackHome = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onBackHome();
  };

  const handleCategory = (slug: CategorySlug) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenCategory(slug);
  };

  const handleCivicTools = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenCivicTools();
  };

  const handleSwitchLang = (next: Lang) => (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onLangChange(next);
  };

  return (
    <header style={{ borderBottom: '1px solid #E5E5E5', background: '#fff' }}>
      <div className="site-header-inner">
        <MobileMenu
          lang={lang}
          onLangChange={onLangChange}
          onOpenCategory={onOpenCategory}
          onSubscribe={onSubscribe ?? onBackHome}
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
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: '#111',
              whiteSpace: 'nowrap',
            }}
          >
            <img
              src="/logo.png"
              alt="Civic Tech logo"
              style={{ height: 26, width: 'auto', display: 'block' }}
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
          {CATEGORIES.map((cat) => (
            <a
              key={cat.slug}
              href={`/category/${cat.slug}`}
              onClick={handleCategory(cat.slug)}
            >
              {cat.label[lang]}
            </a>
          ))}
        </nav>

        {/* Desktop Right Actions (GovInsider layout: Search, Language, Login / Sign Up) */}
        <div className="site-actions">
          <a
            href="/civictools"
            onClick={handleCivicTools}
            className="site-search-link"
            aria-label={lang === 'en' ? 'Search Civic Tools directory' : 'Maghanap sa Civic Tools'}
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
          </a>

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

          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
            }}
            className="site-auth-btn"
          >
            {lang === 'en' ? 'Login / Sign up' : 'Mag-login'}
          </a>
        </div>

        <MobileAuthButton lang={lang} />
      </div>
    </header>
  );
}
