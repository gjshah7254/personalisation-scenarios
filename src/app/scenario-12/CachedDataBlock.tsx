import { cacheLife } from "next/cache";
import { getMockApiBaseUrl } from "@/lib/mock-api-base-url";

type CachedContentMock = {
  title?: string;
  message?: string;
  updatedAt?: string;
};

/**
 * Block that fetches shared data from our mock API. Uses Next.js 16 Cache Components:
 * 'use cache' + cacheLife('minutes') so the result is cached and reused until revalidation.
 */
export async function CachedDataBlock() {
  "use cache";
  cacheLife("minutes"); // revalidate 1 min, expire 1 hour

  const base = getMockApiBaseUrl();
  const res = await fetch(`${base}/api/mock/cached-content`);
  const data = (await res.json()) as CachedContentMock;
  const title = data.title ?? "Cached content (mock)";
  const message = data.message ?? "";
  const updatedAt = data.updatedAt ? new Date(data.updatedAt).toLocaleString() : "";

  return (
    <div className="mt-3 rounded-lg bg-emerald-500/10 p-4 text-emerald-200">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm">
        This block uses <code className="rounded bg-zinc-700 px-1">use cache</code> and{" "}
        <code className="rounded bg-zinc-700 px-1">cacheLife(&quot;minutes&quot;)</code>. It fetches
        from <code className="rounded bg-zinc-700 px-1">GET /api/mock/cached-content</code>; the
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
