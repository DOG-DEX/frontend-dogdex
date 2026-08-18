# Architecture Decisions Log - Frontend (DogDex)

All major technical, architectural, and UI design decisions for the DogDex frontend workspace.

---

## Decision 1: Full-Screen Interactive Leaflet Map for Lost Dog Radar (/find)
- **Context**: The original codebase presented lost dog listings as a static news-style card grid.
- **Decision**: Replaced the static grid on /find with a full-screen dynamic Leaflet interactive map ([LeafletLostDogsMap.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/features/dogs/components/LeafletLostDogsMap.tsx)) taking up the full height between navigation and footer.
- **Rationale**: A visual interactive map with live user GPS pin positioning (`navigator.geolocation`) dramatically speeds up finding lost pets and improves emergency response time.

---

## Decision 2: 0ms Client-Side SWR RAM/Disk Cache vs. Server Redis Cache
- **Context**: Fetching map tiles and lost dog data over HTTP on every pan/zoom created network latency and server load.
- **Decision**: Implemented a Client-side Stale-While-Revalidate (SWR) Hydration Strategy (`dogdex_cached_user_gps` & `dogdex_cached_lost_dogs`) using `localStorage` and browser RAM pre-buffering (`keepBuffer: 16`).
- **Rationale**: Offloads 100% of tile rendering and initial hydration from Node.js/Redis server. Gives users instant 0ms load speed on initial mount and works offline seamlessly. Redis on the server is used strictly for rate-limiting and atomic step locks (`lock:project:<id>:step:<n>`).

---

## Decision 3: Discrete Zoom Snapshots & Unrestricted Map Panning
- **Context**: Continuous pinch-zoom caused micro-rendering churn and map tile flickering. Initial tests restricted map panning to a rigid `maxBounds` bounding box.
- **Decision**:
  1. Configured discrete integral zoom snaps (`zoomSnap: 1`, `zoomDelta: 1`) locked to percentage scale snapshots: 25% City (Zoom 11), 50% Radar (Zoom 13), 100% Block (Zoom 15).
  2. Removed `maxBounds` panning restrictions, allowing unrestricted panning across Vietnam/World while using a Top 5 Proximity Tile Pre-Fetcher to keep the 5 nearest locations pre-loaded in RAM.
- **Rationale**: Users can pan anywhere freely without hitting wall boundaries, while local/nearest map areas render instantly with zero network delay.

---

## Decision 4: User Encounter Photo Priority in Dex Pokedex Grid (/dex)
- **Context**: Standard Pokedex grids only display generic stock images.
- **Decision**: Updated [BreedGridCard.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/features/dogs/components/BreedGridCard.tsx) and [BreedDetailView.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/features/dogs/views/BreedDetailView.tsx) to prioritize displaying the user's first collected photo thumbnail over stock wiki images when a breed is unlocked.
- **Rationale**: Creates a deeply personal collection experience while preserving official stock images in a multimodal gallery.

---

## Decision 5: Production-Grade WebRTC Camera State Architecture (/scan)
- **Context**: Initial inline camera state handling triggered React Compiler ESLint warnings (`react-hooks/set-state-in-effect`) and suffered from race conditions during rapid tab switching.
- **Decision**: Re-architected [ScanView.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/features/scan/views/ScanView.tsx) to strictly match the production pattern of original `DogBreedID_v2/frontend/app/live/page.tsx`:
  - `streamRef = useRef<MediaStream | null>(null)` for stable hardware stream lifecycle.
  - `facingModeRef = useRef("environment")` with flip camera button.
  - `isStreamingRef = useRef(false)` for synchronous state checks.
  - Centralized `cleanupCameraResources()` for teardown.
- **Rationale**: Guarantees zero hardware stream memory leaks, smooth camera flipping, and clean teardown on component unmount.

---

## Decision 6: Service Layer Business Logic Encapsulation
- **Context**: Mixing API contracts, data transformations, and state updates directly inside View components creates duplicate code and hard-to-test components.
- **Decision**: All API communications and business logic are encapsulated in dedicated Service modules (`dogs.service.ts`, `auth.service.ts`, `scan.service.ts`). View components interact exclusively with Service APIs.
- **Rationale**: Clean separation of concerns, high testability, and adherence to clean architecture principles.
