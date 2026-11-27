import { useAuth, useClerk, useUser } from '@clerk/react';
import { useEffect, useState, type FormEvent, type MouseEvent } from 'react';
import { Footer } from '../components/Footer';
import { SiteHeader } from '../components/SiteHeader';
import { ARTICLES, type CategorySlug } from '../data/articles';
import { mapD1RowToArticle, type CachedArticleItem, type D1ApiArticle } from '../data/articlesCache';
import type { Lang } from '../data/i18n';
import type { InfoPageSlug } from '../data/infoPages';

const ACCENT = '#0B3D91';
const HAS_CLERK = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

interface ProfilePageProps {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  onBackHome: () => void;
  onOpenCivicTools: () => void;
  onOpenSubmit: (hash?: string) => void;
  onOpenCategory: (slug: CategorySlug) => void;
  onOpenInfo: (slug: InfoPageSlug) => void;
  onOpenLogin: () => void;
  onOpenWrite?: () => void;
}

function ClerkProfileContent({
  lang,
  onBackHome,
  onOpenLogin,
  onOpenWrite,
}: Pick<ProfilePageProps, 'lang' | 'onBackHome' | 'onOpenLogin' | 'onOpenWrite'>) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const { signOut, openUserProfile } = useClerk();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [authorBio, setAuthorBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [notice, setNotice] = useState<{ text: string; isError: boolean } | null>(null);
  const [nlActive, setNlActive] = useState<boolean | null>(null);
  const [nlBusy, setNlBusy] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [teamQuery, setTeamQuery] = useState('');
  const [teamUsers, setTeamUsers] = useState<
    Array<{ id: string; name: string; email: string; imageUrl: string; role: string }>
  >([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamNotice, setTeamNotice] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [showBanners, setShowBanners] = useState(false);
  const [banners, setBanners] = useState<Array<{ imageUrl: string; linkUrl: string }>>([]);
  const [bannersLoading, setBannersLoading] = useState(false);
  const [bannersSaving, setBannersSaving] = useState(false);
  const [bannersNotice, setBannersNotice] = useState<string | null>(null);

  const isEn = lang === 'en';

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? '');
      setLastName(user.lastName ?? '');
      setAuthorBio(String((user.unsafeMetadata as { bio?: string } | undefined)?.bio || ''));
      const email =
        user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress;
      if (email) {
        fetch(`/api/newsletter?email=${encodeURIComponent(email)}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((data: { ok?: boolean; subscribed?: boolean } | null) => {
            if (data?.ok) setNlActive(Boolean(data.subscribed));
          })
          .catch(() => {
            // D1 endpoint unavailable in plain Vite dev
          });
      }
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const roleVal = String(
      (user.publicMetadata as { role?: string } | undefined)?.role || ''
    ).toLowerCase();
    if (roleVal !== 'admin') return;

    const syncPanelFromUrl = () => {
      const panel = new URLSearchParams(window.location.search).get('panel');
      if (panel === 'team') {
        setShowTeam(true);
        setShowBanners(false);
        loadTeamUsers();
      } else if (panel === 'banners') {
        setShowBanners(true);
        setShowTeam(false);
        loadBanners();
      }
    };
    syncPanelFromUrl();
    window.addEventListener('popstate', syncPanelFromUrl);
    return () => window.removeEventListener('popstate', syncPanelFromUrl);
  }, [user]);

  if (!isLoaded) {
    return (
      <p style={{ textAlign: 'center', fontSize: 15, color: '#555', padding: '40px 0' }}>
        {isEn ? 'Loading account…' : 'Nilo-load ang account…'}
      </p>
    );
  }

  if (!isSignedIn || !user) {
    return (
      <div style={{ maxWidth: 460, margin: '0 auto', textAlign: 'center', padding: '24px 0' }}>
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
          {isEn ? 'Account · BetterGov.ph' : 'Account · BetterGov.ph'}
        </p>
        <h1
          style={{
            margin: '0 0 14px',
            fontFamily: 'Newsreader, Georgia, serif',
            fontSize: 38,
            fontWeight: 500,
            lineHeight: 1.15,
          }}
        >
          {isEn ? 'Sign in to view your profile' : 'Mag-sign in upang makita ang iyong profile'}
        </h1>
        <p style={{ margin: '0 0 28px', fontSize: 16, lineHeight: 1.55, color: '#444' }}>
          {isEn
            ? 'Manage your reader details, connected accounts, and newsletter preferences.'
            : 'Pamahalaan ang iyong mga detalye, nakakonektang account, at newsletter.'}
        </p>
        <a
          href="/login"
          onClick={(e: MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            onOpenLogin();
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 46,
            padding: '0 24px',
            background: ACCENT,
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {isEn ? 'Login / Sign up' : 'Mag-login / Mag-sign up'}
        </a>
      </div>
    );
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setNotice(null);
    setSaving(true);
    try {
      const trimmedBio = authorBio.trim();
      await user.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        ...(canPublish
          ? {
              unsafeMetadata: {
                ...(user.unsafeMetadata as Record<string, unknown> | undefined),
                bio: trimmedBio,
              },
            }
          : {}),
      });
      if (canPublish) {
        const token = await getToken();
        fetch('/api/articles', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ syncAuthorBio: trimmedBio }),
        }).catch(() => {
          // ignore if D1 unavailable
        });
      }
      setNotice({
        text: isEn ? 'Profile updated.' : 'Na-update ang profile.',
        isError: false,
      });
      setEditingName(false);
    } catch (err) {
      setNotice({
        text:
          err instanceof Error && err.message
            ? err.message
            : isEn
              ? 'Could not update profile.'
              : 'Hindi ma-update ang profile.',
        isError: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    onBackHome();
  };

  const handleToggleNewsletter = async () => {
    if (!primaryEmail) return;
    setNlBusy(true);
    const nextAction = nlActive ? 'unsubscribe' : 'subscribe';
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: primaryEmail,
          lang,
          action: nextAction,
          firstName: user.firstName || undefined,
        }),
      });
      if (res.ok) {
        setNlActive(nextAction === 'subscribe');
      }
    } catch {
      // ignore if D1 not bound yet
    } finally {
      setNlBusy(false);
    }
  };

  const primaryEmail =
    user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? '';
  const role = String(
    (user.publicMetadata as { role?: string } | undefined)?.role || ''
  ).toLowerCase();
  const canPublish = role === 'admin' || role === 'editor';
  const isAdmin = role === 'admin';

  const loadTeamUsers = async (queryText = '') => {
    if (!isAdmin) return;
    setTeamLoading(true);
    setTeamNotice(null);
    try {
      const token = await getToken();
      const url = queryText.trim()
        ? `/api/users?query=${encodeURIComponent(queryText.trim())}`
        : '/api/users';
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        users?: Array<{ id: string; name: string; email: string; imageUrl: string; role: string }>;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setTeamNotice(data.error || (isEn ? 'Could not load users.' : 'Hindi ma-load ang mga user.'));
        return;
      }
      setTeamUsers(data.users ?? []);
    } catch {
      setTeamNotice(isEn ? 'Could not reach users API.' : 'Hindi maabot ang users API.');
    } finally {
      setTeamLoading(false);
    }
  };

  const loadBanners = async () => {
    if (!isAdmin) return;
    setBannersLoading(true);
    setBannersNotice(null);
    try {
      const res = await fetch('/api/banners');
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        banners?: Array<{ imageUrl: string; linkUrl?: string }>;
      };
      if (res.ok && data.ok) {
        setBanners(
          (data.banners ?? []).map((b) => ({
            imageUrl: b.imageUrl || '',
            linkUrl: b.linkUrl || '',
          }))
        );
      }
    } catch {
      setBannersNotice(isEn ? 'Could not load banners.' : 'Hindi ma-load ang mga banner.');
    } finally {
      setBannersLoading(false);
    }
  };

  const handleSaveBanners = async (e: FormEvent) => {
    e.preventDefault();
    setBannersSaving(true);
    setBannersNotice(null);
    try {
      const token = await getToken();
      const cleaned = banners
        .map((b) => ({ imageUrl: b.imageUrl.trim(), linkUrl: b.linkUrl.trim() }))
        .filter((b) => Boolean(b.imageUrl));
      const res = await fetch('/api/banners', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ banners: cleaned }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        banners?: Array<{ imageUrl: string; linkUrl?: string }>;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setBannersNotice(data.error || (isEn ? 'Could not save banners.' : 'Hindi ma-save ang mga banner.'));
        return;
      }
      const next = (data.banners ?? []).map((b) => ({
        imageUrl: b.imageUrl || '',
        linkUrl: b.linkUrl || '',
      }));
      setBanners(next);
      try {
        window.localStorage.setItem('civictech_homepage_banners_v1', JSON.stringify(next));
      } catch {
        // ignore
      }
      setBannersNotice(isEn ? 'Homepage banners saved.' : 'Nai-save ang mga homepage banner.');
    } catch {
      setBannersNotice(isEn ? 'Network error saving banners.' : 'May error sa pag-save.');
    } finally {
      setBannersSaving(false);
    }
  };

  const handleRoleChange = async (targetUserId: string, nextRole: string) => {
    setUpdatingUserId(targetUserId);
    setTeamNotice(null);
    try {
      const token = await getToken();
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ userId: targetUserId, role: nextRole }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setTeamNotice(data.error || (isEn ? 'Could not update role.' : 'Hindi ma-update ang role.'));
        return;
      }
      setTeamUsers((prev) =>
        prev.map((u) => (u.id === targetUserId ? { ...u, role: nextRole } : u))
      );
      setTeamNotice(isEn ? 'Role updated.' : 'Na-update ang role.');
    } catch {
      setTeamNotice(isEn ? 'Network error updating role.' : 'May error sa pag-update ng role.');
    } finally {
      setUpdatingUserId(null);
    }
  };
  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || primaryEmail || 'Reader';
  const connectedProviders = user.externalAccounts
    .map((ext) => ext.provider.charAt(0).toUpperCase() + ext.provider.slice(1))
    .join(', ');
  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(isEn ? 'en-PH' : 'tl-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <>
      {/* Top profile header */}
      <div
        className="profile-header"
        style={{
          paddingBottom: 24,
          borderBottom: '1px solid #E5E5E5',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
          <img
            src={user.imageUrl}
            alt={displayName}
            className="profile-avatar"
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1px solid #E5E5E5',
              flex: 'none',
            }}
          />
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                margin: '0 0 4px',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: ACCENT,
              }}
            >
              {isEn ? 'Account · BetterGov.ph' : 'Account · BetterGov.ph'}
            </p>
            <h1
              className="profile-title"
              style={{
                margin: 0,
                fontFamily: 'Newsreader, Georgia, serif',
                fontSize: 34,
                fontWeight: 500,
                lineHeight: 1.12,
                letterSpacing: '-0.02em',
              }}
            >
              {displayName}
            </h1>
            <p
              className="profile-meta"
              style={{
                margin: '4px 0 0',
                fontSize: 14,
                color: '#555',
                overflowWrap: 'anywhere',
              }}
            >
              {primaryEmail}
              {joinedDate && (
                <span className="profile-joined">
                  {` · ${isEn ? 'Joined' : 'Sumali noong'} ${joinedDate}`}
                </span>
              )}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          style={{
            padding: 0,
            border: 'none',
            background: 'transparent',
            color: '#555',
            fontFamily: 'inherit',
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'underline',
            textUnderlineOffset: 3,
            cursor: 'pointer',
          }}
        >
          {isEn ? 'Sign out' : 'Mag-sign out'}
        </button>
      </div>

      <div className={canPublish || isAdmin ? 'profile-desktop-grid' : 'profile-reader-stack'} style={{ marginTop: 28 }}>
        <div className="profile-col-account" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Newsletter (Cloudflare D1) */}
      <section
        className="profile-section"
        style={{
          padding: '20px 22px',
          border: '1px solid #E5E5E5',
          borderTop: `2px solid ${ACCENT}`,
          background: '#fff',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div style={{ flex: '1 1 180px', minWidth: 0 }}>
          <h2
            style={{
              margin: '0 0 4px',
              fontFamily: 'Newsreader, Georgia, serif',
              fontSize: 21,
              fontWeight: 500,
            }}
          >
            {isEn ? 'The Civic Tech Weekly' : 'Ang Civic Tech Weekly'}
          </h2>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: '#555' }}>
            {nlActive
              ? isEn
                ? `Subscribed with ${primaryEmail}.`
                : `Naka-subscribe gamit ang ${primaryEmail}.`
              : isEn
                ? "Friday editors' picks on digital government & open data."
                : 'Mga piling ulat tuwing Biyernes tungkol sa digital na gobyerno.'}
          </p>
        </div>
        <button
          type="button"
          className="profile-cta"
          disabled={nlBusy}
          onClick={handleToggleNewsletter}
          style={{
            flex: 'none',
            minHeight: 40,
            padding: '0 18px',
            border: nlActive ? '1px solid #D4D4D4' : canPublish ? `1px solid ${ACCENT}` : 'none',
            background: nlActive ? '#fff' : canPublish ? '#fff' : ACCENT,
            color: nlActive ? '#111' : canPublish ? ACCENT : '#fff',
            fontFamily: 'inherit',
            fontSize: 13,
            fontWeight: 600,
            cursor: nlBusy ? 'wait' : 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {nlBusy
            ? isEn
              ? 'Updating…'
              : 'Ina-update…'
            : nlActive
              ? isEn
                ? 'Unsubscribe'
                : 'Mag-unsubscribe'
              : isEn
                ? 'Subscribe'
                : 'Mag-subscribe'}
        </button>
      </section>

      {/* Profile & security (compact) */}
      <section
        className="profile-section"
        style={{
          padding: '20px 22px',
          border: '1px solid #E5E5E5',
          borderTop: `2px solid ${ACCENT}`,
          background: '#fff',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div>
            <h2
              style={{
                margin: '0 0 4px',
                fontFamily: 'Newsreader, Georgia, serif',
                fontSize: 21,
                fontWeight: 500,
              }}
            >
              {isEn ? 'Profile & security' : 'Profile at seguridad'}
            </h2>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: '#555' }}>
              {connectedProviders
                ? isEn
                  ? `Connected via ${connectedProviders}.`
                  : `Nakakonekta gamit ang ${connectedProviders}.`
                : isEn
                  ? 'Name, password, and active sessions.'
                  : 'Pangalan, password, at mga aktibong session.'}
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 18 }}>
            <button
              type="button"
              onClick={() => {
                setEditingName((prev) => !prev);
                setNotice(null);
              }}
              style={{
                padding: 0,
                border: 'none',
                background: 'transparent',
                color: '#111',
                fontFamily: 'inherit',
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'underline',
                textUnderlineOffset: 3,
                cursor: 'pointer',
              }}
            >
              {editingName
                ? isEn
                  ? 'Cancel'
                  : 'Kanselahin'
                : canPublish
                  ? isEn
                    ? 'Edit profile'
                    : 'I-edit ang profile'
                  : isEn
                    ? 'Edit name'
                    : 'I-edit ang pangalan'}
            </button>
            <button
              type="button"
              onClick={() => openUserProfile()}
              style={{
                padding: 0,
                border: 'none',
                background: 'transparent',
                color: ACCENT,
                fontFamily: 'inherit',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {isEn ? 'Security settings →' : 'Seguridad →'}
            </button>
          </div>
        </div>

        {notice && !editingName && (
          <p
            role="status"
            style={{
              margin: '12px 0 0',
              fontSize: 13,
              fontWeight: 600,
              color: notice.isError ? '#C62828' : ACCENT,
            }}
          >
            {notice.text}
          </p>
        )}

        {editingName && (
          <form
            onSubmit={handleSave}
            style={{
              marginTop: 20,
              padding: 20,
              border: '1px solid #E5E5E5',
              background: '#FAFAFA',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                gap: 14,
              }}
            >
              <div>
                <label
                  htmlFor="profile-first-name"
                  style={{
                    display: 'block',
                    marginBottom: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#222',
                  }}
                >
                  {isEn ? 'First name' : 'Unang pangalan'}
                </label>
                <input
                  id="profile-first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: 40,
                    padding: '0 12px',
                    border: '1px solid #D4D4D4',
                    background: '#fff',
                    fontFamily: 'inherit',
                    fontSize: 14,
                    color: '#111',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="profile-last-name"
                  style={{
                    display: 'block',
                    marginBottom: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#222',
                  }}
                >
                  {isEn ? 'Last name' : 'Apelyido'}
                </label>
                <input
                  id="profile-last-name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: 40,
                    padding: '0 12px',
                    border: '1px solid #D4D4D4',
                    background: '#fff',
                    fontFamily: 'inherit',
                    fontSize: 14,
                    color: '#111',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {canPublish && (
              <div>
                <label
                  htmlFor="profile-author-bio"
                  style={{
                    display: 'block',
                    marginBottom: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#222',
                  }}
                >
                  {isEn ? 'Writer bio (shown under your articles)' : 'Bio ng manunulat (makikita sa iyong mga artikulo)'}
                </label>
                <textarea
                  id="profile-author-bio"
                  rows={2}
                  maxLength={240}
                  value={authorBio}
                  onChange={(e) => setAuthorBio(e.target.value)}
                  placeholder={
                    isEn
                      ? 'Short bio — your beat, background, or organization…'
                      : 'Maikling bio — iyong paksa o organisasyon…'
                  }
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #D4D4D4',
                    background: '#fff',
                    fontFamily: 'inherit',
                    fontSize: 14,
                    color: '#111',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                  }}
                />
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  minHeight: 40,
                  padding: '0 18px',
                  border: 'none',
                  background: ACCENT,
                  color: '#fff',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: saving ? 'wait' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving
                  ? isEn
                    ? 'Saving…'
                    : 'Sine-save…'
                  : isEn
                    ? 'Save changes'
                    : 'I-save ang pagbabago'}
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
        )}
      </section>
        </div>

        {(canPublish || isAdmin) && (
          <div className="profile-col-workspace" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Newsroom Studio (admin / editor only) */}
            {canPublish && onOpenWrite && (
              <section
                className="profile-section"
                style={{
                  padding: '20px 22px',
                  border: '1px solid #E5E5E5',
                  borderTop: `2px solid ${ACCENT}`,
                  background: '#fff',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <div style={{ maxWidth: 420 }}>
                  <h2
                    style={{
                      margin: '0 0 4px',
                      fontFamily: 'Newsreader, Georgia, serif',
                      fontSize: 21,
                      fontWeight: 500,
                    }}
                  >
                    Newsroom Studio
                  </h2>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: '#555' }}>
                    {isEn
                      ? `Signed in as ${role}. Write and publish articles.`
                      : `Naka-sign in bilang ${role}. Sumulat at mag-publish ng artikulo.`}
                  </p>
                </div>
                <a
                  href="/write"
                  className="profile-cta"
                  onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    onOpenWrite();
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    minHeight: 40,
                    padding: '0 18px',
                    background: ACCENT,
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span className="profile-desktop-only">
                    {isEn ? 'Manage articles →' : 'Pamahalaan ang artikulo →'}
                  </span>
                  <span className="profile-mobile-only">
                    {isEn ? 'Write & manage articles →' : 'Sumulat at pamahalaan ang artikulo →'}
                  </span>
                </a>
              </section>
            )}

      {/* Team roles (admin only) */}
      {isAdmin && (
        <section
          className="profile-section"
          style={{
            padding: '20px 22px',
            border: '1px solid #E5E5E5',
            borderTop: `2px solid ${ACCENT}`,
            background: '#fff',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div>
              <h2
                style={{
                  margin: '0 0 4px',
                  fontFamily: 'Newsreader, Georgia, serif',
                  fontSize: 21,
                  fontWeight: 500,
                }}
              >
                {isEn ? 'Team roles' : 'Mga role ng team'}
              </h2>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: '#555' }}>
                {isEn
                  ? 'Promote writers, editors, or admins.'
                  : 'Mag-promote ng mga writer, editor, o admin.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const next = !showTeam;
                setShowTeam(next);
                if (next && teamUsers.length === 0) {
                  loadTeamUsers();
                }
              }}
              style={{
                flex: 'none',
                width: 170,
                minHeight: 36,
                padding: '0 14px',
                border: '1px solid #D4D4D4',
                background: '#fff',
                color: '#111',
                fontFamily: 'inherit',
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              {showTeam
                ? isEn
                  ? 'Hide team roles'
                  : 'Itago ang team roles'
                : isEn
                  ? 'Manage team roles'
                  : 'Pamahalaan ang team roles'}
            </button>
          </div>

          {showTeam && (
            <div
              style={{
                marginTop: 18,
                padding: 16,
                border: '1px solid #E5E5E5',
                background: '#FAFAFA',
              }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  loadTeamUsers(teamQuery);
                }}
                style={{ display: 'flex', gap: 8, marginBottom: 12 }}
              >
                <input
                  type="search"
                  value={teamQuery}
                  onChange={(e) => setTeamQuery(e.target.value)}
                  placeholder={isEn ? 'Search user by name or email…' : 'Maghanap ng user…'}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    minHeight: 38,
                    padding: '0 12px',
                    border: '1px solid #D4D4D4',
                    background: '#fff',
                    fontFamily: 'inherit',
                    fontSize: 13,
                    color: '#111',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    minHeight: 38,
                    padding: '0 14px',
                    border: '1px solid #111',
                    background: '#fff',
                    color: '#111',
                    fontFamily: 'inherit',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {isEn ? 'Search' : 'Hanapin'}
                </button>
              </form>

              {teamNotice && (
                <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: ACCENT }}>
                  {teamNotice}
                </p>
              )}

              {teamLoading ? (
                <p style={{ margin: 0, fontSize: 13, color: '#666' }}>
                  {isEn ? 'Loading users…' : 'Nilo-load ang mga user…'}
                </p>
              ) : teamUsers.length === 0 ? (
                <p style={{ margin: 0, fontSize: 13, color: '#666' }}>
                  {isEn ? 'No users found.' : 'Walang nahanap na user.'}
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {teamUsers.map((u) => {
                    const isSelf = u.id === user.id;
                    return (
                      <div
                        key={u.id}
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 12px',
                          border: '1px solid #E5E5E5',
                          background: '#fff',
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#111' }}>
                            {u.name} {isSelf ? (isEn ? '(You)' : '(Ikaw)') : ''}
                          </p>
                          <p style={{ margin: '2px 0 0', fontSize: 12, color: '#666' }}>{u.email}</p>
                        </div>

                        <select
                          aria-label={`Role for ${u.email || u.name}`}
                          value={u.role}
                          disabled={isSelf || updatingUserId === u.id}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          style={{
                            minHeight: 34,
                            padding: '0 10px',
                            border: '1px solid #D4D4D4',
                            background: isSelf ? '#F5F5F5' : '#fff',
                            fontFamily: 'inherit',
                            fontSize: 12,
                            fontWeight: 600,
                            color: '#111',
                            cursor: isSelf ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <option value="">{isEn ? 'Reader' : 'Reader'}</option>
                          <option value="editor">{isEn ? 'Writer / Editor' : 'Writer / Editor'}</option>
                          <option value="admin">{isEn ? 'Admin' : 'Admin'}</option>
                        </select>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Homepage banners (admin only) */}
      {isAdmin && (
        <section
          className="profile-section"
          style={{
            padding: '20px 22px',
            border: '1px solid #E5E5E5',
            borderTop: `2px solid ${ACCENT}`,
            background: '#fff',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div style={{ flex: '1 1 240px', minWidth: 0 }}>
              <h2
                style={{
                  margin: '0 0 4px',
                  fontFamily: 'Newsreader, Georgia, serif',
                  fontSize: 21,
                  fontWeight: 500,
                }}
              >
                {isEn ? 'Homepage banners' : 'Mga banner sa homepage'}
              </h2>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: '#555' }}>
                {isEn
                  ? 'Paste direct image URLs for the scrolling banner under the header.'
                  : 'Maglagay ng mga image URL para sa scrolling banner sa homepage.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const next = !showBanners;
                setShowBanners(next);
                if (next && banners.length === 0 && !bannersLoading) {
                  loadBanners();
                }
              }}
              style={{
                flex: 'none',
                width: 170,
                minHeight: 36,
                padding: '0 14px',
                border: '1px solid #D4D4D4',
                background: '#fff',
                color: '#111',
                fontFamily: 'inherit',
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              {showBanners
                ? isEn
                  ? 'Hide banners'
                  : 'Itago ang mga banner'
                : isEn
                  ? 'Manage banners'
                  : 'Pamahalaan ang mga banner'}
            </button>
          </div>

          {showBanners && (
            <form
              onSubmit={handleSaveBanners}
              style={{
                marginTop: 18,
                padding: 16,
                border: '1px solid #E5E5E5',
                background: '#FAFAFA',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {bannersLoading ? (
                <p style={{ margin: 0, fontSize: 13, color: '#666' }}>
                  {isEn ? 'Loading banners…' : 'Nilo-load ang mga banner…'}
                </p>
              ) : (
                <>
                  {banners.map((b, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: 12,
                        border: '1px solid #E5E5E5',
                        background: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#333' }}>
                          {isEn ? `Banner #${idx + 1}` : `Banner #${idx + 1}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => setBanners((prev) => prev.filter((_, i) => i !== idx))}
                          style={{
                            padding: 0,
                            border: 'none',
                            background: 'transparent',
                            color: '#C62828',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {isEn ? 'Remove' : 'Tanggalin'}
                        </button>
                      </div>
                      <input
                        type="url"
                        required
                        value={b.imageUrl}
                        onChange={(e) =>
                          setBanners((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, imageUrl: e.target.value } : item))
                          )
                        }
                        placeholder="https://example.com/banner-image.jpg"
                        style={{
                          width: '100%',
                          minHeight: 38,
                          padding: '0 10px',
                          border: '1px solid #D4D4D4',
                          fontFamily: 'inherit',
                          fontSize: 13,
                          boxSizing: 'border-box',
                        }}
                      />
                      <input
                        type="url"
                        value={b.linkUrl}
                        onChange={(e) =>
                          setBanners((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, linkUrl: e.target.value } : item))
                          )
                        }
                        placeholder={isEn ? 'Optional click link (https://…)' : 'Opsyonal na link (https://…)'}
                        style={{
                          width: '100%',
                          minHeight: 38,
                          padding: '0 10px',
                          border: '1px solid #D4D4D4',
                          fontFamily: 'inherit',
                          fontSize: 13,
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  ))}

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setBanners((prev) => [...prev, { imageUrl: '', linkUrl: '' }])}
                      style={{
                        minHeight: 38,
                        padding: '0 14px',
                        border: '1px solid #111',
                        background: '#fff',
                        color: '#111',
                        fontFamily: 'inherit',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      + {isEn ? 'Add banner' : 'Magdagdag ng banner'}
                    </button>
                    <button
                      type="submit"
                      disabled={bannersSaving}
                      style={{
                        minHeight: 38,
                        padding: '0 18px',
                        border: 'none',
                        background: ACCENT,
                        color: '#fff',
                        fontFamily: 'inherit',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: bannersSaving ? 'wait' : 'pointer',
                      }}
                    >
                      {bannersSaving
                        ? isEn
                          ? 'Saving…'
                          : 'Sine-save…'
                        : isEn
                          ? 'Save banners'
                          : 'I-save ang mga banner'}
                    </button>
                    {bannersNotice && (
                      <span style={{ fontSize: 12, fontWeight: 600, color: ACCENT }}>
                        {bannersNotice}
                      </span>
                    )}
                  </div>
                </>
              )}
            </form>
          )}
        </section>
      )}
      {/* Newsletter Studio (admin / editor) */}
      {canPublish && (
        <NewsletterStudioCard
          isEn={isEn}
          getToken={getToken}
          defaultOpen={new URLSearchParams(window.location.search).get('panel') === 'newsletter'}
        />
      )}
          </div>
        )}
      </div>
    </>
  );
}

function NewsletterStudioCard({
  isEn,
  getToken,
  defaultOpen,
}: {
  isEn: boolean;
  getToken: () => Promise<string | null>;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [loading, setLoading] = useState(false);
  const [activeCount, setActiveCount] = useState<number | null>(null);
  const [configured, setConfigured] = useState(false);
  const [stories, setStories] = useState<CachedArticleItem[]>(ARTICLES);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(() =>
    ARTICLES.slice(0, 3).map((a) => a.slug)
  );
  const [subject, setSubject] = useState('Civic Tech PH Weekly Briefing');
  const [intro, setIntro] = useState(
    'Here are the latest stories on Philippine open data, public budgets, and digital government.'
  );
  const [testEmail, setTestEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const loadStudio = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const [statsRes, artRes] = await Promise.all([
        fetch('/api/newsletter/send', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
        fetch('/api/articles'),
      ]);
      if (statsRes.ok) {
        const stats = (await statsRes.json()) as {
          activeCount?: number;
          configured?: boolean;
        };
        setActiveCount(stats.activeCount ?? 0);
        setConfigured(Boolean(stats.configured));
      }
      if (artRes.ok) {
        const artData = (await artRes.json()) as { ok?: boolean; articles?: D1ApiArticle[] };
        if (artData.ok && artData.articles) {
          const d1 = artData.articles.map(mapD1RowToArticle);
          const d1Slugs = new Set(d1.map((s) => s.slug));
          const merged = [...d1, ...ARTICLES.filter((a) => !d1Slugs.has(a.slug))];
          setStories(merged);
          setSelectedSlugs(merged.slice(0, 3).map((a) => a.slug));
        }
      }
    } catch {
      // ignore on plain Vite dev
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (defaultOpen) {
      loadStudio();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultOpen]);

  const toggleSlug = (slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : prev.length < 5 ? [...prev, slug] : prev
    );
  };

  const buildIssuePayload = () => {
    const origin = window.location.origin;
    const picked = stories.filter((s) => selectedSlugs.includes(s.slug));
    const itemsHtml = picked
      .map(
        (s) =>
          `<tr><td style="padding:16px 0;border-bottom:1px solid #E5E5E5;">
            <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#0B3D91;">${s.kicker.en}</p>
            <h3 style="margin:0 0 6px;font-family:Georgia,serif;font-size:20px;line-height:1.25;color:#111;"><a href="${origin}/article/${s.slug}" style="color:#111;text-decoration:none;">${s.title.en}</a></h3>
            <p style="margin:0;font-size:14px;line-height:1.5;color:#444;">${s.deck.en}</p>
          </td></tr>`
      )
      .join('');
    const html = `<div style="background:#F7F8FA;padding:32px 16px;font-family:Inter,system-ui,sans-serif;color:#111;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #E5E5E5;border-top:4px solid #0B3D91;">
        <tr><td style="padding:24px 32px;border-bottom:1px solid #E5E5E5;">
          <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#0B3D91;">Civic Tech PH Briefing</p>
          <h1 style="margin:0;font-family:Georgia,serif;font-size:26px;font-weight:600;color:#111;">${subject}</h1>
        </td></tr>
        <tr><td style="padding:20px 32px 8px;font-size:15px;line-height:1.6;color:#222;">
          <p style="margin:0;">${intro}</p>
        </td></tr>
        <tr><td style="padding:0 32px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${itemsHtml}</table>
        </td></tr>
        <tr><td style="padding:16px 32px;background:#F7F8FA;border-top:1px solid #E5E5E5;font-size:12px;color:#666;">
          Civic Tech by BetterGov.ph · <a href="${origin}/profile" style="color:#0B3D91;">Manage subscription</a>
        </td></tr>
      </table>
    </div>`;
    const text = `${subject}\n\n${intro}\n\n${picked
      .map((s) => `- ${s.title.en}: ${origin}/article/${s.slug}`)
      .join('\n')}`;
    return { subject, html, text };
  };

  const handleSend = async (isTest: boolean) => {
    setNotice(null);
    if (isTest && !testEmail.trim()) {
      setNotice(isEn ? 'Enter a test email address first.' : 'Maglagay muna ng test email.');
      return;
    }
    setSending(true);
    try {
      const token = await getToken();
      const payload = buildIssuePayload();
      const res = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...payload,
          ...(isTest ? { testEmail: testEmail.trim() } : {}),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        sent?: number;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setNotice(data.error || (isEn ? 'Could not send newsletter.' : 'Hindi maipadala ang newsletter.'));
        return;
      }
      setNotice(
        isTest
          ? isEn
            ? `Test email sent to ${testEmail.trim()}.`
            : `Naipadala ang test email sa ${testEmail.trim()}.`
          : isEn
            ? `Broadcast sent to ${data.sent ?? 0} subscriber(s).`
            : `Naipadala sa ${data.sent ?? 0} subscriber.`
      );
    } catch {
      setNotice(isEn ? 'Network error sending newsletter.' : 'May error sa pagpapadala.');
    } finally {
      setSending(false);
    }
  };

  const handleDownloadCsv = async () => {
    setNotice(null);
    try {
      const token = await getToken();
      const res = await fetch('/api/newsletter/send?format=csv', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        setNotice(isEn ? 'Could not export CSV.' : 'Hindi ma-export ang CSV.');
        return;
      }
      const csv = await res.text();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'civictech-subscribers.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setNotice(isEn ? 'Network error exporting CSV.' : 'May error sa pag-export.');
    }
  };

  return (
    <section
      className="profile-section"
      style={{
        border: '1px solid #E5E5E5',
        borderTop: `2px solid ${ACCENT}`,
        background: '#fff',
        padding: '20px 22px',
      }}
    >
      <div
        className="profile-nl-header"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ flex: '1 1 160px', minWidth: 0 }}>
          <h2
            style={{
              margin: '0 0 4px',
              fontFamily: 'Newsreader, Georgia, serif',
              fontSize: 21,
              fontWeight: 500,
            }}
          >
            {isEn ? 'Newsletter Studio' : 'Studio ng Newsletter'}
          </h2>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: '#555' }}>
            {activeCount !== null
              ? `${activeCount} ${isEn ? 'active subscribers' : 'aktibong subscriber'}`
              : isEn
                ? 'Compose & send issues or export subscribers.'
                : 'Gumawa at magpadala ng isyu o mag-export ng subscribers.'}
          </p>
        </div>
        <div className="profile-nl-actions" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleDownloadCsv}
            style={{
              width: 170,
              minHeight: 36,
              padding: '0 14px',
              border: '1px solid #D4D4D4',
              background: '#fff',
              color: '#111',
              fontFamily: 'inherit',
              fontSize: 13,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            {isEn ? 'Export CSV' : 'I-export ang CSV'}
          </button>
          <button
            type="button"
            onClick={() => {
              const next = !open;
              setOpen(next);
              if (next && activeCount === null && !loading) loadStudio();
            }}
            style={{
              width: 170,
              minHeight: 36,
              padding: '0 14px',
              border: '1px solid #D4D4D4',
              background: '#fff',
              color: '#111',
              fontFamily: 'inherit',
              fontSize: 13,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            {open
              ? isEn
                ? 'Hide studio'
                : 'Itago'
              : isEn
                ? 'Compose issue'
                : 'Gumawa ng isyu'}
          </button>
        </div>
      </div>

      {open && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #EFEFEF', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {loading ? (
            <p style={{ margin: 0, fontSize: 13, color: '#666' }}>
              {isEn ? 'Loading subscribers & stories…' : 'Nilo-load…'}
            </p>
          ) : (
            <>
              {!configured && (
                <p style={{ margin: 0, fontSize: 12, color: '#991B1B' }}>
                  {isEn
                    ? 'RESEND_API_KEY is not configured yet on this environment.'
                    : 'Hindi pa naka-configure ang RESEND_API_KEY.'}
                </p>
              )}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                  {isEn ? 'Email Subject' : 'Pamagat ng Email'}
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #D4D4D4', fontFamily: 'inherit', fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                  {isEn ? 'Intro Note' : 'Pambungad'}
                </label>
                <textarea
                  rows={2}
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #D4D4D4', fontFamily: 'inherit', fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 600 }}>
                  {isEn ? 'Select up to 5 stories to include:' : 'Pumili ng hanggang 5 artikulo:'}
                </p>
                <div style={{ maxHeight: 160, overflowY: 'auto', border: '1px solid #E5E5E5', padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {stories.slice(0, 20).map((s) => (
                    <label key={s.slug} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={selectedSlugs.includes(s.slug)}
                        onChange={() => toggleSlug(s.slug)}
                      />
                      <span>{s.title.en}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@example.com"
                  style={{ flex: '1 1 200px', padding: '8px 10px', border: '1px solid #D4D4D4', fontFamily: 'inherit', fontSize: 13 }}
                />
                <button
                  type="button"
                  disabled={sending}
                  onClick={() => handleSend(true)}
                  style={{
                    minHeight: 36,
                    padding: '0 14px',
                    border: '1px solid #111',
                    background: '#fff',
                    color: '#111',
                    fontFamily: 'inherit',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: sending ? 'wait' : 'pointer',
                  }}
                >
                  {isEn ? 'Send test' : 'Magpadala ng test'}
                </button>
                <button
                  type="button"
                  disabled={sending}
                  onClick={() => handleSend(false)}
                  style={{
                    minHeight: 36,
                    padding: '0 16px',
                    border: 'none',
                    background: ACCENT,
                    color: '#fff',
                    fontFamily: 'inherit',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: sending ? 'wait' : 'pointer',
                  }}
                >
                  {sending
                    ? isEn
                      ? 'Sending…'
                      : 'Ipinapadala…'
                    : isEn
                      ? `Send to ${activeCount ?? 0} subscribers`
                      : `Ipadala sa ${activeCount ?? 0} subscriber`}
                </button>
              </div>
              {notice && (
                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: ACCENT }}>
                  {notice}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}

export function ProfilePage({
  lang,
  onLangChange,
  onBackHome,
  onOpenCivicTools,
  onOpenSubmit,
  onOpenCategory,
  onOpenInfo,
  onOpenLogin,
  onOpenWrite,
}: ProfilePageProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#111',
        background: '#fff',
      }}
    >
      <SiteHeader
        lang={lang}
        onLangChange={onLangChange}
        onBackHome={onBackHome}
        onOpenCategory={onOpenCategory}
        onOpenCivicTools={onOpenCivicTools}
      />

      <main
        className="info-main"
        style={{
          width: '100%',
          maxWidth: 1120,
          margin: '0 auto',
          padding: '44px 24px 88px',
          flex: '1 0 auto',
          boxSizing: 'border-box',
        }}
      >
        {HAS_CLERK ? (
          <ClerkProfileContent
            lang={lang}
            onBackHome={onBackHome}
            onOpenLogin={onOpenLogin}
            onOpenWrite={onOpenWrite}
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
