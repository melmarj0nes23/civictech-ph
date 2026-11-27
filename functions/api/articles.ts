import { verifyClerkRequest } from '../_lib/clerkAuth';

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  all<T = unknown>(): Promise<{ results: T[] }>;
  first<T = unknown>(): Promise<T | null>;
  run(): Promise<{ success: boolean }>;
}

interface SeedArticleInput {
  slug: string;
  category: string;
  kicker_en: string;
  kicker_fil: string;
  title_en: string;
  title_fil: string;
  deck_en: string;
  deck_fil: string;
  body_en: string;
  body_fil: string;
  author_name: string;
  photo_url: string;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch?(statements: D1PreparedStatement[]): Promise<unknown[]>;
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

let ensuredPlacementColumns = false;

async function ensurePlacementColumns(db: D1Database) {
  if (ensuredPlacementColumns) return;
  try {
    await db.prepare('ALTER TABLE articles ADD COLUMN is_featured INTEGER NOT NULL DEFAULT 0').run();
  } catch {
    // Column already exists
  }
  try {
    await db.prepare('ALTER TABLE articles ADD COLUMN is_long_read INTEGER NOT NULL DEFAULT 0').run();
  } catch {
    // Column already exists
  }
  try {
    await db.prepare("ALTER TABLE articles ADD COLUMN author_bio TEXT NOT NULL DEFAULT ''").run();
  } catch {
    // Column already exists
  }
  try {
    await db.prepare("ALTER TABLE articles ADD COLUMN event_date TEXT NOT NULL DEFAULT ''").run();
  } catch {
    // Column already exists
  }
  try {
    await db.prepare("ALTER TABLE articles ADD COLUMN event_location TEXT NOT NULL DEFAULT ''").run();
  } catch {
    // Column already exists
  }
  try {
    await db.prepare("ALTER TABLE articles ADD COLUMN event_url TEXT NOT NULL DEFAULT ''").run();
  } catch {
    // Column already exists
  }
  ensuredPlacementColumns = true;
}

export async function onRequestGet({ request, env }: PagesContext) {
  if (!env.DB) {
    return json({ ok: true, articles: [] });
  }
  await ensurePlacementColumns(env.DB);

  const url = new URL(request.url);
  const category = (url.searchParams.get('category') || '').trim();
  const slug = (url.searchParams.get('slug') || '').trim();
  const includeDrafts = url.searchParams.get('all') === '1';

  if (slug) {
    const row = await env.DB.prepare(
      `SELECT slug, category, kicker_en, kicker_fil, title_en, title_fil, deck_en, deck_fil,
              body_en, body_fil, author_name, author_bio, photo_url, status, is_featured, is_long_read,
              event_date, event_location, event_url, created_at, updated_at
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
              body_en, body_fil, author_name, author_bio, photo_url, status, is_featured, is_long_read,
              event_date, event_location, event_url, created_at, updated_at
       FROM articles
       ORDER BY is_featured DESC, created_at DESC
       LIMIT 100`
    ).all();
    return json({ ok: true, articles: results });
  }

  const stmt = category
    ? env.DB.prepare(
        `SELECT slug, category, kicker_en, kicker_fil, title_en, title_fil, deck_en, deck_fil,
                body_en, body_fil, author_name, author_bio, photo_url, status, is_featured, is_long_read,
                event_date, event_location, event_url, created_at
         FROM articles
         WHERE status = 'published' AND category = ?
         ORDER BY is_featured DESC, created_at DESC
         LIMIT 50`
      ).bind(category)
    : env.DB.prepare(
        `SELECT slug, category, kicker_en, kicker_fil, title_en, title_fil, deck_en, deck_fil,
                body_en, body_fil, author_name, author_bio, photo_url, status, is_featured, is_long_read,
                event_date, event_location, event_url, created_at
         FROM articles
         WHERE status = 'published'
         ORDER BY is_featured DESC, created_at DESC
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
    seedArticles?: SeedArticleInput[];
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

  if (Array.isArray(body.seedArticles)) {
    if (user.role !== 'admin') {
      return json({ ok: false, error: 'Only admin accounts can import starter articles.' }, 403);
    }
    const stmts = body.seedArticles.map((a) =>
      env.DB!.prepare(
        `INSERT OR IGNORE INTO articles (
           slug, category, kicker_en, kicker_fil, title_en, title_fil,
           deck_en, deck_fil, body_en, body_fil, author_name, author_email, photo_url, status
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published')`
      ).bind(
        a.slug,
        a.category,
        a.kicker_en,
        a.kicker_fil,
        a.title_en,
        a.title_fil,
        a.deck_en,
        a.deck_fil,
        a.body_en,
        a.body_fil,
        a.author_name,
        user.email || user.userId,
        a.photo_url
      )
    );
    if (env.DB.batch && stmts.length > 0) {
      await env.DB.batch(stmts);
    } else {
      for (const s of stmts) await s.run();
    }
    return json({ ok: true, imported: stmts.length }, 201);
  }

  const title = (body.title || '').trim();
  const deck = (body.deck || '').trim();
  const category = (body.category || 'open-data').trim();
  const content = (body.content || '').trim();
  const authorName = (body.authorName || 'Civic Tech Newsroom').trim();
  const authorBio = String((body as { authorBio?: string }).authorBio || '').trim();
  const photoUrl = (body.photoUrl || '/images/congress-session.jpg').trim();
  const status = body.status === 'draft' ? 'draft' : 'published';
  const isFeatured = Boolean((body as { isFeatured?: boolean }).isFeatured);
  const isLongRead = Boolean((body as { isLongRead?: boolean }).isLongRead);
  const eventDate = String((body as { eventDate?: string }).eventDate || '').trim();
  const eventLocation = String((body as { eventLocation?: string }).eventLocation || '').trim();
  const eventUrl = String((body as { eventUrl?: string }).eventUrl || '').trim();

  if (!title || !deck || !content) {
    return json({ ok: false, error: 'Title, deck, and article body are required.' }, 400);
  }

  await ensurePlacementColumns(env.DB);
  if (isFeatured) {
    await env.DB.prepare('UPDATE articles SET is_featured = 0 WHERE is_featured = 1').run();
  }
  if (isLongRead) {
    await env.DB.prepare('UPDATE articles SET is_long_read = 0 WHERE is_long_read = 1').run();
  }

  const baseSlug = slugify(title) || 'story';
  const slug = `${baseSlug}-${Date.now().toString(36)}`;
  const kicker = (body.kicker || category.replace(/-/g, ' ')).trim();

  await env.DB.prepare(
    `INSERT INTO articles (
       slug, category, kicker_en, kicker_fil, title_en, title_fil,
       deck_en, deck_fil, body_en, body_fil, author_name, author_email, author_bio, photo_url, status,
       is_featured, is_long_read, event_date, event_location, event_url
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
      authorBio,
      photoUrl,
      status,
      isFeatured ? 1 : 0,
      isLongRead ? 1 : 0,
      eventDate,
      eventLocation,
      eventUrl
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
    isFeatured?: boolean;
    isLongRead?: boolean;
    authorBio?: string;
    syncAuthorBio?: string;
    eventDate?: string;
    eventLocation?: string;
    eventUrl?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ ok: false, error: 'Invalid JSON body.' }, 400);
  }

  await ensurePlacementColumns(env.DB);

  if (typeof body.syncAuthorBio === 'string') {
    const authorIdentifier = user.email || user.userId;
    await env.DB.prepare('UPDATE articles SET author_bio = ? WHERE author_email = ?')
      .bind(body.syncAuthorBio.trim(), authorIdentifier)
      .run();
    return json({ ok: true, synced: true });
  }

  const slug = (body.slug || '').trim();
  const title = (body.title || '').trim();
  const deck = (body.deck || '').trim();
  const category = (body.category || 'open-data').trim();
  const content = (body.content || '').trim();
  const photoUrl = (body.photoUrl || '/images/congress-session.jpg').trim();
  const status = body.status === 'draft' ? 'draft' : 'published';
  const isFeatured = Boolean(body.isFeatured);
  const isLongRead = Boolean(body.isLongRead);
  const authorBio = typeof body.authorBio === 'string' ? body.authorBio.trim() : null;
  const eventDate = typeof body.eventDate === 'string' ? body.eventDate.trim() : '';
  const eventLocation = typeof body.eventLocation === 'string' ? body.eventLocation.trim() : '';
  const eventUrl = typeof body.eventUrl === 'string' ? body.eventUrl.trim() : '';
  const kicker = (body.kicker || category.replace(/-/g, ' ')).trim();

  if (!slug || !title || !deck || !content) {
    return json({ ok: false, error: 'Slug, title, deck, and body are required.' }, 400);
  }

  if (isFeatured) {
    await env.DB.prepare('UPDATE articles SET is_featured = 0 WHERE is_featured = 1').run();
  }
  if (isLongRead) {
    await env.DB.prepare('UPDATE articles SET is_long_read = 0 WHERE is_long_read = 1').run();
  }

  await env.DB.prepare(
    `UPDATE articles
     SET category = ?, kicker_en = ?, kicker_fil = ?, title_en = ?, title_fil = ?,
         deck_en = ?, deck_fil = ?, body_en = ?, body_fil = ?, photo_url = ?,
         status = ?, is_featured = ?, is_long_read = ?,
         event_date = ?, event_location = ?, event_url = ?,
         author_bio = COALESCE(?, author_bio), updated_at = datetime('now')
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
      isFeatured ? 1 : 0,
      isLongRead ? 1 : 0,
      eventDate,
      eventLocation,
      eventUrl,
      authorBio,
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
