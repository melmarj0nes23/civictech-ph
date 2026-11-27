import { useState, type FormEvent, type MouseEvent } from 'react';
import { Footer } from '../components/Footer';
import { SiteHeader } from '../components/SiteHeader';
import type { CategorySlug } from '../data/articles';
import type { Lang } from '../data/i18n';
import type { InfoPageSlug } from '../data/infoPages';

const ACCENT = '#0B3D91';

interface AuthPageProps {
  mode: 'login' | 'signup';
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  onBackHome: () => void;
  onOpenCivicTools: () => void;
  onOpenSubmit: (hash?: string) => void;
  onOpenCategory: (slug: CategorySlug) => void;
  onOpenInfo: (slug: InfoPageSlug) => void;
  onSwitchMode: (mode: 'login' | 'signup') => void;
}

export function AuthPage({
  mode,
  lang,
  onLangChange,
  onBackHome,
  onOpenCivicTools,
  onOpenSubmit,
  onOpenCategory,
  onOpenInfo,
  onSwitchMode,
}: AuthPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const isEn = lang === 'en';
  const isLogin = mode === 'login';

  const handleOAuth = (provider: 'Google' | 'GitHub') => {
    setNotice(
      isEn
        ? `Preview mode: ${provider} sign-in will connect here once auth is configured.`
        : `Preview mode: ikokonekta ang ${provider} sign-in kapag na-configure na ang auth.`
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) return;
    setNotice(
      isLogin
        ? isEn
          ? `Preview mode: signed in as ${cleanEmail}.`
          : `Preview mode: naka-login bilang ${cleanEmail}.`
        : isEn
          ? `Preview mode: account created for ${cleanEmail}.`
          : `Preview mode: nagawa ang account para sa ${cleanEmail}.`
    );
  };

  const handleForgot = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setNotice(
      isEn
        ? 'Preview mode: password reset links will be sent via email once auth is live.'
        : 'Preview mode: ipapadala ang password reset link sa email kapag live na ang auth.'
    );
  };

  const handleToggleMode = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setNotice(null);
    onSwitchMode(isLogin ? 'signup' : 'login');
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#111', background: '#fff' }}>
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
          maxWidth: 440,
          margin: '0 auto',
          padding: '64px 24px 88px',
        }}
      >
        <h1
          style={{
            margin: '0 0 28px',
            fontFamily: 'Newsreader, Georgia, serif',
            fontSize: 36,
            fontWeight: 500,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            textAlign: 'center',
            color: '#111',
          }}
        >
          {isLogin
            ? isEn
              ? 'Login to your account'
              : 'Mag-login sa iyong account'
            : isEn
              ? 'Create your account'
              : 'Gumawa ng iyong account'}
        </h1>

        {/* OAuth buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <button
            type="button"
            onClick={() => handleOAuth('Google')}
            style={{
              width: '100%',
              minHeight: 46,
              padding: '0 16px',
              border: '1px solid #D4D4D4',
              background: '#fff',
              color: '#111',
              fontFamily: 'inherit',
              fontSize: 14,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              cursor: 'pointer',
              boxSizing: 'border-box',
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
              width: '100%',
              minHeight: 46,
              padding: '0 16px',
              border: '1px solid #D4D4D4',
              background: '#fff',
              color: '#111',
              fontFamily: 'inherit',
              fontSize: 14,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              cursor: 'pointer',
              boxSizing: 'border-box',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            {isEn ? 'Continue with GitHub' : 'Magpatuloy gamit ang GitHub'}
          </button>
        </div>

        {/* Or divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            margin: '26px 0',
            color: '#999',
            fontSize: 13,
          }}
        >
          <span style={{ flex: 1, height: 1, background: '#EAEAEA' }} />
          <span>{isEn ? 'Or' : 'O'}</span>
          <span style={{ flex: 1, height: 1, background: '#EAEAEA' }} />
        </div>

        {/* Email & Password form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {!isLogin && (
            <div>
              <label
                htmlFor="auth-name"
                style={{
                  display: 'block',
                  marginBottom: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#222',
                }}
              >
                <span style={{ color: '#C62828', marginRight: 4 }}>*</span>
                {isEn ? 'Full Name' : 'Buong Pangalan'}
              </label>
              <input
                id="auth-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isEn ? 'Your full name' : 'Iyong buong pangalan'}
                style={{
                  width: '100%',
                  minHeight: 46,
                  padding: '0 14px',
                  border: '1px solid #D4D4D4',
                  fontFamily: 'inherit',
                  fontSize: 15,
                  color: '#111',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )}

          <div>
            <label
              htmlFor="auth-email"
              style={{
                display: 'block',
                marginBottom: 8,
                fontSize: 13,
                fontWeight: 600,
                color: '#222',
              }}
            >
              <span style={{ color: '#C62828', marginRight: 4 }}>*</span>
              {isEn ? 'Email' : 'Email'}
            </label>
            <input
              id="auth-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isEn ? 'Your email' : 'Iyong email'}
              style={{
                width: '100%',
                minHeight: 46,
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
              htmlFor="auth-password"
              style={{
                display: 'block',
                marginBottom: 8,
                fontSize: 13,
                fontWeight: 600,
                color: '#222',
              }}
            >
              <span style={{ color: '#C62828', marginRight: 4 }}>*</span>
              {isEn ? 'Password' : 'Password'}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isEn ? 'Your password' : 'Iyong password'}
                style={{
                  width: '100%',
                  minHeight: 46,
                  padding: '0 44px 0 14px',
                  border: '1px solid #D4D4D4',
                  fontFamily: 'inherit',
                  fontSize: 15,
                  color: '#111',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={
                  showPassword
                    ? isEn
                      ? 'Hide password'
                      : 'Itago ang password'
                    : isEn
                      ? 'Show password'
                      : 'Ipakita ang password'
                }
                style={{
                  position: 'absolute',
                  right: 4,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 38,
                  height: 38,
                  border: 'none',
                  background: 'transparent',
                  color: '#555',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                {showPassword ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              minHeight: 46,
              marginTop: 6,
              border: 'none',
              background: ACCENT,
              color: '#fff',
              fontFamily: 'inherit',
              fontWeight: 600,
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            {isLogin ? (isEn ? 'Login' : 'Mag-login') : isEn ? 'Sign up' : 'Mag-sign up'}
          </button>
        </form>

        {isLogin && (
          <p style={{ margin: '14px 0 0', textAlign: 'center', fontSize: 13 }}>
            <a
              href="/login"
              onClick={handleForgot}
              style={{ color: '#222', textDecoration: 'underline' }}
            >
              {isEn ? 'Forgot Password' : 'Nakalimutan ang password'}
            </a>
          </p>
        )}

        {notice && (
          <p
            role="status"
            style={{
              margin: '20px 0 0',
              padding: '12px 14px',
              background: '#F4F6FA',
              borderLeft: `3px solid ${ACCENT}`,
              fontSize: 13,
              lineHeight: 1.5,
              color: '#1A1A1A',
            }}
          >
            {notice}
          </p>
        )}

        <p
          style={{
            margin: '36px 0 0',
            textAlign: 'center',
            fontSize: 14,
            color: '#444',
          }}
        >
          {isLogin
            ? isEn
              ? "Don't have an account? "
              : 'Wala ka pang account? '
            : isEn
              ? 'Already have an account? '
              : 'May account ka na? '}
          <a
            href={isLogin ? '/signup' : '/login'}
            onClick={handleToggleMode}
            style={{ color: ACCENT, fontWeight: 600 }}
          >
            {isLogin ? (isEn ? 'Sign up' : 'Mag-sign up') : isEn ? 'Login' : 'Mag-login'}
          </a>
        </p>
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
