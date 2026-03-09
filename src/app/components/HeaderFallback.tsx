import Link from "next/link";
import { MobileNavLink } from "@/app/components/MobileNavLink";

/** Fallback header while users are loading (Suspense). No fetch. */
export function HeaderFallback() {
  return (
    <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-lg font-semibold text-white">
          Personalisation Scenarios
        </Link>
        <MobileNavLink />
      </div>
      <div className="h-9 w-24 animate-pulse rounded bg-zinc-700" aria-hidden />
    </div>
  );
}
