"use client";

import { useState } from "react";

const PLAYER_IDS = ["player-1", "player-2", "player-3", "player-4"] as const;

export function MobilePersonalisedContentButton() {
  const [playerId, setPlayerId] = useState<string>(PLAYER_IDS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<unknown>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    setData(null);
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

  return (
    <section className="rounded-xl border border-zinc-700 bg-zinc-900/80 p-6">
      <h2 className="text-lg font-semibold text-white">Try it</h2>
      <p className="mt-2 text-sm text-zinc-400">
        Call <code className="rounded bg-zinc-700 px-1.5 py-0.5 text-indigo-300">GET /api/personalised-content</code> with
        the <code className="rounded bg-zinc-700 px-1.5 py-0.5 text-indigo-300">X-Player-Id</code> header.
        The Next.js app will resolve user context from Salesforce (mock), cache it by playerId, and return
        component content cached per (playerId, componentId).
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
          onClick={handleClick}
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? "Loading…" : "Fetch personalised content"}
        </button>
      </div>
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
