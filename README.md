# finn-app

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines React Native, Expo, Hono, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **React Native** - Build mobile apps using React
- **Expo** - Tools for React Native development
- **Hono** - Lightweight, performant server framework
- **Node.js** - Runtime environment
- **Drizzle** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Authentication** - Better-Auth
- **Turborepo** - Optimized monorepo build system
- **Biome** - Linting and formatting
- **Husky** - Git hooks for code quality

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

## Database Setup

This project uses PostgreSQL with Drizzle ORM.

1. Make sure you have a PostgreSQL database set up.
2. Update your `apps/server/.env` file with your PostgreSQL connection details.

3. Apply the schema to your database:

```bash
pnpm run db:push
```

Then, run the development server:

```bash
pnpm run dev
```

Use the Expo Go app to run the mobile application.
The API is running at [http://localhost:3000](http://localhost:3000).

## Git Hooks and Formatting

- Initialize hooks: `pnpm run prepare`
- Format and lint fix: `pnpm run check`

## Railway Server Deployment

The server is deployed from the repository root with the root `Dockerfile`. Railway uses `railway.json` to select the Dockerfile builder and `/health` as the deployment health check.

Build the server image locally with:

```bash
pnpm docker:build:server
```

Run the server image locally with:

```bash
pnpm docker:run:server
```

This reads `apps/server/.env` directly.

To keep the server running in Docker Desktop in detached mode, use:

```bash
pnpm docker:start:server
pnpm docker:stop:server
```

Start a local Postgres container with:

```bash
pnpm docker:db:up
```

The database script uses this connection string:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/finapp
```

If the server also runs inside Docker and needs to reach a database on your host machine, use `host.docker.internal` instead of `localhost` because `localhost` inside Docker means the container itself.

Run migrations in Docker with:

```bash
pnpm docker:migrate
```

This command reads `apps/server/.env`, so use your Neon `DATABASE_URL` there for Neon migrations, or use `host.docker.internal` when migrating a database exposed on your host machine.

Required Railway variables:

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

Do not use local Docker values on Railway. `host.docker.internal`, `localhost`, and `127.0.0.1` are only for local development. For Neon, set `DATABASE_URL` to the Neon connection string, usually with `sslmode=require`.

`CORS_ORIGIN` accepts a comma-separated list. Include Expo web origins used in development and any production web origin that calls the API from a browser.

Generate `FCM_SERVICE_ACCOUNT_BASE64` from the Firebase service account JSON:

```bash
base64 -w 0 firebase-service-account.json
```

For local development, keep using a file path instead:

```env
FCM_SERVICE_ACCOUNT_PATH=./secret-config/firebase-service-account.json
```

For Expo on a physical device, point the native app at the machine running the server:

```env
EXPO_PUBLIC_SERVER_URL=http://<your-local-ip>:3000
```

Before production traffic, run database migrations against the Railway database:

```bash
DATABASE_URL="postgresql://..." pnpm db:migrate
```

## Project Structure

```
finn-app/
├── apps/
│   ├── native/      # Mobile application (React Native, Expo)
│   └── server/      # Backend API (Hono)
├── packages/
│   ├── auth/        # Authentication configuration & logic
│   └── db/          # Database schema & queries
```

## Available Scripts

- `pnpm run dev`: Start all applications in development mode
- `pnpm run build`: Build all applications
- `pnpm run dev:server`: Start only the server
- `pnpm run check-types`: Check TypeScript types across all apps
- `pnpm run dev:native`: Start the React Native/Expo development server
- `pnpm run db:push`: Push schema changes to database
- `pnpm run db:generate`: Generate database client/types
- `pnpm run db:migrate`: Run database migrations
- `pnpm run db:studio`: Open database studio UI
- `pnpm run check`: Run Biome formatting and linting
