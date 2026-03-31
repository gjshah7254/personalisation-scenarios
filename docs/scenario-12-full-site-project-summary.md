# Scenario 12 Full-Site Project Summary

**Purpose:** Blueprint for a brand-new project (in a separate folder) that implements a real-looking site using **Middleware routing with Cache Components for 1:1 personalisation**. All pages follow Scenario 12: static shell, cached shared content, and streamed personalised sections with mock data.

---

## 1. Project overview

| Item | Description |
|------|-------------|
| **Name** | e.g. `personalisation-site` or `scenario-12-site` |
| **Stack** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS |
| **Deploy** | Vercel (Edge Middleware + Serverless) |
| **Content** | Mock Contentful-style data (JSON / in-repo); no real CMS required |
| **Personalisation** | Segment A / B from cookie (set at login); middleware rewrites to variant route; app reads cookie and serves personalised blocks |

The site should **look and feel like a real site**: multiple pages, consistent header/footer, hero sections, product or content listings, and personalised promos/recommendations. All content is read from mock data; shared content uses Cache Components; personalised content streams in per segment.

---

## 2. Architecture (Scenario 12)

- **Request path:** Browser → **Edge Middleware** (read cookie, rewrite to `/path--A` or `/path--B`) → **CDN** (cache per variant) → **Next.js App**.
- **Static components:** Header, Footer, global nav, site chrome. Same for everyone; part of the shell; no `use cache` needed (or use for reuse).
- **Cache Components:** Shared content (e.g. featured items, categories, editorial blocks) using `"use cache"` + `cacheLife(...)`. Cached per serialisable inputs; no cookie.
- **Personalised components:** Wrapped in `<Suspense>`. Read `cookies()` for segment, fetch or resolve content by segment (from mock), render. Streamed when ready; cache the **data** per `(segment, componentId)` where useful.
- **Mock data:** Contentful-like entries (title, body, slug, segment variants). Stored as JSON or TS in repo; optional mock API routes for `GET /api/mock/contentful/entries?segment=A|B` and `GET /api/mock/contentful/cached`.

---

## 3. Site structure (pages)

Treat these as the main pages of the site. Each page uses the same layout (static header/footer) and a mix of static, cached, and personalised sections.

| Route | Purpose | Static | Cached | Personalised (streamed) |
|-------|---------|--------|--------|-------------------------|
| `/` | Home | Header, Footer, layout | Hero copy, featured categories | Hero CTA, promos, recommendations |
| `/products` | Catalog / listing | Header, Footer, layout | Product grid (shared), filters copy | Promo banner, “For you” strip |
| `/products/[slug]` | Product detail | Header, Footer, layout | Product info, related (shared) | Upsells, reviews CTA, add-to-cart CTA |
| `/about` | About us | Header, Footer, layout | Team, story, values (shared) | Quote or CTA block |
| `/contact` | Contact | Header, Footer, layout | Office info, map placeholder | Contact CTA / form CTA |
| `/blog` | Blog listing | Header, Footer, layout | Post list, categories | “Recommended for you” |
| `/blog/[slug]` | Blog post | Header, Footer, layout | Post body, author (shared) | Related posts, newsletter CTA |

All pages share the same **root layout** with static **Header** and **Footer**.

---

## 4. Global static components

These are the same for every user and every variant. They are part of the initial HTML shell.

### 4.1 Header

- **Role:** Global nav, logo, primary links (Home, Products, About, Contact, Blog), optional “Login” (sets segment cookie in this demo).
- **Implementation:** Server Component, no async, no cookie. Can be a client component for mobile menu toggle only; structure and links are static.
- **File:** e.g. `components/Header.tsx` (or `components/layout/Header.tsx`).

### 4.2 Footer

- **Role:** Footer links, copyright, legal links, social placeholders, newsletter placeholder (can be a static CTA; real signup not required).
- **Implementation:** Server Component, no async, no cookie. Pure static markup.
- **File:** e.g. `components/Footer.tsx`.

### 4.3 Root layout

- **Role:** Wraps all pages with `<html>`, `<body>`, Header, main content slot, Footer. No personalisation in layout itself.
- **Implementation:** `app/layout.tsx`; children = page content. Header and Footer are static; no Suspense needed for them.

---

## 5. Cache Components (shared content)

Use `"use cache"` and `cacheLife(...)` so the **output** is cached and reused. No cookie or request-time data inside the cached function/component.

| Component | Purpose | Cache key / inputs | Mock data source |
|-----------|---------|--------------------|-------------------|
| **CachedHeroCopy** | Main hero title + short description (home) | None (global) | e.g. `contentful/hero.json` or inline mock |
| **CachedFeaturedCategories** | List of categories with names + slugs | None or `locale` | e.g. `contentful/categories.json` |
| **CachedProductGrid** | First N products for catalog | e.g. `limit`, `category` | e.g. `contentful/products.json` |
| **CachedProductBySlug** | Single product by slug | `slug` | Same products mock |
| **CachedRelatedProducts** | Related products for a given product | `productId` or `slug` | Same products mock |
| **CachedAboutContent** | About page body, team, values | None | e.g. `contentful/about.json` |
| **CachedContactInfo** | Office address, map placeholder, hours | None | e.g. `contentful/contact.json` |
| **CachedBlogList** | Blog post list (title, slug, date, excerpt) | Optional `limit`, `category` | e.g. `contentful/posts.json` |
| **CachedBlogPost** | Single post body + author | `slug` | Same posts mock |

Implementation pattern:

- Create a function or async component with `"use cache"` and `cacheLife("minutes")` (or `"hours"`).
- Accept only serialisable arguments (string, number, plain objects). No cookies or headers.
- Read from imported mock JSON/TS or from a mock API (e.g. `fetch(process.env.ORIGIN + '/api/mock/contentful/...')`) and return JSX or data.
- Use these inside pages so the shell or first paint includes cached content where possible.

---

## 6. Personalised (streamed) components

These read the segment from the cookie and render different content per segment. Wrap each in `<Suspense fallback={...}>` so the shell can show a default/placeholder and the real content streams in.

| Component | Purpose | Segment-driven content (mock) |
|-----------|---------|-------------------------------|
| **PersonalisedHeroCta** | Primary CTA under hero (e.g. “Start trial” vs “Book demo”) | Title, link text, URL by segment |
| **PersonalisedPromoBanner** | Banner promo (e.g. discount vs free shipping) | Copy, code, link by segment |
| **PersonalisedRecommendations** | “For you” or “Recommended” block | List of item IDs or content entries by segment |
| **PersonalisedUpsells** | Product detail upsells | Different product set per segment |
| **PersonalisedQuoteOrCta** | About/Contact CTA or testimonial quote | Copy and CTA by segment |
| **PersonalisedBlogRecommendations** | “Recommended for you” on blog | Post IDs or entries by segment |
| **PersonalisedNewsletterCta** | Footer or post-level newsletter CTA | Headline + subcopy by segment |

Implementation pattern:

- Async Server Component.
- `const segment = await getSegmentFromCookie();` (or similar). Default to `"A"` if no cookie.
- Load content from mock: e.g. `getCachedPersonalisedContent(segment, componentId)` (cached helper with `use cache` and args `segment` + `componentId`) or fetch from `GET /api/mock/contentful/entries?segment=A|B` and pick by component/slot.
- Render; React will stream this chunk when ready. Cache the **data** per `(segment, componentId)` so repeat visits are fast.

---

## 7. Mock data structure

All content is mock; structure should feel like Contentful (entries with fields).

### 7.1 Global / shared (for Cache Components)

- **Hero:** `{ title, description, imageUrl? }`
- **Categories:** `[{ id, name, slug, description? }]`
- **Products:** `[{ id, slug, name, description, price, imageUrl?, categoryId }]`
- **About:** `{ title, body, team?: [], values?: [] }`
- **Contact:** `{ title, address, hours, mapPlaceholderUrl? }`
- **Posts:** `[{ id, slug, title, excerpt, body, date, authorId }]`
- **Authors:** `[{ id, name, avatarUrl? }]`

Store as JSON under `data/` or `contentful/` (e.g. `data/hero.json`, `data/products.json`). Cache Components import or fetch these.

### 7.2 Personalised (per segment)

- **Entries by segment:** For each “slot” (e.g. hero CTA, promo banner, recommendations), provide:
  - `segmentA: { title, body, linkText?, linkUrl?, items? }`
  - `segmentB: { ... }`
- Store as e.g. `data/personalised-entries.json` with structure like:
  - `{ slots: [{ id: "hero-cta", segmentA: {...}, segmentB: {...} }, ...] }`
- Cached helper `getCachedPersonalisedContent(segment, slotId)` returns the right variant; personalised components call it and render.

---

## 8. Middleware (Edge)

- **File:** `middleware.ts` at project root.
- **Logic:** Read cookie (e.g. `userContext` or `segment`). Map to variant `A` or `B`. Rewrite request to path with variant: e.g. `/(.*)` → `/$1--A` or `/$1--B` (or use a convention like `/[segment]/path` if you prefer).
- **Fallback:** If no cookie, rewrite to `--A` (or default segment).
- Keep middleware minimal: no personalisation logic, only cookie read + rewrite so CDN can cache per variant route.

---

## 9. Config and environment

- **Next.js:** Enable Cache Components in `next.config`: `experimental: { cacheComponents: true }` or the stable flag if available in your version.
- **Cookie:** Name and shape (e.g. `segment=A|B` or `userContext=ctxKey`) consistent with login/set-user API that sets the cookie (mock login can set segment A or B for demo).
- **Mock API (optional):** If you use `fetch('/api/mock/...')` from the app, ensure `getMockApiBaseUrl()` or similar points to the same origin in dev/prod so Cache Components and server components can hit the same mock.

---

## 10. Suggested folder structure (new project)

```
app/
  layout.tsx                 # Root layout: Header + children + Footer
  page.tsx                   # Home
  products/
    page.tsx                 # Catalog
    [slug]/
      page.tsx               # Product detail
  about/
    page.tsx
  contact/
    page.tsx
  blog/
    page.tsx
    [slug]/
      page.tsx
  api/
    auth/
      login/                 # Mock: set segment cookie
    mock/
      contentful/
        entries/            # GET ?segment=A|B
        cached/             # GET shared cached content
components/
  layout/
    Header.tsx               # Static
    Footer.tsx               # Static
  cached/
    CachedHeroCopy.tsx
    CachedFeaturedCategories.tsx
    CachedProductGrid.tsx
    CachedProductBySlug.tsx
    CachedRelatedProducts.tsx
    CachedAboutContent.tsx
    CachedContactInfo.tsx
    CachedBlogList.tsx
    CachedBlogPost.tsx
  personalised/
    PersonalisedHeroCta.tsx
    PersonalisedPromoBanner.tsx
    PersonalisedRecommendations.tsx
    PersonalisedUpsells.tsx
    PersonalisedQuoteOrCta.tsx
    PersonalisedBlogRecommendations.tsx
    PersonalisedNewsletterCta.tsx
lib/
  cookies.ts                 # getSegmentFromCookie(), etc.
  getCachedPersonalisedContent.ts  # use cache per (segment, slotId)
data/
  hero.json
  categories.json
  products.json
  about.json
  contact.json
  posts.json
  authors.json
  personalised-entries.json  # Slots with segmentA / segmentB
middleware.ts                # Read cookie, rewrite to /path--A|B
```

---

## 11. Page composition pattern (example: Home)

- **Static:** `<Header />`, `<Footer />` (in layout).
- **Cached:** `<CachedHeroCopy />`, `<CachedFeaturedCategories />` (no Suspense; they’re fast and cached).
- **Personalised (streamed):**  
  `<Suspense fallback={<HeroCtaFallback />}><PersonalisedHeroCta /></Suspense>`,  
  `<Suspense fallback={<PromoFallback />}><PersonalisedPromoBanner /></Suspense>`,  
  `<Suspense fallback={<RecsFallback />}><PersonalisedRecommendations /></Suspense>`.

Same idea on other pages: static shell + cached shared blocks + Suspense-wrapped personalised blocks reading from cache (per segment).

---

## 12. Summary checklist

- [ ] New project folder; Next.js 16, App Router, TypeScript, Tailwind.
- [ ] Root layout with static **Header** and **Footer**.
- [ ] **Middleware** reads segment cookie and rewrites to variant route (`--A` / `--B`).
- [ ] **Mock data** for hero, categories, products, about, contact, blog posts, and personalised slots (segment A/B).
- [ ] **Cache Components** for all shared content (hero, categories, product grid, product by slug, related, about, contact, blog list, blog post).
- [ ] **Personalised components** for hero CTA, promo, recommendations, upsells, quote/CTA, blog recs, newsletter CTA; each in Suspense, reading from cookie + cached data per segment.
- [ ] **Mock login** (e.g. `/api/auth/login`) sets segment cookie; Header or a dev control can trigger it.
- [ ] All pages look like a real site: consistent nav, multiple routes, real-looking copy and structure, with cache and personalisation applied as above.

This summary gives a full blueprint to implement a Scenario 12–based site in a new folder with static header/footer, Cache Components for shared content, and streamed personalised sections powered by mock data.
