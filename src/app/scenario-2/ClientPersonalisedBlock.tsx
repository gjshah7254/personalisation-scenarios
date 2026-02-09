"use client";

import { useEffect, useState } from "react";
import type { User } from "@/lib/types";

export function ClientPersonalisedBlock() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((data: { user: User | null }) => setUser(data.user));
  }, []);

  if (user === undefined) {
    return <p className="mt-3 text-zinc-500">Loading...</p>;
  }

  if (!user) {
    return (
      <p className="mt-3 text-zinc-400">
        No user selected. Use &quot;View as&quot; in the header to pick a user.
      </p>
    );
  }

  if (user.segment === "A") {
    return (
      <div className="mt-3 rounded-lg bg-indigo-500/10 p-4 text-indigo-200">
        <p className="font-medium">Variant for Segment A (client)</p>
        <p className="mt-1 text-sm">
          Hello {user.name}. This block was rendered in the browser for Segment A.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-lg bg-amber-500/10 p-4 text-amber-200">
      <p className="font-medium">Variant for Segment B (client)</p>
      <p className="mt-1 text-sm">
        Hey {user.name}. This block was rendered in the browser for Segment B.
      </p>
    </div>
  );
}
