# Frontend Builder Progress — Master Dashboard

> **Doc version:** 1.7.0 · **Last updated:** 2026-08-02  
> Agents: update feature files first, then sync summary counts here.

## Summary

| Feature | Routes | Skeleton+ | Implemented+ | Tested | Documented |
|---------|--------|-----------|--------------|--------|------------|
| [Home](./features/home/progress.md) | 1 | 1 | 1 | 0 | yes |
| [Auth](./features/auth/progress.md) | 2 | 2 | 2 | 0 | yes |
| [Dogs (Dex)](./features/dogs/progress.md) | 1 | 1 | 1 | 0 | yes |
| [Scan](./features/scan/progress.md) | 1 | 1 | 0 | 0 | partial |
| [Profile](./features/profile/progress.md) | 1 | 1 | 1 | 0 | yes |
| **Total** | **6** | **6** | **6** | **0** | **4 full** |

## Build phases

| Phase | Scope | Status |
|-------|-------|--------|
| P0 — Scaffold | Folder structure, routing, i18n, docs hub | done |
| P1 — Core UX | Home, SiteNav Morphic Redesign, Scan upload, Dex collection grid | in_progress |
| P2 — Auth | Login, register, OTP verification, HttpOnly cookie refresh token & auto-refresh | done |
| P3 — Profile | Profile redesign, expandable edit panel, country/city selection, avatar management & validation | done |
| P4 — Quality | Tests, accessibility, performance | planned |

## Blockers & TODOs

| ID | Feature | Item | Priority |
|----|---------|------|----------|
| T-001 | Scan | Wire upload UI to scan API | high |
| T-002 | Dogs | Breed list + collection grid | done |
| T-003 | Auth | Connect auth service + session | done |
| T-004 | All | Add unit tests for views/services | medium |

## Feature links

- [Home](./features/home/progress.md)
- [Auth](./features/auth/progress.md)
- [Dogs (Dex)](./features/dogs/progress.md)
- [Scan](./features/scan/progress.md)
- [Profile](./features/profile/progress.md)

## Architecture

See [architecture/architecture-design.md](./architecture/architecture-design.md).
