import { useEffect, useState, type FormEvent } from 'react';
import type { Lang } from '../data/i18n';

const ACCENT = '#0B3D91';

interface AuthModalProps {
  open: boolean;
  lang: Lang;
  onClose: () => void;
}

export function AuthModal({ open, lang, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setNotice(null);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const isEn = lang === 'en';

  const handleOAuth = (provider: 'GitHub' | 'Google') => {
    setNotice(
      isEn
        ? `Preview mode: ${provider} sign-in will connect to your account once auth is enabled.`
        : `Preview mode: ikokonekta ang pag-sign in gamit ang ${provider} kapag na-enable na ang auth.`
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) return;
    setNotice(
      isEn
        ? `Preview mode: magic sign-in link prepared for ${cleanEmail}.`
        : `Preview mode: nakahanda na ang magic sign-in link para sa ${cleanEmail}.`
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isEn ? 'Login or sign up' : 'Mag-login o mag-sign up'}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        boxSizing: 'border-box',
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(17, 17, 17, 0.45)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1101,
          width: '100%',
          maxWidth: 420,
          background: '#fff',
          border: '1px solid #E5E5E5',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.16)',
          padding: '24px 24px 28px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
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
              Civic Tech · BetterGov.ph
            </p>
            <h2
              style={{
                margin: 0,
                fontFamily: 'Newsreader, Georgia, serif',
                fontSize: 28,
                fontWeight: 500,
                lineHeight: 1.15,
                color: '#111',
              }}
            >
              {mode === 'login'
                ? isEn
                  ? 'Welcome back'
                  : 'Maligayang pagbabalik'
                : isEn
                  ? 'Create an account'
                  : 'Gumawa ng account'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={isEn ? 'Close' : 'Isara'}
            style={{
              width: 36,
              height: 36,
              margin: '-6px -8px 0 0',
              border: 'none',
              background: 'transparent',
              color: '#555',
              fontSize: 22,
              lineHeight: 1,
              cursor: 'pointer',
              flex: 'none',
            }}
          >
            ×
          </button>
        </div>

        {/* Mode tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            marginTop: 18,
            borderBottom: '1px solid #E5E5E5',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setNotice(null);
            }}
            style={{
              padding: '10px 0',
              border: 'none',
              borderBottom: mode === 'login' ? `2px solid ${ACCENT}` : '2px solid transparent',
              background: 'transparent',
              color: mode === 'login' ? ACCENT : '#555',
              fontWeight: mode === 'login' ? 600 : 500,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            {isEn ? 'Log in' : 'Mag-login'}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setNotice(null);
            }}
            style={{
              padding: '10px 0',
              border: 'none',
              borderBottom: mode === 'signup' ? `2px solid ${ACCENT}` : '2px solid transparent',
              background: 'transparent',
              color: mode === 'signup' ? ACCENT : '#555',
              fontWeight: mode === 'signup' ? 600 : 500,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            {isEn ? 'Sign up' : 'Mag-sign up'}
          </button>
        </div>

        {/* OAuth buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
          <button
            type="button"
            onClick={() => handleOAuth('Google')}
            style={{
              minHeight: 42,
              padding: '0 14px',
              border: '1px solid #D4D4D4',
              background: '#fff',
              color: '#111',
              fontSize: 13,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              cursor: 'pointer',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.2 0 6-1.1 8-3l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.2 0-5.9-2.1-6.8-5H1.2v3.1C3.2 21.3 7.3 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.2 14.2c-.2-.7-.4-1.4-.4-2.2s.1-1.5.4-2.2V6.7H1.2C.4 8.3 0 10.1 0 12s.4 3.7 1.2 5.3l4-3.1z"
              />
              <path
                fill="#EA4335"
                d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.3 0 3.2 2.7 1.2 6.7l4 3.1c.9-2.9 3.6-5 6.8-5z"
              />
            </svg>
            {isEn ? 'Continue with Google' : 'Magpatuloy gamit ang Google'}
          </button>

          <button
            type="button"
            onClick={() => handleOAuth('GitHub')}
            style={{
              minHeight: 42,
              padding: '0 14px',
              border: '1px solid #D4D4D4',
              background: '#fff',
              color: '#111',
              fontSize: 13,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              cursor: 'pointer',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            {isEn ? 'Continue with GitHub' : 'Magpatuloy gamit ang GitHub'}
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            margin: '16px 0',
            color: '#777',
            fontSize: 12,
          }}
        >
          <span style={{ flex: 1, height: 1, background: '#E5E5E5' }} />
          <span>{isEn ? 'or with email' : 'o gamit ang email'}</span>
          <span style={{ flex: 1, height: 1, background: '#E5E5E5' }} />
        </div>

        {/* Magic link email form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mode === 'signup' && (
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isEn ? 'Full name' : 'Buong pangalan'}
              aria-label={isEn ? 'Full name' : 'Buong pangalan'}
              style={{
                minHeight: 42,
                padding: '0 12px',
                border: '1px solid #D4D4D4',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 14,
                boxSizing: 'border-box',
              }}
            />
          )}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-label={isEn ? 'Email address' : 'Email address'}
            style={{
              minHeight: 42,
              padding: '0 12px',
              border: '1px solid #D4D4D4',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 14,
              boxSizing: 'border-box',
            }}
          />
          <button
            type="submit"
            style={{
              minHeight: 44,
              border: 'none',
              background: ACCENT,
              color: '#fff',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            {mode === 'login'
              ? isEn
                ? 'Send sign-in link'
                : 'Magpadala ng sign-in link'
              : isEn
                ? 'Create account'
                : 'Gumawa ng account'}
          </button>
        </form>

        {notice && (
          <p
            role="status"
            style={{
              margin: '14px 0 0',
              padding: '10px 12px',
              background: '#F4F6FA',
              borderLeft: `3px solid ${ACCENT}`,
              fontSize: 13,
              lineHeight: 1.45,
              color: '#1A1A1A',
            }}
          >
            {notice}
          </p>
        )}
      </div>
    </div>
  );
}
