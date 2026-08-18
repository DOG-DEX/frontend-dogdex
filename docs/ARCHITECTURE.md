# DogDex Frontend Architecture and Coding Contract

This is the frontend source of truth for developers and coding agents. It uses Next.js App Router and a feature-sliced structure.

---

## 1. System Topology Overview

```text
+-------------------+        HTTP/JSON (JWT Cookie)       +-------------------+
|    Next.js FE     | ----------------------------------> |    NestJS API     |
|   (App Router)    | <---------------------------------- | (Feature Modules) |
+-------------------+         SWR Hydration (0ms)         +-------------------+
          |                                                         |
          v                                                         v
+-------------------+                                     +-------------------+
|  Client RAM/Disk  |                                     | MongoDB + Redis   |
| (Tiles/GPS/Dex)   |                                     | (Durable State)   |
+-------------------+                                     +-------------------+
```

---

## 2. Source Layout

```text
src/
  app/                           # routes, layouts, metadata, loading/error boundaries
  components/                    # global composite UI: navigation, footer, providers
  features/<feature>/
    components/                  # feature-only presentation components
    hooks/                       # feature state/effects
    messages/                    # feature i18n messages
    services/                    # feature API functions
    types/                       # feature-only contracts
    views/                       # complete route-level UI
  i18n/                          # next-intl routing and request configuration
  lib/                           # infrastructure: env, api client, generic utilities
  shared/
    constants/ hooks/ types/ ui/ # reusable, feature-independent code
```

`app` composes a view; it does not own business behavior. `features` own business behavior. `shared` never imports a feature.

---

## 3. Dependency Direction

```text
app -> features -> shared / lib
components -> shared / lib
features -> shared / lib
shared -> no feature imports
lib -> no React feature imports
```

If code needs to import from a sibling feature, move its reusable portion to `shared` or define a composition boundary in `app`.

---

## 4. Decision Table: Where Code Belongs

| Need | Place it in | Do not put it in |
| :--- | :--- | :--- |
| URL, route layout, page metadata | `app/` | Feature services/components |
| A complete screen for one business area | `features/<feature>/views` | `app/page.tsx` |
| UI reused only by one feature | `features/<feature>/components` | `shared/ui` |
| UI reusable without business knowledge | `shared/ui` | A feature folder |
| API request and mapping to UI contract | `features/<feature>/services` using `lib/api.ts` | A component or view |
| API base URL, headers, error unwrapping | `lib/api.ts`, `lib/env.ts` | Every individual service |
| Stateful/effectful behavior reused in one feature | `features/<feature>/hooks` | A large view component |
| Generic reusable hook | `shared/hooks` | Feature folder |
| Feature-only TypeScript type | `features/<feature>/types` | `shared/types` too early |
| Type shared by two or more independent features | `shared/types` | Duplicate type declarations |
| Translation copy | feature/global `messages` | Inline strings in components |

---

## 5. Component and State Rules

- A view composes feature components and a feature hook; it should not make raw API calls.
- Encapsulate all API logic strictly inside Service layer (`dogs.service.ts`, `auth.service.ts`, `scan.service.ts`).
- Create a component when a visual unit is reused, independently testable, or makes a parent hard to read. Do not split simple markup into one-file components merely to reduce line count.
- Use server components by default. Add `'use client'` only for browser APIs, event handlers, client state, or client-only libraries.
- Never use emojis or icons in markdown documentation files.
