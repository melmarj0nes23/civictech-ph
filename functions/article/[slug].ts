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
  const rawPhoto = (article.photo_url || '/images/congress-session.jpg').trim();
  const absoluteImage = /^https?:\/\//i.test(rawPhoto)
    ? rawPhoto
    : `${reqUrl.origin}${rawPhoto.startsWith('/') ? rawPhoto : `/${rawPhoto}`}`;
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
