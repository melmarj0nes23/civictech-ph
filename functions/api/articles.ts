import { verifyClerkRequest } from '../_lib/clerkAuth';

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  all<T = unknown>(): Promise<{ results: T[] }>;
  first<T = unknown>(): Promise<T | null>;
  run(): Promise<{ success: boolean }>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface Env {
  DB?: D1Database;
  CLERK_ISSUER?: string;
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

function canEdit(role: string): boolean {
  return role === 'admin' || role === 'editor';
}

export async function onRequestGet({ request, env }: PagesContext) {
  if (!env.DB) {
    return json({ ok: true, articles: [] });
  }

  const url = new URL(request.url);
  const category = (url.searchParams.get('category') || '').trim();
  const slug = (url.searchParams.get('slug') || '').trim();
  const includeDrafts = url.searchParams.get('all') === '1';

  if (slug) {
    const row = await env.DB.prepare(
      `SELECT slug, category, kicker_en, kicker_fil, title_en, title_fil, deck_en, deck_fil,
              body_en, body_fil, author_name, photo_url, status, created_at, updated_at
       FROM articles
       WHERE slug = ?`
    )
      .bind(slug)
      .first();
    return json({ ok: true, article: row ?? null });
  }

  if (includeDrafts) {
    const user = await verifyClerkRequest(request, env.CLERK_ISSUER);
    if (!user || !canEdit(user.role)) {
      return json({ ok: false, error: 'Editor or admin role required.' }, 403);
    }
    const { results } = await env.DB.prepare(
      `SELECT slug, category, kicker_en, kicker_fil, title_en, title_fil, deck_en, deck_fil,
              body_en, body_fil, author_name, photo_url, status, created_at, updated_at
       FROM articles
       ORDER BY created_at DESC
       LIMIT 100`
    ).all();
    return json({ ok: true, articles: results });
  }

  const stmt = category
    ? env.DB.prepare(
        `SELECT slug, category, kicker_en, kicker_fil, title_en, title_fil, deck_en, deck_fil,
                body_en, body_fil, author_name, photo_url, status, created_at
         FROM articles
         WHERE status = 'published' AND category = ?
         ORDER BY created_at DESC
         LIMIT 50`
      ).bind(category)
    : env.DB.prepare(
        `SELECT slug, category, kicker_en, kicker_fil, title_en, title_fil, deck_en, deck_fil,
                body_en, body_fil, author_name, photo_url, status, created_at
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

  const user = await verifyClerkRequest(request, env.CLERK_ISSUER);
  if (!user) {
    return json({ ok: false, error: 'Authentication required.' }, 401);
  }
  if (!canEdit(user.role)) {
    return json(
      { ok: false, error: 'Only admin or editor accounts can publish articles.' },
      403
    );
  }

  let body: {
    title?: string;
    deck?: string;
    category?: string;
    kicker?: string;
    content?: string;
    authorName?: string;
    photoUrl?: string;
    status?: 'published' | 'draft';
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
  const authorName = (body.authorName || 'Civic Tech Newsroom').trim();
  const photoUrl = (body.photoUrl || '/images/congress-session.jpg').trim();
  const status = body.status === 'draft' ? 'draft' : 'published';

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
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
      user.email || user.userId,
      photoUrl,
      status
    )
    .run();

  return json({ ok: true, slug, status }, 201);
}

export async function onRequestPatch({ request, env }: PagesContext) {
  if (!env.DB) {
    return json({ ok: false, error: 'D1 database binding (DB) is not configured.' }, 503);
  }

  const user = await verifyClerkRequest(request, env.CLERK_ISSUER);
  if (!user) {
    return json({ ok: false, error: 'Authentication required.' }, 401);
  }
  if (!canEdit(user.role)) {
    return json({ ok: false, error: 'Only admin or editor accounts can edit articles.' }, 403);
  }

  let body: {
    slug?: string;
    title?: string;
    deck?: string;
    category?: string;
    kicker?: string;
    content?: string;
    photoUrl?: string;
    status?: 'published' | 'draft';
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ ok: false, error: 'Invalid JSON body.' }, 400);
  }

  const slug = (body.slug || '').trim();
  const title = (body.title || '').trim();
  const deck = (body.deck || '').trim();
  const category = (body.category || 'open-data').trim();
  const content = (body.content || '').trim();
  const photoUrl = (body.photoUrl || '/images/congress-session.jpg').trim();
  const status = body.status === 'draft' ? 'draft' : 'published';
  const kicker = (body.kicker || category.replace(/-/g, ' ')).trim();

  if (!slug || !title || !deck || !content) {
    return json({ ok: false, error: 'Slug, title, deck, and body are required.' }, 400);
  }

  await env.DB.prepare(
    `UPDATE articles
     SET category = ?, kicker_en = ?, kicker_fil = ?, title_en = ?, title_fil = ?,
         deck_en = ?, deck_fil = ?, body_en = ?, body_fil = ?, photo_url = ?,
         status = ?, updated_at = datetime('now')
     WHERE slug = ?`
  )
    .bind(
      category,
      kicker,
      kicker,
      title,
      title,
      deck,
      deck,
      content,
      content,
      photoUrl,
      status,
      slug
    )
    .run();

  return json({ ok: true, slug, status });
}

export async function onRequestDelete({ request, env }: PagesContext) {
  if (!env.DB) {
    return json({ ok: false, error: 'D1 database binding (DB) is not configured.' }, 503);
  }

  const user = await verifyClerkRequest(request, env.CLERK_ISSUER);
  if (!user) {
    return json({ ok: false, error: 'Authentication required.' }, 401);
  }
  if (user.role !== 'admin') {
    return json({ ok: false, error: 'Only admin accounts can delete articles.' }, 403);
  }

  const url = new URL(request.url);
  const slug = (url.searchParams.get('slug') || '').trim();
  if (!slug) {
    return json({ ok: false, error: 'Missing slug parameter.' }, 400);
  }

  await env.DB.prepare('DELETE FROM articles WHERE slug = ?').bind(slug).run();
  return json({ ok: true, deleted: slug });
}
