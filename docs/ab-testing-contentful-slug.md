# Full-Page AB Testing via Contentful Slug URLs + Cache Components for Personalisation

No middleware and no variant routes. Salesforce user context includes AB slug mappings that tell the app which Contentful slug to fetch for each page under test. The app resolves the AB variant at the content layer by fetching a different Contentful slug per variant. Cache Components cache the output per slug so both variants are efficiently cached.

```mermaid
sequenceDiagram
    autonumber
    actor U as Web User
    participant B as Browser
    participant CDN as Vercel CDN
    participant APP as Vercel NextJs App
    participant SF as Salesforce
    participant CF as Contentful

    %% --- One-off login ---
    U->>B: Sign in
    B->>APP: POST /api/auth (playerID or credentials)
    APP->>SF: Get user context by playerID
    SF-->>APP: User context (segment, AB slug mappings per page)
    APP->>APP: Cache SF user context by playerID
    APP-->>B: Set-Cookie segment=A + Set-Cookie playerID
    Note over B,APP: Salesforce called once at session start.<br />Returns segment for personalisation<br />and AB slug mappings e.g.<br />/homepage uses slug homepage-variant-b<br />/products uses slug products-variant-b

    %% --- Page request: no middleware ---
    U->>B: Navigate to /page
    B->>CDN: GET /page with playerID (cookie or header)
    Note over CDN: No middleware. Check edge cache for shell.<br />If HIT serve, if MISS fetch from App.
    CDN->>APP: GET /page (playerID only) [CDN MISS]

    alt Static shell only (no dynamic components)
        Note over APP: No playerID or Salesforce - shell is generic
        APP->>APP: Build static shell (header, footer, 3rd party)
        alt Shell content in app cache
            APP->>APP: Use cached shell content
        else Shell content cache MISS
            APP->>CF: Fetch content for static shell
            CF-->>APP: Content for shell (nav, footer, etc.)
            APP->>APP: Store shell content in cache
        end
        APP-->>CDN: [Static] Shell response only
        CDN-->>B: [Static] Send shell only
        B-->>U: User sees shell (no streaming)
    else Stream (dynamic components present)
        Note over APP: Same request: shell first, then stream<br />Cache per component (e.g. use cache)

        APP->>APP: Lookup Salesforce user context by playerID
        alt User context exists in app cache
            APP->>APP: Use cached Salesforce user context
        else User context not in app cache
            APP->>SF: Get user context by playerID
            SF-->>APP: User context (segment, AB slug mappings)
            APP->>APP: Store user context in cache
        end

        Note over APP: Check SF context for AB slug override.<br />If /page has an AB slug mapping<br />use the AB slug for Contentful fetch.<br />Otherwise use default page slug.

        alt Page has AB slug in SF context
            APP->>APP: Resolve AB slug from SF context for this page
            Note over APP: e.g. /homepage maps to slug homepage-variant-b
        else No AB test for this page
            APP->>APP: Use default page slug
        end

        Note over APP: For each personalised component on page:<br />lookup cache per component<br />keyed by (slug + user context)
        alt Component cache HIT
            APP->>APP: Use cached component output
        else Component cache MISS
            APP->>CF: Fetch data using AB slug from Contentful
            CF-->>APP: AB variant content for this component
            APP->>APP: Cache component output per slug
        end
        APP->>APP: Render Cache Components (from cache or newly loaded)
        APP-->>CDN: [Stream] RSC/HTML chunks (Cache Components)
        CDN-->>B: [Stream] Send personalised sections
        B-->>U: Server-rendered personalised blocks appear
    end
```
