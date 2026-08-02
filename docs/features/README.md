# Features Index

Per-feature documentation and progress tracking for Dog Dex frontend.

## Features

| Feature | Routes | Progress | Specification |
|---------|--------|----------|---------------|
| Home | `/` | [progress.md](./home/progress.md) | — |
| Auth | `/login`, `/register` | [progress.md](./auth/progress.md) | — |
| Dogs (Dex) | `/dex` | [progress.md](./dogs/progress.md) | [progress.md](./collection/progress.md) |
| Scan | `/scan` | [progress.md](./scan/progress.md) | — |
| Profile | `/profile` | [progress.md](./profile/progress.md) | — |

## Adding a new feature

1. Create `src/features/<name>/` with standard subfolders.
2. Create `docs/features/<name>/progress.md` from an existing template.
3. Add row to [PROGRESS.md](../PROGRESS.md) summary table.
4. Update this index.
5. Add CHANGELOG entry (MINOR bump).

## i18n

Each feature owns `messages/en.json` and `messages/vi.json`. Register routes in `src/i18n/request.ts`.
