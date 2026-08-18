# Agent Navigation and Documentation Maintenance Guide - Frontend (DogDex)

Comprehensive workflow guide for AI Agents maintaining, updating, and navigating the DogDex frontend codebase and documentation.

---

## 1. Core Documentation Architecture

The documentation in `docs/` is organized hierarchically. Always maintain link integrity and append updates without deleting past historical context.

| Document | Path | Purpose | When to Update |
| :--- | :--- | :--- | :--- |
| **Start Here** | `docs/START_HERE.md` | Developer onboarding and project overview | Initial setup or environment changes |
| **Agent Guide** | `docs/AGENT_GUIDE.md` | Navigation rules, commit standards, and update triggers | Whenever documentation workflows evolve |
| **Master Plan** | `docs/PLAN.md` | High-level roadmap, migration audit matrix, and feature plan links | When new features, routes, or admin tasks are planned |
| **Master Progress** | `docs/PROGRESS.md` | Master status dashboard tracking all routes and features | After completing feature tasks or adding routes |
| **Decisions Log** | `docs/DECISIONS.md` | Log of architectural choices, trade-offs, and design rationale | Whenever architectural or technical decisions are made |
| **System Architecture** | `docs/ARCHITECTURE.md` | Component hierarchy, routing layout, and state data flow | When structural architecture or data flows change |
| **Feature Plans** | `docs/features/<feature>/progress.md` | Granular task list, component breakdown, and feature roadmap | During active development of specific feature modules |
| **Changelog** | `docs/CHANGELOG.md` | Chronological log of major version updates and breaking changes | Upon completing major milestones or version releases |

---

## 2. Conventional Commit Standards & Scope Rules

Format: `<type>(<scope>): <subject>`

### Commit Types
- `feat`: New user-facing feature or component capability.
- `fix`: Bug fix.
- `refactor`: Code restructuring without logic changes.
- `docs`: Documentation updates only.
- `style`: UI design, CSS tokens, or layout formatting changes.
- `test`: Unit or integration test additions.
- `chore`: Configuration, build scripts, or dependency updates.

### Scope Rules & Component-Level Examples
- **Rule**: The `<scope>` MUST represent the specific component, view, hook, or utility function being modified. Do NOT use broad macro module names (like `dogs` or `scan`) as scope.
- **Examples**:
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

1. **Feature Branches**: Work on feature-isolated branches (`feat/<feature>`, `docs/<topic>`, `chore/<topic>`).
2. **Master Integration Branch**: Merge all completed feature branches into master integration branch `duong`.
3. **Atomic Commits**: Create small, atomic commits per component/function using Conventional Commit standards.

---

## 4. Hard Documentation Rules for AI Agents

1. **No Emojis or Icons in Markdown**:
   Do NOT use unicode emojis or icons in any `.md` documentation file. Keep all markdown documentation clean, professional, structured, and versioning-friendly.

2. **Append-Only and Historical Preservation**:
   NEVER delete previous entries, historical decisions, or past plan phases. Proactively summarize existing context and append new updates under new section headers.

3. **Service Layer Logic Separation**:
   Ensure all business logic, state mutations, and API communications remain strictly inside Service modules (`dogs.service.ts`, `auth.service.ts`, `scan.service.ts`). View components (`src/features/*/views`) must only render UI and call Service methods.
