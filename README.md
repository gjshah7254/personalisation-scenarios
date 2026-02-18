# Next.js & Vercel Personalisation Scenarios

A demo app showing **5 personalisation patterns** with Next.js (App Router) and Vercel. Use it to explain how personalisation works with Next.js and Vercel.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How to use

1. Use **Login** in the header to switch between users (Segment A or B).
2. Visit each scenario page and switch users to see how content changes.

Mock users and segments are defined in `src/data/users.json`.

## Scenarios

| Scenario | Description |
|----------|-------------|
| **1** | **Server-side personalised component** — Page is RSC; cookie/session is read, variant is chosen, output is streamed as a Server Component. |
| **2** | **Client-side personalised component** — Page is static (CDN-cached); personalisation happens in the browser after hydration. |
| **3** | **Whole page at middleware** — Middleware detects segment (cookie) and rewrites to a segment-specific static path. Pages are pre-generated per segment and CDN-cached. |
| **4** | **Middleware + Server Component hybrid** — Segment from cookie; static shell with a Server Component that fetches segment-based data (cache can be per segment). |
| **5** | **Streaming + partial personalisation** — Static shell streams first; personalised sections stream in server-side (RSC streaming). |
| **10** | **Whole page at middleware (header-based)** — Like 3 but segment from `x-segment` header or `segment` query param; no cookie read in middleware. |

## Deploy to Vercel

```bash
vercel
```

The app is built for Vercel; middleware and static generation work as described when deployed.
