import { verifyClerkRequest } from '../_lib/clerkAuth';

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
  CLERK_ISSUER?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

export interface BannerSlide {
  imageUrl: string;
  linkUrl?: string;
  alt?: string;
}

const BANNER_KEY = 'homepage_banners';

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

async function ensureSettingsTable(db: D1Database) {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS site_settings (
         key TEXT PRIMARY KEY,
         value TEXT NOT NULL,
         updated_at TEXT NOT NULL DEFAULT (datetime('now'))
       )`
    )
    .run();
}

export async function onRequestGet({ env }: PagesContext) {
  if (!env.DB) {
    return json({ ok: true, banners: [] });
  }
  await ensureSettingsTable(env.DB);
  const row = await env.DB.prepare('SELECT value FROM site_settings WHERE key = ?')
    .bind(BANNER_KEY)
    .first<{ value: string }>();

  let banners: BannerSlide[] = [];
  if (row?.value) {
    try {
      const parsed = JSON.parse(row.value) as unknown;
      if (Array.isArray(parsed)) {
        banners = parsed.filter(
          (item): item is BannerSlide =>
            Boolean(item && typeof item === 'object' && typeof (item as BannerSlide).imageUrl === 'string')
        );
      }
    } catch {
      banners = [];
    }
  }
  return json({ ok: true, banners });
}

export async function onRequestPut({ request, env }: PagesContext) {
  if (!env.DB) {
    return json({ ok: false, error: 'D1 database binding (DB) is not configured.' }, 503);
  }

  const caller = await verifyClerkRequest(request, env.CLERK_ISSUER);
  if (!caller) {
    return json({ ok: false, error: 'Authentication required.' }, 401);
  }
  if (caller.role !== 'admin') {
    return json({ ok: false, error: 'Admin role required.' }, 403);
  }

  let body: { banners?: BannerSlide[] };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ ok: false, error: 'Invalid JSON body.' }, 400);
  }

  const cleaned: BannerSlide[] = Array.isArray(body.banners)
    ? body.banners
        .map((b) => ({
          imageUrl: String(b?.imageUrl || '').trim(),
          linkUrl: String(b?.linkUrl || '').trim(),
          alt: String(b?.alt || '').trim(),
        }))
        .filter((b) => Boolean(b.imageUrl))
        .slice(0, 10)
    : [];

  await ensureSettingsTable(env.DB);
  await env.DB.prepare(
    `INSERT INTO site_settings (key, value)
     VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET
       value = excluded.value,
       updated_at = datetime('now')`
  )
    .bind(BANNER_KEY, JSON.stringify(cleaned))
    .run();

  return json({ ok: true, banners: cleaned });
}
