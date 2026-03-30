"use client";

import { useState } from "react";

const PLAYER_IDS = ["player-1", "player-2", "player-3", "player-4"] as const;

type NdjsonRecord =
  | { type: "meta"; segment: string; user: { name: string; email: string } }
  | { type: "component"; id: string; content: Record<string, unknown> | null }
  | { type: "error"; componentId: string; message: string }
  | { type: "done" };

function parseNdjsonLines(buffer: string): { lines: NdjsonRecord[]; rest: string } {
  const parts = buffer.split("\n");
  const rest = parts.pop() ?? "";
  const lines: NdjsonRecord[] = [];
  for (const line of parts) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      lines.push(JSON.parse(trimmed) as NdjsonRecord);
    } catch {
      lines.push({ type: "error", componentId: "parse", message: "Invalid JSON line" });
    }
  }
  return { lines, rest };
}

export function MobilePersonalisedContentButton() {
  const [playerId, setPlayerId] = useState<string>(PLAYER_IDS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<unknown>(null);
  const [ndjsonLog, setNdjsonLog] = useState<NdjsonRecord[]>([]);
  const [streamBusy, setStreamBusy] = useState(false);
  const [cacheMessage, setCacheMessage] = useState<string | null>(null);

  async function handleFetchJson() {
    setLoading(true);
    setError(null);
    setData(null);
    setNdjsonLog([]);
    try {
      const res = await fetch("/api/personalised-content", {
        headers: { "X-Player-Id": playerId },
        cache: "no-store",
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        setError(err.error ?? `API returned ${res.status}`);
        return;
      }
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleFetchNdjson() {
    setStreamBusy(true);
    setError(null);
    setData(null);
    setNdjsonLog([]);
    try {
      const res = await fetch(`/api/personalised-content?format=ndjson`, {
        headers: { "X-Player-Id": playerId },
        cache: "no-store",
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        setError(err.error ?? `API returned ${res.status}`);
        return;
      }
      const reader = res.body?.getReader();
      if (!reader) {
        setError("No response body");
        return;
      }
      const dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const { lines, rest } = parseNdjsonLines(buf);
        buf = rest;
        if (lines.length > 0) {
          setNdjsonLog((prev) => [...prev, ...lines]);
        }
      }
      if (buf.trim()) {
        const { lines } = parseNdjsonLines(buf + "\n");
        if (lines.length > 0) setNdjsonLog((prev) => [...prev, ...lines]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Stream failed");
    } finally {
      setStreamBusy(false);
    }
  }

  async function handleClearCache() {
    setCacheMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/personalised-content", { method: "POST" });
      const body = (await res.json()) as { revalidated?: boolean; tag?: string };
      if (!res.ok) {
        setCacheMessage(`Clear failed: ${res.status}`);
        return;
      }
      setCacheMessage(
        body.revalidated
          ? `Cache cleared for tag "${body.tag ?? "personalised-content"}". Next fetches will miss unstable_cache.`
          : "Done."
      );
    } catch (e) {
      setCacheMessage(e instanceof Error ? e.message : "Request failed");
    }
  }

  return (
    <section className="rounded-xl border border-zinc-700 bg-zinc-900/80 p-6">
      <h2 className="text-lg font-semibold text-white">Try it</h2>
      <p className="mt-2 text-sm text-zinc-400">
        Call <code className="rounded bg-zinc-700 px-1.5 py-0.5 text-indigo-300">GET /api/personalised-content</code> with
        the <code className="rounded bg-zinc-700 px-1.5 py-0.5 text-indigo-300">X-Player-Id</code> header.
        Use <code className="rounded bg-zinc-700 px-1.5 py-0.5 text-indigo-300">?format=ndjson</code> or{" "}
        <code className="rounded bg-zinc-700 px-1.5 py-0.5 text-indigo-300">Accept: application/x-ndjson</code> for a
        newline-delimited stream (<code className="text-indigo-300">meta</code>, then each{" "}
        <code className="text-indigo-300">component</code> as it completes, then <code className="text-indigo-300">done</code>
        ).
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="text-sm text-zinc-400">
          Player ID
          <select
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
            className="ml-2 rounded border border-zinc-600 bg-zinc-800 px-2 py-1.5 text-sm text-white"
          >
            {PLAYER_IDS.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => handleFetchJson()}
          disabled={loading || streamBusy}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? "Loading…" : "Fetch JSON (8 components)"}
        </button>
        <button
          type="button"
          onClick={handleFetchNdjson}
          disabled={loading || streamBusy}
          className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-500 disabled:opacity-50"
        >
          {streamBusy ? "Streaming…" : "Fetch NDJSON stream"}
        </button>
        <button
          type="button"
          onClick={handleClearCache}
          disabled={loading || streamBusy}
          className="rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-700 disabled:opacity-50"
        >
          Clear Next.js data cache
        </button>
      </div>
      {cacheMessage && (
        <p className="mt-3 text-sm text-emerald-400/90" role="status">
          {cacheMessage}
        </p>
      )}
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
      {ndjsonLog.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">NDJSON lines (order = arrival)</p>
          <ul className="max-h-80 space-y-2 overflow-auto rounded-lg bg-zinc-800/80 p-3 text-sm">
            {ndjsonLog.map((rec, i) => (
              <li key={i} className="rounded border border-zinc-700/80 bg-zinc-900/60 p-2 font-mono text-xs text-zinc-300">
                {JSON.stringify(rec)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
