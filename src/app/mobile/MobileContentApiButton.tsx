"use client";

import { useState } from "react";
import type { SalesforceUserContext } from "@/lib/types";

export function MobileContentApiButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<unknown>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const contextRes = await fetch("/api/salesforce/user-context", {
        credentials: "include",
        cache: "no-store",
      });
      const contextJson = (await contextRes.json()) as { context: SalesforceUserContext | null };
      const context = contextJson.context;
      if (!context) {
        setError("No user selected. Use Login in the header to pick a user.");
        return;
      }
      const segment = context.segment;
      // Use path-based URL so CDN cache key includes segment (Vercel overwrites Vary, so header-based
      // /api/mobile/content would share one cache entry for all segments and return wrong data).
      const apiRes = await fetch(`/api/mobile/content/${segment}`, {
        cache: "no-store",
      });
      if (!apiRes.ok) {
        setError(`API returned ${apiRes.status}`);
        return;
      }
      const json = await apiRes.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-xl border border-zinc-700 bg-zinc-900/80 p-6">
      <h2 className="text-lg font-semibold text-white">Try it</h2>
      <p className="mt-2 text-sm text-zinc-400">
        Fetch API data using your current segment (from Login). The request uses{" "}
        <code className="rounded bg-zinc-700 px-1.5 py-0.5 text-indigo-300">/api/mobile/content/A</code> or{" "}
        <code className="rounded bg-zinc-700 px-1.5 py-0.5 text-indigo-300">/api/mobile/content/B</code> so
        the CDN cache key includes the segment and A/B always get the correct response on Vercel.
      </p>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
      >
        {loading ? "Loading…" : "Open API data (current segment)"}
      </button>
      {error && (
        <p className="mt-4 text-sm text-amber-400" role="alert">
          {error}
        </p>
      )}
      {data !== null && (
        <pre className="mt-4 overflow-auto rounded-lg bg-zinc-800 p-4 text-left text-sm text-zinc-300">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </section>
  );
}
