# DogDex Frontend Agent Rules

Read [docs/architecture/architecture-design.md](docs/architecture/architecture-design.md) before changing frontend code.

- Keep `src/app` limited to routes, layouts, metadata, and loading/error boundaries.
- Keep business UI, state, and API contracts inside `src/features/<feature>`.
- Use `src/lib/api.ts` for backend requests; never add raw fetch calls in views/components.
- Keep shared UI generic and feature-independent; never import one feature into another.
- Use feature-local types first and promote only genuinely reusable types to `src/shared/types`.
- Run `npm run lint`, `npm run build`, and `pnpm audit --prod` after changes.
- Never commit env secrets or modify another developer's in-progress feature without need.
