import { useAuth, useUser } from '@clerk/react';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Footer } from '../components/Footer';
import { SiteHeader } from '../components/SiteHeader';
import { ARTICLES, CATEGORIES, getArticlePhoto, type CategorySlug } from '../data/articles';
import { clearCachedD1Articles } from '../data/articlesCache';
import type { Lang } from '../data/i18n';
import type { InfoPageSlug } from '../data/infoPages';

const ACCENT = '#0B3D91';
const HAS_CLERK = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

interface D1ArticleRow {
  slug: string;
  category: CategorySlug;
  kicker_en: string;
  title_en: string;
  deck_en: string;
  body_en: string;
  author_name: string;
  photo_url: string;
  status: 'published' | 'draft';
  is_featured?: number;
  is_long_read?: number;
  created_at: string;
}

interface WritePageProps {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  onBackHome: () => void;
  onOpenCivicTools: () => void;
  onOpenSubmit: (hash?: string) => void;
  onOpenCategory: (slug: CategorySlug) => void;
  onOpenInfo: (slug: InfoPageSlug) => void;
  onOpenArticle: (slug: string) => void;
  onOpenLogin: () => void;
}

function WriteStudio({
  lang,
  onBackHome,
  onOpenArticle,
  onOpenLogin,
}: Pick<WritePageProps, 'lang' | 'onBackHome' | 'onOpenArticle' | 'onOpenLogin'>) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();

  const [articles, setArticles] = useState<D1ArticleRow[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [category, setCategory] = useState<CategorySlug>('open-data');
  const [kicker, setKicker] = useState('Open Data · Report');
  const [title, setTitle] = useState('');
  const [deck, setDeck] = useState('');
  const [content, setContent] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isLongRead, setIsLongRead] = useState(false);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [mobileTab, setMobileTab] = useState<'add' | 'edit'>('add');
  const [notice, setNotice] = useState<{ text: string; isError: boolean } | null>(null);

  const isEn = lang === 'en';
  const role = String((user?.publicMetadata as { role?: string } | undefined)?.role || '').toLowerCase();
  const isAllowed = role === 'admin' || role === 'editor';

  const loadArticles = useCallback(async () => {
    if (!isSignedIn || !isAllowed) return;
    setLoadingList(true);
    try {
      const token = await getToken();
      const res = await fetch('/api/articles?all=1', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = (await res.json()) as { articles?: D1ArticleRow[] };
        setArticles(data.articles ?? []);
      }
    } catch {
      // ignore on plain Vite dev
    } finally {
      setLoadingList(false);
    }
  }, [getToken, isAllowed, isSignedIn]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const resetForm = () => {
    setEditingSlug(null);
    setCategory('open-data');
    setKicker('Open Data · Report');
    setTitle('');
    setDeck('');
    setContent('');
    setPhotoUrl('');
    setStatus('published');
    setIsFeatured(false);
    setIsLongRead(false);
    setNotice(null);
    setMobileTab('add');
  };

  const handleSelectArticle = (art: D1ArticleRow) => {
    setEditingSlug(art.slug);
    setCategory(art.category);
    setKicker(art.kicker_en);
    setTitle(art.title_en);
    setDeck(art.deck_en);
    setContent(art.body_en);
    setPhotoUrl(art.photo_url || '');
    setStatus(art.status === 'draft' ? 'draft' : 'published');
    setIsFeatured(Boolean(art.is_featured));
    setIsLongRead(Boolean(art.is_long_read));
    setNotice(null);
    setMobileTab('add');
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setNotice(null);
    setSaving(true);
    try {
      const token = await getToken();
      const authorName =
        [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
        user?.primaryEmailAddress?.emailAddress ||
        'Civic Tech Newsroom';
      const authorBio = String(
        (user?.unsafeMetadata as { bio?: string } | undefined)?.bio || ''
      ).trim();

      const method = editingSlug ? 'PATCH' : 'POST';
      const res = await fetch('/api/articles', {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          slug: editingSlug ?? undefined,
          category,
          kicker,
          title,
          deck,
          content,
          authorName,
          authorBio,
          photoUrl,
          status,
          isFeatured,
          isLongRead,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        slug?: string;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setNotice({
          text:
            data.error ||
            (isEn ? 'Could not save article.' : 'Hindi ma-save ang artikulo.'),
          isError: true,
        });
        return;
      }

      setNotice({
        text: editingSlug
          ? isEn
            ? 'Article updated in D1.'
            : 'Na-update ang artikulo sa D1.'
          : isEn
            ? 'Article published to D1!'
            : 'Nai-publish ang artikulo sa D1!',
        isError: false,
      });
      clearCachedD1Articles();
      await loadArticles();
      if (!editingSlug) {
        resetForm();
      }
    } catch {
      setNotice({
        text: isEn ? 'Network error saving article.' : 'May error sa pag-save ng artikulo.',
        isError: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    setNotice(null);
    try {
      const token = await getToken();
      const res = await fetch(`/api/articles?slug=${encodeURIComponent(slug)}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setNotice({
          text: data.error || (isEn ? 'Could not delete article.' : 'Hindi matanggal ang artikulo.'),
          isError: true,
        });
        return;
      }
      if (editingSlug === slug) resetForm();
      clearCachedD1Articles();
      await loadArticles();
    } catch {
      setNotice({
        text: isEn ? 'Network error deleting article.' : 'May error sa pagtanggal.',
        isError: true,
      });
    }
  };

  const handleImportStarter = async () => {
    setNotice(null);
    setImporting(true);
    try {
      const token = await getToken();
      const seedArticles = ARTICLES.map((a) => ({
        slug: a.slug,
        category: a.category,
        kicker_en: a.kicker.en,
        kicker_fil: a.kicker.fil,
        title_en: a.title.en,
        title_fil: a.title.fil,
        deck_en: a.deck.en,
        deck_fil: a.deck.fil,
        body_en: a.body.en.join('\n\n'),
        body_fil: a.body.fil.join('\n\n'),
        author_name: a.author.en,
        photo_url: getArticlePhoto(a.slug),
      }));
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ seedArticles }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        imported?: number;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setNotice({
          text: data.error || (isEn ? 'Could not import starter articles.' : 'Hindi ma-import ang mga artikulo.'),
          isError: true,
        });
        return;
      }
      setNotice({
        text: isEn
          ? `Imported ${data.imported ?? seedArticles.length} starter articles into D1!`
          : `Na-import ang ${data.imported ?? seedArticles.length} na artikulo sa D1!`,
        isError: false,
      });
      clearCachedD1Articles();
      await loadArticles();
    } catch {
      setNotice({
        text: isEn ? 'Network error importing starter articles.' : 'May error sa pag-import.',
        isError: true,
      });
    } finally {
      setImporting(false);
    }
  };

  if (!isLoaded) {
    return (
      <p style={{ textAlign: 'center', fontSize: 15, color: '#555', padding: '40px 0' }}>
        {isEn ? 'Loading studio…' : 'Nilo-load ang studio…'}
      </p>
    );
  }

  if (!isSignedIn) {
    return (
      <div style={{ maxWidth: 460, margin: '0 auto', textAlign: 'center', padding: '24px 0' }}>
        <h1 style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: 36, fontWeight: 500 }}>
          {isEn ? 'Sign in to access Newsroom Studio' : 'Mag-sign in para sa Newsroom Studio'}
        </h1>
        <button
          type="button"
          onClick={onOpenLogin}
          style={{
            minHeight: 44,
            padding: '0 22px',
            border: 'none',
            background: ACCENT,
            color: '#fff',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          {isEn ? 'Login / Sign up' : 'Mag-login'}
        </button>
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center', padding: '24px 0' }}>
        <p
          style={{
            margin: '0 0 8px',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#C62828',
          }}
        >
          {isEn ? 'Access restricted' : 'Limitado ang access'}
        </p>
        <h1 style={{ margin: '0 0 12px', fontFamily: 'Newsreader, Georgia, serif', fontSize: 34, fontWeight: 500 }}>
          {isEn ? 'Editor or Admin role required' : 'Kailangan ng Editor o Admin role'}
        </h1>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: '#555' }}>
          {isEn
            ? 'Ask a BetterGov.ph administrator to set { "role": "editor" } or { "role": "admin" } on your Clerk account.'
            : 'Magtanong sa BetterGov.ph admin upang mabigyan ka ng editor o admin role.'}
        </p>
      </div>
    );
  }

  const labelStyle = {
    display: 'block',
    marginBottom: 6,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    color: '#222',
  };

  const inputStyle = {
    width: '100%',
    minHeight: 44,
    padding: '10px 12px',
    border: '1px solid #D4D4D4',
    fontFamily: 'inherit',
    fontSize: 15,
    color: '#111',
    background: '#fff',
    boxSizing: 'border-box' as const,
  };

  return (
    <div>
      <div
        style={{
          paddingBottom: 24,
          borderBottom: '1px solid #E5E5E5',
          marginBottom: 28,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 16,
        }}
      >
        <div>
          <p
            style={{
              margin: '0 0 8px',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: ACCENT,
            }}
          >
            Newsroom Studio · Role: {role}
          </p>
          <h1
            className="directory-title"
            style={{
              margin: 0,
              fontFamily: 'Newsreader, Georgia, serif',
              fontSize: 42,
              fontWeight: 500,
              lineHeight: 1.08,
            }}
          >
            {editingSlug
              ? isEn
                ? 'Edit article'
                : 'I-edit ang artikulo'
              : isEn
                ? 'Write an article'
                : 'Sumulat ng artikulo'}
          </h1>
        </div>

        {editingSlug && (
          <button
            type="button"
            onClick={resetForm}
            style={{
              minHeight: 40,
              padding: '0 16px',
              border: '1px solid #111',
              background: '#fff',
              color: '#111',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            + {isEn ? 'New article' : 'Bagong artikulo'}
          </button>
        )}
      </div>

      {/* Mobile Add / Edit switcher */}
      <div
        className="write-mobile-tabs"
        role="tablist"
        aria-label={isEn ? 'Newsroom mode' : 'Mode ng Newsroom'}
        style={{
          marginBottom: 22,
          border: '1px solid #111',
        }}
      >
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'add'}
          onClick={() => setMobileTab('add')}
          style={{
            minHeight: 40,
            border: 'none',
            background: mobileTab === 'add' ? ACCENT : '#fff',
            color: mobileTab === 'add' ? '#fff' : '#111',
            fontFamily: 'inherit',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {isEn ? 'Add' : 'Dagdag'}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'edit'}
          onClick={() => setMobileTab('edit')}
          style={{
            minHeight: 40,
            border: 'none',
            borderLeft: '1px solid #111',
            background: mobileTab === 'edit' ? ACCENT : '#fff',
            color: mobileTab === 'edit' ? '#fff' : '#111',
            fontFamily: 'inherit',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {isEn ? `Edit (${articles.length})` : `I-edit (${articles.length})`}
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'stretch' }}>
        {/* Form */}
        <form
          onSubmit={handleSave}
          className={mobileTab === 'edit' ? 'write-mobile-hidden' : undefined}
          style={{ flex: '2 1 480px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 18 }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
              gap: 16,
            }}
          >
            <div>
              <label htmlFor="write-category" style={labelStyle}>
                {isEn ? 'Category' : 'Kategorya'}
              </label>
              <select
                id="write-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as CategorySlug)}
                style={inputStyle}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label[lang]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="write-status" style={labelStyle}>
                {isEn ? 'Status' : 'Katayuan'}
              </label>
              <select
                id="write-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                style={inputStyle}
              >
                <option value="published">{isEn ? 'Published' : 'Nai-publish'}</option>
                <option value="draft">{isEn ? 'Draft' : 'Draft'}</option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
              gap: 16,
            }}
          >
            <div>
              <label htmlFor="write-kicker" style={labelStyle}>
                {isEn ? 'Kicker / Label' : 'Kicker / Label'}
              </label>
              <input
                id="write-kicker"
                type="text"
                value={kicker}
                onChange={(e) => setKicker(e.target.value)}
                placeholder="Open Data · Feature"
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="write-photo" style={labelStyle}>
                {isEn ? 'Cover photo URL' : 'URL ng larawan'}
              </label>
              <input
                id="write-photo"
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label htmlFor="write-title" style={labelStyle}>
              {isEn ? 'Headline *' : 'Pamagat *'}
            </label>
            <input
              id="write-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isEn ? 'Enter article headline…' : 'Ilagay ang pamagat…'}
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="write-deck" style={labelStyle}>
              {isEn ? 'Deck / Summary *' : 'Buod *'}
            </label>
            <textarea
              id="write-deck"
              required
              rows={2}
              value={deck}
              onChange={(e) => setDeck(e.target.value)}
              placeholder={isEn ? 'One or two sentences summarizing the story…' : 'Maikling buod ng artikulo…'}
              style={{ ...inputStyle, minHeight: 72, resize: 'vertical' }}
            />
          </div>

          <div>
            <label htmlFor="write-body" style={labelStyle}>
              {isEn ? 'Body (separate paragraphs with blank lines) *' : 'Nilalaman *'}
            </label>
            <textarea
              id="write-body"
              required
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={isEn ? 'Write your story here…' : 'Isulat ang artikulo rito…'}
              style={{ ...inputStyle, minHeight: 220, resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                fontWeight: 600,
                color: '#222',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: ACCENT, cursor: 'pointer' }}
              />
              <span>
                {isEn ? 'Pin as Lead story' : 'I-pin bilang Lead story'}
              </span>
            </label>

            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                fontWeight: 600,
                color: '#222',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={isLongRead}
                onChange={(e) => setIsLongRead(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: ACCENT, cursor: 'pointer' }}
              />
              <span>
                {isEn ? 'Pin as Long Read' : 'I-pin bilang Long Read'}
              </span>
            </label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                minHeight: 46,
                padding: '0 24px',
                border: 'none',
                background: ACCENT,
                color: '#fff',
                fontWeight: 600,
                fontSize: 14,
                cursor: saving ? 'wait' : 'pointer',
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving
                ? isEn
                  ? 'Saving…'
                  : 'Sine-save…'
                : editingSlug
                  ? isEn
                    ? 'Update article'
                    : 'I-update ang artikulo'
                  : isEn
                    ? 'Publish article'
                    : 'I-publish ang artikulo'}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => (editingSlug ? resetForm() : onBackHome())}
              style={{
                minHeight: 46,
                padding: '0 20px',
                border: '1px solid #D4D4D4',
                background: '#fff',
                color: '#111',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              {isEn ? 'Cancel' : 'Kanselahin'}
            </button>
            {notice && (
              <span
                role="status"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: notice.isError ? '#C62828' : ACCENT,
                }}
              >
                {notice.text}
              </span>
            )}
          </div>
        </form>

        {/* Published / Draft D1 articles list */}
        <aside
          className={mobileTab === 'add' ? 'write-aside write-mobile-hidden' : 'write-aside'}
          style={{ flex: '1 1 280px', minWidth: 0 }}
        >
          <div className="write-aside-inner">
            <h2
              style={{
                margin: '0 0 12px',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                borderBottom: '2px solid #111',
                paddingBottom: 10,
                flex: 'none',
              }}
            >
              {isEn ? `D1 Articles (${articles.length})` : `Mga Artikulo sa D1 (${articles.length})`}
            </h2>
            {role === 'admin' && (
              <button
                type="button"
                disabled={importing}
                onClick={handleImportStarter}
                style={{
                  width: '100%',
                  minHeight: 38,
                  marginBottom: 14,
                  padding: '0 12px',
                  border: '1px solid #111',
                  background: '#fff',
                  color: '#111',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: importing ? 'wait' : 'pointer',
                  flex: 'none',
                }}
              >
                {importing
                  ? isEn
                    ? 'Importing…'
                    : 'Ini-import…'
                  : isEn
                    ? `Import ${ARTICLES.length} starter articles`
                    : `I-import ang ${ARTICLES.length} starter articles`}
              </button>
            )}
            {loadingList ? (
              <p style={{ fontSize: 13, color: '#666' }}>{isEn ? 'Loading…' : 'Nilo-load…'}</p>
            ) : articles.length === 0 ? (
              <p style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>
                {isEn
                  ? 'No articles in D1 yet. Publish your first story on the left!'
                  : 'Wala pang artikulo sa D1. Mag-publish gamit ang form sa kaliwa!'}
              </p>
            ) : (
              <div
                className="write-aside-list"
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                {articles.map((art) => (
                  <div
                    key={art.slug}
                    style={{
                      padding: '12px 14px',
                      border: editingSlug === art.slug ? `1px solid ${ACCENT}` : '1px solid #E5E5E5',
                      background: editingSlug === art.slug ? '#F4F6FA' : '#fff',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: ACCENT, textTransform: 'uppercase' }}>
                        {art.status}
                        {Boolean(art.is_featured) && (
                          <span style={{ marginLeft: 8, color: '#111', background: '#E8EEF8', padding: '1px 5px' }}>
                            LEAD
                          </span>
                        )}
                        {Boolean(art.is_long_read) && (
                          <span style={{ marginLeft: 6, color: '#111', background: '#F0F0F0', padding: '1px 5px' }}>
                            LONG READ
                          </span>
                        )}
                      </span>
                      <span style={{ fontSize: 11, color: '#666' }}>{art.category}</span>
                    </div>
                    <p
                      style={{
                        margin: '0 0 10px',
                        fontFamily: 'Newsreader, Georgia, serif',
                        fontSize: 17,
                        fontWeight: 500,
                        lineHeight: 1.25,
                      }}
                    >
                      {art.title_en}
                    </p>
                    <div style={{ display: 'flex', gap: 12, fontSize: 12, fontWeight: 600 }}>
                      <button
                        type="button"
                        onClick={() => handleSelectArticle(art)}
                        style={{
                          padding: 0,
                          border: 'none',
                          background: 'transparent',
                          color: ACCENT,
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: 12,
                        }}
                      >
                        {isEn ? 'Edit' : 'I-edit'}
                      </button>
                      {art.status === 'published' && (
                        <button
                          type="button"
                          onClick={() => onOpenArticle(art.slug)}
                          style={{
                            padding: 0,
                            border: 'none',
                            background: 'transparent',
                            color: '#111',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: 12,
                          }}
                        >
                          {isEn ? 'View →' : 'Tingnan →'}
                        </button>
                      )}
                      {role === 'admin' && (
                        <button
                          type="button"
                          onClick={() => handleDelete(art.slug)}
                          style={{
                            padding: 0,
                            border: 'none',
                            background: 'transparent',
                            color: '#C62828',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: 12,
                            marginLeft: 'auto',
                          }}
                        >
                          {isEn ? 'Delete' : 'Tanggalin'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export function WritePage({
  lang,
  onLangChange,
  onBackHome,
  onOpenCivicTools,
  onOpenSubmit,
  onOpenCategory,
  onOpenInfo,
  onOpenArticle,
  onOpenLogin,
}: WritePageProps) {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#111', background: '#fff' }}>
      <SiteHeader
        lang={lang}
        onLangChange={onLangChange}
        onBackHome={onBackHome}
        onOpenCategory={onOpenCategory}
        onOpenCivicTools={onOpenCivicTools}
      />

      <main style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 24px 72px' }}>
        {HAS_CLERK ? (
          <WriteStudio
            lang={lang}
            onBackHome={onBackHome}
            onOpenArticle={onOpenArticle}
            onOpenLogin={onOpenLogin}
          />
        ) : (
          <p style={{ textAlign: 'center', fontSize: 14, color: '#555' }}>
            {lang === 'en'
              ? 'Authentication is not configured in this environment.'
              : 'Hindi pa naka-configure ang authentication sa environment na ito.'}
          </p>
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
