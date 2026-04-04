# Full-Page AB Testing with Vercel Flags SDK + Cache Components for Personalisation

Vercel Flags SDK replaces the manual cookie-based AB routing with its **precompute pattern**. Flags are defined in code via `flag()` from `flags/next`. The `decide` function reads the segment cookie (set at login by Salesforce) to choose the variant. Middleware calls `precompute()` which evaluates all flags and encodes the results into an encrypted URL segment. The page reads the precomputed code from `params.code` without re-evaluating flags, so it can stay static or use ISR.

Only one cookie is needed: the **segment cookie** serves both personalisation (Cache Components) and AB testing (Flags SDK).

```mermaid
sequenceDiagram
    autonumber
    actor U as Web User
    participant B as Browser
    participant MW as Vercel Edge Middleware<br />precompute via flags/next
    participant CDN as Vercel CDN
    participant APP as Vercel NextJs App
    participant SF as Salesforce
    participant CF as Contentful

    %% --- One-off login ---
    U->>B: Sign in
    B->>APP: POST /api/auth (playerID or credentials)
    APP->>SF: Get user context by playerID
    SF-->>APP: User context (segment)
    APP-->>B: Set-Cookie segment=A
    Note over B,APP: Salesforce called once at session start.<br />Single segment cookie set.<br />Used for both personalisation (Cache Components)<br />and AB testing (Flags SDK decide function).

    %% --- Page request with Flags SDK precompute ---
    U->>B: Navigate to /page
    B->>MW: GET /page with segment cookie and playerID

    MW->>MW: flag decide functions read segment cookie
    MW->>MW: precompute(flags) returns encrypted code
    MW->>CDN: Rewrite to /[code]/page (user sees clean /page URL)
    Note over MW,CDN: Flags SDK encrypts all flag values into a single code.<br />Each unique combination of flag states gets its own URL.<br />Pages without flags pass through unchanged.

    Note over CDN: Check edge cache for /[code]/page.<br />If HIT serve instantly.<br />If MISS fetch from App.
    CDN->>APP: GET /[code]/page (playerID only) [CDN MISS]

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

        Note over APP: Read AB variant from params.code<br />via await flag(code, flagGroup).<br />No re-evaluation of decide function.<br />Page can be static or ISR.

        APP->>APP: Lookup Salesforce user context by playerID
        alt User context exists in cache
            APP->>APP: Use cached Salesforce user context
        else User context not in cache
            APP->>SF: Get user context by playerID
            SF-->>APP: User context (segment, ctxKey, attributes)
            APP->>APP: Store user context in cache
        end

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
```
