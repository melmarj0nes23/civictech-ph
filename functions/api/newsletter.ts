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

  return json({ ok: true, email, lang, subscribed: status === 'active' }, 201);
}
