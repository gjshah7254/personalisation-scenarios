import { cacheLife } from "next/cache";
import { getMockApiBaseUrl } from "@/lib/mock-api-base-url";
import contentfulCachedMock from "@/data/contentful-cached-mock.json";

type ContentfulCachedMock = {
  title?: string;
  message?: string;
  updatedAt?: string;
};

/**
 * Block that fetches shared content from mock Contentful API. Uses Next.js 16 Cache Components:
 * 'use cache' + cacheLife('minutes') so the result is cached and reused until revalidation.
 * At build time (no server running) we use imported mock data to avoid ECONNREFUSED.
 */
export async function CachedDataBlock() {
  "use cache";
  cacheLife("minutes"); // revalidate 1 min, expire 1 hour

  let data: ContentfulCachedMock;
  try {
    const base = getMockApiBaseUrl();
    const res = await fetch(`${base}/api/mock/contentful/cached`);
    data = (await res.json()) as ContentfulCachedMock;
  } catch {
    data = contentfulCachedMock as ContentfulCachedMock;
  }
  const title = data.title ?? "Cached content (Contentful mock)";
  const message = data.message ?? "";
  const updatedAt = data.updatedAt ? new Date(data.updatedAt).toLocaleString() : "";

  return (
    <div className="mt-3 rounded-lg bg-emerald-500/10 p-4 text-emerald-200">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm">
        This block uses <code className="rounded bg-zinc-700 px-1">use cache</code> and{" "}
        <code className="rounded bg-zinc-700 px-1">cacheLife(&quot;minutes&quot;)</code>. It fetches
        from <code className="rounded bg-zinc-700 px-1">GET /api/mock/contentful/cached</code>; the
        result is cached and reused until revalidation.
      </p>
      {message && (
        <p className="mt-2 text-sm text-emerald-300/80">{message}</p>
      )}
      {updatedAt && (
        <p className="mt-1 text-xs text-emerald-400/70">Mock data updated: {updatedAt}</p>
      )}
    </div>
  );
}
