# DogDex Frontend Testing Strategy & Execution Guide

This document outlines the testing methodology, ESLint static analysis, and build verification procedures for **frontend-dogdex**.

---

## 1. Quality Assurance Commands

```bash
cd frontend-dogdex

# Execute ESLint static code inspection
npm run lint

# Validate Next.js production build compilation
npm run build
```

---

## 2. API Client Behavior (`src/lib/api.ts`)

- Wraps native `fetch` calls with automatic authorization bearer headers.
- Intercepts HTTP 401 `TOKEN_EXPIRED` responses and executes silent background `/api/auth/refresh` before retrying the original request.
