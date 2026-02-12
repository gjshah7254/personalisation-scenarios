import Link from "next/link";
import { notFound } from "next/navigation";
import {
  mobileScenarioSlugs,
  mobileScenariosDetail,
  type MobileScenarioSlug,
} from "../mobile-scenarios";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return mobileScenarioSlugs.map((slug) => ({ slug }));
}

export default async function MobileScenarioDetailPage({ params }: PageProps) {
  const { slug } = await params;
  if (!mobileScenarioSlugs.includes(slug as MobileScenarioSlug)) {
    notFound();
  }
  const scenario = mobileScenariosDetail[slug as MobileScenarioSlug];

  return (
    <div className="space-y-8">
      <div>
        <Link href="/mobile" className="text-sm text-indigo-400 hover:underline">
          ← Back to mobile scenarios
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">{scenario.title}</h1>
        <p className="mt-1 text-sm font-medium text-indigo-400">{scenario.subtitle}</p>
        <p className="mt-2 text-zinc-400">{scenario.description}</p>
      </div>

      <section className="rounded-xl border border-zinc-700 bg-zinc-900/80 p-6">
        <h2 className="text-lg font-semibold text-white">URL shape</h2>
        <p className="mt-2 font-mono text-sm text-zinc-300">{scenario.urlShape}</p>
        <h3 className="mt-4 text-sm font-medium uppercase tracking-wider text-zinc-500">
          Example URLs
        </h3>
        <ul className="mt-2 space-y-1 font-mono text-sm text-zinc-400">
          {scenario.urlExamples.map((url) => (
            <li key={url}>{url}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-zinc-700 bg-zinc-900/80 p-6">
        <h2 className="text-lg font-semibold text-white">Salesforce integration</h2>
        <p className="mt-2 text-sm text-zinc-300">
          User context (segment, which components to personalise) is always sourced from Salesforce.
          The app uses a mock API (<code className="rounded bg-zinc-800 px-1">GET /api/salesforce/user-context</code>)
          until real credentials are available. Mobile clients should resolve the user (e.g. from auth),
          then call the user-context API (or equivalent Salesforce API) to get segment and personalised
          component IDs before requesting scenario-specific resources.
        </p>
      </section>

      <section className="rounded-xl border border-zinc-700 bg-zinc-900/80 p-6">
        <h2 className="text-lg font-semibold text-white">Technical details</h2>
        <ol className="mt-2 list-inside list-decimal space-y-1.5 text-sm text-zinc-300">
          {scenario.technicalSteps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="rounded-xl border border-zinc-700 bg-zinc-900/80 p-6">
        <h2 className="text-lg font-semibold text-white">Vercel usage</h2>
        <ul className="mt-2 list-inside list-disc space-y-1.5 text-sm text-zinc-300">
          {scenario.vercelUsage.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
