# Directory & File Structure

```
apps/
├── server/                    # Hono Backend
│   ├── src/
│   │   ├── index.ts           # Entry point & route definitions
│   │   ├── middlewares/       # Custom middlewares
│   │   ├── modules/           # Domain-driven modules
│   │   │   └── users/
│   │   │       ├── users.routes.ts
│   │   │       └── users.schema.ts
│   │   └── types.ts           # Global backend types
│   ├── package.json
│   └── tsconfig.json
│
├── native/                    # Expo React Native App
│   ├── app/                   # Expo Router file-based routing
│   │   ├── (auth)/            # Authenticated flow groups
│   │   ├── (drawer)/          # Drawer navigation groups
│   │   │   └── (tabs)/        # Tab navigation groups
│   │   ├── _layout.tsx        # Root navigation config
│   │   ├── modal.tsx          # Modal screens at stack level
│   │   └── +not-found.tsx     # 404 fallback
│   ├── components/            # Reusable UI components
│   │   └── common/            # App-wide reusable buttons, inputs, text wrappers
│   ├── features/              # Feature-scoped UI and behavior
│   │   └── auth/
│   │       ├── components/    # Auth-only components
│   │       ├── constants/     # Auth constants and derived config
│   │       ├── hooks/         # Auth orchestration hooks
│   │       ├── schemas/       # Auth Zod schemas
│   │       └── utils/         # Auth-only pure helpers
│   ├── hooks/                 # Custom hooks
│   │   ├── api/               # API consumer hooks
│   │   └── ui/                # Layout/theme hooks
│   ├── lib/                   # Client inits (API clients, storage)
│   └── theme/                 # Style tokens & colors
│
packages/
├── auth/                      # Better-Auth setup
├── db/                        # Drizzle ORM + PostgreSQL
├── env/                       # Env validation (@t3-oss/env-core)
└── config/                    # Shared tsconfig
```

## Rules
- `app/` files = routing & navigation ONLY — no styling, no business logic
- `components/` is for app-wide reusable UI only; feature-specific components go under `features/{feature}/components/`
- Feature logic, schemas, constants, and utilities stay with the feature under `features/{feature}/`
- Business logic goes in custom hooks under `features/{feature}/hooks/` or `hooks/` only when truly app-wide
- Define Zod schemas once in `schemas/` and import them; do not duplicate validation rules in components or hooks
- Put pure helpers in `utils/` and derived configuration in `constants/`; do not hide reusable helpers inside components
- Avoid creating new files at the app root unless they are route files, app-wide components/hooks, or package entrypoints
- API client config goes in `lib/`
- Theme tokens go in `theme/`
