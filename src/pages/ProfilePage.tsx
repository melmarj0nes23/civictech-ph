import { useClerk, useUser } from '@clerk/react';
import { useEffect, useState, type FormEvent, type MouseEvent } from 'react';
import { Footer } from '../components/Footer';
import { SiteHeader } from '../components/SiteHeader';
import type { CategorySlug } from '../data/articles';
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
  const { signOut, openUserProfile } = useClerk();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ text: string; isError: boolean } | null>(null);
  const [nlActive, setNlActive] = useState<boolean | null>(null);
  const [nlBusy, setNlBusy] = useState(false);

  const isEn = lang === 'en';

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? '');
      setLastName(user.lastName ?? '');
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
      await user.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      setNotice({
        text: isEn ? 'Profile updated.' : 'Na-update ang profile.',
        isError: false,
      });
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
        body: JSON.stringify({ email: primaryEmail, lang, action: nextAction }),
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
  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || primaryEmail || 'Reader';
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
        style={{
          paddingBottom: 28,
          borderBottom: '1px solid #E5E5E5',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <img
            src={user.imageUrl}
            alt={displayName}
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1px solid #E5E5E5',
              flex: 'none',
            }}
          />
          <div>
            <p
              style={{
                margin: '0 0 6px',
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
              className="directory-title"
              style={{
                margin: 0,
                fontFamily: 'Newsreader, Georgia, serif',
                fontSize: 38,
                fontWeight: 500,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              {displayName}
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: 14, color: '#555' }}>
              {primaryEmail}
              {joinedDate ? ` · ${isEn ? 'Joined' : 'Sumali noong'} ${joinedDate}` : ''}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          style={{
            minHeight: 42,
            padding: '0 16px',
            border: '1px solid #D4D4D4',
            background: '#fff',
            color: '#111',
            fontFamily: 'inherit',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {isEn ? 'Sign out' : 'Mag-sign out'}
        </button>
      </div>

      {/* Profile details form */}
      <section style={{ padding: '32px 0', borderBottom: '1px solid #E5E5E5' }}>
        <h2
          style={{
            margin: '0 0 18px',
            fontFamily: 'Newsreader, Georgia, serif',
            fontSize: 24,
            fontWeight: 500,
          }}
        >
          {isEn ? 'Profile details' : 'Mga detalye ng profile'}
        </h2>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
              gap: 16,
            }}
          >
            <div>
              <label
                htmlFor="profile-first-name"
                style={{
                  display: 'block',
                  marginBottom: 8,
                  fontSize: 13,
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
                  minHeight: 44,
                  padding: '0 14px',
                  border: '1px solid #D4D4D4',
                  fontFamily: 'inherit',
                  fontSize: 15,
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
                  marginBottom: 8,
                  fontSize: 13,
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
                  minHeight: 44,
                  padding: '0 14px',
                  border: '1px solid #D4D4D4',
                  fontFamily: 'inherit',
                  fontSize: 15,
                  color: '#111',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                minHeight: 44,
                padding: '0 22px',
                border: 'none',
                background: ACCENT,
                color: '#fff',
                fontFamily: 'inherit',
                fontSize: 14,
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
      </section>

      {/* Emails & connected accounts */}
      <section style={{ padding: '32px 0', borderBottom: '1px solid #E5E5E5' }}>
        <h2
          style={{
            margin: '0 0 18px',
            fontFamily: 'Newsreader, Georgia, serif',
            fontSize: 24,
            fontWeight: 500,
          }}
        >
          {isEn ? 'Email & connected accounts' : 'Email at mga nakakonektang account'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {user.emailAddresses.map((ea) => (
            <div
              key={ea.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                border: '1px solid #E5E5E5',
                fontSize: 14,
              }}
            >
              <span>{ea.emailAddress}</span>
              {ea.id === user.primaryEmailAddressId && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '3px 8px',
                    background: '#F4F6FA',
                    color: ACCENT,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {isEn ? 'Primary' : 'Pangunahin'}
                </span>
              )}
            </div>
          ))}

          {user.externalAccounts.map((ext) => (
            <div
              key={ext.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                border: '1px solid #E5E5E5',
                fontSize: 14,
              }}
            >
              <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>
                {ext.provider} · {ext.emailAddress || ext.username || ''}
              </span>
              <span style={{ fontSize: 12, color: '#555' }}>
                {isEn ? 'Connected' : 'Nakakonekta'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter (Cloudflare D1) */}
      <section style={{ padding: '32px 0', borderBottom: '1px solid #E5E5E5' }}>
        <h2
          style={{
            margin: '0 0 10px',
            fontFamily: 'Newsreader, Georgia, serif',
            fontSize: 24,
            fontWeight: 500,
          }}
        >
          {isEn ? 'The Civic Tech Weekly' : 'Ang Civic Tech Weekly'}
        </h2>
        <p style={{ margin: '0 0 16px', fontSize: 14, lineHeight: 1.55, color: '#555' }}>
          {nlActive
            ? isEn
              ? `Subscribed with ${primaryEmail}.`
              : `Naka-subscribe gamit ang ${primaryEmail}.`
            : isEn
              ? "Our editors' picks on data, digital government and public tools. Every Friday."
              : 'Mga piling ulat ng patnugot tungkol sa datos, digital na gobyerno at mga tool.'}
        </p>
        <button
          type="button"
          disabled={nlBusy}
          onClick={handleToggleNewsletter}
          style={{
            minHeight: 42,
            padding: '0 18px',
            border: nlActive ? '1px solid #D4D4D4' : 'none',
            background: nlActive ? '#fff' : ACCENT,
            color: nlActive ? '#111' : '#fff',
            fontFamily: 'inherit',
            fontSize: 13,
            fontWeight: 600,
            cursor: nlBusy ? 'wait' : 'pointer',
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
                ? 'Subscribe to newsletter'
                : 'Mag-subscribe sa newsletter'}
        </button>
      </section>

      {/* Newsroom Studio (admin / editor only) */}
      {canPublish && onOpenWrite && (
        <section style={{ padding: '32px 0', borderBottom: '1px solid #E5E5E5' }}>
          <h2
            style={{
              margin: '0 0 10px',
              fontFamily: 'Newsreader, Georgia, serif',
              fontSize: 24,
              fontWeight: 500,
            }}
          >
            {isEn ? 'Newsroom Studio' : 'Newsroom Studio'}
          </h2>
          <p style={{ margin: '0 0 16px', fontSize: 14, lineHeight: 1.55, color: '#555' }}>
            {isEn
              ? `Signed in as ${role}. Create, edit, and publish Civic Tech articles directly to Cloudflare D1.`
              : `Naka-sign in bilang ${role}. Sumulat, mag-edit, at mag-publish ng mga artikulo sa Cloudflare D1.`}
          </p>
          <a
            href="/write"
            onClick={(e: MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              onOpenWrite();
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: 42,
              padding: '0 18px',
              background: ACCENT,
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {isEn ? 'Write & manage articles →' : 'Sumulat at pamahalaan ang artikulo →'}
          </a>
        </section>
      )}

      {/* Security */}
      <section style={{ padding: '32px 0 0' }}>
        <h2
          style={{
            margin: '0 0 10px',
            fontFamily: 'Newsreader, Georgia, serif',
            fontSize: 24,
            fontWeight: 500,
          }}
        >
          {isEn ? 'Security & password' : 'Seguridad at password'}
        </h2>
        <p style={{ margin: '0 0 16px', fontSize: 14, lineHeight: 1.55, color: '#555' }}>
          {isEn
            ? 'Manage your password, active sessions, two-factor authentication, or connected providers.'
            : 'Pamahalaan ang iyong password, mga aktibong session, at two-factor authentication.'}
        </p>
        <button
          type="button"
          onClick={() => openUserProfile()}
          style={{
            minHeight: 42,
            padding: '0 18px',
            border: '1px solid #111',
            background: '#fff',
            color: '#111',
            fontFamily: 'inherit',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {isEn ? 'Manage security settings →' : 'Pamahalaan ang seguridad →'}
        </button>
      </section>
    </>
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
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#111', background: '#fff' }}>
      <SiteHeader
        lang={lang}
        onLangChange={onLangChange}
        onBackHome={onBackHome}
        onOpenCategory={onOpenCategory}
        onOpenCivicTools={onOpenCivicTools}
      />

      <main className="info-main" style={{ maxWidth: 740, margin: '0 auto', padding: '48px 24px 72px' }}>
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
