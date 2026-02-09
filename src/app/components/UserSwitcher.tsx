"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@/lib/types";

interface UserSwitcherProps {
  users: User[];
}

export function UserSwitcher({ users }: UserSwitcherProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((data: { user: User | null }) => setCurrentUserId(data.user?.id));
  }, []);

  async function switchUser(userId: string) {
    await fetch("/api/set-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    setOpen(false);
    setCurrentUserId(userId);
    router.refresh();
  }

  const current = users.find((u) => u.id === currentUserId);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-700"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="text-zinc-400">View as:</span>
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
              <li key={user.id} role="option" aria-selected={currentUserId === user.id}>
                <button
                  type="button"
                  onClick={() => switchUser(user.id)}
                  className={`flex w-full flex-col gap-0.5 px-3 py-2 text-left text-sm hover:bg-zinc-800 ${
                    currentUserId === user.id ? "bg-indigo-900/40 text-indigo-200" : "text-zinc-200"
                  }`}
                >
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-zinc-400">{user.email}</span>
                  <span className="text-xs text-zinc-500">Segment {user.segment}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
