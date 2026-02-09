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
      "Middleware determines segment. Page is a static shell. Server Component fetches segment-based data. Cache can be per segment.",
  },
  {
    href: "/scenario-5",
    title: "Scenario 5",
    subtitle: "Streaming + partial personalization",
    description:
      "Initial static page streams instantly. Personalized sections stream in server-side afterwards (RSC streaming).",
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
