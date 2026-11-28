# civictech.ph — Session Handoff

**Last updated:** 2026-11-28
**Repository:** `https://github.com/melmarj0nes23/civictech-ph` (branch `main`, latest pushed commit `09e42bb`)
**Staging URL:** `https://civictech-ph.pages.dev/`
**Local project path:** `/Users/brucedlc/.gemini/antigravity/scratch/civictech-ph`

---

## 1. Tech Stack & Architecture
- **Frontend:** Vite + React 19 + TypeScript (`npm run build` runs `sync:directory` → `tsc -b && vite build` → `scripts/prerender-seo.mjs` for 34 SEO routes + `sitemap.xml`).
- **Styling & Typography:** `src/index.css` + inline styles; **Newsreader** (serif headings/body) + **Inter** (UI); `#0B3D91` BetterGov.ph primary accent; sharp `0px` corners; `1380px` desktop container width; `text-wrap: balance` on headlines; bilingual **English | Filipino** (`en` | `fil`).
  - *Constraint:* Keep desktop layout untouched unless asked; no global `box-sizing: border-box` in `src/index.css`; mobile rules live under `@media (max-width: 768px)` (using `overflow-x: clip` on `html, body` so sticky header works).
- **Hosting:** Cloudflare Pages Free Tier (`dist/` build output, `functions/` automatically compiled as Pages Functions).
- **Auth:** **Clerk** (`@clerk/react` v6.19.7 + `@clerk/react/legacy` custom flow hooks).
- **Database:** **Cloudflare D1** (`civictech-db`), bound to Pages as `DB` via the Cloudflare Dashboard (do **not** commit a `wrangler.toml` with placeholder D1 IDs or it overrides Dashboard bindings).
- **Email / Newsletter:** **Resend** HTTP API (`RESEND_API_KEY` stored in Cloudflare Pages secrets).

---

## 2. What Is Built & Live (`09e42bb`)
### Header & Navigation (`SiteHeader.tsx`, `MobileMenu.tsx`, `src/data/articles.ts`)
- **Desktop Header:** Inline `Civic Tech` + `BY BETTERGOV.PH` (`13px` centered), followed by 8 nav items: **Articles ▾** (`Policy`, `Digital Services`, `Community`, `All Articles →`) | **Open Data** | **Budget** | **Elections** | **Videos** | **Events** | **Tools** | **Opinion**.
- **Mobile Drawer:** Collapsible `Articles` group + top-level categories + `Directory` links, rendered via `createPortal(..., document.body)`.
- **Clerk Avatar Menu (`AdminUserButton`):** Role-gated shortcuts for `Newsroom` (`/write`), `Newsletter` (`/profile?panel=newsletter`), `Team Roles` (`/profile?panel=team`), and `Manage Banner` (`/profile?panel=banners`).

### Pages & Features (`src/pages/`, `src/components/`)
- **Homepage (`HomePage.tsx`):** Edition utility strip, admin-managed banner carousel (`1332×260`), live D1 feed (`articlesCache.ts`), Headlines + Top Stories, Latest, Long Read, Opinion, Civic Tools, and `NewsletterBand`.
- **Category & Directory Pages (`CategoryPage.tsx`, `DirectoryPage.tsx`, `SubmitPage.tsx`, `InfoPage.tsx`):** Unified `.category-desk-band`, `?kind=project`/`cso` sync, event date/location lines on event cards, and `resolveArticleImage` thumbnails.
- **Videos & Events Support (`src/data/videoEmbed.ts`, `WritePage.tsx`, `ArticlePage.tsx`):**
  - Selecting `Videos` in `/write` switches `Cover photo URL` to `Direct video URL`. `ArticlePage` auto-embeds YouTube (`youtube-nocookie.com`), Vimeo, or direct `.mp4`/`.webm`/`.ogg`/`.mov` files in the 16:9 hero slot; `resolveArticleImage` pulls YouTube thumbnails for feed cards.
  - Selecting `Events` in `/write` reveals `Event Date & Time`, `Location / Venue`, and `Registration / RSVP URL`, rendered as an **Event Details** callout card with an RSVP button on `ArticlePage`.
- **Article Reader (`ArticlePage.tsx`, `RichBody.tsx`) & Author Archives (`AuthorPage.tsx`):**
  - Top reading-progress bar, `RichBody` Markdown renderer with `id` anchors on `##` headings, **"In this story"** jump-link TOC (when 2+ `##` headings exist), same-category-first Related Stories, and clickable author links to `/author/:slug`.
  - Edge `HTMLRewriter` in `functions/article/[slug].ts` for dynamic D1 Open Graph / Twitter cards.
- **Profile & Editorial Dashboard (`/profile`, `ProfilePage.tsx`):**
  - Responsive 2-column desktop layout (`.profile-desktop-grid`) with unified `#fff` / `2px solid #0B3D91` cards and matching `170px` desktop action buttons:
    - Left column: `The Civic Tech Weekly` D1 subscribe/unsubscribe toggle + `Profile & security`.
    - Right column (`admin`/`editor`): `Newsroom Studio`, `Team roles` (`admin`), `Homepage banners` (`admin`), and `Newsletter Studio` (active subscriber count, **Export CSV**, story picker up to 5 stories, **Send test**, **Send to all subscribers**).
  - Mobile (`<= 768px`): Single-column stack; `Newsletter Studio` keeps `Export CSV` / `Compose issue` stacked on the right on the same row.
- **Newsroom Studio (`/write`, `WritePage.tsx`):** Role-protected CMS with Markdown toolbar, **Write | Preview** toggle, Lead/Long Read pinning, video URL / event metadata fields, and D1 cache clearing.
- **Contact & News Tip Line (`/contact`, `ContactPage.tsx`, `functions/api/contact.ts`):** Wired from `Footer.tsx`, saves submissions to D1 `contact_messages` and optionally forwards via Resend if `CONTACT_TO_EMAIL` is set.

### Backend (`functions/`, `db/schema.sql`)
- **`functions/api/articles.ts`:** `GET`/`POST`/`PATCH`/`DELETE` with auto-migrated columns (`is_featured`, `is_long_read`, `author_bio`, `event_date`, `event_location`, `event_url`).
- **`functions/api/newsletter.ts`:** D1 subscribe/unsubscribe + formal bilingual Resend welcome email (`Dear <FirstName>,` when signed in via Clerk, `Dear Reader,` fallback) + optional `RESEND_AUDIENCE_ID` sync.
- **`functions/api/newsletter/send.ts`:** Role-gated (`admin`/`editor`) `GET` (stats + `?format=csv` export) and `POST` (test email or 100-per-batch Resend broadcast).
- **`functions/api/contact.ts`:** Saves contact/tip form submissions to D1 `contact_messages` + optional Resend forwarding to `CONTACT_TO_EMAIL`.
- **`functions/api/users.ts` & `functions/api/banners.ts`:** Admin-only Clerk role management and D1 `site_settings` banner management.

---

## 3. Environment & Dashboard Config
- **Local `.env.local`** (gitignored): `VITE_CLERK_PUBLISHABLE_KEY=pk_test_bGFzdGluZy1kb3ZlLTkzMTYuY2xlcmsuYWNjb3VudHMuZGV2JA`
- **Cloudflare Pages → `civictech-ph` → Settings:**
  - **Variables and secrets (Production):** `VITE_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `RESEND_API_KEY` set.
  - **Optional Resend/Contact vars:** `RESEND_FROM_EMAIL` (currently defaults to `Civic Tech PH <onboarding@resend.dev>` until a custom domain is verified in Resend), `RESEND_AUDIENCE_ID`, `SITE_URL`, `CONTACT_TO_EMAIL`.
  - **Bindings:** D1 database `DB` → `civictech-db` set.
- **Clerk Dashboard:**
  - User `publicMetadata`: `{ "role": "admin" }` for admin/editor accounts.
  - **Sessions → Customize session token:** `{ "role": "{{user.public_metadata.role}}" }` saved.

---

## 4. Pending / Next Steps
1. **Populate Content:** Publish initial stories/items under **Videos** and **Events** via `/write` so all top-level nav sections have live content, and replace placeholder photos with real photography.
2. **Production Custom Domain (`civictech.ph`), Clerk Live Keys & Resend Domain:**
   - Point `civictech.ph` in Cloudflare Pages and update `SITE_URL` (`index.html`, `public/robots.txt`, `src/data/seo.ts`, `scripts/prerender-seo.mjs`) from `civictech-ph.pages.dev` to `https://civictech.ph`.
   - Swap Clerk `pk_test_` / `sk_test_` for `pk_live_` / `sk_live_` (and update `DEFAULT_CLERK_ISSUER` / `CLERK_ISSUER` in `functions/_lib/clerkAuth.ts`).
   - Verify `civictech.ph` (or `mail.bettergov.ph`) in Resend DNS and set `RESEND_FROM_EMAIL` + `CONTACT_TO_EMAIL` in Cloudflare Pages secrets. *(Also rotate the test `RESEND_API_KEY` if needed.)*
3. **Analytics:** Enable Cloudflare Web Analytics (free) in the Cloudflare Dashboard.

---

## 5. Working Rules Remembered from User
- **Never run `git push` until the user explicitly tells you to push.**
- **Do not add unrequested features to pages outside what the user specifically asked for.**
- Keep responses concise and avoid exposing internal file paths in boss-facing summaries.
