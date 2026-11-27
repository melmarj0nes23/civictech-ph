import { getArticlePhoto } from './articles';

export interface VideoEmbedInfo {
  provider: 'youtube' | 'vimeo' | 'direct';
  embedUrl: string;
  thumbnailUrl?: string;
}

const DIRECT_VIDEO_RE = /\.(mp4|webm|ogg|mov)(\?.*)?$/i;

/**
 * Parse a YouTube, Vimeo, or direct video file URL into an embeddable player descriptor.
 * Returns null for regular image URLs or unrecognized strings.
 */
export function parseVideoEmbed(rawUrl?: string): VideoEmbedInfo | null {
  const trimmed = rawUrl?.trim();
  if (!trimmed) return null;

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return null;
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./i, '').toLowerCase();

  // YouTube (watch, youtu.be, shorts, embed, live)
  if (host === 'youtu.be') {
    const id = parsed.pathname.split('/').filter(Boolean)[0];
    if (id && /^[a-zA-Z0-9_-]{6,20}$/.test(id)) {
      return {
        provider: 'youtube',
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
        thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      };
    }
  }

  if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
    const vParam = parsed.searchParams.get('v');
    const parts = parsed.pathname.split('/').filter(Boolean);
    const pathId =
      parts[0] === 'embed' || parts[0] === 'shorts' || parts[0] === 'live'
        ? parts[1]
        : undefined;
    const id = vParam || pathId;
    if (id && /^[a-zA-Z0-9_-]{6,20}$/.test(id)) {
      return {
        provider: 'youtube',
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
        thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      };
    }
  }

  // Vimeo
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const parts = parsed.pathname.split('/').filter(Boolean);
    const id = parts[0] === 'video' ? parts[1] : parts[0];
    if (id && /^\d+$/.test(id)) {
      return {
        provider: 'vimeo',
        embedUrl: `https://player.vimeo.com/video/${id}`,
      };
    }
  }

  // Direct video file (.mp4, .webm, .ogg, .mov)
  if (DIRECT_VIDEO_RE.test(parsed.pathname)) {
    return {
      provider: 'direct',
      embedUrl: trimmed,
    };
  }

  return null;
}

/**
 * Resolve a safe <img> src for article cards: uses YouTube thumbnail for video URLs
 * when available, falls back to the default placeholder for non-image video URLs,
 * or returns the image URL directly.
 */
export function resolveArticleImage(photoUrl: string | undefined, slug: string): string {
  const video = parseVideoEmbed(photoUrl);
  if (video) {
    return video.thumbnailUrl || getArticlePhoto(slug);
  }
  return photoUrl || getArticlePhoto(slug);
}
