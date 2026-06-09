# Standards for Auth Flow

The following standards apply to this work.

---

## auth/better-auth

# Better-Auth Configuration

## Cookie Settings
- `sameSite: "none"`, `secure: true` — required for cross-origin mobile requests
- `httpOnly: true` — prevents XSS access to tokens

## Trusted Origins
Include all origins that the app can be accessed from:
- Custom app scheme: `finn-app://`
- Expo Go: `exp://`
- Metro dev server: `http://localhost:8081`
- Production server URL (from env `CORS_ORIGIN`)

## Plugins
Always enable the `expo()` plugin for native mobile auth flows (token exchange, secure storage).

---

## native/expo-router

# Expo Router Navigation Hierarchy

Navigation structure: `Stack > Drawer > Tabs > Screens`

- **Stack** (`_layout.tsx`) — Root layout, wraps all navigation. Modals sit directly on the stack (bypass drawer/tabs).
- **Drawer** (`(drawer)/_layout.tsx`) — Main app shell with side menu. Contains tabs and standalone screens.
- **Tabs** (`(drawer)/(tabs)/_layout.tsx`) — Bottom tab navigation for primary sections.

## Rules
- Modals go at the Stack level, outside the Drawer
- Standalone screens (not in tabs) go at the Drawer level
- Screens within a tab section go inside `(tabs)/`
- This hierarchy prevents visual glitches and keeps navigation predictable

---

## native/theme-tokens

# Theme Tokens

Native UI must use shared theme objects from `apps/native/lib/constants.ts` instead of duplicating design literals inside components.

Use `NAV_THEME` for React Navigation shell colors. Use `FIN_DATA_THEME` for product UI surfaces and the FinData Pro visual language.

```ts
export const FIN_DATA_THEME = {
  colors: {
    background: "#020401",
    primary: "#CDF200",
    text: "#F7F7F7",
    muted: "#858585",
    input: "#111111",
    line: "#1B1B1B",
  },
  spacing: { sm: 8, md: 12, lg: 14 },
  radii: { md: 8, lg: 9 },
  typography: { body: 14, caption: 12 },
} as const;
```

## Rules
- Uppercase 6-char hex — never `#FFF` or `#fff`
- Semantic names for colors, spacing, radii, sizes, and typography
- Tagged `as const` for strict typing
- Apply via `StyleSheet.create()` referencing theme tokens, e.g. `FIN_DATA_THEME.colors.primary`
- Do not create component-local `COLORS` objects unless the values are one-off third-party brand colors and cannot belong to the project theme
- Use `@expo/vector-icons` for iconography already available in the app instead of text placeholders or hand-drawn icon text

---

## native/ui-constraints

# UI Constraints (React Native)

## Color Tokens
- Uppercase 6-char hex codes only: `#FFFFFF` not `#FFF` or `#fff`
- Some Android engines fail on shorthand hex under re-render stress

## Layout Rules
- **No raw text nodes** — Every string must be inside a `<Text>` component
- **No string percentages** — Use `flex: 1`, `alignItems: "center"` instead of `padding: "5%"`
- **StyleSheet.create outside components** — Define styles outside the render function; inline styles only for dynamic values (animations)

## Component Patterns
- Use `memo` for pure presentational components
- Use `Pressable` over `TouchableOpacity` for modern gesture handling
- Export named functions, not default exports

---

## global/env-validation

# Environment Variable Validation

Use `@t3-oss/env-core` with Zod schemas for type-safe env vars.

## Split Exports
- `@finn-app/env/server` — Server-only vars (DATABASE_URL, BETTER_AUTH_SECRET, etc.)
- `@finn-app/env/native` — Public client vars (EXPO_PUBLIC_SERVER_URL)
- Prevents server secrets from leaking into the mobile bundle

## Configuration
- `emptyStringAsUndefined: true` — Empty strings trigger min-length validation
- Zod schemas use `.min(1)` for required fields
- Server module loads `.env` via `import "dotenv/config"`
- Native does not load dotenv (handled by Expo)

---

## global/quality-controls

# Monorepo Quality Controls

## Type Checking
```sh
pnpm check-types
```

- `verbatimModuleSyntax` enforced — must use `import type` for type-only imports
- `noUnusedLocals`, `noUnusedParameters` — strict

## Build Pipeline
```sh
pnpm build
```

Package dependency order: `server → auth → db → env` (turbo handles automatically).

## Rules
- Never skip lint-staged or commit hooks
- Fix all Biome errors before committing
- Fix all type errors before merging

---

## global/testing

# Testing Strategy (Three-Tier)

```text
Unit Tests          Component Tests           E2E Tests
(Vitest)            (RNTL + Vitest)           (Maestro)
```

## A. Unit Tests
- **Scope:** Pure functions, Zod schemas, state logic, utilities
- **Tool:** Vitest (faster than Jest in monorepo, uses ESBuild)

## B. Component & Hook Tests
- **Scope:** Interactive hooks, UI rendering, user interactions
- **Tool:** React Native Testing Library + Vitest
- **Query by accessibility:** Use `getByRole`, `getByLabelText` — not `testID`

## C. E2E Tests
- **Scope:** Full user journeys (registration, token refresh, deep links)
- **Tool:** Maestro (YAML-based, runs on native layout hierarchy)

## Rules
- Unit test all Zod schemas and pure transformation functions
- Component tests prefer accessibility queries over testID
- E2E covers critical paths only (auth flow, core screens)
