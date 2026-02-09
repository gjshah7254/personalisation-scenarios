"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNavLink() {
  const pathname = usePathname();
  const isActive = pathname === "/mobile" || pathname.startsWith("/mobile/");

  return (
    <Link
      href="/mobile"
      className={`text-sm font-medium transition hover:text-white ${
        isActive ? "text-white underline" : "text-zinc-400"
      }`}
    >
      Mobile API
    </Link>
  );
}
