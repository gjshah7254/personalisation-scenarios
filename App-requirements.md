Create a new app with latest NextJS app with APP router. 
Make sure you use eslint , prettier, tailwind.

Use best practices to create this new app. 

App will be deployed to vercel only. 

I want to understand what type of persoanlisation scenarios are possible in Nextjs and Vercel. 

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

All of my personalisation will happen based on a JSON mock file. So create some fake users and add some users to Segement A and Segment B. 

Add a button to change the user context for the user session. So I can see how content different between users. I should be able to browse the session as a user.
Add fake emails to identify users.


Create different page for each scenario. I want this app to explain my client how persoanlisation works with nextjs and Vercel.
