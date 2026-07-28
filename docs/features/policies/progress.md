# Policies — Feature Progress

**Feature version:** 1.1.0  
**Last reviewed:** 2026-07-28  
**Source:** `src/features/policies/`

## Screen status

| Route | View | Status | Tests | Docs | Notes |
|-------|------|--------|-------|------|-------|
| `/policies` | `PoliciesView` | implemented | no | yes | Interactive Policies Hub with Tab Navigation & Search filter. |
| `/policies/privacy` | `PrivacyPolicyView` | implemented | no | yes | Dedicated Privacy Policy View with Unsubscribe widget & partner logistics cards. |
| `/policies/terms` | `TermsOfUseView` | implemented | no | yes | Dedicated Terms of Use View with accuracy declaration & COD / Bank Transfer methods. |
| `/policies/refund` | `RefundPolicyView` | implemented | no | yes | Dedicated Return & Refund View for 7-day collar size/defect returns. |
| `/policies/shipping` | `ShippingPolicyView` | implemented | no | yes | Dedicated Shipping View for 1-2 days processing & 2-5 days delivery timelines. |

## Feature components

- `src/features/policies/views/PoliciesView.tsx`: Interactive multi-tab policy hub.
- `src/features/policies/views/PrivacyPolicyView.tsx`: Standalone privacy policy screen view.
- `src/features/policies/views/TermsOfUseView.tsx`: Standalone terms of use screen view.
- `src/features/policies/views/RefundPolicyView.tsx`: Standalone return & refund policy screen view.
- `src/features/policies/views/ShippingPolicyView.tsx`: Standalone shipping policy screen view.

## Highlights

- [x] Full bilingual (VI & EN) internationalization (i18n) support across all policy sections using `useTranslations("Policies")`.
- [x] Redesigned policy sections into smooth slide-down accordion dropdowns.
- [x] Zero icon libraries used (strictly using typography, color badges & CSS elements).
- [x] Full Next.js App Router & modular feature view architecture.
