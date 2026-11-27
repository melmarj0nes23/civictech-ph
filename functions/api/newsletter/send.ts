import { verifyClerkRequest } from '../../_lib/clerkAuth';

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  all<T = unknown>(): Promise<{ results: T[] }>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface Env {
  DB?: D1Database;
  CLERK_ISSUER?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
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

async function requireEditorOrAdmin(request: Request, env: Env) {
  const user = await verifyClerkRequest(request, env.CLERK_ISSUER);
  if (!user) return { error: json({ ok: false, error: 'Unauthorized.' }, 401) };
  if (user.role !== 'admin' && user.role !== 'editor') {
    return { error: json({ ok: false, error: 'Forbidden.' }, 403) };
  }
  return { user };
}

export async function onRequestGet({ request, env }: PagesContext) {
  if (!env.DB) {
    return json({ ok: false, error: 'D1 database binding (DB) is not configured.' }, 503);
  }
  const auth = await requireEditorOrAdmin(request, env);
  if (auth.error) return auth.error;

  const { results } = await env.DB.prepare(
    "SELECT email, lang, created_at FROM newsletter_subscribers WHERE status = 'active' ORDER BY created_at DESC"
  ).all<{ email: string; lang: string; created_at: string }>();

  const url = new URL(request.url);
  if (url.searchParams.get('format') === 'csv') {
    const lines = ['email,lang,created_at'];
    for (const row of results) {
      lines.push(`"${row.email.replace(/"/g, '""')}","${row.lang}","${row.created_at}"`);
    }
    return new Response(lines.join('\n'), {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="civictech-subscribers.csv"',
      },
    });
  }

  return json({
    ok: true,
    activeCount: results.length,
    configured: Boolean(env.RESEND_API_KEY),
    fromEmail: env.RESEND_FROM_EMAIL || 'Civic Tech PH <onboarding@resend.dev>',
  });
}

export async function onRequestPost({ request, env }: PagesContext) {
  if (!env.DB) {
    return json({ ok: false, error: 'D1 database binding (DB) is not configured.' }, 503);
  }
  const auth = await requireEditorOrAdmin(request, env);
  if (auth.error) return auth.error;

  if (!env.RESEND_API_KEY) {
    return json({ ok: false, error: 'RESEND_API_KEY is not configured.' }, 503);
  }

  let body: { subject?: string; html?: string; text?: string; testEmail?: string };
  try {
    body = (await request.json()) as {
      subject?: string;
      html?: string;
      text?: string;
      testEmail?: string;
    };
  } catch {
    return json({ ok: false, error: 'Invalid JSON body.' }, 400);
  }

  const subject = (body.subject || '').trim();
  const html = (body.html || '').trim();
  const text = (body.text || '').trim();
  if (!subject || (!html && !text)) {
    return json({ ok: false, error: 'Subject and message body (html or text) are required.' }, 400);
  }

  const fromEmail = env.RESEND_FROM_EMAIL || 'Civic Tech PH <onboarding@resend.dev>';
  const testEmail = (body.testEmail || '').trim().toLowerCase();

  if (testEmail) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [testEmail],
        subject: `[TEST] ${subject}`,
        ...(html ? { html } : {}),
        ...(text ? { text } : {}),
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return json({ ok: false, error: 'Resend API error.', details: data }, res.status);
    }
    return json({ ok: true, sent: 1, mode: 'test', details: data });
  }

  const { results } = await env.DB.prepare(
    "SELECT email FROM newsletter_subscribers WHERE status = 'active' ORDER BY created_at DESC"
  ).all<{ email: string }>();

  if (results.length === 0) {
    return json({ ok: true, sent: 0, mode: 'broadcast' });
  }

  let sent = 0;
  const CHUNK_SIZE = 100;
  for (let i = 0; i < results.length; i += CHUNK_SIZE) {
    const chunk = results.slice(i, i + CHUNK_SIZE);
    const payload = chunk.map((row) => ({
      from: fromEmail,
      to: [row.email],
      subject,
      ...(html ? { html } : {}),
      ...(text ? { text } : {}),
    }));

    const res = await fetch('https://api.resend.com/emails/batch', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const details = await res.json().catch(() => ({}));
      return json({ ok: false, error: 'Resend batch error.', sent, details }, res.status);
    }
    sent += chunk.length;
  }

  return json({ ok: true, sent, mode: 'broadcast' });
}
