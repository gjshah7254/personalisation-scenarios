sequenceDiagram
    autonumber
    actor U as Web User
    participant B as Browser
    participant MW as Vercel Edge Middleware
    participant CDN as Vercel CDN
    participant APP as Vercel NextJs App
    participant SF as Salesforce
    participant CF as Contentful

    %% --- Seed AB cookie + cache full Salesforce user context (only if ab-tests cookie missing) ---
    U->>B: Sign in
    alt No ab-tests cookie
        B->>APP: POST /api/salesforce/ab-tests-cookie (cookie: playerID)
        alt No Salesforce user context in app cache for this playerID
            APP->>SF: Fetch user context (full context for personalisation)
            SF-->>APP: Full Salesforce user context
            APP->>APP: Cache entire user context in app cache (per playerID)
        else Salesforce user context already in app cache (per playerID)
            APP->>APP: Use cached Salesforce user context
        end
        APP-->>B: Set-Cookie ab-tests JSON (AB assignments only)
    else ab-tests cookie already set
        Note over B,APP: Skip POST /api/salesforce/ab-tests-cookie as AB Tests values already in cookie.
    end

    %% --- Page request with AB check ---
    U->>B: Navigate to /page
    B->>MW: GET /page with cookies (ab-tests, playerID)

    alt Page has active AB test (found in ab-tests cookie)
        MW->>MW: Read ab-tests cookie and find variant for /page
        MW->>CDN: Rewrite to /page-variant-B (variant route)
    else No AB test for this page
        MW->>CDN: Pass through unchanged (GET /page)
    end

    Note over CDN: Check edge cache for URL. <br />If HIT serve static shell instantly.<br />If MISS fetch from App.
    CDN->>APP: GET /page or /page-variant-B (playerID only) [CDN MISS]

    alt Static shell only (no dynamic components)
        Note over APP: No playerID or Salesforce - shell is generic
        APP->>APP: Build static shell (header, footer, mule components, 3rd party)
        alt Shell content in app cache
            APP->>APP: Use cached shell content
        else Shell content cache MISS
            APP->>CF: Fetch content for static shell
            CF-->>APP: Content for shell (header, footer, mule components, etc.)
            APP->>APP: Store shell content in cache
        end
        APP-->>CDN: [Static] Shell response only
        CDN-->>B: [Static] Send shell only
        B-->>U: User sees shell (no streaming)
    else Stream (dynamic components present)
        Note over APP: Same request: shell first, then stream<br />Cache per component (e.g. use cache)

        APP->>APP: Lookup Salesforce user context by playerID
        alt User context exists in cache
            APP->>APP: Use cached Salesforce user context
        else User context not in cache
            APP->>SF: Get user context by playerID
            SF-->>APP: User context (segment, ctxKey, attributes)
            APP->>APP: Store user context in cache
        end

        Note over APP: If AB page: parse variant from rewritten URL.<br />Use Cache Component with variant as input<br />for page layout (cached per variant).

        Note over APP: For each personalised component on page:<br />lookup cache per component (keyed by user context)
        alt Component cache HIT (cached for this user context)
            APP->>APP: Use cached component output
        else Component cache MISS
            APP->>CF: Fetch data for this component (Contentful)
            CF-->>APP: Component data
            APP->>APP: Load component, then cache it per component
        end
        APP->>APP: Render Cache Components (from cache or newly loaded)
        APP-->>CDN: [Stream] RSC/HTML chunks (Cache Components)
        CDN-->>B: [Stream] Send personalised sections
        B-->>U: Server-rendered personalised blocks appear
    end