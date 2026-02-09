import Link from "next/link";
import { mobileScenarioSlugs, mobileScenariosDetail } from "./mobile-scenarios";

export default function MobilePage() {
  return (
    <div className="space-y-10">
      <div>
        <Link href="/" className="text-sm text-indigo-400 hover:underline">
          ← Back to home
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
          Mobile API personalisation
        </h1>
        <p className="mt-2 text-zinc-400">
          The mobile app calls this Next.js app&apos;s APIs for data. Personalisation is required, and
          the goal is for responses to be <strong className="text-zinc-300">CDN-cached on Vercel</strong>.
          The cache key is the request URL, so the user or segment must be part of the URL for
          per-user or per-segment caching.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {mobileScenarioSlugs.map((slug) => {
          const s = mobileScenariosDetail[slug];
          return (
            <li key={slug}>
              <Link
                href={`/mobile/${slug}`}
                className="block rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition hover:border-indigo-500/50 hover:bg-zinc-900"
              >
                <span className="text-sm font-medium text-indigo-400">{s.subtitle}</span>
                <h2 className="mt-1 text-xl font-semibold text-white">{s.title}</h2>
                <p className="mt-2 text-sm text-zinc-400">{s.description}</p>
                <p className="mt-2 font-mono text-xs text-zinc-500">{s.urlShape}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
