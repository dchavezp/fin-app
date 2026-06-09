# AGENTS.md — finn-app

**Better-T-Stack** monorepo: Expo native (SDK 54) + Hono server + PostgreSQL (Drizzle) + Better-Auth.

## Commands

```sh
pnpm dev              # runs all apps via turbo
pnpm dev:server       # turbo -F server dev
pnpm dev:native       # turbo -F native dev
pnpm check-types      # turbo check-types (all packages)
pnpm check            # biome check --write .  (lint+format+organize imports)
pnpm build            # turbo build
pnpm db:push          # push schema to DB (turbo -F @finn-app/db db:push)
pnpm db:generate      # generate Drizzle migrations
pnpm db:migrate       # run migrations
pnpm db:studio        # Drizzle Studio UI
pnpm prepare          # init husky hooks
```

Single-package filtering: `turbo -F <package-name> <task>`

## Subagent workflow

When a plan is approved and work moves into build mode, call the project subagents before or during implementation:

- `native-agent` — use for tasks touching `apps/native/`, Expo Router, React Native UI, native auth client, forms, or theme tokens.
- `be-agent` — use for tasks touching `apps/server/`, `packages/auth/`, `packages/db/`, `packages/env/`, Hono, Better Auth, Drizzle, or server env validation.
- `qa-agent` — use after implementation for verification strategy, command results, regression risks, and testing gaps.
- `review-agent` — use before final response for non-trivial changes to identify bugs, security issues, regressions, and missing tests.

For full-stack work, call both `native-agent` and `be-agent`; then run `qa-agent` and `review-agent` after changes are implemented. Keep subagent use proportional for small fixes, but do not skip QA/review on significant feature work.

## Monorepo layout

```
apps/server/    Hono backend — entry: src/index.ts, listen :3000
apps/native/    Expo (bare) — entry: expo-router/entry, app/ file-based routes
packages/auth/  Better-Auth setup — exports createAuth() + singleton auth
packages/db/    Drizzle ORM — exports createDb() + singleton db
packages/env/   Env validation (@t3-oss/env-core + Zod) — split exports: @finn-app/env/server, @finn-app/env/native
packages/config/ Shared tsconfig.base.json
```

Dependency graph: `server ← auth ← db ← env` (build order matters, turbo handles it).

## Key wiring

- **Server** (`apps/server/src/index.ts`): logger + CORS middleware, `/api/auth/*` → `auth.handler()`, `GET /` → `"OK"`.
- **Auth** (`packages/auth/src/index.ts`): Better-Auth with Drizzle adapter (PG), email/password, expo() plugin. Cookies use `sameSite:none, secure:true` (cross-origin for mobile). Trusted origins include \`finn-app://\`, `exp://`, `http://localhost:8081`.
- **DB** (`packages/db/src/index.ts`): `drizzle(env.DATABASE_URL, { schema })`. Singleton created at import time — fine for server, re-create for tests.
- **Env** (`packages/env/src/server.ts`): validates `DATABASE_URL`, `BETTER_AUTH_SECRET` (min 32), `BETTER_AUTH_URL`, `CORS_ORIGIN`, `NODE_ENV`. `emptyStringAsUndefined: true` — empty strings fail `.min(1)` checks.
- **Expo client** (`apps/native/lib/auth-client.ts`): `createAuthClient` with `@better-auth/expo` plugin, stores tokens in `expo-secure-store`. Scheme from \`app.json\` (\`finn-app\`).
- **Expo SDK 54**: downgraded from SDK 56 (incompatible with Expo Go on App Store). SDK 54 uses RN 0.81 + React 19.1. Expo-* packages use independent pre-55 versioning (e.g., `expo-constants ~18.0.0`, `expo-router ~6.0.0`). `@expo/ui` universal components were removed — replaced with React Native equivalents.

## Config quirks

- `.npmrc`: `node-linker=isolated` — pnpm creates node_modules per-dep, no traditional hoisting.
- **Server build** (`tsdown.config.ts`): `noExternal: [/@finn-app\/.*/]` — internal packages bundled into single ESM output (`dist/index.mjs`).
- **Drizzle config** (`packages/db/drizzle.config.ts`): reads `DATABASE_URL` from `../../apps/server/.env` (relative to db package). Not run through `@finn-app/env` validation.
- **Biome** (`biome.json`): tab indents, double quotes, organize imports on assist, sorted classes via `clsx`/`cva`/`cn`
- **tsconfig**: `verbatimModuleSyntax` — must use `import type` for type-only imports. `noUnusedLocals`, `noUnusedParameters` — strict.
- **Env**: Catalog versions in `pnpm-workspace.yaml` (`typescript ^6`, `better-auth 1.6.11`, `zod ^4.1.13`). Use `catalog:` in package.json to pin.
- **No test framework** is installed. The repo has no test runner or test files yet.

## Structure conventions

- `apps/server/src/index.ts` is the server main. Routes are flat or organized under `src/` (no router file yet).
- `apps/native/app/` is Expo Router file-based routing. Routes are Stack → Drawer → Tabs nested.
- `packages/*/src/index.ts` is the default export entrypoint.
- No `.env` files are committed (in `.gitignore`). Each app has its own `.env` (pre-existing).
- `bts.jsonc` is scaffolding metadata — safe to delete.

## Native architecture

- Apply SOLID boundaries in native UI: components should stay declarative and render markup; move state transitions, form orchestration, API calls, navigation decisions, subscriptions, keyboard behavior, and derived business rules into focused custom hooks.
- Keep custom hooks single-purpose with small return interfaces. Do not extract trivial one-line state unless it reduces component responsibility or improves reuse/testability.
- Use feature folders for feature-specific native code: `apps/native/features/{feature}/components`, `hooks`, `schemas`, `constants`, and `utils`. Keep `apps/native/components` for app-wide reusable UI only.
- Define schemas, constants, and pure utilities once in the feature folder and import them. Do not duplicate validation rules or bury reusable helpers inside components/hooks.
