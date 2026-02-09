"use client";

import { useEffect, useState } from "react";

const SEGMENT_COOKIE = "personalisation-segment";

function getSegmentFromCookie(): "A" | "B" | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${SEGMENT_COOKIE}=([^;]*)`));
  const value = match ? decodeURIComponent(match[1]).trim() : null;
  if (value === "A" || value === "B") return value;
  return null;
}

interface ClientSegmentRevealProps {
  segmentA: React.ReactNode;
  segmentB: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ClientSegmentReveal({ segmentA, segmentB, fallback }: ClientSegmentRevealProps) {
  const [segment, setSegment] = useState<"A" | "B" | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSegment(getSegmentFromCookie());
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{fallback ?? <p className="mt-3 text-zinc-500">Loading…</p>}</>;
  }

  if (segment === "A") return <>{segmentA}</>;
  if (segment === "B") return <>{segmentB}</>;
  return (
    <>{fallback ?? <p className="mt-3 text-zinc-400">No segment. Use &quot;View as&quot; in the header to pick a user.</p>}</>
  );
}
