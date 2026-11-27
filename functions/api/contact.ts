interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<{ success: boolean }>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface Env {
  DB?: D1Database;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  CONTACT_TO_EMAIL?: string;
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

let ensuredContactTable = false;

async function ensureContactTable(db: D1Database) {
  if (ensuredContactTable) return;
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        topic TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`
    )
    .run();
  ensuredContactTable = true;
}

export async function onRequestPost({ request, env }: PagesContext) {
  if (!env.DB) {
    return json({ ok: false, error: 'D1 database binding (DB) is not configured.' }, 503);
  }

  let body: { name?: string; email?: string; topic?: string; message?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ ok: false, error: 'Invalid JSON body.' }, 400);
  }

  const name = (body.name || '').trim().slice(0, 120);
  const email = (body.email || '').trim().toLowerCase().slice(0, 160);
  const topic = (body.topic || 'General Inquiry').trim().slice(0, 80);
  const message = (body.message || '').trim().slice(0, 4000);

  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message) {
    return json({ ok: false, error: 'Name, valid email, and message are required.' }, 400);
  }

  await ensureContactTable(env.DB);
  await env.DB.prepare(
    'INSERT INTO contact_messages (name, email, topic, message) VALUES (?, ?, ?, ?)'
  )
    .bind(name, email, topic, message)
    .run();

  if (env.RESEND_API_KEY && env.CONTACT_TO_EMAIL) {
    const fromEmail = env.RESEND_FROM_EMAIL || 'Civic Tech PH <onboarding@resend.dev>';
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [env.CONTACT_TO_EMAIL],
          reply_to: email,
          subject: `[Civic Tech PH · ${topic}] Message from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`,
        }),
      });
    } catch {
      // Best-effort email notification; D1 record is saved
    }
  }

  return json({ ok: true }, 201);
}
