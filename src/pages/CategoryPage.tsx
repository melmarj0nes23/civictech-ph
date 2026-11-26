import type { MouseEvent } from 'react';
import {
  ARTICLES,
  CATEGORIES,
  getCategoryBySlug,
  type CategorySlug,
} from '../data/articles';
import { TRANSLATIONS, type Lang } from '../data/i18n';

const ACCENT = '#0B3D91';

interface CategoryPageProps {
  categorySlug: CategorySlug;
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  onBackHome: () => void;
  onOpenCategory: (slug: CategorySlug) => void;
  onOpenArticle: (slug: string) => void;
}

export function CategoryPage({
  categorySlug,
  lang,
  onLangChange,
  onBackHome,
  onOpenCategory,
  onOpenArticle,
}: CategoryPageProps) {
  const t = TRANSLATIONS[lang];
  const category = getCategoryBySlug(categorySlug) ?? CATEGORIES[0];
  const stories = ARTICLES.filter((a) => a.category === category.slug);

  const handleBackHome = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onBackHome();
  };

  const handleCategoryClick =
    (slug: CategorySlug) => (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      onOpenCategory(slug);
    };

  const handleArticleClick = (slug: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenArticle(slug);
  };

  const handleSwitchLang = (next: Lang) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onLangChange(next);
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
                display: 'inline-flex',
                alignItems: 'baseline',
                gap: 8,
                fontFamily: 'Newsreader, Georgia, serif',
                fontSize: 32,
                fontWeight: 600,
                letterSpacing: '-0.01em',
              }}
            >
              <img
                src="/logo.png"
                alt="Civic Tech logo"
                style={{ height: 28, width: 'auto', display: 'block', alignSelf: 'center' }}
              />
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
          <nav aria-label="Sections" className="compact-nav">
            {CATEGORIES.slice(0, 6).map((cat) => {
              const active = cat.slug === category.slug;
              return (
                <a
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={handleCategoryClick(cat.slug)}
                  style={{
                    padding: '12px 0',
                    color: active ? ACCENT : '#111',
                    fontWeight: active ? 600 : 500,
                  }}
                >
                  {cat.label[lang]}
                </a>
              );
            })}
          </nav>
          <div className="compact-actions" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <a
              href={`/category/${category.slug}`}
              onClick={handleSwitchLang(lang === 'en' ? 'fil' : 'en')}
              style={{ fontSize: 13, color: '#555', fontWeight: 500 }}
            >
              {lang === 'en' ? 'FIL' : 'EN'}
            </a>
            <a href="/" onClick={handleBackHome} className="compact-subscribe">
              {t.subscribe}
            </a>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1240, margin: '0 auto', padding: '40px 24px 64px' }}>
        <div style={{ paddingBottom: 24, borderBottom: '2px solid #111', marginBottom: 32 }}>
          <p
            style={{
              margin: '0 0 8px',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: ACCENT,
            }}
          >
            civictech.ph · {lang === 'en' ? 'Section' : 'Seksyon'}
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
            {category.label[lang]}
          </h1>
          <p style={{ margin: '12px 0 0', maxWidth: 680, fontSize: 16, lineHeight: 1.5, color: '#444' }}>
            {category.description[lang]}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 32,
          }}
        >
          {stories.map((story) => (
            <article key={story.slug}>
              <a
                href={story.slug === 'volunteers-national-budget' ? '/article' : `/article/${story.slug}`}
                onClick={handleArticleClick(story.slug)}
                style={{ display: 'block' }}
              >
                <div className="ph" style={{ aspectRatio: '3 / 2' }}>
                  {story.photoLabel[lang]}
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
                  {story.kicker[lang]}
                </p>
                <h2
                  style={{
                    margin: 0,
                    fontFamily: 'Newsreader, Georgia, serif',
                    fontSize: 24,
                    lineHeight: 1.2,
                    fontWeight: 500,
                  }}
                >
                  {story.title[lang]}
                </h2>
                <p style={{ margin: '10px 0 0', fontSize: 15, lineHeight: 1.5, color: '#444' }}>
                  {story.deck[lang]}
                </p>
                <p style={{ margin: '12px 0 0', fontSize: 13, color: '#555' }}>
                  {story.date[lang]} · {story.readTime[lang]}
                </p>
              </a>
            </article>
          ))}
        </div>
      </main>

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
    </div>
  );
}
