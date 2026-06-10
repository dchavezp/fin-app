# Standards for FCM Price Alert Notifications

The following standards apply to this work.

---

## auth/better-auth

### Cookie Settings
- `sameSite: "none"`, `secure: true` — required for cross-origin mobile requests
- `httpOnly: true` — prevents XSS access to tokens

### Trusted Origins
Include all origins that the app can be accessed from:
- Custom app scheme: `finn-app://`
- Expo Go: `exp://`
- Metro dev server: `http://localhost:8081`
- Production server URL (from env `CORS_ORIGIN`)

### Plugins
Always enable the `expo()` plugin for native mobile auth flows (token exchange, secure storage).

---

## api/hono-rpc

### Backend: Define Schema & Routes
```ts
const userSchema = z.object({ name: z.string().min(2), email: z.string().email() });
const routes = app.post("/users/:id", zValidator("json", userSchema), (c) => {
  return c.json({ status: "success", processedId: c.req.param("id") }, 201);
});
export type AppType = typeof routes;
```

### Frontend: Typesafe Client
```ts
import { hc } from "hono/client";
import type { AppType } from "@finn-app/server/src/index";
export const api = hc<AppType>(process.env.EXPO_PUBLIC_SERVER_URL!);
```

### Rules
- Always validate with `zValidator` at the route level
- Export `AppType` from the server entry point
- Client uses `hc<AppType>()` — never type individual endpoints manually

---

## global/env-validation

Use `@t3-oss/env-core` with Zod schemas for type-safe env vars.

### Split Exports
- `@finn-app/env/server` — Server-only vars (DATABASE_URL, BETTER_AUTH_SECRET, etc.)
- `@finn-app/env/native` — Public client vars (EXPO_PUBLIC_SERVER_URL)
- Prevents server secrets from leaking into the mobile bundle

### Configuration
- `emptyStringAsUndefined: true` — Empty strings trigger min-length validation
- Zod schemas use `.min(1)` for required fields
- Server module loads `.env` via `import "dotenv/config"`
- Native does not load dotenv (handled by Expo)

---

## global/factory-singleton

Packages that manage shared state (DB, auth clients) export both:
- `create*()` factory function — for tests and re-creation
- Singleton instance — created at import time for production use

```ts
export function createDb() { return drizzle(env.DATABASE_URL, { schema }) }
export const db = createDb()
```

- Singleton is the default for production (imported by server)
- Factory is for tests that need a fresh instance
- Singleton is created at module import time, not lazily

---

## native/hooks-architecture

### Separation of Concerns
- Components are markup only — no business logic
- All state logic, API calls, and side effects go in custom hooks

### SOLID Hook Boundaries
- Keep hooks single-purpose: one hook owns one coherent behavior
- Return a small, stable interface from hooks
- Keep components declarative
- Do not extract tiny one-line state into hooks unless it reduces component responsibility
- Keep schemas, constants, and pure utilities outside hooks

### Performance Guards
- **Event cleanup:** Always remove listeners in `useEffect` return
- **Stable references:** Wrap callbacks in `useCallback` to prevent expensive child re-renders

### State Storage Strategy
- **Server data** → `@tanstack/react-query` (never replicate API data in useState/Zustand)
- **UI client state** → Zustand
- **Persistent device storage** → `expo-secure-store` (for tokens), MMKV for other persisted data

---

## native/expo-router

Navigation structure: `Stack > Drawer > Tabs > Screens`

- **Stack** — Root layout, wraps all navigation. Modals sit directly on the stack.
- **Drawer** — Main app shell with side menu. Contains tabs and standalone screens.
- **Tabs** — Bottom tab navigation for primary sections.

### Rules
- Modals go at the Stack level, outside the Drawer
- Standalone screens go at the Drawer level
- Screens within a tab section go inside `(tabs)/`

---

## global/testing

Three-tier testing strategy:
- **Unit Tests (Vitest):** Pure functions, Zod schemas, state logic, utilities
- **Component Tests (RNTL + Vitest):** Interactive hooks, UI rendering, user interactions. Query by accessibility (`getByRole`, `getByLabelText`).
- **E2E (Maestro):** Full user journeys (auth, token refresh, deep links)

### Rules
- Unit test all Zod schemas and pure transformation functions
- Component tests prefer accessibility queries over testID
- E2E covers critical paths only
