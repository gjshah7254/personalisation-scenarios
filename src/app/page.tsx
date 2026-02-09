import Link from "next/link";

const scenarios = [
  {
    href: "/scenario-1",
    title: "Scenario 1",
    subtitle: "Server-side personalised component",
    description:
      "Page loads on the server (RSC). Cookie/session is read, variant is chosen, output is streamed as a Server Component.",
  },
  {
    href: "/scenario-2",
    title: "Scenario 2",
    subtitle: "Client-side personalised component",
    description:
      "Page is static (fast + CDN cached). Personalization happens in the browser after hydration.",
  },
  {
    href: "/scenario-3",
    title: "Scenario 3",
    subtitle: "Whole page at middleware by segment",
    description:
      "Middleware runs before the page. Segment is detected (cookie). Request is rewritten to a segment-specific static file. All pages CDN cached per segment.",
  },
  {
    href: "/scenario-4",
    title: "Scenario 4",
    subtitle: "Middleware + Server Component hybrid",
    description:
      "Middleware determines segment. Page is a static shell. Server Component fetches segment-based data. Response not CDN-cached (Next.js data cache can be per segment only).",
  },
  {
    href: "/scenario-5",
    title: "Scenario 5",
    subtitle: "Streaming + partial personalization",
    description:
      "Initial static page streams instantly. Personalized sections stream in server-side afterwards (RSC streaming). Response not CDN-cached.",
  },
  {
    href: "/scenario-6",
    title: "Scenario 6",
    subtitle: "SSG with embedded variants (client reveals one)",
    description:
      "Page is fully static (SSG). Both segment variants are in the HTML; client reads segment cookie and shows one. No API or server for content.",
  },
  {
    href: "/scenario-7",
    title: "Scenario 7",
    subtitle: "Client-side 1:1 with cached API",
    description:
      "SSG page; client fetches user content from API. API sets Cache-Control so response is CDN-cached per user.",
  },
  {
    href: "/scenario-8",
    title: "Scenario 8",
    subtitle: "Server-side 1:1 with data cache",
    description:
      "RSC reads userId, fetches content via unstable_cache(userId). Data cached per user; 1 serverless inv per view.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Next.js & Vercel personalisation
        </h1>
        <p className="mt-2 text-zinc-400">
          Use the <strong className="text-zinc-300">View as</strong> control in the header to switch
          between users (Segment A or B) and see how content changes per scenario.
        </p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {scenarios.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              className="block rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition hover:border-indigo-500/50 hover:bg-zinc-900"
            >
              <span className="text-sm font-medium text-indigo-400">{s.subtitle}</span>
              <h2 className="mt-1 text-xl font-semibold text-white">{s.title}</h2>
              <p className="mt-2 text-sm text-zinc-400">{s.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
