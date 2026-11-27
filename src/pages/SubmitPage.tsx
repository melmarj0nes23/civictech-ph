import { useMemo, useState, type FormEvent, type MouseEvent } from 'react';
import { Footer } from '../components/Footer';
import { MobileMenu } from '../components/MobileMenu';
import { CATEGORIES, type CategorySlug } from '../data/articles';
import { DIRECTORY_ENTRIES } from '../data/directory';
import { SECTOR_LABELS, TRANSLATIONS, type Lang } from '../data/i18n';
import type { InfoPageSlug } from '../data/infoPages';
import { SECTORS, type Sector } from '../data/sectors';

const ACCENT = '#0B3D91';
const GITHUB_NEW_ISSUE_URL = 'https://github.com/melmarj0nes23/civictech-ph/issues/new';

interface SubmitPageProps {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  onBackHome: () => void;
  onBackDirectory: () => void;
  onOpenSubmit: (hash?: string) => void;
  onOpenCategory: (slug: CategorySlug) => void;
  onOpenInfo: (slug: InfoPageSlug) => void;
}

export function SubmitPage({
  lang,
  onLangChange,
  onBackHome,
  onBackDirectory,
  onOpenSubmit,
  onOpenCategory,
  onOpenInfo,
}: SubmitPageProps) {
  const t = TRANSLATIONS[lang];
  const [kind, setKind] = useState<'Civic Tech Project' | 'Civil Society Organization (CSO)'>(
    'Civic Tech Project'
  );
  const [name, setName] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'Planning' | 'Alpha' | 'Beta' | 'Stable'>('Beta');
  const [sector, setSector] = useState<Sector>(SECTORS[0]);
  const [website, setWebsite] = useState('');
  const [repository, setRepository] = useState('');
  const [license, setLicense] = useState('');
  const [tags, setTags] = useState('');
  const [maintainers, setMaintainers] = useState('');

  const sortedEntries = useMemo(
    () => [...DIRECTORY_ENTRIES].sort((a, b) => a.title.localeCompare(b.title)),
    []
  );
  const [updateProject, setUpdateProject] = useState(sortedEntries[0]?.slug ?? '');
  const [updateStatus, setUpdateStatus] = useState<
    'No change' | 'Planning' | 'Alpha' | 'Beta' | 'Stable' | 'Archived'
  >('No change');
  const [updateWebsite, setUpdateWebsite] = useState('');
  const [updateRepository, setUpdateRepository] = useState('');
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateBody, setUpdateBody] = useState('');

  const handleBackHome = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onBackHome();
  };

  const handleBackDirectory = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onBackDirectory();
  };

  const handleSwitchLang = (next: Lang) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onLangChange(next);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('template', 'submit-entry.yml');
    params.set('title', `[Directory]: ${name.trim()}`);
    params.set('kind', kind);
    params.set('name', name.trim());
    params.set('summary', summary.trim());
    if (description.trim()) params.set('description', description.trim());
    params.set('status', status);
    params.set('sector', sector);
    if (website.trim()) params.set('website', website.trim());
    if (repository.trim()) params.set('repository', repository.trim());
    if (license.trim()) params.set('license', license.trim());
    if (tags.trim()) params.set('tags', tags.trim());
    if (maintainers.trim()) params.set('maintainers', maintainers.trim());

    window.open(`${GITHUB_NEW_ISSUE_URL}?${params.toString()}`, '_blank', 'noopener,noreferrer');
  };

  const handleUpdateSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('template', 'post-update.yml');
    params.set('title', `Post an update: ${updateTitle.trim()}`);
    params.set('project', updateProject);
    params.set('status', updateStatus);
    if (updateWebsite.trim()) params.set('website', updateWebsite.trim());
    if (updateRepository.trim()) params.set('repository', updateRepository.trim());
    params.set('body', updateBody.trim());

    window.open(`${GITHUB_NEW_ISSUE_URL}?${params.toString()}`, '_blank', 'noopener,noreferrer');
  };

  const inputStyle = {
    width: '100%',
    minHeight: 44,
    padding: '10px 12px',
    border: '1px solid #DADADA',
    font: '400 14px Inter, sans-serif',
    boxSizing: 'border-box' as const,
    background: '#fff',
    color: '#111',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: 6,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: '#222',
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#111', background: '#fff' }}>
      {/* Compact header */}
      <header style={{ borderBottom: '1px solid #E5E5E5' }}>
        <div className="compact-header-inner">
          <MobileMenu
            lang={lang}
            onLangChange={onLangChange}
            onOpenCategory={onOpenCategory}
            onSubscribe={onBackHome}
            onOpenCivicTools={onBackDirectory}
            onBackHome={onBackHome}
          />
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
            {CATEGORIES.map((cat) => (
              <a
                key={cat.slug}
                href={`/category/${cat.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onOpenCategory(cat.slug);
                }}
                style={{ padding: '12px 0' }}
              >
                {cat.label[lang]}
              </a>
            ))}
          </nav>
          <div className="compact-actions" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <a
              href="/civictools/submit"
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

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 72px' }}>
        <p style={{ margin: '0 0 20px', fontSize: 13 }}>
          <a href="/civictools" onClick={handleBackDirectory} style={{ color: ACCENT, fontWeight: 600 }}>
            {t.submit.backToDirectory}
          </a>
        </p>

        <div style={{ paddingBottom: 24, borderBottom: '1px solid #E5E5E5', marginBottom: 28 }}>
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
            {t.submit.kicker}
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
            {t.submit.title}
          </h1>
          <p style={{ margin: '12px 0 0', fontSize: 16, lineHeight: 1.5, color: '#444' }}>
            {t.submit.lead}
          </p>
          <p style={{ margin: '8px 0 0', fontSize: 13, color: '#666' }}>{t.submit.note}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
              gap: 16,
            }}
          >
            <div>
              <label htmlFor="submit-kind" style={labelStyle}>
                {t.submit.entryType} *
              </label>
              <select
                id="submit-kind"
                value={kind}
                onChange={(e) =>
                  setKind(
                    e.target.value as 'Civic Tech Project' | 'Civil Society Organization (CSO)'
                  )
                }
                style={inputStyle}
              >
                <option value="Civic Tech Project">{t.submit.projectOption}</option>
                <option value="Civil Society Organization (CSO)">{t.submit.csoOption}</option>
              </select>
            </div>

            <div>
              <label htmlFor="submit-status" style={labelStyle}>
                {t.submit.stage} *
              </label>
              <select
                id="submit-status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as 'Planning' | 'Alpha' | 'Beta' | 'Stable')
                }
                style={inputStyle}
              >
                <option value="Planning">Planning</option>
                <option value="Alpha">Alpha</option>
                <option value="Beta">Beta</option>
                <option value="Stable">Stable</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="submit-name" style={labelStyle}>
              {t.submit.name} *
            </label>
            <input
              id="submit-name"
              required
              maxLength={80}
              placeholder={t.submit.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="submit-sector" style={labelStyle}>
              {t.submit.sector} *
            </label>
            <select
              id="submit-sector"
              value={sector}
              onChange={(e) => setSector(e.target.value as Sector)}
              style={inputStyle}
            >
              {SECTORS.map((s) => (
                <option key={s} value={s}>
                  {SECTOR_LABELS[s][lang]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="submit-summary" style={labelStyle}>
              {t.submit.summary} *
            </label>
            <p style={{ margin: '0 0 6px', fontSize: 12, color: '#666' }}>{t.submit.summaryHint}</p>
            <input
              id="submit-summary"
              required
              maxLength={240}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="submit-description" style={labelStyle}>
              {t.submit.description}
            </label>
            <p style={{ margin: '0 0 6px', fontSize: 12, color: '#666' }}>
              {t.submit.descriptionHint}
            </p>
            <textarea
              id="submit-description"
              rows={4}
              maxLength={1200}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ ...inputStyle, minHeight: 110, resize: 'vertical' }}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
              gap: 16,
            }}
          >
            <div>
              <label htmlFor="submit-website" style={labelStyle}>
                {t.submit.website}
              </label>
              <p style={{ margin: '0 0 6px', fontSize: 12, color: '#666' }}>
                {t.submit.websiteHint}
              </p>
              <input
                id="submit-website"
                type="url"
                placeholder="https://"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="submit-repo" style={labelStyle}>
                {t.submit.repository}
              </label>
              <p style={{ margin: '0 0 6px', fontSize: 12, color: '#666' }}>
                {t.submit.repositoryHint}
              </p>
              <input
                id="submit-repo"
                type="url"
                placeholder="https://github.com/"
                value={repository}
                onChange={(e) => setRepository(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
              gap: 16,
            }}
          >
            <div>
              <label htmlFor="submit-license" style={labelStyle}>
                {t.submit.license}
              </label>
              <input
                id="submit-license"
                maxLength={40}
                placeholder="MIT"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="submit-tags" style={labelStyle}>
                {t.submit.tags}
              </label>
              <input
                id="submit-tags"
                placeholder="open-data, mapping"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label htmlFor="submit-maintainers" style={labelStyle}>
              {t.submit.maintainers}
            </label>
            <p style={{ margin: '0 0 6px', fontSize: 12, color: '#666' }}>
              {t.submit.maintainersHint}
            </p>
            <input
              id="submit-maintainers"
              value={maintainers}
              onChange={(e) => setMaintainers(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ paddingTop: 8 }}>
            <button
              type="submit"
              style={{
                background: ACCENT,
                color: '#fff',
                border: 0,
                padding: '0 22px',
                minHeight: 46,
                font: '600 14px Inter, sans-serif',
                cursor: 'pointer',
              }}
            >
              {t.submit.continueGithub}
            </button>
          </div>
        </form>

        {/* Post an update */}
        <section
          id="update"
          style={{
            marginTop: 56,
            paddingTop: 40,
            borderTop: '1px solid #111',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: 'Newsreader, Georgia, serif',
              fontWeight: 500,
              fontSize: 34,
              lineHeight: 1.15,
            }}
          >
            {t.submit.updateHeading}
          </h2>
          <p style={{ margin: '10px 0 24px', fontSize: 15, lineHeight: 1.5, color: '#444' }}>
            {t.submit.updateLead}
          </p>

          <form
            onSubmit={handleUpdateSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
                gap: 16,
              }}
            >
              <div>
                <label htmlFor="update-project" style={labelStyle}>
                  {t.submit.updateEntry} *
                </label>
                <select
                  id="update-project"
                  required
                  value={updateProject}
                  onChange={(e) => setUpdateProject(e.target.value)}
                  style={inputStyle}
                >
                  {sortedEntries.map((entry) => (
                    <option key={entry.slug} value={entry.slug}>
                      {entry.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="update-status" style={labelStyle}>
                  {t.submit.updateStage}
                </label>
                <select
                  id="update-status"
                  value={updateStatus}
                  onChange={(e) =>
                    setUpdateStatus(
                      e.target.value as
                        | 'No change'
                        | 'Planning'
                        | 'Alpha'
                        | 'Beta'
                        | 'Stable'
                        | 'Archived'
                    )
                  }
                  style={inputStyle}
                >
                  <option value="No change">{t.submit.updateStageNoChange}</option>
                  <option value="Planning">Planning</option>
                  <option value="Alpha">Alpha</option>
                  <option value="Beta">Beta</option>
                  <option value="Stable">Stable</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
                gap: 16,
              }}
            >
              <div>
                <label htmlFor="update-website" style={labelStyle}>
                  {t.submit.updateWebsite}
                </label>
                <p style={{ margin: '0 0 6px', fontSize: 12, color: '#666' }}>
                  {t.submit.updateUrlHint}
                </p>
                <input
                  id="update-website"
                  type="url"
                  placeholder="https://"
                  value={updateWebsite}
                  onChange={(e) => setUpdateWebsite(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="update-repository" style={labelStyle}>
                  {t.submit.updateRepository}
                </label>
                <p style={{ margin: '0 0 6px', fontSize: 12, color: '#666' }}>
                  {t.submit.updateUrlHint}
                </p>
                <input
                  id="update-repository"
                  type="url"
                  placeholder="https://github.com/"
                  value={updateRepository}
                  onChange={(e) => setUpdateRepository(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label htmlFor="update-title" style={labelStyle}>
                {t.submit.updateTitle} *
              </label>
              <p style={{ margin: '0 0 6px', fontSize: 12, color: '#666' }}>
                {t.submit.updateTitleHint}
              </p>
              <input
                id="update-title"
                required
                maxLength={100}
                value={updateTitle}
                onChange={(e) => setUpdateTitle(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="update-body" style={labelStyle}>
                {t.submit.updateBody} *
              </label>
              <p style={{ margin: '0 0 6px', fontSize: 12, color: '#666' }}>
                {t.submit.updateBodyHint}
              </p>
              <textarea
                id="update-body"
                rows={4}
                required
                maxLength={1200}
                value={updateBody}
                onChange={(e) => setUpdateBody(e.target.value)}
                style={{ ...inputStyle, minHeight: 110, resize: 'vertical' }}
              />
            </div>

            <div style={{ paddingTop: 4 }}>
              <button
                type="submit"
                style={{
                  background: '#111',
                  color: '#fff',
                  border: 0,
                  padding: '0 22px',
                  minHeight: 46,
                  font: '600 14px Inter, sans-serif',
                  cursor: 'pointer',
                }}
              >
                {t.submit.continueGithub}
              </button>
            </div>
          </form>
        </section>
      </main>

      <Footer
        lang={lang}
        onBackHome={onBackHome}
        onOpenCivicTools={onBackDirectory}
        onOpenSubmit={onOpenSubmit}
        onOpenInfo={onOpenInfo}
      />
    </div>
  );
}
