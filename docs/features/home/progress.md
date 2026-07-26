# Home — Feature Progress

**Feature version:** 1.9.0  
**Last reviewed:** 2026-07-26  
**Source:** `src/features/home/` & `src/components/SiteNav.tsx`

## Screen status

| Route | View | Status | Tests | Docs | Notes |
|-------|------|--------|-------|------|-------|
| `/` | `HomeView` | implemented | no | yes | Redesigned Neo-Brutalist Morphic Navigation Bar with DogDex brand logo (/logos/logo-ic-black.png), active route morphing pill, logged-in controls (+ SCAN, NOTIF, cute dog avatar), and mobile menu. |

## Components

| Component | Status | Notes |
|-----------|--------|-------|
| `SiteNav` | implemented | Redesigned Morphic Navigation Bar with official brand logo, active tab morphing pill, user state controls (+ SCAN, NOTIF pill badge, cute dog avatar circle), and mobile drawer without SVG icons. |
| `VariantSelector` | implemented | True-Color Apple Glassmorphism color variant cards featuring physical variant color backgrounds, glowing specular borders, and zero outer chrome |
| `ZoomableImage` | implemented | Reusable image component with 4-stop click zoom and click-propagation fixed Glassmorphism VariantSelector in modal overlay |
| `ProductStage` | implemented | Centerpiece hero hardware showcase with clean layout & full-screen zoom inspection |
| `BentoGrid` | implemented | Feature cards with PixelRadarIcon & PixelCameraIcon and emotional lost-pet copy |
| `HowItWorks` | implemented | 3-step process section with calibrated typography |

## Next steps

- [x] Redesign SiteNav with official DogDex logo, morphic active tab pill, logged-in user controls, and zero icons.
- [x] Hero centerpiece hardware showcase
- [x] True-Color Apple Glassmorphism VariantSelector Cards with Glowing Specular Borders
- [x] Click propagation fix for inside-modal variant selection
- [x] Full-screen click-to-zoom image inspection modal
- [x] Warm & emotional pet reunification copy
- [ ] Integration tests for HomeView

## Related

- [Master progress](../../PROGRESS.md)
- [Architecture](../../architecture/architecture-design.md)
