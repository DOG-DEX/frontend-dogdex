# frontend-dogdex

Dog breed identification app — Next.js frontend with feature-sliced architecture.

## Quick start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000/en](http://localhost:3000/en).

## Documentation

Start with **[docs/START_HERE.md](./docs/START_HERE.md)** (Vietnamese onboarding).

| Doc | Purpose |
|-----|---------|
| [docs/README.md](./docs/README.md) | Documentation hub |
| [docs/architecture/architecture-design.md](./docs/architecture/architecture-design.md) | Source structure & conventions |
| [docs/PROGRESS.md](./docs/PROGRESS.md) | Build progress dashboard |

## Source layout

```
src/
├── app/           # Routes only — thin wrappers
├── components/    # SiteNav, SiteFooter
├── features/      # auth, dogs, scan, profile, home
├── i18n/          # next-intl
├── lib/           # env, utils
├── shared/        # types, hooks, constants
└── proxy.ts       # i18n routing proxy
```

## Environment

```env
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
