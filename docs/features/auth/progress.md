# Auth — Feature Progress

**Feature version:** 1.3.0  
**Last reviewed:** 2026-07-28  
**Source:** `src/features/auth/`

## Screen status

| Route | View | Status | Tests | Docs | Notes |
|-------|------|--------|-------|------|-------|
| `/login` | `LoginView` | implemented | no | yes | Integrated with NestJS backend `POST /api/auth/login`. Uses HttpOnly Cookie for refreshToken, alert error messages, and accessToken in localStorage. |
| `/register` | `RegisterView` | implemented | no | yes | Integrated with NestJS backend `POST /api/auth/register` and `POST /api/auth/verify-email`. Includes OTP modal verification step. |

## Service layer

| Component | Status | Notes |
|-----------|--------|-------|
| `auth.service.ts` | implemented | Complete API integration with NestJS auth endpoints (`register`, `login`, `verifyEmail`, `resendOtp`, `logout`, `refreshSession`). Auto-refreshes tokens via HttpOnly cookies and 401 interceptor in `api.ts`. Supports both 'user' and 'member' roles seamlessly. |
| `auth.types.ts` | implemented | TypeScript interfaces for payloads, user objects, UserRole ('user' | 'member' | 'de' | 'admin'), and API response structures. |

## Next steps

- [x] Login / register forms API integration
- [x] Email OTP verification UI & flow
- [x] Session token persistence
- [x] HttpOnly Cookie refresh token & automatic 401 token refresh interceptor
- [x] Support both 'user' and 'member' roles in backend schema, guards and frontend types
- [ ] Protected profile route middleware & session guards

## Related

- [Master progress](../../PROGRESS.md)
- [Architecture](../../architecture/architecture-design.md)
