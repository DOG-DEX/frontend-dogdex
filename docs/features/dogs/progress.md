# Dogs (Dex) — Feature Progress

**Feature version:** 1.1.0  
**Last reviewed:** 2026-08-02  
**Source:** `src/features/dogs/`

## Screen status

| Route | View | Status | Tests | Docs | Notes |
|-------|------|--------|-------|------|-------|
| `/dex` | `DexView` | implemented | no | yes | Neo-Brutalist split-panel collection workstation |

## Component & Service layer

| Component | Status | Notes |
|-----------|--------|-------|
| `dogs.service.ts` | implemented | Fetches breed list with limit & lang params, concurrent `listMyDogs` integration |
| `BreedDetailPanel.tsx` | implemented | Left panel inspector with stat bars, specs grid, and collect action buttons |
| `BreedFilterBar.tsx` | implemented | Search, status chips (`ALL`, `COLLECTED`, `MISSING`, `LEGENDARY`), and custom sort dropdown |
| `BreedGridCard.tsx` | implemented | Collection grid card with status color accents and selection handling |
| `StatBar.tsx` | implemented | Reusable 5-block rating bar in shared UI |

## Key Features Implemented

- [x] Dual-panel split workstation (40% inspector panel, 60% collection browser grid)
- [x] Collection discovery state & progress counter badge (`X / Y BREEDS`)
- [x] Status filtering (`ALL`, `COLLECTED`, `MISSING`, `LEGENDARY`) & sorting (`NUMBER`, `NAME`, `GROUP`)
- [x] Local storage collection persistence (`dogdex_collected_ids`)
- [x] Mobile responsive tab switcher ("COLLECTION BROWSER" vs "DOG DETAILS")
- [x] Neo-Brutalist pagination controls (PREV, Page Dots, NEXT)

## Next steps

- [ ] Unit & integration tests for `DexView` and `dogs.service.ts`
- [ ] Connect favorite heart action to backend endpoint

## Related

- [Collection UI Specification](../collection/progress.md)
- [Master progress](../../PROGRESS.md)
