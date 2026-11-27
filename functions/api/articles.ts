interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  all<T = unknown>(): Promise<{ results: T[] }>;
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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

export async function onRequestGet({ request, env }: PagesContext) {
  if (!env.DB) {
    return json({ ok: true, articles: [] });
  }

  const url = new URL(request.url);
  const category = (url.searchParams.get('category') || '').trim();

  const stmt = category
    ? env.DB.prepare(
        `SELECT slug, category, kicker_en, kicker_fil, title_en, title_fil, deck_en, deck_fil,
                body_en, body_fil, author_name, photo_url, created_at
         FROM articles
         WHERE status = 'published' AND category = ?
         ORDER BY created_at DESC
         LIMIT 50`
      ).bind(category)
    : env.DB.prepare(
        `SELECT slug, category, kicker_en, kicker_fil, title_en, title_fil, deck_en, deck_fil,
                body_en, body_fil, author_name, photo_url, created_at
         FROM articles
         WHERE status = 'published'
         ORDER BY created_at DESC
         LIMIT 50`
      );

  const { results } = await stmt.all();
  return json({ ok: true, articles: results });
}

export async function onRequestPost({ request, env }: PagesContext) {
  if (!env.DB) {
    return json({ ok: false, error: 'D1 database binding (DB) is not configured.' }, 503);
  }

  const authHeader = request.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ') || authHeader.length < 20) {
    return json({ ok: false, error: 'Authentication required to publish.' }, 401);
  }

  let body: {
    title?: string;
    deck?: string;
    category?: string;
    kicker?: string;
    content?: string;
    authorName?: string;
    authorEmail?: string;
    photoUrl?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ ok: false, error: 'Invalid JSON body.' }, 400);
  }

  const title = (body.title || '').trim();
  const deck = (body.deck || '').trim();
  const category = (body.category || 'open-data').trim();
  const content = (body.content || '').trim();
  const authorName = (body.authorName || 'Civic Tech Contributor').trim();
  const authorEmail = (body.authorEmail || '').trim();
  const photoUrl = (body.photoUrl || '/images/congress-session.jpg').trim();

  if (!title || !deck || !content) {
    return json({ ok: false, error: 'Title, deck, and article body are required.' }, 400);
  }

  const baseSlug = slugify(title) || 'story';
  const slug = `${baseSlug}-${Date.now().toString(36)}`;
  const kicker = (body.kicker || category.replace(/-/g, ' ')).trim();

  await env.DB.prepare(
    `INSERT INTO articles (
       slug, category, kicker_en, kicker_fil, title_en, title_fil,
       deck_en, deck_fil, body_en, body_fil, author_name, author_email, photo_url, status
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published')`
  )
    .bind(
      slug,
      category,
      kicker,
      kicker,
      title,
      title,
      deck,
      deck,
      content,
      content,
      authorName,
      authorEmail,
      photoUrl
    )
    .run();

  return json({ ok: true, slug }, 201);
}
