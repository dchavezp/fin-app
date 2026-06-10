# Plan: FCM Price Alert Notifications

## Task 1: Save Spec Documentation
Done — saved to `docs/specs/2026-06-10-1214-fcm-price-alert-notifications/`.

## Task 2: Add DB Schema for Alerts & Device Tokens
- `packages/db/src/schema/price-alert.ts` — `priceAlert` table
- `packages/db/src/schema/device-token.ts` — `deviceToken` table
- Re-export from `packages/db/src/schema/index.ts`
- Run `pnpm db:generate` + `pnpm db:push`

## Task 3: Add Server Env Vars for FCM
- Add `FCM_SERVICE_ACCOUNT_JSON` and `FCM_PROJECT_ID` to `packages/env/src/server.ts`

## Task 4: Build Alerts CRUD API (Server)
- `apps/server/src/modules/alerts/alerts.schema.ts` — Zod schemas
- `apps/server/src/modules/alerts/alerts.service.ts` — DB queries
- `apps/server/src/modules/alerts/alerts.routes.ts` — Hono routes
- Mount at `/api/alerts` in server index

## Task 5: Build Device Token Registration API (Server)
- `apps/server/src/modules/notifications/notifications.schema.ts` — Zod schemas
- `apps/server/src/modules/notifications/notifications.service.ts` — DB queries
- `apps/server/src/modules/notifications/notifications.routes.ts` — Hono routes
- Mount at `/api/notifications` in server index

## Task 6: Build Finnhub WebSocket Service (Server)
- `apps/server/src/modules/stocks/finnhub-websocket.ts` — WebSocket client

## Task 7: Build Alert Evaluation Engine (Server)
- `apps/server/src/modules/notifications/alert-evaluator.ts`

## Task 8: Build FCM Push Notification Service (Server)
- `apps/server/src/modules/notifications/fcm.service.ts` — wraps `firebase-admin` SDK

## Task 9: Wire WebSocket → Alert Evaluator → FCM (Server)
- Connect Finnhub trades → evaluator → FCM sender

## Task 10: Install Client Notification Dependencies
- `expo-notifications`, `expo-device`

## Task 11: Build FCM Registration Hook (Client)
- `apps/native/features/notifications/hooks/use-fcm-registration.ts`

## Task 12: Build Notification Handler Hook (Client)
- `apps/native/features/notifications/hooks/use-notification-handler.ts`

## Task 13: Wire Client-Side Hooks into App
- Mount hooks in drawer layout

## Task 14: Migrate StockAlertsProvider to API-Backed (Client)
- Rewrite context to use `@tanstack/react-query` + Hono RPC

## Task 15: Add Client Env Validation for FCM Sender ID
- `EXPO_PUBLIC_FCM_SENDER_ID` in native env

## Task 16: Type Checking & Biome
- `pnpm check-types` and `pnpm check`
