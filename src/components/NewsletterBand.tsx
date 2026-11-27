import { useUser } from '@clerk/react';
import { useState, type FormEvent } from 'react';
import { TRANSLATIONS, type Lang } from '../data/i18n';

const ACCENT = '#0B3D91';
const HAS_CLERK = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

interface NewsletterBandProps {
  lang: Lang;
}

function NewsletterBandInner({ lang, firstName }: NewsletterBandProps & { firstName?: string }) {
  const t = TRANSLATIONS[lang];
  const [nlEmail, setNlEmail] = useState('');
  const [nlSubmitting, setNlSubmitting] = useState(false);
  const [nlSubscribed, setNlSubscribed] = useState<string | null>(null);

  const handleNlSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const clean = nlEmail.trim();
    if (!clean) return;
    setNlSubmitting(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: clean, lang, firstName: firstName || undefined }),
      });
      if (res.ok) {
        setNlSubscribed(clean);
        return;
      }
    } catch {
      // Fallback when running plain Vite dev server without Pages Functions
    } finally {
      setNlSubmitting(false);
    }
    setNlSubscribed(clean);
  };

  return (
    <section
      id="newsletter"
      aria-labelledby="nl"
      style={{
        margin: '40px 0',
        padding: '52px 24px',
        background: '#F4F6FA',
        border: '1px solid #E5E5E5',
        borderTop: `3px solid ${ACCENT}`,
        textAlign: 'center',
      }}
    >
      <h2
        id="nl"
        style={{
          margin: 0,
          fontFamily: 'Newsreader, Georgia, serif',
          fontSize: 36,
          fontWeight: 500,
          lineHeight: 1.15,
        }}
      >
        {t.home.nlTitle}
      </h2>
      <p
        style={{
          margin: '10px auto 0',
          maxWidth: 520,
          fontSize: 16,
          lineHeight: 1.5,
          color: '#444',
        }}
      >
        {t.home.nlDesc}
      </p>
      {nlSubscribed ? (
        <div
          role="status"
          style={{
            margin: '24px auto 0',
            maxWidth: 520,
            padding: '14px 16px',
            background: '#fff',
            borderLeft: `3px solid ${ACCENT}`,
            textAlign: 'left',
            fontSize: 14,
            lineHeight: 1.5,
            color: '#1A1A1A',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span>
            {lang === 'en'
              ? `Subscribed (${nlSubscribed}).`
              : `Naka-subscribe na (${nlSubscribed}).`}
          </span>
          <button
            type="button"
            onClick={() => {
              setNlSubscribed(null);
              setNlEmail('');
            }}
            style={{
              border: 'none',
              background: 'transparent',
              color: ACCENT,
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            {lang === 'en' ? 'Change email' : 'Palitan ang email'}
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleNlSubmit}
          className="newsletter-form"
          style={{
            margin: '24px auto 0',
            maxWidth: 520,
            display: 'flex',
            flexWrap: 'nowrap',
            gap: 8,
            textAlign: 'left',
          }}
        >
          <label
            htmlFor="nl-email"
            style={{
              position: 'absolute',
              width: 1,
              height: 1,
              overflow: 'hidden',
              clip: 'rect(0 0 0 0)',
            }}
          >
            {t.home.nlEmailLabel}
          </label>
          <input
            id="nl-email"
            type="email"
            required
            value={nlEmail}
            onChange={(e) => setNlEmail(e.target.value)}
            placeholder={t.home.nlPlaceholder}
            style={{
              flex: '1 1 0',
              minWidth: 0,
              minHeight: 48,
              padding: '0 16px',
              border: '1px solid #111',
              background: '#fff',
              font: '400 16px Inter, sans-serif',
              boxSizing: 'border-box',
            }}
          />
          <button
            type="submit"
            disabled={nlSubmitting}
            className="newsletter-submit"
            style={{
              flex: 'none',
              minHeight: 48,
              padding: '0 24px',
              border: 0,
              background: ACCENT,
              color: '#fff',
              font: '600 15px Inter, sans-serif',
              whiteSpace: 'nowrap',
              cursor: nlSubmitting ? 'wait' : 'pointer',
              opacity: nlSubmitting ? 0.7 : 1,
            }}
          >
            {nlSubmitting ? (lang === 'en' ? 'Saving…' : 'Sine-save…') : t.home.nlSignUp}
          </button>
        </form>
      )}
    </section>
  );
}

function NewsletterBandWithClerk({ lang }: NewsletterBandProps) {
  const { user } = useUser();
  return <NewsletterBandInner lang={lang} firstName={user?.firstName || undefined} />;
}

export function NewsletterBand({ lang }: NewsletterBandProps) {
  if (HAS_CLERK) {
    return <NewsletterBandWithClerk lang={lang} />;
  }
  return <NewsletterBandInner lang={lang} />;
}
