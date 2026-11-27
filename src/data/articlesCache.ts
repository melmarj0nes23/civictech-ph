import type { ArticleItem, CategorySlug } from './articles';

export interface D1ApiArticle {
  slug: string;
  category: CategorySlug;
  kicker_en: string;
  kicker_fil?: string;
  title_en: string;
  title_fil?: string;
  deck_en: string;
  deck_fil?: string;
  body_en: string;
  body_fil?: string;
  author_name: string;
  author_bio?: string;
  photo_url: string;
  is_featured?: number;
  is_long_read?: number;
  event_date?: string;
  event_location?: string;
  event_url?: string;
  created_at: string;
}

export interface CachedArticleItem extends ArticleItem {
  photoUrl?: string;
  isLongRead?: boolean;
  authorBio?: string;
  eventDate?: string;
  eventLocation?: string;
  eventUrl?: string;
}

const CACHE_KEY = 'civictech_d1_articles_v1';

export function mapD1RowToArticle(a: D1ApiArticle): CachedArticleItem {
  return {
    slug: a.slug,
    category: a.category,
    kicker: { en: a.kicker_en, fil: a.kicker_fil || a.kicker_en },
    title: { en: a.title_en, fil: a.title_fil || a.title_en },
    deck: { en: a.deck_en, fil: a.deck_fil || a.deck_en },
    author: { en: a.author_name, fil: a.author_name },
    date: { en: a.created_at.slice(0, 10), fil: a.created_at.slice(0, 10) },
    readTime: { en: '4 min read', fil: '4 minutong pagbabasa' },
    photoLabel: { en: a.title_en, fil: a.title_fil || a.title_en },
    body: {
      en: a.body_en.split(/\n\n+/),
      fil: (a.body_fil || a.body_en).split(/\n\n+/),
    },
    photoUrl: a.photo_url,
    isLongRead: Boolean(a.is_long_read),
    authorBio: a.author_bio || '',
    eventDate: a.event_date || '',
    eventLocation: a.event_location || '',
    eventUrl: a.event_url || '',
  };
}

export function readCachedD1Articles(): CachedArticleItem[] | null {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as CachedArticleItem[]) : null;
  } catch {
    return null;
  }
}

export function writeCachedD1Articles(items: CachedArticleItem[]): void {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(items));
  } catch {
    // ignore storage quota errors
  }
}

export function clearCachedD1Articles(): void {
  try {
    window.localStorage.removeItem(CACHE_KEY);
  } catch {
    // ignore
  }
}
