# DOG DEX — Frontend Architecture

## Overview

The application follows a **feature-sliced design** mapped to the Next.js App Router paradigm, ensuring scalability, maintainability, and reusability. Adapted from the Pure Evil Store frontend architecture.

---

## Directory Structure

```txt
src/
├── app/                  # Routing, layouts, and globals.css
├── components/           # Global composite UI (SiteNav, SiteFooter, etc.)
├── features/             # Isolated business logic modules
├── i18n/                 # next-intl configuration (routing.ts, request.ts)
├── lib/                  # Core utilities and API/infrastructure clients
├── shared/               # Primitive UI elements, constants, shared hooks
└── proxy.ts              # Next.js proxy (next-intl rewrite & x-pathname header)
```

---

### 1. `app/` (Next.js App Router)

Responsible ONLY for routing, layouts, metadata, and rendering boundaries.

- `/api`: Backend route handlers.
- `/[locale]`: Internationalized route segments.
- `layout.tsx`: Global root layout.
- `page.tsx`: Landing page wrapper.
- `globals.css`: Global tailwind config and root styling variables.

*Rule:* NEVER place complex business logic directly inside routes. Keep pages as thin wrappers.

```tsx
import { ScanView } from "@/features/scan/views/ScanView";

export default function ScanPage() {
  return <ScanView />;
}
```

---

### 2. `features/` (Business Logic Modules)

| Feature | Purpose |
|---------|---------|
| `auth/` | Authentication (login, register, session) |
| `dogs/` | Breed dex — browse and collection |
| `scan/` | Upload photo, identify breed |
| `profile/` | User profile and scan statistics |
| `home/` | Landing page |

Each feature folder houses:

- `components/` — Feature-specific UI
- `views/` — Full page views (e.g., `ScanView.tsx`)
- `hooks/` — Feature-specific logic hooks
- `services/` — API calls (e.g., `scan.service.ts`)
- `messages/` — Localization (`en.json`, `vi.json`)
- `styles/` — Feature-specific CSS

*Rule:* Features MUST NOT tightly couple to each other. Use shared types in `shared/types/`.

---

### 3. `components/` (Global Composite UI)

- `SiteNav.tsx`, `SiteFooter.tsx`
- `messages/` — Shared localization for layout chrome

---

### 4. `shared/` (Design System Foundations)

- `ui/` — Design system primitives
- `hooks/` — Global reusable hooks (e.g., `useMediaQuery.ts`)
- `constants/` — Global constants
- `types/` — Shared TypeScript interfaces

---

### 5. `lib/` (Infrastructure Layer)

- `env.ts` — Environment variables
- `utils.ts` — Tailwind merge, classnames

---

## Internationalization (i18n)

1. **Colocated translations** in feature `messages/` folders.
2. **`src/i18n/request.ts`** dynamically imports common + feature messages based on `x-pathname` from middleware.

---

## Naming Conventions

| Kind | Convention | Example |
|------|------------|---------|
| Components & views | PascalCase | `ScanView.tsx` |
| Hooks | camelCase + `use` | `useScanUpload.ts` |
| Services | camelCase + `.service.ts` | `scan.service.ts` |
| Docs | kebab-case | `architecture-design.md` |

---

## AI Agent Coding Rules

1. **NEVER** place business logic inside app routes.
2. **ALWAYS** isolate feature-specific logic inside `features/[feature]`.
3. **KEEP** components focused and small (ideally 50–150 LOC).
4. **USE** absolute path imports (`@/shared/...`, `@/features/...`).
5. **NEVER** commit secrets or API keys.

---

## Route map

| Path | Feature | View |
|------|---------|------|
| `/` | home | `HomeView` |
| `/login` | auth | `LoginView` |
| `/register` | auth | `RegisterView` |
| `/dex` | dogs | `DexView` |
| `/scan` | scan | `ScanView` |
| `/profile` | profile | `ProfileView` |

All routes are prefixed with locale: `/en/...`, `/vi/...`.
