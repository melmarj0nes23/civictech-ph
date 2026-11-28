interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface Env {
  DB?: D1Database;
  ASSETS: { fetch: (req: Request) => Promise<Response> };
}

interface PagesContext {
  request: Request;
  env: Env;
  params: { slug?: string | string[] };
  next: () => Promise<Response>;
}

interface HtmlElement {
  setAttribute(name: string, value: string): void;
  setInnerContent(content: string): void;
}

declare class HTMLRewriter {
  on(selector: string, handler: { element(el: HtmlElement): void }): HTMLRewriter;
  transform(response: Response): Response;
}

const DIRECT_VIDEO_RE = /\.(mp4|webm|ogg|mov)(\?.*)?$/i;

function resolveOgImage(rawPhoto: string, origin: string): string {
  const trimmed = (rawPhoto || '/images/congress-session.jpg').trim();
  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./i, '').toLowerCase();

    if (host === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0];
      if (id && /^[a-zA-Z0-9_-]{6,20}$/.test(id)) {
        return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
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
        return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
      }
    }

    if (host === 'vimeo.com' || host === 'player.vimeo.com' || DIRECT_VIDEO_RE.test(parsed.pathname)) {
      return `${origin}/images/congress-session.jpg`;
    }

    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return trimmed;
    }
  } catch {
    // Relative path
  }

  return `${origin}${trimmed.startsWith('/') ? trimmed : `/${trimmed}`}`;
}

export async function onRequestGet(context: PagesContext) {
  const { request, env, params, next } = context;
  const rawSlug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const slug = (rawSlug || '').trim();

  if (!slug || !env.DB) {
    return next();
  }

  let article: {
    title_en: string;
    deck_en: string;
    photo_url: string;
  } | null = null;

  try {
    article = await env.DB.prepare(
      `SELECT title_en, deck_en, photo_url
       FROM articles
       WHERE slug = ? AND status = 'published'`
    )
      .bind(slug)
      .first();
  } catch {
    return next();
  }

  if (!article) {
    return next();
  }

  const reqUrl = new URL(request.url);
  const absoluteImage = resolveOgImage(article.photo_url, reqUrl.origin);
  const pageTitle = `${article.title_en} — Civic Tech`;
  const canonicalUrl = `${reqUrl.origin}/article/${slug}`;

  const assetRes = await env.ASSETS.fetch(new Request(new URL('/index.html', reqUrl.origin)));

  return new HTMLRewriter()
    .on('title', {
      element(el) {
        el.setInnerContent(pageTitle);
      },
    })
    .on('link[rel="canonical"]', {
      element(el) {
        el.setAttribute('href', canonicalUrl);
      },
    })
    .on('meta[name="description"]', {
      element(el) {
        el.setAttribute('content', article!.deck_en);
      },
    })
    .on('meta[property="og:type"]', {
      element(el) {
        el.setAttribute('content', 'article');
      },
    })
    .on('meta[property="og:url"]', {
      element(el) {
        el.setAttribute('content', canonicalUrl);
      },
    })
    .on('meta[property="og:title"]', {
      element(el) {
        el.setAttribute('content', article!.title_en);
      },
    })
    .on('meta[property="og:description"]', {
      element(el) {
        el.setAttribute('content', article!.deck_en);
      },
    })
    .on('meta[property="og:image"]', {
      element(el) {
        el.setAttribute('content', absoluteImage);
      },
    })
    .on('meta[property="og:image:alt"]', {
      element(el) {
        el.setAttribute('content', article!.title_en);
      },
    })
    .on('meta[name="twitter:card"]', {
      element(el) {
        el.setAttribute('content', 'summary_large_image');
      },
    })
    .on('meta[name="twitter:title"]', {
      element(el) {
        el.setAttribute('content', article!.title_en);
      },
    })
    .on('meta[name="twitter:description"]', {
      element(el) {
        el.setAttribute('content', article!.deck_en);
      },
    })
    .on('meta[name="twitter:image"]', {
      element(el) {
        el.setAttribute('content', absoluteImage);
      },
    })
    .transform(assetRes);
}
