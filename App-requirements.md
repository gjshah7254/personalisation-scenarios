##New APP Requirement##
Create a new app with latest NextJS app with APP router. 
Make sure you use eslint , prettier, tailwind.
Use best practices to create this new app. 
App will be deployed to vercel only. 

##Features##
I want to understand what type of persoanlisation scenarios are possible in Nextjs and Vercel. 

##Scenarios##
Scenario 1:
Serverside persoanlised component. Page loads on the server (RSC). You read cookie / session. You decide what variant of component to render. Output is streamed as a Server Component.

Scenario 2:
Client side persoanlised component.Page is static (fast + CDN cached). Personalization happens in the browser.

Scenario 3:
Whole page personalised at vercel middleware based on user segment. During Vercel build, page should be pre-generated based on Segment. All pages should be CDN cached based on segment. 
Middleware runs before the page exists. Detects segment (cookie, geo, header). Rewrites the request to a segment-specific static file like this /page?segment=enterprise

Scenario 4:
Middleware + Server Component Hybrid (personalized shell + server-rendered sections) . Middleware determines segment. Page is static shell. Server Component fetches segment-based data. Cache can be configured per segment.

Scenario 5:
Streaming + Partial Personalization (RSC streaming) - You can stream the initial static page instantly/. Then stream in personalized sections server-side.

Scenario 6:
SSG with embedded variants (client reveals one)
One static page is built at build time. It contains both Segment A and Segment B content in the HTML (e.g. two blocks or a data structure). A client component reads the segment from the existing cookie (personalisation-segment, already set by the user switcher) and only displays the matching variant (e.g. by toggling visibility or picking from embedded data). No middleware, no serverless for the page, no /api/me call.

Scenario 7: Client-side 1:1 with cached API
Page is SSG. Client gets current user (e.g. from existing /api/me or a dedicated endpoint). A user-specific content API (e.g. GET /api/user-content that reads userId from cookie and returns content for that user) sets Cache-Control with a short s-maxage (and optionally stale-while-revalidate) so the response is cached at the edge per user. 

##Extras##
All of my personalisation will happen based on a JSON mock file. So create some fake users and add some users to Segement A and Segment B. 

Add a button to change the user context for the user session. So I can see how content different between users. I should be able to browse the session as a user. Add fake emails to identify users.

Create different page for each scenario. I want this app to explain my client how persoanlisation works with nextjs and Vercel.

On All the Scenario pages add another sample component which is a static component and built at build time. 
On all the Scenarios , can you add extra explanation at the bottom of the page that explains how this component. Add details like Whether Middleware was used or not for personalising. what about the second request which is from the user? will that be served from cache mention that too in technical details. 
Give technical steps for persoanlisation.

In each scenario, below technical details add Vercel Usage section. this should tell what type of usage will this page/persoanlisation do for Vercel.