# Dogs & Radar Feature Implementation Plan & Progress

Feature version: 1.3.0
Source: src/features/dogs/

## Screen Status

| Route | View | Status | Tests | Docs | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/dex` | `DexView` | Implemented | Pending | Yes | Neo-Brutalist Pokedex grid workstation with user first encounter photo priority |
| `/find` | `FindDogsView` | Implemented | Pending | Yes | GPU-accelerated Leaflet lost dog radar map, 0ms SWR hydration, discrete zoom snap |
| `/breed/[slug]` | `BreedDetailView` | Implemented | Pending | Yes | Multimodal wiki page (stock image + user encounter gallery + Pokedex stats) |

## Component & Service Layer Status

| Component | Status | Notes |
| :--- | :--- | :--- |
| `dogs.service.ts` | Implemented | API communication layer for breed list, my-dogs, lost search, and media URL resolution |
| `LeafletLostDogsMap.tsx` | Implemented | Full-screen Leaflet radar map, 16-tile RAM pre-buffer, Top 5 Proximity Tile Pre-fetcher, zoomSnap:1 |
| `BreedGridCard.tsx` | Implemented | Grid card displaying user's first collected photo thumbnail when unlocked |
| `BreedFilterBar.tsx` | Implemented | Search input, status chips (ALL, COLLECTED, MISSING, LEGENDARY), custom sort dropdown |
| `ReportLostModal.tsx` | Pending | Modal for owners to post a lost pet report with Nominatim address geocoding |
| `BreedChatAssistant.tsx` | Pending | Gemini AI Dog Breed Assistant chatbot on breed wiki |

## Completed Implementation Tasks

- [x] Full-screen Leaflet Radar Map on /find with user GPS position pin
- [x] Discrete zoom snapshots (25% City, 50% Radar, 100% Block) with percentage buttons
- [x] Unrestricted map panning across Vietnam/World while pre-buffering 16 tile rings in RAM
- [x] Top 5 Proximity Tile Pre-Fetcher loading Zoom 13 & 15 tiles into RAM cache
- [x] Chevron navigation buttons (< / >) and 0ms card modal close (x CLOSE)
- [x] Dex collection grid with user first photo encounter thumbnail priority
- [x] Multimodal stock + user encounter photo gallery on /breed/[slug]

## Feature Implementation Roadmap

1. [ ] Implement `ReportLostModal.tsx` on `/find` map for lost pet post creation
2. [ ] Embed `BreedChatAssistant.tsx` on `/breed/[slug]` for AI breed care advice
3. [ ] Add unit & integration tests for `dogs.service.ts` and `LeafletLostDogsMap.tsx`
