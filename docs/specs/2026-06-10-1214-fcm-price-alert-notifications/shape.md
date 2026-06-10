# FCM Price Alert Notifications — Shaping Notes

## Scope

Wire FCM push notifications when a stock price crosses a user's price alert threshold. This is a full-stack feature: persist alerts to DB, connect to Finnhub WebSocket for real-time trade ticks, evaluate alerts server-side, and send FCM push notifications to iOS + Android via Expo Notifications.

## Decisions

- **Alert persistence:** Migrate from client-only `useState` to DB-backed `price_alert` table
- **Real-time feed:** Finnhub WebSocket (`wss://ws.finnhub.io`) for real-time trade data
- **Push target:** iOS + Android via `expo-notifications` + Firebase Cloud Messaging
- **Server auth:** All new endpoints use Better-Auth session middleware
- **Singleton pattern:** Finnhub WebSocket client uses factory + singleton (per `global/factory-singleton` standard)
- **Hono RPC:** New API routes export types for E2E type safety
- **Alert deduplication:** Avoid repeated FCM sends on subsequent ticks after first trigger

## Context

- **Visuals:** None
- **References:** `alerts-screen`, `notifications`, existing Finnhub REST service (`stocks.service.ts`)
- **Product alignment:** FCM push notifications are Step 5 of the MVP roadmap; the product mission explicitly calls out "Firebase Cloud Messaging push notifications when alert prices are hit"
- **Prior specs:** 3 prior specs (home refresh, rules/notifications home integration, dedicated notifications tab) establish the UI structure this feature plugs into

## Standards Applied

- auth/better-auth — User identity for device token registration & alert ownership
- api/hono-rpc — E2E type safety for new alerts CRUD + token registration endpoints
- global/env-validation — FCM env vars (Firebase credentials)
- global/factory-singleton — FCM server client pattern
- native/hooks-architecture — SOLID hook boundaries for FCM registration, permission flows
- native/expo-router — Notification tap → navigation handling
- global/testing — Test strategy for new code
