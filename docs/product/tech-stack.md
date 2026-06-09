# Tech Stack

## Frontend

- **Framework:** Expo (React Native) SDK 54
- **Routing:** Expo Router v6 (Stack > Drawer > Tabs)
- **Auth Client:** Better-Auth with expo-secure-store
- **State/Data:** @tanstack/react-query for server data, Zustand for UI state
- **Forms:** @tanstack/react-form with Zod validation
- **Styling:** React Native StyleSheet.create with HSL/hex theme tokens
- **Notifications:** Firebase Cloud Messaging (FCM)
- **Charts:** (to be determined — for stock price graphs)

## Backend

- **Runtime:** Node.js with Hono framework
- **Server:** @hono/node-server on port 3000
- **Auth:** Better-Auth with Drizzle adapter
- **Build:** tsdown (ESM bundler, internal packages inlined)

## Database

- **Database:** PostgreSQL
- **ORM:** Drizzle ORM with drizzle-orm/node-postgres driver
- **Schema:** Better-Auth tables (user, session, account, verification)

## External APIs

- **Stock Data:** Finnhub API (real-time stock quotes, price data)

## DevOps

- **Orchestration:** Docker (planned for backend deployment)
- **Monorepo:** pnpm workspaces with Turbo
- **Lint/Format:** Biome

## Environment

- **Validation:** @t3-oss/env-core with Zod schemas
- **Split:** Server env (DATABASE_URL, BETTER_AUTH_SECRET) vs Native env (EXPO_PUBLIC_SERVER_URL)
