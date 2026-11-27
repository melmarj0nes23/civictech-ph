-- Civic Tech PH (BetterGov.ph) — Cloudflare D1 Schema

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  lang TEXT NOT NULL DEFAULT 'en',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  kicker_en TEXT NOT NULL,
  kicker_fil TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL,
  title_fil TEXT NOT NULL DEFAULT '',
  deck_en TEXT NOT NULL,
  deck_fil TEXT NOT NULL DEFAULT '',
  body_en TEXT NOT NULL,
  body_fil TEXT NOT NULL DEFAULT '',
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL DEFAULT '',
  photo_url TEXT NOT NULL DEFAULT '/images/congress-session.jpg',
  status TEXT NOT NULL DEFAULT 'published',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_articles_category_status
  ON articles (category, status, created_at DESC);
