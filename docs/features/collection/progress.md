# Collection (Breed Dex) UI Implementation

**Feature:** Dogs / Collection  
**Doc Version:** 1.0.0  
**Last Updated:** 2026-08-02  
**Status:** `implemented`  
**Primary View:** [`DexView.tsx`](../../../src/features/dogs/views/DexView.tsx)

---

## Summary of Changes

The Collection (Breed Dex) view was upgraded into a high-impact **Neo-Brutalist Split-Panel Workstation** inspired by the Figma design (`Main` frame) and following the project's pop-brutalist aesthetic and architecture design rules.

### 1. Extended Shared Types
- **[`breed.ts`](../../../src/shared/types/breed.ts)**:
  - Extended `Breed` type with visual metadata and collection status fields:
    - `pokedexNumber?: number`
    - `number?: string`
    - `group?: string`
    - `origin?: string`
    - `rarityLevel?: number`
    - `lifeSpan?: string`
    - `weight?: string`
    - `height?: string`
    - `temperament?: string[]`
    - `stats?: BreedStats` (`friendliness`, `energy`, `intelligence`)
    - `isCollected?: boolean`
    - `isLegendary?: boolean`
    - `discoveredAt?: string`

---

### 2. Shared Generic UI Components
- **[`StatBar.tsx`](../../../src/shared/ui/StatBar.tsx)** (*NEW*):
  - Reusable 5-block segmented rating bar with custom labels, icons (Friendliness, Energy, Intellect), and color mappings (`#F87171` red, `#FACC15` yellow, `#60A5FA` blue).
- **[`CustomSelect.tsx`](../../../src/shared/ui/CustomSelect.tsx)** (*REUSED*):
  - Shared dropdown integrated for sort criteria selection (`NUMBER`, `NAME`, `GROUP`).

---

### 3. Dogs Feature Components (`src/features/dogs/components/`)
- **[`BreedDetailPanel.tsx`](../../../src/features/dogs/components/BreedDetailPanel.tsx)** (*NEW*):
  - Left-hand detail viewer displaying:
    - Rotated badge tag (`NO.066`) & verified guide icon
    - Neo-Brutalist framed high-resolution image container
    - Breed title & group badge
    - Temperament tags (`FRIENDLY`, `INTELLIGENT`, `FAMILY`, etc.)
    - Stat Bars for Friendliness, Energy, and Intellect
    - 2x2 Specs Grid (Origin, Life Span, Weight, Height)
    - Action button row ("COLLECT ENTRY" / "✓ IN COLLECTION" toggle + Heart favorite toggle)
- **[`BreedFilterBar.tsx`](../../../src/features/dogs/components/BreedFilterBar.tsx)** (*NEW*):
  - Filter bar containing:
    - Search input field with search icon
    - Status filter chips (`ALL`, `COLLECTED`, `MISSING`, `LEGENDARY`)
    - `CustomSelect` dropdown for sorting options
- **[`BreedGridCard.tsx`](../../../src/features/dogs/components/BreedGridCard.tsx)** (*NEW*):
  - Neo-Brutalist grid card component with status color accents:
    - `#99F4D3` mint green for collected breeds
    - `#FFDBCC` peach for legendary breeds
    - `#DCE5DD` muted background with `???` locked overlay for missing breeds
    - Active selection highlight border and hover animations

---

### 4. Collection View & Service Integration
- **[`DexView.tsx`](../../../src/features/dogs/views/DexView.tsx)** (*MODIFIED*):
  - Refactored main view into a responsive dual-panel layout (40% Left Panel for breed inspector, 60% Right Panel for collection grid).
  - Integrated local storage persistence for collection entries (`dogdex_collected_ids`).
  - Added hero banner with live progress counter (`X / Y BREEDS`).
  - Implemented responsive mobile tab switcher ("COLLECTION BROWSER" vs "DOG DETAILS").
  - Implemented pagination with Neo-Brutalist controls (PREV, Page Dots, NEXT).
- **[`dogs.service.ts`](../../../src/features/dogs/services/dogs.service.ts)** (*MODIFIED*):
  - Supports combined dataset pagination (`limit`) and language localization (`lang`).

---

### 5. Internationalization (i18n)
- **[`en.json`](../../../src/features/dogs/messages/en.json)** & **[`vi.json`](../../../src/features/dogs/messages/vi.json)**:
  - Added translation keys for collection headers, search placeholders, filter status chips, and button actions.

---

## Verification Summary
- TypeScript type check (`npx tsc --noEmit`): Passed with 0 errors.
- Responsive design tested across desktop dual-panel workstation and mobile tabbed view.
