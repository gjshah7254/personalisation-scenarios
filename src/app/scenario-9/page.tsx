import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionFromCookie } from "@/lib/cookies";
import { getRequestBaseUrl } from "@/lib/get-request-base-url";
import { normaliseComponentParam } from "@/lib/normalise-component-param";
import { ScenarioExplanation } from "@/app/components/ScenarioExplanation";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Scenario9Page({ searchParams }: PageProps) {
  const baseUrl = await getRequestBaseUrl();
  const params = await searchParams;
  const componentParams = params.component;
  const rawComponents = Array.isArray(componentParams) ? componentParams : componentParams ? [componentParams] : [];
  const components = rawComponents.map((c) => normaliseComponentParam(String(c)));

  // Two fixed slots: default labels are Sample Component V2 and Sample Component V3.
  // When a matching rule is in the URL, show the replacement component instead.
  const componentV2Rule = "Sample Component V2-Sample Component V2 Replaced with new component";
  const componentV3Rule = "Sample Component V3-Sample Component V3 Replaced with new component";
  const slot1Label = components.includes(componentV2Rule) ? "Sample Component V2 Replaced with new component" : "Sample Component V2";
  const slot2Label = components.includes(componentV3Rule) ? "Sample Component V3 Replaced with new component" : "Sample Component V3";

  // Fallback: if we have session rules for /scenario-9 but no params (e.g. client-side nav skipped middleware rewrite), redirect with params
  if (components.length === 0) {
    const session = await getSessionFromCookie();
    const rules = session?.personalisationRules ?? [];
    const matchingRules = rules.filter((r) => {
      const urls = Array.isArray(r.pageUrls) ? r.pageUrls : [r.pageUrls];
      return urls.some((p) => p === "/scenario-9" || p === "/scenario-9/");
    });
    if (matchingRules.length > 0) {
      const query = matchingRules
        .map((r) => {
          const raw = r.componentName + "-" + r.componentReplacementName;
          const value = normaliseComponentParam(raw);
          return `component=${encodeURIComponent(value)}`;
        })
        .join("&");
      redirect(`/scenario-9?${query}`);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href="/" className="text-sm text-indigo-400 hover:underline">
          ← Back
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">
          Scenario 9: Session + middleware (page/component rules from mock data)
        </h1>
        <p className="mt-1 text-zinc-400">
          Set user session → mock &quot;Salesforce&quot; returns user context (segment + which pages/components
          to personalise). Stored in a session cookie. Middleware reads the cookie and adds the correct
          query params so the CDN can serve the right cached page.
        </p>
      </div>

      <div className="space-y-2">
        <div className="rounded border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 font-medium text-indigo-300">
          {slot1Label}
        </div>
        <div className="rounded border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 font-medium text-indigo-300">
          {slot2Label}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          Session & middleware-added params
        </h2>
        <p className="mt-3 text-sm text-zinc-300">
          Use <strong className="text-zinc-200">Login</strong> in the header to pick a user. That
          calls the mock API, gets user context (including personalisation rules for /scenario-9),
          and stores it in the session cookie. When you visit /scenario-9, middleware adds the
          component query params.
        </p>
        {components.length > 0 ? (
          <>
            <ul className="mt-4 space-y-1 font-mono text-sm text-indigo-300">
              {components.map((c) => (
                <li key={c}>component={c}</li>
              ))}
            </ul>
            <p className="mt-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
              Full URL used by middleware (rewrite target — used to fetch page content)
            </p>
            <p className="mt-1 break-all font-mono text-sm text-indigo-300">
              {baseUrl}/scenario-9?{components.map((c) => `component=${encodeURIComponent(c)}`).join("&")}
            </p>
            <a
              href={`${baseUrl}/scenario-9?${components.map((c) => `component=${encodeURIComponent(c)}`).join("&")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-indigo-400 underline hover:text-indigo-300"
            >
              Open this URL in a new tab
            </a>
          </>
        ) : (
          <p className="mt-4 text-zinc-500">
            No component params yet. Use Login to set a user session, then revisit /scenario-9.
          </p>
        )}
        <p className="mt-3 text-xs text-zinc-500">
          Segment A gets Sample Component V3 + Sample Component V2; segment B gets Sample Component V2
          (see salesforce-mock.json).
        </p>
      </div>

      <ScenarioExplanation
        title="How this scenario works"
        middlewareUsed={true}
        contentServedFromCdn={true}
        contentServedFromCdnNote="page can be static; CDN caches per URL + query string"
        secondRequestFromCache={true}
        secondRequestFromCacheNote="same user + same page = same query params = CDN cache hit"
        steps={[
          <>
            Set user session: use Login to pick a user. The client calls {" "}
            <a href={`${baseUrl}/api/set-user?email=alice%40enterprise.com`} target="_blank" rel="noopener noreferrer">
              {baseUrl}/api/set-user?email=alice@enterprise.com
            </a>
          </>,
          <>
            Server handling set-user fetches user context by calling above API 
            and Salesforce Mock API GET{" "}
            <a href={`${baseUrl}/api/mock/salesforce/segment-config?email=alice%40enterprise.com`} target="_blank" rel="noopener noreferrer">
              {baseUrl}/api/mock/salesforce/segment-config?email=alice@enterprise.com
            </a>{" "}
            (personalised per user — returns only that user&apos;s segment and rules). It builds segment + personalisationRules and returns Set-Cookie for personalisation-session.
          </>,
          <>
            Session started: the response from both APIs (user API and Salesforce API) are stored in the personalisation-session cookie.
          </>,
          <>
            You navigate to the scenario-9 page: browser requests GET{" "}
            <a href={`${baseUrl}/scenario-9`} target="_blank" rel="noopener noreferrer">
              {baseUrl}/scenario-9
            </a>{" "}. Middleware runs, reads the session cookie.
          </>,
          "Middleware finds rules whose pageUrls match /scenario-9 and adds query params: ?component=... (and more if multiple rules match).",
          <>
            Middleware rewrites the request to{" "}
            <a href={`${baseUrl}/scenario-9?component=Sample Component V2-Sample Component V2 Replaced with new component`} target="_blank" rel="noopener noreferrer">
              {baseUrl}/scenario-9?component=Sample Component V2-Sample Component V2 Replaced with new component
            </a>{" "}
            (etc.). The page receives the params and can be cached by CDN per that full URL.
          </>,
          <>
            Result: final URL is e.g.{" "}
            <a href={`${baseUrl}/scenario-9?component=Sample Component V2-Sample Component V2 Replaced with new component`} target="_blank" rel="noopener noreferrer">
              {baseUrl}/scenario-9?component=Sample Component V2-Sample Component V2 Replaced with new component
            </a>{" "}
            (or multiple component params). CDN caches the response for that URL. If the page loaded without params (e.g. client-side nav), the server redirects to the same URL with params using the session cookie.
          </>,
        ]}
        vercelUsage={[
          "Every request to /scenario-9: 1 Edge Middleware invocation (reads session cookie, adds query params, rewrites).",
          "Page response: served from CDN; cache key includes the full URL (path + component query params).",
          "Same user + same page = same component params = CDN cache hit on repeat visits.",
        ]}
      />
    </div>
  );
}
