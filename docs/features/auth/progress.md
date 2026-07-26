# Auth — Feature Progress

**Feature version:** 1.1.0  
**Last reviewed:** 2026-07-26  
**Source:** `src/features/auth/`

## Screen status

| Route | View | Status | Tests | Docs | Notes |
|-------|------|--------|-------|------|-------|
| `/login` | `LoginView` | implemented | no | yes | Integrated with NestJS backend `POST /api/auth/login`. Features alert error messages, loading states, and token persistence in localStorage. |
| `/register` | `RegisterView` | implemented | no | yes | Integrated with NestJS backend `POST /api/auth/register` and `POST /api/auth/verify-email`. Includes OTP modal verification step. |

## Service layer

| Component | Status | Notes |
|-----------|--------|-------|
| `auth.service.ts` | implemented | Complete API integration with NestJS auth endpoints (`register`, `login`, `verifyEmail`, `resendOtp`, `logout`). |
| `auth.types.ts` | implemented | TypeScript interfaces for payloads, user objects, and API response structures. |

## Next steps

- [x] Login / register forms API integration
- [x] Email OTP verification UI & flow
- [x] Session token persistence
- [ ] Protected profile route middleware & session guards

## Related

- [Master progress](../../PROGRESS.md)
- [Architecture](../../architecture/architecture-design.md)
