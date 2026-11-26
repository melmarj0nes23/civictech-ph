# civictech.ph — To-Do & Roadmap

## Phase 1: Directory & Launch (Current)
- [x] Load verbatim `Civic Tech by BetterGov.ph` template (`HomePage`, `ArticlePage`)
- [x] Migrate 201 civic tech projects from `bettergovph/openbayan.org`
- [x] Seed 15 Philippine CSOs across Jason's 15 sectors (`content/csos/`)
- [x] Wire `/civictools` directory with `Show [All Entries] in [Every Sector]` + search
- [x] Add transparent logo, favicon, manifest, and per-route SEO pre-rendering (`civictech-ph.pages.dev`)
- [x] Mobile responsiveness + iOS Safari 16px form anti-zoom
- [x] Strict 100% English | Filipino translation across UI, sectors, articles, and 216 directory entries
- [x] GitHub submission form (`submit-entry.yml`) + automated `Issue -> PR` workflow (`issue-to-pr.yml`)
- [ ] **Push latest commits** (`1240155` & `9c5cbd8` + `TODO.md`) to `origin main` and stop local dev server
- [ ] **Smoke-test `Submit via GitHub ->`** by creating 1 test issue and verifying the automated PR
- [ ] **Wire placeholder links & Newsletter** (`The Civic Tech Weekly`, `Sign in`, footer links) when copy/endpoints are ready
- [ ] **Point custom domain (`civictech.ph`)** in Cloudflare Pages and switch `SITE_URL` from `civictech-ph.pages.dev` to `https://civictech.ph`

## Phase 2: Newsroom / Blog Platform (Later)
- [ ] Add Markdown article publishing pipeline (`content/articles/<slug>/index.md`)
- [ ] Add GitHub Action to **auto-translate newly published English articles (and new directory entries) into Filipino** on every Pull Request
- [ ] Replace template placeholder articles and `.ph` photo boxes with real reporting and photography
- [ ] Wire the 8 newsroom nav categories (`Open Data`, `Budget`, `Elections`, `Policy`, `Digital Services`, `Tools`, `Opinion`, `Community`) to live filtered article feeds
