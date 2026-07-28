# Profile — Feature Progress

**Feature version:** 1.3.0  
**Last reviewed:** 2026-07-28  
**Source:** `src/features/profile/`

## Screen status

| Route | View | Status | Tests | Docs | Notes |
|-------|------|--------|-------|------|-------|
| `/profile` | `ProfileView` | implemented | no | yes | Redesigned header (removed DOGDEX Trainer, Location, Favourites), expandable inline Edit Profile dropdown panel with CountryStatePicker using shared CustomSelect component, read-only email, avatar upload/delete, and validations. |

## Service layer

| Component | Status | Notes |
|-----------|--------|-------|
| `profileService.ts` | implemented | Complete API integration with `/api/user/profile` (`getProfile`, `updateProfile`) and localStorage sync. |

## Next steps

- [x] Fixed Dither background WebGL shader GLSL resolution uniform & domain warping animation
- [x] Redesigned Profile view: removed DOGDEX Trainer, Location & Favourites
- [x] Extracted reusable `CustomSelect` component to `@/shared/ui/CustomSelect` with search filter support
- [x] Refactored `CreateDogModal` and `CountryStatePicker` to inherit shared `CustomSelect`
- [x] Expandable inline Edit Profile dropdown panel with smooth expand/collapse transition
- [x] Read-only Email field with lock indicator
- [x] Country & City selectors with `country-state-city` integration
- [x] Comprehensive input validations (username 3-30 chars a-z0-9_, phone number digits format, 5MB avatar file limits)
- [x] Avatar upload & removal capabilities
- [x] Exact Dog Profile Creation Form matching old frontend design with AI breed auto-detection
- [x] NestJS Backend API integration (`POST /api/dog`, `GET /api/dog/my-dogs`, `POST /api/predictions/predict`)
- [x] Integrated TiltedCard 3D spring tilt component from React Bits for interactive pet collection cards
- [x] Integrated real media upload API (`POST /api/medias/upload`) in `CreateDogModal`, `EditDogModal`, and user profile avatar upload (`ProfileView`) before calling backend API endpoints.
- [x] Separated pet photo into a standalone top card and pet name, breed, and buttons into a clean bottom card (`PetProfileSection.tsx`).
- [x] Added `vi` and `en` internationalization (i18n) support to `SiteFooter.tsx` (`useTranslations("SiteFooter")`).
- [x] Redesigned policy sections into smooth slide-down accordion dropdowns (`PoliciesView.tsx`).

## Related

- [Master progress](../../PROGRESS.md)
