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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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

  let body: { email?: string; lang?: string; action?: 'subscribe' | 'unsubscribe'; firstName?: string };
  try {
    body = (await request.json()) as {
      email?: string;
      lang?: string;
      action?: 'subscribe' | 'unsubscribe';
      firstName?: string;
    };
  } catch {
    return json({ ok: false, error: 'Invalid JSON body.' }, 400);
  }

  const email = (body.email || '').trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: 'Please enter a valid email address.' }, 400);
  }

  const firstName = (body.firstName || '').trim().slice(0, 60);
  const safeFirstName = firstName ? escapeHtml(firstName) : '';
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
            ? 'Kumpirmasyon ng Subscription — Civic Tech PH ng BetterGov.ph'
            : 'Subscription Confirmed — Civic Tech PH by BetterGov.ph';
        const html =
          lang === 'fil'
            ? `<div style="background:#F7F8FA;padding:32px 16px;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111111;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#FFFFFF;border:1px solid #E5E5E5;border-top:4px solid #0B3D91;">
                  <tr>
                    <td style="padding:28px 32px 20px;border-bottom:1px solid #E5E5E5;">
                      <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#0B3D91;">
                        Kumpirmasyon ng Newsletter
                      </p>
                      <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:600;line-height:1.2;color:#111111;">
                        Civic Tech <span style="font-weight:400;color:#555555;">ng BetterGov.ph</span>
                      </h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:28px 32px;font-size:15px;line-height:1.65;color:#222222;">
                      <p style="margin:0 0 16px;">${safeFirstName ? `Magandang araw, ${safeFirstName},` : 'Magandang araw,'}</p>
                      <p style="margin:0 0 16px;">
                        Nakumpirma na ang iyong subscription sa lingguhang newsletter ng <strong>Civic Tech PH</strong>—isang independiyenteng publikasyon at direktoryo ng BetterGov.ph.
                      </p>
                      <p style="margin:0 0 24px;">
                        Matatanggap mo ang aming mga bagong ulat, pagsusuri sa pambansang badyet at bukas na datos, mga gabay sa serbisyong digital, at mga tampok na proyektong civic technology sa Pilipinas.
                      </p>
                      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                        <tr>
                          <td style="background:#0B3D91;">
                            <a href="${siteUrl}" style="display:inline-block;padding:12px 22px;color:#FFFFFF;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:0.02em;">
                              Basahin ang Pinakabagong Ulat →
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin:0;font-size:13px;color:#555555;">
                        Lubos na gumagalang,<br />
                        <strong style="color:#111111;">Ang Patnugutan ng Civic Tech PH</strong>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 32px;background:#F7F8FA;border-top:1px solid #E5E5E5;font-size:12px;line-height:1.55;color:#666666;">
                      Natanggap mo ang mensaheng ito dahil nag-subscribe ka sa <a href="${siteUrl}" style="color:#0B3D91;text-decoration:underline;">civictech.ph</a>.
                      Maaari mong pamahalaan o ihinto ang iyong subscription anumang oras sa iyong <a href="${siteUrl}/profile" style="color:#0B3D91;text-decoration:underline;">Account Profile</a>.
                    </td>
                  </tr>
                </table>
              </div>`
            : `<div style="background:#F7F8FA;padding:32px 16px;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111111;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#FFFFFF;border:1px solid #E5E5E5;border-top:4px solid #0B3D91;">
                  <tr>
                    <td style="padding:28px 32px 20px;border-bottom:1px solid #E5E5E5;">
                      <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#0B3D91;">
                        Newsletter Confirmation
                      </p>
                      <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:600;line-height:1.2;color:#111111;">
                        Civic Tech <span style="font-weight:400;color:#555555;">by BetterGov.ph</span>
                      </h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:28px 32px;font-size:15px;line-height:1.65;color:#222222;">
                      <p style="margin:0 0 16px;">Dear ${safeFirstName || 'Reader'},</p>
                      <p style="margin:0 0 16px;">
                        Thank you for subscribing to the <strong>Civic Tech PH</strong> briefing, an independent newsroom and public-interest directory by BetterGov.ph.
                      </p>
                      <p style="margin:0 0 24px;">
                        Each edition brings original reporting and analysis on Philippine open data, public budgets, elections, digital government services, and civic technology initiatives across the country.
                      </p>
                      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                        <tr>
                          <td style="background:#0B3D91;">
                            <a href="${siteUrl}" style="display:inline-block;padding:12px 22px;color:#FFFFFF;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:0.02em;">
                              Visit Civic Tech PH →
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin:0;font-size:13px;color:#555555;">
                        Sincerely,<br />
                        <strong style="color:#111111;">The Civic Tech PH Editorial Team</strong>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 32px;background:#F7F8FA;border-top:1px solid #E5E5E5;font-size:12px;line-height:1.55;color:#666666;">
                      You are receiving this email because you subscribed at <a href="${siteUrl}" style="color:#0B3D91;text-decoration:underline;">civictech.ph</a>.
                      You may update or cancel your subscription at any time from your <a href="${siteUrl}/profile" style="color:#0B3D91;text-decoration:underline;">Account Profile</a>.
                    </td>
                  </tr>
                </table>
              </div>`;
        const text =
          lang === 'fil'
            ? `Nakumpirma na ang iyong subscription sa Civic Tech PH ng BetterGov.ph. Bisitahin ang ${siteUrl} para sa pinakabagong ulat.`
            : `Your subscription to Civic Tech PH by BetterGov.ph is confirmed. Visit ${siteUrl} to read our latest reporting.`;

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
