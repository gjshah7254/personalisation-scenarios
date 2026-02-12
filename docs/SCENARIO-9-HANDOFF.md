# Scenario 9: Session + Middleware (Page/Component Rules) — Handoff Document

A detailed specification and implementation guide so another project can replicate the same behaviour.

---

## 1. Summary

**Scenario 9** personalises page content using **session-based rules** from a backend (here, a mock “Salesforce” API). The flow is:

1. **User identity** is set via “Login” (e.g. `GET /api/set-user?email=...`). The server fetches the user and their **personalisation rules** (which pages, which component slots to replace).
2. **Session cookie** stores segment and a list of **personalisation rules** (page URLs + component name → replacement name).
3. When the user visits a **target page** (e.g. `/scenario-9`), **Edge Middleware** runs, reads the session cookie, finds rules whose `pageUrls` match the request path, and **rewrites** the request to the same path with **query params** added: one `component` param per rule.
4. The **page** reads those `component` params and, for each “slot”, shows either the **default** component or the **replacement** component. The full URL (path + query) is the **cache key**, so a CDN can cache different variants per user/segment.

**Outcome:** Same route (e.g. `/scenario-9`) serves different content depending on session rules; the variant is encoded in the URL so CDN caching works correctly.

---

## 2. Description

### 2.1 What it does

- **Identity:** User is identified by **email** (no user ID). Email is stored in a cookie after “Login”.
- **Rules source:** A “Salesforce” API (mock here) returns, per user (by email), a **segment** (e.g. A or B) and a list of **personalisation rules**. Each rule says: “On these page URLs, replace this component name with this replacement component name.”
- **Session:** The set-user API writes a **session cookie** containing segment and the full list of personalisation rules (so middleware doesn’t need to call Salesforce on every request).
- **Middleware:** On requests to the target path (e.g. `/scenario-9`), middleware reads the session cookie, filters rules by `pageUrls`, and rewrites to the same path with `?component=...` (and possibly multiple `component` params).
- **Page:** The page always has a fixed set of “slots” (e.g. two). For each slot, if the corresponding rule appears in the URL’s `component` params, the slot shows the **replacement**; otherwise it shows the **default**. Optional: if the user lands without params but has session rules, the page can **redirect** to itself with the correct `component` params (so client-side nav doesn’t skip middleware).

### 2.2 User flow

1. User clicks **Login** and picks a user (e.g. Alice). Client calls `GET /api/set-user?email=alice@enterprise.com`.
2. Set-user API loads user by email, calls Salesforce segment-config by email, gets segment + personalisation rules, and sets three cookies: user email, segment, and session (segment + rules).
3. User navigates to `/scenario-9`. Browser sends `GET /scenario-9` with the session cookie.
4. Middleware runs, parses session, finds rules for `/scenario-9`, builds `component` values (e.g. `Sample Component V2|Sample Component V2 Replaced with new component`) and rewrites to `GET /scenario-9?component=...&component=...`.
5. Page loads with search params; it normalises and reads `component` params, decides per-slot default vs replacement, and renders. CDN can cache this response by full URL.

### 2.3 Design decisions

- **Email as identifier:** All APIs and cookies use email (no numeric/user ID) for the current user.
- **Pipe separator in URL:** The value of each `component` param is `componentName|componentReplacementName` so that component names can safely contain hyphens (e.g. `DashboardHeroBanner-Premium`).
- **Session holds full rules:** Middleware does not call Salesforce; it only reads the session cookie. Set-user is the only place that calls Salesforce and writes the session.
- **Rewrite, not redirect:** Middleware **rewrites** the request to the same path with added query params so the URL bar can show the final URL and the cache key is path + query.

---

## 3. Technical steps (end-to-end)

### 3.1 Set user session (Login)

| Step | Actor | Action |
|------|--------|--------|
| 1 | Client | User selects a user; client calls `GET /api/set-user?email={email}` (e.g. `email=alice@enterprise.com`). |
| 2 | Set-user API | Reads `email` from query. Calls **users API** to get user by email. |
| 3 | Set-user API | Calls **Salesforce segment-config API** with same email: `GET /api/mock/salesforce/segment-config?email={email}`. |
| 4 | Segment-config API | Looks up user’s segment and `personalisationRulesBySegment[segment]` in mock data; returns `{ segment, personalisationRules }`. |
| 5 | Set-user API | Builds session payload `{ segment, personalisationRules }`. Responds with `Set-Cookie` for: `personalisation-user-email`, `personalisation-segment`, `personalisation-session` (JSON string). |

**API contracts:**

- **GET /api/set-user?email=...**
  - Success: `200` + Set-Cookie headers.
  - Missing email: `400`.
  - User not found: `404`.

- **GET /api/mock/users/by-email?email=...**
  - Returns `{ user: { email, name } }`.

- **GET /api/mock/salesforce/segment-config?email=...**
  - Returns `{ segment: "A" | "B", personalisationRules: PersonalisationRule[] }`.
  - Each rule: `{ pageUrls: string[], componentName: string, componentReplacementName: string }`.

### 3.2 Visit target page (e.g. /scenario-9)

| Step | Actor | Action |
|------|--------|--------|
| 1 | Browser | Requests `GET /scenario-9` (or `GET /scenario-9/`) with cookies. |
| 2 | Middleware | Matches path `/scenario-9` or `/scenario-9/`. Reads `personalisation-session` cookie. |
| 3 | Middleware | Parses cookie as JSON → `{ segment, personalisationRules }`. Filters rules where `pageUrls` includes current path (e.g. `/scenario-9`). |
| 4 | Middleware | For each matching rule, builds value `componentName + "|" + componentReplacementName`, optionally normalises (legacy formats), appends `component={value}` to the request URL. |
| 5 | Middleware | Rewrites request to same path with new search params; request continues to the page. |
| 6 | Page (RSC) | Receives `searchParams.component` (string or string[]). Normalises each value, then for each “slot” checks if the corresponding rule value is present: if yes, show replacement; else show default. |
| 7 | (Optional) | If `component` is empty but session has rules for this page, page issues a **redirect** to `/scenario-9?component=...` so the next load has params (e.g. after client-side nav). |

### 3.3 Component param format

- **Single param value:** `componentName|componentReplacementName` (pipe separator; no hyphen so names can contain hyphens).
- **Multiple rules:** Multiple query params with the same name: `?component=...&component=...`.
- **Encoding:** Values are URL-encoded (e.g. spaces → `%20`, `|` → `%7C`).

Example:

- Rule: `{ pageUrls: ["/scenario-9"], componentName: "Sample Component V2", componentReplacementName: "Sample Component V2 Replaced with new component" }`
- Param value: `Sample Component V2|Sample Component V2 Replaced with new component`
- URL: `/scenario-9?component=Sample%20Component%20V2%7CSample%20Component%20V2%20Replaced%20with%20new%20component`

---

## 4. Mocks and data

### 4.1 Users mock

- **Source:** JSON file (e.g. `src/data/users.json`) or HTTP API that returns users by email.
- **Shape:** List of users: `{ email: string, name: string }`. Email is the unique identifier; no `id` field required for Scenario 9.

Example `users.json`:

```json
{
  "users": [
    { "email": "alice@enterprise.com", "name": "Alice Chen" },
    { "email": "bob@startup.io", "name": "Bob Martinez" }
  ]
}
```

- **API:** `GET /api/mock/users/by-email?email=...` → `{ user: { email, name } }` or 404.

### 4.2 Salesforce mock (segment + rules)

- **Source:** JSON file (e.g. `src/data/salesforce-mock.json`) used by the segment-config API.
- **Contents:**
  - **userSegments:** `Record<email, "A" | "B">` — which segment each user is in.
  - **personalisationRulesBySegment:** `Record<"A"|"B", PersonalisationRule[]>` — per-segment list of rules.

**PersonalisationRule:**

- `pageUrls`: array of paths (e.g. `["/scenario-9"]`) that this rule applies to. Middleware matches request path to these (exact or prefix).
- `componentName`: default component identifier (e.g. `"Sample Component V2"`).
- `componentReplacementName`: replacement component identifier when the rule applies (e.g. `"Sample Component V2 Replaced with new component"`).

Example `salesforce-mock.json` (minimal for Scenario 9):

```json
{
  "userSegments": {
    "alice@enterprise.com": "A",
    "bob@startup.io": "B"
  },
  "personalisationRulesBySegment": {
    "A": [
      { "pageUrls": ["/scenario-9"], "componentName": "Sample Component V3", "componentReplacementName": "Sample Component V3 Replaced with new component" },
      { "pageUrls": ["/scenario-9"], "componentName": "Sample Component V2", "componentReplacementName": "Sample Component V2 Replaced with new component" }
    ],
    "B": [
      { "pageUrls": ["/scenario-9"], "componentName": "Sample Component V2", "componentReplacementName": "Sample Component V2 Replaced with new component" }
    ]
  }
}
```

- **API:** `GET /api/mock/salesforce/segment-config?email=...` → `{ segment, personalisationRules }` for that user only (segment from `userSegments[email]`, rules from `personalisationRulesBySegment[segment]`).

### 4.3 No other mocks required for Scenario 9

- A separate “segment-personalised-components” list (block IDs per segment) is **not** required for Scenario 9; that is used by other scenarios. Scenario 9 only needs **segment** and **personalisationRules** from the Salesforce mock.

---

## 5. Cookies

All cookies use `path: "/"` and a long `maxAge` (e.g. 7 days); `httpOnly` can be false if the client needs to read (e.g. for display). Names are constants so middleware (Edge) and server can share them.

| Cookie name | Purpose |
|-------------|---------|
| `personalisation-user-email` | Current user’s email (identifier). |
| `personalisation-segment` | Current user’s segment (e.g. "A" or "B"). |
| `personalisation-session` | JSON string: `{ segment, personalisationRules }`. **Only this one is read by Scenario 9 middleware.** |

Middleware must **not** import server-only modules (e.g. `cookies()` from `next/headers`). Cookie **names** are defined in a small shared module (e.g. `lib/cookie-names.ts`) that only exports strings.

---

## 6. Types (TypeScript)

```ts
type Segment = "A" | "B";

interface PersonalisationRule {
  pageUrls: string[];  // e.g. ["/scenario-9"]
  componentName: string;
  componentReplacementName: string;
}

interface PersonalisationSession {
  segment: Segment;
  personalisationRules: PersonalisationRule[];
}
```

- **PersonalisationRule:** One rule from Salesforce; used in session and in segment-config response.
- **PersonalisationSession:** Exact shape stored in the `personalisation-session` cookie and read by middleware.

---

## 7. Key files and their roles

| File / area | Role |
|-------------|------|
| **Cookie names** | Define `USER_EMAIL_COOKIE`, `SEGMENT_COOKIE`, `SESSION_COOKIE` (strings only; usable in Edge). |
| **Set-user API** | GET with `?email=...`; fetches user + segment-config; sets the three cookies. |
| **Segment-config API** | GET with `?email=...`; reads salesforce-mock (userSegments + personalisationRulesBySegment); returns segment + personalisationRules for that user. |
| **Middleware** | For `/scenario-9` (and `/scenario-9/`): read SESSION_COOKIE, parse, filter rules by path, append `component=...` (pipe-separated), rewrite. |
| **Component param helper** | `buildComponentParamValue(name, replacement)` → `name|replacement`; `normaliseComponentParam(value)` for legacy hyphen format → pipe format. |
| **Scenario 9 page** | Read `searchParams.component`; normalise; define “slots” and which rule value maps to which slot; if no params but session has rules, redirect with params; render default vs replacement per slot. |
| **Salesforce lib** | Optional: `getSalesforceUserContext(email)` used by set-user; can call segment-config API or fallback to reading mock JSON. |

---

## 8. Middleware logic (pseudocode)

```
if pathname is /scenario-9 or /scenario-9/:
  sessionCookie = request.cookies.get(SESSION_COOKIE)
  if not sessionCookie: next()
  session = JSON.parse(sessionCookie)  // { segment, personalisationRules }
  url = clone request URL
  for each rule in session.personalisationRules:
    if pathname matches rule.pageUrls (exact or prefix):
      value = buildComponentParamValue(rule.componentName, rule.componentReplacementName)
      value = normaliseComponentParam(value)   // optional: legacy → pipe
      url.searchParams.append("component", value)
  if any param was added:
    return rewrite(url)
return next()
```

Path matching: treat `rule.pageUrls` as an array; for each entry, match `pathname === p` or `pathname.startsWith(p + "/")`.

---

## 9. Page logic (Scenario 9)

- Read `searchParams.component` (may be string or string[]).
- Normalise each value (so legacy hyphen form becomes pipe form).
- Define slot rules, e.g.:
  - Slot 1: default "Sample Component V2"; rule value `"Sample Component V2|Sample Component V2 Replaced with new component"` → show "Sample Component V2 Replaced with new component".
  - Slot 2: default "Sample Component V3"; rule value `"Sample Component V3|Sample Component V3 Replaced with new component"` → show "Sample Component V3 Replaced with new component".
- If `components.length === 0` but session has rules for this page: build same `component=...` query from session rules and **redirect** to current path with that query (so middleware-run or direct load gets params next time).
- Render one block per slot with the chosen label (default or replacement).

---

## 10. Clear session

- **API:** `GET /api/clear-session` clears the three cookies (set to empty, `maxAge: 0`) and redirects to `/` (home).
- **UI:** e.g. “Clear cookies & start new session” in the Login dropdown; link to `/api/clear-session` with `target="_self"` so redirect is followed in the same tab.

---

## 11. Checklist for another project

- [ ] **Identity:** Use email as the only user identifier (no user ID in URLs or cookies for this flow).
- [ ] **Users:** Mock or real API that returns a user by email: `{ email, name }`.
- [ ] **Salesforce mock:** JSON (or API) with `userSegments` (email → segment) and `personalisationRulesBySegment` (segment → list of `{ pageUrls, componentName, componentReplacementName }`).
- [ ] **Segment-config API:** GET with `?email=...`, returns `{ segment, personalisationRules }` for that user.
- [ ] **Set-user API:** GET with `?email=...`; fetch user + segment-config; set cookies: user email, segment, session (segment + personalisationRules).
- [ ] **Cookie names:** Shared constants; session cookie holds JSON `PersonalisationSession`.
- [ ] **Middleware:** On target path(s), read session cookie, filter rules by path, append `component=componentName|componentReplacementName` for each match, rewrite.
- [ ] **Component param:** Use `|` between component name and replacement name; support multiple `component` params.
- [ ] **Page:** Read and normalise `component` params; implement slots (default vs replacement); optional redirect when no params but session has rules.
- [ ] **Clear-session:** Endpoint that clears cookies and redirects to home.
- [ ] **Optional:** Normalise legacy hyphen-separated values to pipe format for backward compatibility.

---

## 12. API summary (Scenario 9 only)

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/api/set-user?email=...` | Set user session; calls users + segment-config; sets cookies. |
| GET | `/api/mock/users/by-email?email=...` | Get user by email (mock). |
| GET | `/api/mock/salesforce/segment-config?email=...` | Get segment + personalisationRules for user (mock). |
| GET | `/api/clear-session` | Clear personalisation cookies; redirect to /. |

Middleware runs on each request to `/scenario-9` (and `/scenario-9/`); no separate “middleware API”.

---

*End of Scenario 9 handoff document.*
