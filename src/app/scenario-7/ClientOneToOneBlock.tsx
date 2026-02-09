"use client";

import { useEffect, useState } from "react";

interface UserContent {
  user: { id: string; name: string; email: string; segment: string } | null;
  greeting: string | null;
  recommendations: string[];
}

export function ClientOneToOneBlock() {
  const [content, setContent] = useState<UserContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user-content")
      .then((r) => r.json())
      .then((data: UserContent) => {
        setContent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="mt-3 text-zinc-500">Loading…</p>;
  }

  if (!content?.user) {
    return (
      <p className="mt-3 text-zinc-400">
        No user selected. Use &quot;View as&quot; in the header to pick a user.
      </p>
    );
  }

  return (
    <div className="mt-3 rounded-lg bg-indigo-500/10 p-4 text-indigo-200">
      <p className="font-medium">1:1 personalisation (cached API)</p>
      <p className="mt-1 text-sm">{content.greeting}, here&apos;s your content.</p>
      <ul className="mt-2 list-inside list-disc text-sm">
        {content.recommendations.map((rec) => (
          <li key={rec}>{rec}</li>
        ))}
      </ul>
    </div>
  );
}
