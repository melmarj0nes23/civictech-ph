import { useState, type FormEvent } from 'react';
import { Footer } from '../components/Footer';
import { SiteHeader } from '../components/SiteHeader';
import type { CategorySlug } from '../data/articles';
import type { Lang } from '../data/i18n';
import type { InfoPageSlug } from '../data/infoPages';

const ACCENT = '#0B3D91';

interface ContactPageProps {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  onBackHome: () => void;
  onOpenCivicTools: () => void;
  onOpenSubmit: (hash?: string) => void;
  onOpenCategory: (slug: CategorySlug) => void;
  onOpenInfo: (slug: InfoPageSlug) => void;
}

export function ContactPage({
  lang,
  onLangChange,
  onBackHome,
  onOpenCivicTools,
  onOpenSubmit,
  onOpenCategory,
  onOpenInfo,
}: ContactPageProps) {
  const isEn = lang === 'en';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('News Tip');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, topic, message }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || (isEn ? 'Could not send message.' : 'Hindi maipadala ang mensahe.'));
        return;
      }
      setSent(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setError(isEn ? 'Network error sending message.' : 'May error sa pagpapadala.');
    } finally {
      setSending(false);
    }
  };

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
        style={{
          width: '100%',
          maxWidth: 760,
          margin: '0 auto',
          padding: '40px 24px 72px',
          flex: '1 0 auto',
          boxSizing: 'border-box',
        }}
      >
        <div className="category-desk-band">
          <p
            style={{
              margin: '0 0 8px',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: ACCENT,
            }}
          >
            {isEn ? 'Newsroom & Tip Line' : 'Patnugutan at Tip Line'}
          </p>
          <h1
            style={{
              margin: 0,
              fontFamily: 'Newsreader, Georgia, serif',
              fontSize: 40,
              fontWeight: 600,
              lineHeight: 1.1,
            }}
          >
            {isEn ? 'Contact Civic Tech PH' : 'Makipag-ugnayan sa Civic Tech PH'}
          </h1>
          <p style={{ margin: '12px 0 0', fontSize: 16, lineHeight: 1.55, color: '#444' }}>
            {isEn
              ? 'Send a story tip, request a correction, suggest a civic tech project, or reach the BetterGov.ph editorial desk.'
              : 'Magpadala ng tip sa balita, humiling ng pagwawasto, magmungkahi ng proyektong civic tech, o makipag-ugnayan sa patnugutan.'}
          </p>
        </div>

        {sent ? (
          <div
            role="status"
            style={{
              marginTop: 28,
              padding: 24,
              background: '#F4F6FA',
              border: '1px solid #D9E2F2',
              borderLeft: `4px solid ${ACCENT}`,
            }}
          >
            <h2 style={{ margin: '0 0 8px', fontFamily: 'Newsreader, Georgia, serif', fontSize: 24 }}>
              {isEn ? 'Message received' : 'Natanggap ang mensahe'}
            </h2>
            <p style={{ margin: '0 0 16px', fontSize: 15, lineHeight: 1.55, color: '#333' }}>
              {isEn
                ? 'Thank you for reaching out. Our editorial team will review your message shortly.'
                : 'Salamat sa pakikipag-ugnayan. Susuriin ng aming patnugutan ang iyong mensahe.'}
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              style={{
                minHeight: 40,
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
              {isEn ? 'Send another message' : 'Magpadala ng isa pang mensahe'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 16 }}>
              <div>
                <label htmlFor="contact-name" style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                  {isEn ? 'Your Name *' : 'Pangalan *'}
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #D4D4D4', fontFamily: 'inherit', fontSize: 14, boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label htmlFor="contact-email" style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                  {isEn ? 'Email Address *' : 'Email Address *'}
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #D4D4D4', fontFamily: 'inherit', fontSize: 14, boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-topic" style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                {isEn ? 'Topic' : 'Paksa'}
              </label>
              <select
                id="contact-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #D4D4D4', background: '#fff', fontFamily: 'inherit', fontSize: 14, boxSizing: 'border-box' }}
              >
                <option value="News Tip">{isEn ? 'News Tip / Story Pitch' : 'Tip sa Balita'}</option>
                <option value="Directory / CSO">{isEn ? 'Directory / CSO Update' : 'Update sa Direktoryo / CSO'}</option>
                <option value="Corrections">{isEn ? 'Correction Request' : 'Hiling na Pagwawasto'}</option>
                <option value="General Inquiry">{isEn ? 'General Inquiry / Partnership' : 'Pangkalahatang Tanong'}</option>
              </select>
            </div>

            <div>
              <label htmlFor="contact-message" style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                {isEn ? 'Message *' : 'Mensahe *'}
              </label>
              <textarea
                id="contact-message"
                required
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isEn ? 'Share details, links, or questions…' : 'Ilagay ang detalye o katanungan…'}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #D4D4D4', fontFamily: 'inherit', fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            {error && (
              <p role="alert" style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#991B1B' }}>
                {error}
              </p>
            )}

            <div>
              <button
                type="submit"
                disabled={sending}
                style={{
                  minHeight: 44,
                  padding: '0 24px',
                  border: 'none',
                  background: ACCENT,
                  color: '#fff',
                  fontFamily: 'inherit',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: sending ? 'wait' : 'pointer',
                  opacity: sending ? 0.7 : 1,
                }}
              >
                {sending
                  ? isEn
                    ? 'Sending…'
                    : 'Ipinapadala…'
                  : isEn
                    ? 'Send message'
                    : 'Ipadala ang mensahe'}
              </button>
            </div>
          </form>
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
