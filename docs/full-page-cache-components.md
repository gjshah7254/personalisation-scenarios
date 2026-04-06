sequenceDiagram
    autonumber
    actor U as Web User
    participant B as Browser
    participant CDN as Vercel CDN
    participant APP as Vercel NextJs App
    participant SF as Salesforce
    participant CF as Contentful

    %% --- Single page request: no middleware ---
    U->>B: Navigate to /page
    B->>CDN: GET /page with playerID (cookie or header)
    Note over CDN: No middleware. Check edge cache for shell<br />if HIT serve, if MISS fetch from App
    CDN->>APP: GET /page (playerID only) [CDN MISS]

    APP->>APP: Lookup Salesforce user context by playerID
    alt User context exists in cache
        APP->>APP: Use cached Salesforce user context
    else User context not in cache
        APP->>SF: Get user context by playerID
        SF-->>APP: User context (segment, ctxKey, attributes)
        APP->>APP: Store user context in cache
    end

    alt Static shell only (no dynamic components)
        Note over APP: No playerID or Salesforce — shell is generic
        APP->>APP: Build static shell (header, footer, mule components, etc.)
        alt Shell content in app cache
            APP->>APP: Use cached shell content
        else Shell content cache MISS
            APP->>CF: Fetch content for static shell
            CF-->>APP: Content for shell (header, footer, etc.)
            APP->>APP: Store shell content in cache
        end
        APP-->>CDN: [Static] Shell response only
        CDN-->>B: [Static] Send shell only
        B-->>U: User sees shell (no streaming)
    else Stream (dynamic components present)
        Note over APP: Same request: shell first, then stream<br />Cache per component (e.g. use cache)
        Note over APP: For each personalised component on page:<br />lookup cache per component (keyed by user context)
        alt Component cache HIT (cached for this user context)
            APP->>APP: Use cached component output
        else Component cache MISS
            alt AB test exists for this page (SF user context has AB slug)
                APP->>CF: Fetch data using AB slug URL from SF context
                CF-->>APP: AB variant content for this component
            else No AB test for this page
                APP->>CF: Fetch data using default slug URL
                CF-->>APP: Default content for this component
            end
            APP->>APP: Load component, then cache it per component
        end
        APP->>APP: Render Cache Components (from cache or newly loaded)
        APP-->>CDN: [Stream] RSC/HTML chunks (Cache Components)
        CDN-->>B: [Stream] Send personalised sections
        B-->>U: Server-rendered personalised blocks appear
    end