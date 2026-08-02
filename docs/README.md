# Dog Dex Frontend — Documentation Hub

> **New here?** Read **[START_HERE.md](./START_HERE.md)** first (Vietnamese guide).

Central documentation for **frontend-dogdex**: architecture, feature progress, and agent rules.

## Quick links

| Document | Who | Purpose |
|----------|-----|---------|
| **[START_HERE.md](./START_HERE.md)** | **Humans** | How to read & manage docs (Vietnamese) |
| [AGENT_GUIDE.md](./AGENT_GUIDE.md) | AI agents | Update rules & templates |
| [PROGRESS.md](./PROGRESS.md) | Everyone | Master progress dashboard |
| [CHANGELOG.md](./CHANGELOG.md) | Maintainers | Doc version history |
| [architecture/architecture-design.md](./architecture/architecture-design.md) | Everyone | Frontend architecture & conventions |
| [features/README.md](./features/README.md) | Everyone | Per-feature index |

## Folder layout

```
docs/
├── START_HERE.md          ⭐ Read first (Vietnamese)
├── README.md              ← You are here
├── AGENT_GUIDE.md
├── PROGRESS.md
├── CHANGELOG.md
├── versioning/CONVENTIONS.md
├── architecture/architecture-design.md
└── features/
    ├── README.md
    ├── collection/
    │   └── collection_ui_changes.md
    └── */progress.md      (one per feature)
```

## Project snapshot

| Property | Value |
|----------|-------|
| Project | `frontend-dogdex` |
| Doc version | `1.2.0` |
| Last updated | 2026-08-02 |

## For AI agents

1. Read [START_HERE.md](./START_HERE.md) and [AGENT_GUIDE.md](./AGENT_GUIDE.md).
2. After code changes → update `features/<feature>/progress.md` + [PROGRESS.md](./PROGRESS.md).
3. Keep technical docs in **English**; only START_HERE stays Vietnamese.
