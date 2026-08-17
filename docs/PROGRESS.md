# Frontend Builder Progress - Master Dashboard

Doc version: 2.0.0
Last updated: 2026-08-18

## Master Summary

| Feature | Routes | Implemented | Tested | Documented | Feature Plan Link |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Home** | `/` | Yes | Pending | Yes | [features/home/progress.md](./features/home/progress.md) |
| **Dogs (Dex & Radar)** | `/dex`, `/find`, `/breed/[slug]` | Yes | Pending | Yes | [features/dogs/progress.md](./features/dogs/progress.md) |
| **Scan & AI Vision** | `/scan`, `/pet/[tagId]`, `/history` | Yes | Pending | Yes | [features/scan/progress.md](./features/scan/progress.md) |
| **Products & Checkout** | `/products`, `/checkout` | Yes | Pending | Yes | [features/products/progress.md](./features/products/progress.md) |
| **Profile** | `/profile` | Yes | Pending | Yes | [features/profile/progress.md](./features/profile/progress.md) |
| **Community** | `/community` | Yes | Pending | Yes | [features/community/progress.md](./features/community/progress.md) |
| **Admin Dashboard** | `/admin` | Yes | Pending | Yes | [features/admin/progress.md](./features/admin/progress.md) |
| **Policies** | `/policies` | Yes | Pending | Yes | [features/policies/progress.md](./features/policies/progress.md) |

## Master Build Phases

| Phase | Scope | Status |
| :--- | :--- | :--- |
| P0 - Scaffold | Folder structure, routing, i18n, docs hub | Completed |
| P1 - Core UX | Home, SiteNav Morphic Redesign, Scan upload, Dex collection grid | Completed |
| P2 - Lost Dog Radar | Leaflet full-screen map, 0ms SWR hydration, discrete zoom snap, Top 5 Proximity Tile Pre-fetcher | Completed |
| P3 - AI Scanner | WebRTC camera viewfinder, camera flip, instant Pokedex unlock | Completed |
| P4 - Admin & Fulfillment | Physical QR collar orders, custom engraving queue, emergency scan logs | In Progress |
| P5 - Quality & Testing | Vitest component & service unit tests | Planned |

## Master Feature Links

- [Dogs (Dex & Radar Map) Feature Plan](./features/dogs/progress.md)
- [Scan & AI Vision Feature Plan](./features/scan/progress.md)
- [Admin Module Feature Plan](./features/admin/progress.md)
- [Profile & Pet Management Feature Plan](./features/profile/progress.md)
- [Master Implementation Plan & Migration Matrix](./PLAN.md)
- [Architecture Decisions Log](./DECISIONS.md)
