# finn-app

`finn-app` is a Turborepo monorepo for a mobile-first finance application.

- Native app: Expo + React Native + Expo Router
- API server: Hono on Node.js
- Auth: Better Auth with Expo integration
- Database: PostgreSQL + Drizzle ORM
- Tooling: pnpm, Turbo, Biome, Husky

## Overview

The repo is split into two apps and a small set of shared packages:

```text
finn-app/
├── apps/
│   ├── native/    # Expo mobile app
│   └── server/    # Hono API server
├── packages/
│   ├── auth/      # Better Auth server configuration
│   ├── db/        # Drizzle client, schema, migrations
│   ├── env/       # Shared env validation
│   └── config/    # Shared TypeScript config
├── turbo.json
└── package.json
```

Core dependency flow:

```text
apps/server -> packages/auth -> packages/db -> packages/env
apps/native -> packages/env
```

## Architecture

### Native app

- `apps/native/app/` uses Expo Router file-based navigation.
- The root layout provides React Query, navigation theme wiring, and gesture handling.
- `apps/native/lib/auth-client.ts` configures the Better Auth Expo client and stores tokens in `expo-secure-store`.
- Feature code lives under `apps/native/features/*`.

### Server

- `apps/server/src/index.ts` starts the Hono server on port `3000` by default.
- CORS is configured from `CORS_ORIGIN`.
- Auth routes are mounted at `/api/auth/*`.
- Feature routes are mounted under `/api/alerts`, `/api/notifications`, and `/api/stocks`.
- `GET /health` verifies database connectivity.

### Shared packages

- `packages/auth` exports the Better Auth server instance.
- `packages/db` exports the Drizzle database client, schema, and migration helpers.
- `packages/env` validates server and native environment variables with Zod.

## Requirements

- Node.js 20+
- `pnpm` 11+
- PostgreSQL
- Expo Go or a native simulator/device for the mobile app

## Setup

Install dependencies:

```bash
pnpm install
```

Create your local environment files from the examples:

```bash
cp apps/server/.env.example apps/server/.env
cp apps/native/.env.example apps/native/.env
```

Then update the copied files for your machine and credentials.

For variable-by-variable setup details, see [`docs/environment.md`](./docs/environment.md).

Server env lives in `apps/server/.env` and should include at least:

```env
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/finapp
BETTER_AUTH_SECRET=replace-with-at-least-32-characters
BETTER_AUTH_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:8081,http://<your-local-ip>:8081
FINNHUB_API_KEY=...
FCM_PROJECT_ID=...
FCM_SERVICE_ACCOUNT_PATH=./secret-config/firebase-service-account.json
```

Native env is read from Expo public env variables and should include:

```env
EXPO_PUBLIC_SERVER_URL=http://<your-local-ip>:3000
```

Notes:

- Use your machine's LAN IP for `EXPO_PUBLIC_SERVER_URL` when running on a physical device.
- `BETTER_AUTH_SECRET` must be at least 32 characters.
- `CORS_ORIGIN` accepts a comma-separated list of allowed browser origins.
- Server env validation requires either `FCM_SERVICE_ACCOUNT_PATH` or `FCM_SERVICE_ACCOUNT_BASE64`.

## Running The Project

### Run everything

```bash
pnpm dev
```

This starts all Turbo `dev` tasks for the repo.

### Run only the server

```bash
pnpm dev:server
```

Server URL:

```text
http://localhost:3000
```

Health check:

```text
http://localhost:3000/health
```

### Run only the native app

```bash
pnpm dev:native
```

Inside `apps/native`, useful direct Expo commands are:

```bash
pnpm --filter native android
pnpm --filter native ios
pnpm --filter native web
pnpm --filter native prebuild
```

## Database Workflow

Push the current schema to the database:

```bash
pnpm db:push
```

Generate migrations:

```bash
pnpm db:generate
```

Run migrations:

```bash
pnpm db:migrate
```

Open Drizzle Studio:

```bash
pnpm db:studio
```

## Scripts

### Root scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` | Runs all app `dev` tasks through Turbo |
| `pnpm build` | Builds all packages and apps |
| `pnpm check-types` | Runs TypeScript checks across the monorepo |
| `pnpm check` | Runs Biome linting, formatting, and import organization |
| `pnpm prepare` | Initializes Husky hooks |
| `pnpm dev:server` | Runs only the Hono server in watch mode |
| `pnpm dev:native` | Runs only the Expo app |
| `pnpm db:push` | Pushes Drizzle schema to PostgreSQL |
| `pnpm db:generate` | Generates Drizzle migrations |
| `pnpm db:migrate` | Runs Drizzle migrations |
| `pnpm db:studio` | Opens Drizzle Studio |
| `pnpm build:android` | Builds a release Android APK for arm64 |
| `pnpm build:android:aab` | Builds an Android App Bundle |
| `pnpm build:android:apk:arm64` | Builds an arm64 release APK |
| `pnpm build:android:apk:universal` | Builds a universal release APK |
| `pnpm build:android:dev` | Builds a debug Android APK |
| `pnpm docker:db:up` | Starts a local PostgreSQL Docker container |
| `pnpm docker:build:server` | Builds the server Docker image |
| `pnpm docker:run:server` | Runs the server Docker image in the foreground |
| `pnpm docker:start:server` | Runs the server Docker image in detached mode |
| `pnpm docker:stop:server` | Stops the detached server container |
| `pnpm docker:migrate` | Runs migrations from the Docker image |

### Package-level scripts

- `apps/native`: `dev`, `android`, `ios`, `web`, `prebuild`, Android build variants
- `apps/server`: `dev`, `build`, `start`, `compile`, `check-types`
- `packages/db`: `db:push`, `db:generate`, `db:studio`, `db:migrate`

## Development Workflow

Common commands:

```bash
pnpm check
pnpm check-types
pnpm build
```

Notes:

- The repo uses `pnpm` workspaces with `node-linker=isolated`.
- Turbo handles package build ordering.
- The repo currently does not include a dedicated test runner.

## Docker And Railway

The root `Dockerfile` is used for server deployment.

Local Docker helpers:

```bash
pnpm docker:db:up
pnpm docker:build:server
pnpm docker:run:server
```

Railway-focused variables typically include:

```env
NODE_ENV=production
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=at-least-32-characters
BETTER_AUTH_URL=https://your-service.up.railway.app
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
CORS_ORIGIN=http://localhost:8081,http://<your-local-ip>:8081,https://your-web-origin.example.com
FINNHUB_API_KEY=...
FCM_PROJECT_ID=...
FCM_SERVICE_ACCOUNT_BASE64=...
```

If the server runs inside Docker and needs a database on the host machine, use `host.docker.internal` instead of `localhost`.

## Agent Methodology

This repo is set up to work well with code agents. The expected operating style is:

1. Read the codebase before changing it.
2. Prefer the smallest correct change.
3. Keep app-specific logic in the correct boundary.
4. Verify changes with typechecks, linting, or builds when practical.
5. Avoid reverting unrelated user changes in a dirty worktree.

### Agent OS Workflow

This repo also uses the `agent-os` workflow for product context, specs, and standards.

Main commands:

- `plan-product` to create or update `docs/product/mission.md`, `docs/product/roadmap.md`, and `docs/product/tech-stack.md`
- `shape-spec` to plan significant work before implementation and save a spec folder under `docs/specs/`
- `discover-standards` to extract repeatable patterns from the codebase into `docs/standards/`
- `inject-standards` to load relevant standards into the current task context
- `index-standards` to rebuild `docs/standards/index.yml`

Recommended flow:

1. Run `plan-product` when product docs are missing or outdated.
2. Run `discover-standards` to document important repo-specific patterns.
3. Run `index-standards` after adding or removing standards manually.
4. Run `shape-spec` in plan mode for larger features or refactors.
5. Use `inject-standards` before or during implementation so the active task follows repo standards.

What each command produces:

- `plan-product` writes product context in `docs/product/`
- `shape-spec` creates `docs/specs/YYYY-MM-DD-HHMM-feature-slug/`
- `discover-standards` writes concise standards to `docs/standards/<area>/`
- `index-standards` maintains the descriptions used for standard discovery

`shape-spec` workflow expectations:

- it must be run in plan mode
- task 1 is always saving spec documentation before implementation starts
- the spec folder should include `plan.md`, `shape.md`, `standards.md`, `references.md`, and optional `visuals/`

`discover-standards` workflow expectations:

- focus on unusual, opinionated, or repeated repo patterns
- keep standards concise and scannable for agent context windows
- ask why the pattern exists before writing the standard

`inject-standards` usage modes:

- auto-suggest relevant standards from `docs/standards/index.yml`
- inject specific folders or files when the applicable standards are already known

Recommended agent split for non-trivial work:

- `native-agent` for `apps/native` work, Expo Router flows, React Native UI, and mobile auth wiring
- `be-agent` for `apps/server`, `packages/auth`, `packages/db`, and `packages/env`
- `qa-agent` after implementation for verification, regression checks, and testing gaps
- `review-agent` before wrapping up significant changes to catch bugs and missing validation

Native code conventions:

- Keep UI components declarative.
- Move orchestration, navigation decisions, and business rules into focused hooks.
- Put reusable feature code under `apps/native/features/{feature}`.
- Keep `apps/native/components` reserved for app-wide shared UI.

## Quick Start

```bash
pnpm install
pnpm db:push
pnpm dev:server
pnpm dev:native
```

If you're running on a phone, make sure `EXPO_PUBLIC_SERVER_URL` points to your machine's local IP, not `localhost`.
