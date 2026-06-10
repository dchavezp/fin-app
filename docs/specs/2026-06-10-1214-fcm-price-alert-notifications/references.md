# References for FCM Price Alert Notifications

## Similar Implementations

### Price Alerts (Client-side)

- **Location:** `apps/native/features/alerts/`
- **Relevance:** UI for creating, editing, deleting, and displaying price alerts
- **Key patterns:** `StockAlertsProvider` context pattern, `StockAlertFormScreen` form validation, `StockAlertCard` display component

### Notification Infrastructure (Client-side)

- **Location:** `apps/native/features/notifications/`
- **Relevance:** Scaffolded notification history, settings, and UI components
- **Key patterns:** `NotificationHistoryProvider` context with SecureStore persistence, `useNotificationPermissionStatus` stub (to be wired), `NotificationSettingsCard` with push toggle (currently disabled)

### Finnhub REST Integration (Server-side)

- **Location:** `apps/server/src/modules/stocks/stocks.service.ts`
- **Relevance:** Existing Finnhub API client with caching, error handling, and type transforms
- **Key patterns:** Singleton cache, error class, `fetchFinnhub<T>` generic pattern, `AbortSignal.timeout`

### Auth-wired Routes (Server-side)

- **Location:** `apps/server/src/modules/stocks/stocks.routes.ts`
- **Relevance:** Pattern for Hono routes with auth middleware, zod validation, error handling, and response envelopes
- **Key patterns:** `auth.api.getSession()` middleware, `safeParse` for query/param validation, error status mapping

### Better-Auth Configuration

- **Location:** `packages/auth/`
- **Relevance:** Session management for identifying users on device token registration
- **Key patterns:** Session hook, auth handler

### Provider Wiring

- **Location:** `apps/native/app/(drawer)/_layout.tsx`
- **Relevance:** Shows how `StockAlertsProvider` and `NotificationHistoryProvider` are mounted in the Drawer layout
- **Key patterns:** Providers wrapped around drawer, keyed by `userId`

### DB Schema

- **Location:** `packages/db/src/schema/auth.ts`
- **Relevance:** Reference for Drizzle table definitions, relations, and timestamp patterns
- **Key patterns:** `pgTable`, `text("id").primaryKey()`, `references()`, timestamps with `defaultNow` + `$onUpdate`
