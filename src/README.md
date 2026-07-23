# Source layout — Dog Dex Frontend

Feature-sliced design mapped to Next.js App Router. See [../docs/architecture/architecture-design.md](../docs/architecture/architecture-design.md).

```txt
src/
├── app/                  # Routing, layouts, globals.css
├── components/           # Global composite UI (SiteNav, SiteFooter)
├── features/             # Business modules (auth, dogs, scan, profile, home)
├── i18n/                 # next-intl configuration
├── lib/                  # Utilities and infrastructure clients
├── shared/               # Primitive UI, constants, shared hooks/types
└── proxy.ts              # Next.js proxy (next-intl rewrite & routing)
```

## Rules

- App routes are thin wrappers — delegate to `features/*/views`.
- Feature folders own components, views, hooks, services, messages, styles.
- Shared UI must stay generic with no business logic.
