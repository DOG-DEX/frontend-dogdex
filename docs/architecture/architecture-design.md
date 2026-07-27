# DogDex Frontend Architecture and Coding Contract

This is the frontend source of truth for developers and coding agents. It uses Next.js App Router and a feature-sliced structure.

## Source layout

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
  proxy.ts                       # locale routing proxy
```

`app` composes a view; it does not own business behavior. `features` own business behavior. `shared` never imports a feature.

## Dependency direction

```text
app -> features -> shared / lib
components -> shared / lib
features -> shared / lib
shared -> no feature imports
lib -> no React feature imports
```

If code needs to import from a sibling feature, move its reusable portion to `shared` or define a composition boundary in `app`.

## Decision table: where code belongs

| Need | Place it in | Do not put it in |
|---|---|---|
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

## Component and state rules

- A view composes feature components and a feature hook; it should not make raw API calls.
- Create a component when a visual unit is reused, independently testable, or makes a parent hard to read. Do not split simple markup into one-file components merely to reduce line count.
- Create a custom hook when state/effects/event orchestration are reused or obscure the view. A pure formatter remains a utility.
- Use server components by default. Add `'use client'` only for browser APIs, event handlers, client state, or client-only libraries.
- Keep browser-only storage access behind a service/hook and guard it from SSR (`typeof window !== 'undefined'`).
- Do not mirror derived props in state; derive them during render with `useMemo` only when calculation is expensive.

## API contract rules

The Nest backend returns success as `{ data: ... }` and standardized error payloads. `src/lib/api.ts` is the one client responsible for base URL, authentication header, unwrapping, and error conversion.

```ts
// service: maps backend payload to the feature UI contract
export const dogsService = {
  async listBreeds(): Promise<Breed[]> {
    const result = await apiFetch<BreedListPayload>('/api/wiki/dogs');
    return result.data.map(toBreed);
  },
};
```

Rules:

- No raw `fetch` in a view or reusable component.
- Never expose a backend Mongo document directly as a UI type; map it in the service.
- A service throws an `Error` with a user-safe message; the view decides how to render toast, inline error, retry, or empty state.
- Protected calls pass `requiresAuth: true`; do not manually repeat authorization headers.
- When a feature needs refresh-token handling, add it once to the API/auth boundary, not to every service.

## Errors, loading, and form validation

- Route-wide rendering failures: `app/**/error.tsx`.
- Route-wide loading: `app/**/loading.tsx`.
- Expected API/form errors: feature view/hook state with accessible inline feedback or toast.
- Client validation improves UX; backend DTO validation remains authoritative.
- Every async screen needs loading, empty, error, and success states before it is called implemented.

## Naming conventions

| Kind | Convention | Example |
|---|---|---|
| Component / view | PascalCase | `ScanView.tsx` |
| Hook | `use` + camelCase | `useScanUpload.ts` |
| Service | camelCase + `.service.ts` | `scan.service.ts` |
| Feature API payload | PascalCase + suffix | `PredictionSubmission` |
| Generic utility | camelCase | `formatDate.ts` |

## Definition of done

- [ ] Route remains a thin wrapper around a feature view.
- [ ] API call lives in a feature service and uses `apiFetch`.
- [ ] UI has loading, error, empty, and success states where applicable.
- [ ] Types are placed at the narrowest valid scope.
- [ ] New copy is localized.
- [ ] No secret is exposed through `NEXT_PUBLIC_*` unless it is intentionally public.
- [ ] `npm run lint`, `npm run build`, and `pnpm audit --prod` pass.
- [ ] Update feature progress docs when route/capability status changes.
