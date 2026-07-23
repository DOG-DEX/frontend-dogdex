# Agent Guide — Dog Dex Frontend Docs

Instructions for AI agents maintaining this documentation set.

> **Human onboarding:** point users to [START_HERE.md](./START_HERE.md) (Vietnamese) first.

## Goals

1. **Version control** — Track what the frontend looks like at each doc version.
2. **Discoverability** — One entry point (`README.md`) → feature docs → screen progress.
3. **Progress tracking** — Know which views are skeleton vs implemented vs tested.

## When to update

| Code change | Required doc updates |
|-------------|---------------------|
| New/changed route or view | `features/<feature>/progress.md`, `PROGRESS.md` |
| New shared type or API contract | `architecture/architecture-design.md` if structural |
| New feature folder | `CHANGELOG.md`, `README.md`, `features/README.md` |
| Doc restructure | `CHANGELOG.md`, bump doc version in `README.md` |

## Status labels (screen / capability level)

| Status | Meaning |
|--------|---------|
| `planned` | Designed but no view or route yet |
| `skeleton` | Route + view exist; minimal placeholder UI |
| `implemented` | UI, hooks, and service integration complete |
| `tested` | Unit and/or e2e tests exist |
| `stable` | Reviewed, no known gaps |

Additional columns: **Tests**, **Docs**, **Notes**.

## Versioning docs

Follow [versioning/CONVENTIONS.md](./versioning/CONVENTIONS.md):

- **PATCH** — Typo fixes, progress status updates.
- **MINOR** — New feature folder, new route documented.
- **MAJOR** — Breaking routing, auth, or API contract changes.

Update the `Doc version` line in `README.md` when bumping.

## Source of truth

Code wins over docs. Verify against:

```
src/app/
src/features/
src/components/
```

## Do not

- Delete progress history — mark items `deprecated` in Notes instead.
- Mix languages — all docs except START_HERE are **English**.
- Create orphan files — link every new doc from `README.md` or `features/README.md`.
