"use client";

import { useEffect, useState } from "react";
import type { User, Segment } from "@/lib/types";

interface UserSwitcherProps {
  users: User[];
  userSegments: Record<string, Segment>;
}

export function UserSwitcher({ users, userSegments }: UserSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((r) => r.json())
      .then((data: { user: User | null }) => setCurrentUserEmail(data.user?.email));
  }, []);

  function switchUser(email: string) {
    setOpen(false);
    // Full page navigation: set-user redirects with Set-Cookie, so cookies persist reliably (e.g. on Vercel)
    const redirect = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/";
    window.location.href = `/api/set-user?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(redirect)}`;
  }

  const current = users.find((u) => u.email === currentUserEmail);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-700"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="text-zinc-400">Login:</span>
        <span className="text-indigo-300">
          {current ? `${current.name} (${current.email})` : "No user"}
        </span>
        <span className="text-zinc-500">▼</span>
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <ul
            className="absolute right-0 top-full z-20 mt-1 max-h-64 w-80 list-none overflow-auto rounded-lg border border-zinc-700 bg-zinc-900 py-1 shadow-xl"
            role="listbox"
          >
            {users.map((user) => (
              <li key={user.email} role="option" aria-selected={currentUserEmail === user.email}>
                <button
                  type="button"
                  onClick={() => switchUser(user.email)}
                  className={`flex w-full flex-col gap-0.5 px-3 py-2 text-left text-sm hover:bg-zinc-800 ${
                    currentUserEmail === user.email ? "bg-indigo-900/40 text-indigo-200" : "text-zinc-200"
                  }`}
                >
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-zinc-400">{user.email}</span>
                  <span className="text-xs text-zinc-500">Segment {userSegments[user.email] ?? "—"}</span>
                </button>
              </li>
            ))}
            <li className="border-t border-zinc-700">
              <a
                href="/api/clear-session"
                className="flex w-full px-3 py-2 text-left text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                target="_self"
              >
                Clear cookies & start new session
              </a>
            </li>
          </ul>
        </>
      )}
    </div>
  );
}
