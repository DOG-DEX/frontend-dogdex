# Documentation Changelog

All notable changes to the frontend-dogdex documentation set.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.2.0] - 2026-08-02

### Added

- `features/collection/collection_ui_changes.md` — Refactored feature specification for the Neo-Brutalist Collection Workstation UI using relative file links and standard metadata.

### Changed

- `features/dogs/progress.md` — Updated Dogs (Dex) feature status from `skeleton` to `implemented` with component list and completed features checklist.
- `PROGRESS.md` — Updated master dashboard summary counts (Dogs implemented: 1, total implemented: 6, total documented: 4) and marked task `T-002` as done.
- `features/README.md` & `README.md` — Updated index links and doc version snapshot to `1.2.0`.

## [1.1.0] - 2026-07-27

### Changed

- Refactored `SiteNav.tsx` desktop navigation layout to 3-column CSS Grid (`grid-cols-3`) to ensure perfect geometric centering of navigation links when user is logged in.

## [1.0.0] - 2026-07-24

### Added

- Initial docs hub structure (`README`, `START_HERE`, `AGENT_GUIDE`, `PROGRESS`, versioning conventions).
- `architecture/architecture-design.md` — feature-sliced frontend architecture (adapted from pure-evil-web).
- Per-feature progress trackers under `features/*/progress.md`.
- Master progress dashboard in `PROGRESS.md`.
- Source scaffold: `src/` with app router, 5 features, i18n, shared layer, middleware.

### Progress

- P0 scaffold → done
- All 6 routes → skeleton
