# Home — Feature Progress

**Feature version:** 1.8.0  
**Last reviewed:** 2026-07-24  
**Source:** `src/features/home/`

## Screen status

| Route | View | Status | Tests | Docs | Notes |
|-------|------|--------|-------|------|-------|
| `/` | `HomeView` | implemented | no | yes | True-Color Apple Glassmorphism Product Variant Cards with glowing specular borders inside ZoomableImage modal, ProductStage centerpiece & 8-Bit Pixel icons |

## Components

| Component | Status | Notes |
|-----------|--------|-------|
| `VariantSelector` | implemented | True-Color Apple Glassmorphism color variant cards featuring physical variant color backgrounds, glowing specular borders, and zero outer chrome |
| `ZoomableImage` | implemented | Reusable image component with 4-stop click zoom and click-propagation fixed Glassmorphism VariantSelector in modal overlay |
| `ProductStage` | implemented | Centerpiece hero hardware showcase with clean layout & full-screen zoom inspection |
| `BentoGrid` | implemented | Feature cards with PixelRadarIcon & PixelCameraIcon and emotional lost-pet copy |
| `HowItWorks` | implemented | 3-step process section with calibrated typography |

## Next steps

- [x] Hero centerpiece hardware showcase
- [x] True-Color Apple Glassmorphism VariantSelector Cards with Glowing Specular Borders
- [x] Click propagation fix for inside-modal variant selection
- [x] Full-screen click-to-zoom image inspection modal
- [x] Crisp standard vector SVG icons (Heart for Community & Camera for Collection) for Bento cards
- [x] Warm & emotional pet reunification copy
- [ ] Integration tests for HomeView

## Related

- [Master progress](../../PROGRESS.md)
- [Architecture](../../architecture/architecture-design.md)
