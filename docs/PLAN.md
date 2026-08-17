# Implementation Plan & Source Migration Audit - Frontend (DogDex)

Comprehensive roadmap, source migration comparison, and Admin module implementation plan between `DogBreedID_v2/frontend` and `frontend-dogdex`.

---

## 1. Page Migration Audit Matrix

| Original Page (`DogBreedID_v2`) | New Migrated Page (`frontend-dogdex`) | Status | Notes & Changes |
| :--- | :--- | :--- | :--- |
| **`/`** (Home & AI Scan) | [app/page.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/app/%5Blocale%5D/page.tsx) | **Adjusted** | Focused on Smart QR Collar E-Commerce & Lost Dog Protection Radar |
| **`/live`** & **`/scan`** (Camera AI) | [app/scan/page.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/app/%5Blocale%5D/%28app%29/scan/page.tsx) | **Migrated & Upgraded** | WebRTC Live Camera Viewfinder + File Upload + Instant Pokedex Unlock ([ScanView.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/features/scan/views/ScanView.tsx)) |
| **`/dogdex`** (Collection) | [app/dex/page.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/app/%5Blocale%5D/%28app%29/dex/page.tsx) | **Migrated & Upgraded** | Pokedex 2x4 grid with User First Photo encounter thumbnail + real MongoDB backend sync ([DexView.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/features/dogs/views/DexView.tsx)) |
| **`/breed/[slug]`** (Breed Wiki) | [app/breed/[slug]/page.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/app/%5Blocale%5D/%28app%29/breed/%5Bslug%5D/page.tsx) | **Migrated & Upgraded** | Multimodal stock + user encounter photo gallery + Pokedex stats ([BreedDetailView.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/features/dogs/views/BreedDetailView.tsx)) |
| **`/public/[id]`** (Emergency Landing) | [app/pet/[tagId]/page.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/app/%5Blocale%5D/%28app%29/pet/%5BtagId%5D/page.tsx) | **Migrated & Upgraded** | Public emergency landing for scanned QR collar tags ([PublicPetScanView.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/features/scan/views/PublicPetScanView.tsx)) |
| **`/pricing`** & **`/checkout`** | [app/checkout/page.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/app/%5Blocale%5D/%28app%29/checkout/page.tsx) | **Migrated** | Physical Smart Collar E-Commerce with engraving text, collar size (S/M/L), and MoMo payment initiation |
| **`/history`** (Prediction Logs) | [app/history/page.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/app/%5Blocale%5D/%28app%29/history/page.tsx) | **Migrated** | AI scan history logs ([HistoryView.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/features/scan/views/HistoryView.tsx)) |
| **`/community`** (Social Feed) | [app/community/page.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/app/%5Blocale%5D/%28app%29/community/page.tsx) | **Migrated** | Social pet community feed ([CommunityView.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/features/community/views/CommunityView.tsx)) |
| **`/profile`** (User Profile) | [app/profile/page.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/app/%5Blocale%5D/%28app%29/profile/page.tsx) | **Migrated** | Profile management & owned pets list ([ProfileView.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/features/profile/views/ProfileView.tsx)) |
| **`/admin`** (Admin Dashboard) | [app/admin/page.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/app/%5Blocale%5D/%28app%29/admin/page.tsx) | **Migrated & Upgraded** | Live QR Tag tracking & physical order fulfillment ([AdminView.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/features/admin/views/AdminView.tsx)) |
| **`/rank`** (Leaderboard) | *Not yet migrated* | PENDING | Top Collectors Leaderboard page based on `collectionSize` aggregation |
| **`/achievements`** (Badges) | *Not yet migrated* | PENDING | Achievement badge unlock collection page (`rare_breed`, `collection_count`) |
| **`/help`** & **`/docs`** | *Not yet migrated* | PENDING | Help Desk FAQ & User Documentation |

---

## 2. Component Migration Audit Matrix

| Original Component (`DogBreedID_v2/components`) | New Component (`frontend-dogdex/src`) | Status | Functional Role |
| :--- | :--- | :--- | :--- |
| **`DogRadar.tsx`** & **`maps/RadarMap.tsx`** | [LeafletLostDogsMap.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/features/dogs/components/LeafletLostDogsMap.tsx) | **Migrated** | GPU-accelerated Leaflet full-screen radar map with 0ms RAM caching |
| **`navbar.tsx`** | [SiteNav.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/components/SiteNav.tsx) | **Migrated** | Neo-Brutalist morphic sliding pill navbar |
| **`footer.tsx`** | [SiteFooter.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/components/SiteFooter.tsx) | **Migrated** | Neo-Editorial footer tokens & i18n support |
| **`dog-grid.tsx`** & **`dog-card.tsx`** | [BreedGridCard.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/features/dogs/components/BreedGridCard.tsx) | **Migrated** | Pokedex 2x4 grid card with user encounter thumbnail |
| **`pokedex-header.tsx`** | [BreedFilterBar.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/features/dogs/components/BreedFilterBar.tsx) | **Migrated** | Custom dropdown select, search query, status chips |
| **`VerifyFoundModal.tsx`** | [PublicPetScanView.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/features/scan/views/PublicPetScanView.tsx) | **Migrated** | Verified lost dog report notification to owner on QR tag scan |
| **`ReportLostModal.tsx`** | `src/features/dogs/components/ReportLostModal.tsx` | PENDING | Modal for owners to post a lost dog report on `/find` map |
| **`DogQrCode.tsx`** | `src/features/profile/components/DogQrCodeModal.tsx` | PENDING | SVG/PNG QR Code generator allowing owners to print emergency QR tags |
| **`HealthRecordList.tsx`** | `src/features/profile/components/HealthRecordTab.tsx` | PENDING | Health tracking (vaccinations, vet visits, weight logs) |
| **`breed-chat-box.tsx`** | `src/features/dogs/components/BreedChatAssistant.tsx` | PENDING | AI Dog Breed Assistant chatbot on `/breed/[slug]` |

---

## 3. Admin Module Implementation Plan

The Admin Dashboard ([AdminView.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/features/admin/views/AdminView.tsx)) provides full operational control over physical smart collar orders, QR tag tracking, and user analytics.

### Module Breakdown & Component Architecture

1. **Order Management & Fulfillment Sub-Module**:
   - Filter physical collar orders by status: `PENDING`, `PAID`, `SHIPPED`, `DELIVERED`, `CANCELLED`.
   - Update shipping tracking number and trigger SMS/Email delivery notifications.
   - Custom engraving queue table (displays pet name, owner phone, collar size S/M/L, chosen color).

2. **QR Tag Batch Pairing & Inventory Sub-Module**:
   - Generate batch QR tag IDs (`tagId`) and download printable vector PDF/SVG sheets for collar manufacturing.
   - Pair unassigned physical tags to user pet profiles upon order activation.

3. **Live Emergency Scan Activity Log**:
   - Real-time audit log tracking public QR collar scans across Vietnam with GPS coordinates, scanner IP, and timestamp.
   - Alert threshold trigger for high-frequency scan locations.

4. **Analytics & Revenue Dashboard**:
   - Revenue graphs (MoMo payment success rate, daily collar sales).
   - Lost pet recovery rate percentage and lost vs. found resolution metrics.
   - Popular scanned dog breed ranking.

---

## 4. Next Action Steps

1. **Step 1 (`ReportLostModal`)**: Add lost pet reporting modal on [FindDogsView.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/features/dogs/views/FindDogsView.tsx) with OpenStreetMap Nominatim geocoding.
2. **Step 2 (`DogQrCodeModal`)**: Add printable QR code modal in [ProfileView.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/features/profile/views/ProfileView.tsx).
3. **Step 3 (`Admin Order Module`)**: Enhance [AdminView.tsx](file:///home/duong/Projects/DOGDEX/frontend-dogdex/src/features/admin/views/AdminView.tsx) with engraving fulfillment tables and MoMo order status updates.
