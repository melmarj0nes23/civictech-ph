# civictech.ph — Session Handoff

**Last updated:** 2026-11-28
**Repository:** `https://github.com/melmarj0nes23/civictech-ph` (branch `main`, latest pushed commit `9675e34`)
**Staging URL:** `https://civictech-ph.pages.dev/`
**Local project path:** `/Users/brucedlc/.gemini/antigravity/scratch/civictech-ph`

> **Unpushed local changes (verified with `npm run build`, ready to push when requested):**
> - Markdown rich-text rendering + `/write` formatting toolbar & live preview (`src/components/RichBody.tsx`, `src/pages/ArticlePage.tsx`, `src/pages/WritePage.tsx`, `src/index.css`).
> - Clerk avatar dropdown shortcuts for `Newsroom`, `Team Roles`, and `Manage Banner` (`src/components/SiteHeader.tsx`, `src/pages/ProfilePage.tsx`).

---

## 1. Tech Stack & Architecture
- **Frontend:** Vite + React 19 + TypeScript (`npm run build` runs `sync:directory` → `tsc -b && vite build` → `scripts/prerender-seo.mjs` for 31 SEO routes + `sitemap.xml`).
- **Styling & Typography:** `src/index.css` + inline styles; **Newsreader** (serif headings/body) + **Inter** (UI); `#0B3D91` BetterGov.ph primary accent; sharp `0px` corners; `1380px` desktop container width; `text-wrap: balance` on headlines; bilingual **English | Filipino** (`en` | `fil`).
  - *Constraint:* Keep desktop layout untouched unless asked; no global `box-sizing: border-box` in `src/index.css`; mobile rules live under `@media (max-width: 768px)` (using `overflow-x: clip` on `html, body` so sticky header works).
- **Hosting:** Cloudflare Pages Free Tier (`dist/` build output, `functions/` automatically compiled as Pages Functions).
- **Auth:** **Clerk** (`@clerk/react` v6.19.7 + `@clerk/react/legacy` custom flow hooks).
- **Database:** **Cloudflare D1** (`civictech-db`), bound to Pages as `DB` via the Cloudflare Dashboard (do **not** commit a `wrangler.toml` with placeholder D1 IDs or it overrides Dashboard bindings).
  - *Free Tier Quotas (reset 00:00 UTC):* 5,000,000 rows read/day, 100,000 rows written/day, 500 MB max per DB (5 GB account total).

---

## 2. What Is Built & Live
### Frontend & Pages (`src/pages/`, `src/components/`)
- **Persistent Sticky Header (`src/components/SiteHeader.tsx`) & Mobile Menu (`src/components/MobileMenu.tsx`):**
  - Sticky `top: 0` across desktop and mobile (solid `#fff` background—avoid `backdrop-filter` on `<header>` so fixed children aren't clipped).
  - Desktop: `32px` wordmark + `30px` logo, 8 categories (`15px`) with bottom-border hover/active states, Search modal trigger, `EN / FIL` toggle, `Login / Sign up` or `<AdminUserButton />` (`<UserButton>` with role-gated `<UserButton.MenuItems>`: `Newsroom` → `/write`, `Team Roles` → `/profile?panel=team`, `Manage Banner` → `/profile?panel=banners`).
  - Mobile (`<= 768px`): `24px` wordmark + `26px` logo, hamburger drawer rendered via `createPortal(..., document.body)` + `<AdminUserButton />`. Drawer top layout: centered `SEARCH` button → `Language: English/Filipino` dropdown → `Subscribe` CTA → `Categories` (`13px` `#0B3D91` header) → `Directory` (`Civic Tech Tools` `/civictools?kind=project`, `CSO Listing` `/civictools?kind=cso`, `Submit Project` `/civictools/submit`).
- **Homepage (`src/pages/HomePage.tsx`):**
  - **Edition Utility Strip:** `#F7F8FA` top bar above `<main>` with `formatTodayDate(lang)` and edition subtitle.
  - **Banner Carousel:** Admin-managed scrolling banner (`1332×260` on desktop, pill indicators below, 5.5s auto-advance, no left/right arrow buttons). Hidden if no banners are saved.
  - **Live D1 Feed (`src/data/articlesCache.ts`):** Caches `/api/articles` in `localStorage` (`civictech_d1_articles_v1`) with a first-load `#F4F6FA` skeleton.
  - **Slots:** **Headlines** + **Top Stories** (shared `2px solid #0B3D91` headers, `1px` desktop vertical divider, `112×76` landscape rail thumbnails, photo caption below Lead), **Latest** (4 items + **View all** → `/category`), **Long Read** (dark navy gradient `#0D1B2A → #13294B` feature band), **Opinion** (`#FAF9F6` warm paper cards, 1 per row on mobile), **Civic Tools** (aligned `2px solid #111` header + `#F4F6FA` tool list panel, 2 on desktop, 4 on mobile), and **`NewsletterBand`** (`borderTop: 3px solid #0B3D91`).
- **Category, Directory & Info Pages (`CategoryPage.tsx`, `DirectoryPage.tsx`, `SubmitPage.tsx`, `InfoPage.tsx`):**
  - Unified `.category-desk-band` (`#F7F8FA` + `3px solid #0B3D91` top border) across Category, Directory, Submit, and Info pages.
  - `DirectoryPage.tsx` reads `?kind=project` / `?kind=cso` from URL query params and syncs on `popstate`.
  - `CategoryPage.tsx` right rail uses `96×64` landscape thumbnails with `date · readTime`.
- **Article Reader (`src/pages/ArticlePage.tsx`, `src/components/RichBody.tsx`) & Edge OG Tags (`functions/article/[slug].ts`):**
  - `1020px` centered header, `1px` bordered byline/date/read-time/share strip, hero photo caption, `RichBody` Markdown renderer (`##`/`###`, `**bold**`, `*italic*`, `` `code` ``, safe `[links](url)`, `> blockquotes`, `-`/`1.` lists, `---`, opening plain-paragraph drop cap), `3px solid #0B3D91` directory callout, Author box, 3-card Related grid, and `NewsletterBand`.
  - Rewrites `<title>`, `og:*`, and `twitter:*` meta tags at the edge via `HTMLRewriter` for D1 articles.
- **Auth, Profile & Team/Banner Management (`/profile`, `src/pages/ProfilePage.tsx`):**
  - Compact single-screen layout with sticky footer, Newsroom Studio link, D1 newsletter subscribe/unsubscribe toggle, inline **Edit profile**, **Team roles** (`admin`-only, auto-opens on `?panel=team`), and **Homepage banners** (`admin`-only, auto-opens on `?panel=banners`).
- **Newsroom Studio (`/write`, `src/pages/WritePage.tsx`):**
  - Role-protected CMS (`admin`/`editor`) with desktop-matched height scrollable D1 sidebar, mobile **Add | Edit** tabs, Markdown formatting toolbar (`H2`, `H3`, `B`, `I`, `Link`, `Quote`, `• List`, `1. List`) + **Write | Preview** toggle using `<RichBody />`, **Direct Cover Photo URL** input, **Pin as Lead story** & **Pin as Long Read** checkboxes, **Cancel** button, and auto-clearing of `civictech_d1_articles_v1` cache.
- **Footer (`src/components/Footer.tsx`):** `2px solid #111` top rule, `Facebook Group` + `Discord` links wired.

### Backend (`functions/`, `db/schema.sql`)
- **`db/schema.sql`:** `newsletter_subscribers`, `articles` (`is_featured`, `is_long_read`, `author_bio`), and `site_settings` (self-migrated automatically in Functions if missing).
- **`functions/api/articles.ts`:** `GET` (`is_featured DESC, created_at DESC`), `POST`, `PATCH` (`syncAuthorBio`, `isFeatured`, `isLongRead`), `DELETE` (`admin` only).
- **`functions/api/users.ts`:** `GET /api/users` & `PATCH /api/users` (admin-only, uses `CLERK_SECRET_KEY`).
- **`functions/api/banners.ts`:** `GET /api/banners` & `PUT /api/banners` (admin-only, stores `homepage_banners` in D1 `site_settings`).
- **`functions/api/newsletter.ts`:** `GET /api/newsletter?email=...` and `POST /api/newsletter`.
- **`functions/article/[slug].ts`:** Edge `HTMLRewriter` for dynamic D1 article Open Graph / Twitter cards.

---

## 3. Environment & Dashboard Config
- **Local `.env.local`** (gitignored): `VITE_CLERK_PUBLISHABLE_KEY=pk_test_bGFzdGluZy1kb3ZlLTkzMTYuY2xlcmsuYWNjb3VudHMuZGV2JA`
- **Cloudflare Pages → `civictech-ph` → Settings:**
  - **Variables and secrets (Production):** `VITE_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` set.
  - **Bindings:** D1 database `DB` → `civictech-db` set.
- **Clerk Dashboard:**
  - User `publicMetadata`: `{ "role": "admin" }` for admin/editor accounts.
  - **Sessions → Customize session token:** `{ "role": "{{user.public_metadata.role}}" }` saved.

---

## 4. Pending / Next Steps
1. **Push current local changes** when user requests (`RichBody` Markdown + `/write` preview + Clerk avatar admin shortcuts).
2. **Production Clerk & Custom Domain (`civictech.ph`):**
   - Point `civictech.ph` in Cloudflare Pages and update `SITE_URL` (`index.html`, `public/robots.txt`, `src/data/seo.ts`, `scripts/prerender-seo.mjs`) from `civictech-ph.pages.dev` to `https://civictech.ph`.
   - Swap Clerk `pk_test_` / `sk_test_` for `pk_live_` / `sk_live_` (and update `DEFAULT_CLERK_ISSUER` / `CLERK_ISSUER` in `functions/_lib/clerkAuth.ts`).
3. **Content & Editorial Growth:**
   - Optional new categories (`events`, `videos` using external video URLs—not raw video files in D1).
   - Real photography, varied author bylines, and optional `/author/:name` pages.
4. **Remaining footer link:** Wire `Contact` in `Footer.tsx` once BetterGov.ph provides a final email/endpoint.
5. **Newsletter sending (when ready):** Connect an email provider (e.g., Resend free tier) or add an admin subscriber CSV export—currently `newsletter_subscribers` only stores active emails in D1.

---

## 5. Working Rules Remembered from User
- **Never run `git push` until the user explicitly tells you to push.**
- **Do not add unrequested features to pages outside what the user specifically asked for.**
- Keep responses concise and avoid exposing internal file paths in boss-facing summaries.
