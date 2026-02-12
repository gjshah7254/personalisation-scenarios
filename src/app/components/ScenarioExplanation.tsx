interface ScenarioExplanationProps {
  title: string;
  middlewareUsed: boolean;
  contentServedFromCdn: boolean;
  contentServedFromCdnNote?: string;
  secondRequestFromCache: boolean;
  secondRequestFromCacheNote?: string;
  steps: (string | React.ReactNode)[];
  vercelUsage: string[];
}

export function ScenarioExplanation({
  title,
  middlewareUsed,
  contentServedFromCdn,
  contentServedFromCdnNote,
  secondRequestFromCache,
  secondRequestFromCacheNote,
  steps,
  vercelUsage,
}: ScenarioExplanationProps) {
  return (
    <section className="rounded-xl border border-zinc-700 bg-zinc-900/80 p-6">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="mt-2 flex flex-col gap-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">Middleware used for personalisation:</span>
          <span
            className={
              middlewareUsed
                ? "rounded bg-emerald-500/20 px-2 py-0.5 font-medium text-emerald-300"
                : "rounded bg-zinc-600/40 px-2 py-0.5 font-medium text-zinc-400"
            }
          >
            {middlewareUsed ? "Yes" : "No"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">Personalised content served from CDN cache:</span>
          <span
            className={
              contentServedFromCdn
                ? "rounded bg-emerald-500/20 px-2 py-0.5 font-medium text-emerald-300"
                : "rounded bg-zinc-600/40 px-2 py-0.5 font-medium text-zinc-400"
            }
          >
            {contentServedFromCdn ? "Yes" : "No"}
          </span>
          {contentServedFromCdnNote && (
            <span className="text-zinc-500">({contentServedFromCdnNote})</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">Second request (same user/segment) from CDN cache:</span>
          <span
            className={
              secondRequestFromCache
                ? "rounded bg-emerald-500/20 px-2 py-0.5 font-medium text-emerald-300"
                : "rounded bg-zinc-600/40 px-2 py-0.5 font-medium text-zinc-400"
            }
          >
            {secondRequestFromCache ? "Yes" : "No"}
          </span>
          {secondRequestFromCacheNote && (
            <span className="text-zinc-500">({secondRequestFromCacheNote})</span>
          )}
        </div>
      </div>
      <h3 className="mt-4 text-sm font-medium uppercase tracking-wider text-zinc-500">
        Technical steps
      </h3>
      <ol className="mt-2 list-inside list-decimal space-y-1.5 text-sm text-zinc-300">
        {steps.map((step, i) => (
          <li key={i} className="[&_a]:text-indigo-400 [&_a]:underline [&_a]:hover:text-indigo-300">
            {step}
          </li>
        ))}
      </ol>
      <h3 className="mt-6 text-sm font-medium uppercase tracking-wider text-zinc-500">
        Vercel usage
      </h3>
      <ul className="mt-2 list-inside list-disc space-y-1.5 text-sm text-zinc-300">
        {vercelUsage.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
