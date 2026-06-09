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
│   │   ├── common/            # Buttons, inputs, text wrappers
│   │   └── feature/           # Feature-scoped components
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
- Components go in `components/` by feature scope
- Business logic goes in custom hooks under `hooks/`
- API client config goes in `lib/`
- Theme tokens go in `theme/`
