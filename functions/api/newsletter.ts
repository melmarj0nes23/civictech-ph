interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  run(): Promise<{ success: boolean }>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface Env {
  DB?: D1Database;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  RESEND_AUDIENCE_ID?: string;
  SITE_URL?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

export async function onRequestGet({ request, env }: PagesContext) {
  if (!env.DB) {
    return json({ ok: false, error: 'D1 database binding (DB) is not configured.' }, 503);
  }

  const url = new URL(request.url);
  const email = (url.searchParams.get('email') || '').trim().toLowerCase();
  if (!email) {
    return json({ ok: false, error: 'Missing email parameter.' }, 400);
  }

  const row = await env.DB.prepare(
    'SELECT email, lang, status, created_at FROM newsletter_subscribers WHERE email = ?'
  )
    .bind(email)
    .first<{ email: string; lang: string; status: string; created_at: string }>();

  return json({
    ok: true,
    subscribed: Boolean(row && row.status === 'active'),
    subscriber: row ?? null,
  });
}

export async function onRequestPost({ request, env }: PagesContext) {
  if (!env.DB) {
    return json({ ok: false, error: 'D1 database binding (DB) is not configured.' }, 503);
  }

  let body: { email?: string; lang?: string; action?: 'subscribe' | 'unsubscribe' };
  try {
    body = (await request.json()) as {
      email?: string;
      lang?: string;
      action?: 'subscribe' | 'unsubscribe';
    };
  } catch {
    return json({ ok: false, error: 'Invalid JSON body.' }, 400);
  }

  const email = (body.email || '').trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: 'Please enter a valid email address.' }, 400);
  }

  const lang = body.lang === 'fil' ? 'fil' : 'en';
  const status = body.action === 'unsubscribe' ? 'unsubscribed' : 'active';

  await env.DB.prepare(
    `INSERT INTO newsletter_subscribers (email, lang, status)
     VALUES (?, ?, ?)
     ON CONFLICT(email) DO UPDATE SET
       lang = excluded.lang,
       status = excluded.status,
       updated_at = datetime('now')`
  )
    .bind(email, lang, status)
    .run();

  let emailSent = false;
  if (env.RESEND_API_KEY) {
    const fromEmail = env.RESEND_FROM_EMAIL || 'Civic Tech PH <onboarding@resend.dev>';
    const siteUrl = (env.SITE_URL || new URL(request.url).origin).replace(/\/+$/, '');

    if (status === 'active') {
      try {
        const subject =
          lang === 'fil'
            ? 'Salamat sa pag-subscribe sa Civic Tech PH'
            : 'Welcome to Civic Tech PH by BetterGov.ph';
        const html =
          lang === 'fil'
            ? `<div style="font-family:Inter,system-ui,sans-serif;max-width:560px;margin:0 auto;color:#111;line-height:1.6;">
                <h2 style="font-family:Georgia,serif;color:#0B3D91;margin-bottom:12px;">Civic Tech by BetterGov.ph</h2>
                <p>Salamat sa pag-subscribe sa aming lingguhang buod ng civic technology, bukas na datos, at digital na pamamahala sa Pilipinas.</p>
                <p><a href="${siteUrl}" style="color:#0B3D91;font-weight:600;">Bisitahin ang civictech.ph →</a></p>
                <hr style="border:none;border-top:1px solid #E5E5E5;margin:24px 0;" />
                <p style="font-size:12px;color:#666;">Maaari kang mag-unsubscribe anumang oras sa iyong <a href="${siteUrl}/profile" style="color:#0B3D91;">profile</a>.</p>
              </div>`
            : `<div style="font-family:Inter,system-ui,sans-serif;max-width:560px;margin:0 auto;color:#111;line-height:1.6;">
                <h2 style="font-family:Georgia,serif;color:#0B3D91;margin-bottom:12px;">Civic Tech by BetterGov.ph</h2>
                <p>Thanks for subscribing to our weekly digest on Philippine civic technology, open data, public budgets, and digital government.</p>
                <p><a href="${siteUrl}" style="color:#0B3D91;font-weight:600;">Read the latest at civictech.ph →</a></p>
                <hr style="border:none;border-top:1px solid #E5E5E5;margin:24px 0;" />
                <p style="font-size:12px;color:#666;">You can update your subscription anytime in your <a href="${siteUrl}/profile" style="color:#0B3D91;">profile</a>.</p>
              </div>`;
        const text =
          lang === 'fil'
            ? `Salamat sa pag-subscribe sa Civic Tech by BetterGov.ph (${siteUrl}).`
            : `Thanks for subscribing to Civic Tech by BetterGov.ph (${siteUrl}).`;

        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [email],
            subject,
            html,
            text,
          }),
        });
        emailSent = res.ok;
      } catch {
        // Best-effort: D1 subscription still succeeded
      }
    }

    if (env.RESEND_AUDIENCE_ID) {
      try {
        await fetch(`https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            unsubscribed: status !== 'active',
          }),
        });
      } catch {
        // Best-effort audience sync
      }
    }
  }

  return json({ ok: true, email, lang, subscribed: status === 'active', emailSent }, 201);
}
