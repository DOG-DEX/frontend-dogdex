# DogDex Frontend Agent Rules & Hard Constraints

This document is the workspace customization root (`AGENTS.md`) for AI agent assistance across the DogDex frontend workspace.
Read [docs/START_HERE.md](docs/START_HERE.md), [docs/AGENT_GUIDE.md](docs/AGENT_GUIDE.md), and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) before making code changes.

---

## 1. Core Project Hard Constraints

1. **Service Layer Encapsulation**: All API communications, data transformations, and state updates MUST reside inside Service modules (`dogs.service.ts`, `auth.service.ts`, `scan.service.ts`). View components (`src/features/*/views`) must only render UI and call Service methods (media URL resolution at endpoint boundaries is permitted).
2. **No Raw Fetch in Views**: Always use `src/lib/api.ts` for backend requests; never add raw `fetch()` or `axios()` calls directly inside UI views or components.
3. **0ms Client-Side SWR Caching**: Hydrate map tiles, GPS state, and Dex collection status from client-side `localStorage`/RAM tile ring buffer (`keepBuffer: 16`) for 0ms initial load.
4. **WebRTC Camera Stream Architecture**: In `ScanView.tsx`, use persistent refs (`streamRef`, `facingModeRef`, `isStreamingRef`) and a centralized `cleanupCameraResources()` for teardown to guarantee zero hardware stream leaks.
5. **No Emojis or Icons in Markdown**: Do NOT use unicode emojis or icons in any markdown (.md) documentation file. Keep markdown clean, structured, and versioning-friendly.
6. **Append-Only Documentation Preservation**: Never delete previous .md documentation files or historical decisions. Proactively summarize existing context and append updates.
7. **Environment Variable Hygiene**: Never hardcode secrets, Cloudinary cloud names (e.g. `'dtlp3p1sa'`), API keys, or backend URLs. Always consume via `src/lib/env.ts` or `process.env`.

---

## 2. Conventional Commit Standards & Scope Rules

Format: `<type>(<scope>): <subject>`

### Types
- `feat`: New user-facing feature or component capability.
- `fix`: Bug fix.
- `refactor`: Code restructuring without logic or feature changes.
- `docs`: Documentation updates only.
- `style`: UI design, CSS tokens, or layout formatting changes.
- `test`: Unit or integration test additions.
- `chore`: Configuration, build scripts, or dependency updates.

### Scope Rules
- **Rule**: The `<scope>` MUST represent the specific component, view, hook, or utility function being modified. Do NOT use broad macro module names (like `dogs` or `scan`) as scope.
- **Frontend Examples**:
  - `feat(radar-map): add leaflet full-screen map with 0ms SWR tile pre-fetcher`
  - `feat(find-view): add discrete percentage zoom snap and chevron card navigation`
  - `feat(dex-grid): prioritize user first encounter photo thumbnail on unlocked breeds`
  - `feat(camera-viewfinder): add WebRTC live streamRef management and flip camera control`
  - `feat(public-pet-scan): add emergency rescue owner contact landing page`
  - `feat(pet-modal): add create pet modal with avatar upload`
  - `docs(adr): add architecture decision records ADR-001 to ADR-006`
  - `chore(site-nav): add single-line nav tabs and scan route configuration`

---

## 3. Git Branching & Integration Strategy

1. **Feature-Based Branching**: Develop each feature on an isolated feature branch named `feat/<feature-name>` (or `docs/<topic>`, `chore/<topic>`).
2. **Master Integration Branch (`duong`)**: Merge all completed feature branches into the master integration branch `duong`.
3. **Commit Granularity**: Commit atomically per component/function change using the Conventional Commit standards above.
4. **Build Verification**: Always run `npm run lint` and `npm run build` to verify clean compilation before pushing.

---

## 4. Key Documentation Deliverables

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): System architecture, routing layout, and data flow.
- [docs/DECISIONS.md](docs/DECISIONS.md): Architectural decision records (ADRs) and trade-offs.
- [docs/PLAN.md](docs/PLAN.md): Master implementation plan, migration audit matrix, and Admin roadmap.
- [docs/PROGRESS.md](docs/PROGRESS.md): Master progress dashboard tracking all routes and features.
- [docs/AGENT_GUIDE.md](docs/AGENT_GUIDE.md): Documentation update triggers and maintenance rules.
- [docs/DESIGN_TOKENS.md](docs/DESIGN_TOKENS.md): Neo-Editorial / Neo-Brutalist UI design tokens.
