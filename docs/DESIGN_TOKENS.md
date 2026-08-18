# DOGDEX Frontend Design Tokens & Visual Guidelines

This document defines the UI design tokens, color palettes, typography, spacing, component primitives, and 3D viewport guidelines for **frontend-dogdex**.

---

## 1. Color Palette & CSS Variables

DOGDEX uses Tailwind CSS v4 design tokens defined via `@theme` CSS rules:

```css
@theme {
  /* Brand Primary - Canine Gold */
  --color-gold-50: #fffbeb;
  --color-gold-100: #fef3c7;
  --color-gold-400: #fbbf24;
  --color-gold-500: #f59e0b;  /* Primary Accent */
  --color-gold-600: #d97706;

  /* Surface & Background - Slate Dark */
  --color-surface-bg: #0f172a;       /* Dark Main Background */
  --color-surface-card: #1e293b;     /* Card Container Surface */
  --color-surface-overlay: #334155;  /* Glassmorphism Border */

  /* Neutral Typography */
  --color-text-primary: #f8fafc;     /* Main Heading & Body Text */
  --color-text-secondary: #94a3b8;   /* Muted Subtitles & Labels */

  /* System Feedback */
  --color-status-success: #10b981;  /* High Confidence Prediction (>85%) */
  --color-status-warning: #f59e0b;  /* Moderate Confidence Prediction (50-85%) */
  --color-status-danger: #ef4444;   /* Low Confidence / Error State (<50%) */
}
```

---

## 2. Typography System

- **Primary Body & UI Font:** Inter / Geist (`font-sans`)
- **Display Headings & Breed Names:** Outfit (`font-display`)
- **Metrics & Code:** JetBrains Mono (`font-mono`)

---

## 3. UI Component Primitives

### Glassmorphic Card Standard
```html
<div class="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-amber-500/50 transition-all duration-300">
  <!-- Content -->
</div>
```

---

## 4. 3D Viewport Guidelines

1. **Canvas Background:** Render 3D viewports over dark translucent backgrounds (`#0f172a`).
2. **Rotation Indicator:** Overlay floating 360° pill at bottom center of canvas.
