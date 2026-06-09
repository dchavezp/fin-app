# Standards for Stock Search Screen

The following standards apply to this work.

---

## native/expo-router

# Expo Router Navigation Hierarchy

Navigation structure: `Stack > Drawer > Tabs > Screens`

- **Stack** (`_layout.tsx`) - Root layout, wraps all navigation. Modals sit directly on the stack (bypass drawer/tabs).
- **Drawer** (`(drawer)/_layout.tsx`) - Main app shell with side menu. Contains tabs and standalone screens.
- **Tabs** (`(drawer)/(tabs)/_layout.tsx`) - Bottom tab navigation for primary sections.

## Rules
- Modals go at the Stack level, outside the Drawer
- Standalone screens (not in tabs) go at the Drawer level
- Screens within a tab section go inside `(tabs)/`
- This hierarchy prevents visual glitches and keeps navigation predictable

---

## native/hooks-architecture

# Custom Hooks Architecture

## Separation of Concerns
- Components are markup only - no business logic
- All state logic, API calls, and side effects go in custom hooks

## SOLID Hook Boundaries
- Prefer custom hooks when a component mixes rendering with state transitions, form orchestration, API calls, navigation decisions, subscriptions, or derived business rules
- Keep hooks single-purpose: one hook should own one coherent behavior, such as auth form state, keyboard behavior, session loading, or subscription cleanup
- Return a small, stable interface from hooks: values, status flags, and event handlers needed by the component; do not expose internal implementation details
- Keep components declarative: components should compose hooks and render UI, while hooks coordinate behavior and dependencies
- Do not extract tiny one-line state into hooks unless it reduces component responsibility or improves reuse/testability
- Keep schemas, constants, and pure utilities outside hooks when they can be reused or tested independently

## Performance Guards
- **Event cleanup:** Always remove listeners in `useEffect` return - mobile sessions run longer than web pages, leaked listeners crash the app
- **Stable references:** Wrap callbacks in `useCallback` to prevent expensive child re-renders

## State Storage Strategy
- **Server data** -> `@tanstack/react-query` (never replicate API data in useState/Zustand)
- **UI client state** -> Zustand (cross-cutting: theme, wizard index)
- **Persistent device storage** -> `expo-secure-store` for tokens, MMKV for other persisted data

---

## native/ui-constraints

# UI Constraints (React Native)

## Color Tokens
- Uppercase 6-char hex codes only: `#FFFFFF` not `#FFF` or `#fff`

## Layout Rules
- **No raw text nodes** - Every string must be inside a `<Text>` component
- **No string percentages** - Use `flex: 1`, `alignItems: "center"` instead of string percentage values
- **StyleSheet.create outside components** - Define styles outside render functions; inline styles only for dynamic values

## Component Patterns
- Use `memo` for pure presentational components
- Use `Pressable` over `TouchableOpacity` for modern gesture handling
- Export named functions, not default exports

---

## native/theme-tokens

# Theme Tokens

Native UI must use shared theme objects from `apps/native/lib/constants.ts` instead of duplicating design literals inside components.

## Rules
- Uppercase 6-char hex - never `#FFF` or `#fff`
- Semantic names for colors, spacing, radii, sizes, and typography
- Tagged `as const` for strict typing
- Apply via `StyleSheet.create()` referencing theme tokens
- Do not create component-local `COLORS` objects unless they are unavoidable third-party brand colors
- Use `@expo/vector-icons` for iconography already available in the app instead of text placeholders or hand-drawn icon text

---

## global/directory-structure

# Directory & File Structure

## Rules
- `app/` files = routing and navigation only
- `components/` is for app-wide reusable UI only; feature-specific components go under `features/{feature}/components/`
- Feature logic, schemas, constants, and utilities stay with the feature under `features/{feature}/`
- Business logic goes in custom hooks under `features/{feature}/hooks/` or `hooks/` only when truly app-wide
- Define schemas once in `schemas/` and import them; do not duplicate validation rules in components or hooks
- Put pure helpers in `utils/` and derived configuration in `constants/`; do not hide reusable helpers inside components
- Avoid creating new files at the app root unless they are route files, app-wide components/hooks, or package entrypoints

---

## global/testing

# Testing Strategy (Three-Tier)

## A. Unit Tests
- **Scope:** Pure functions, Zod schemas, state logic, utilities
- **Tool:** Vitest

## B. Component & Hook Tests
- **Scope:** Interactive hooks, UI rendering, user interactions
- **Tool:** React Native Testing Library + Vitest
- **Query by accessibility:** Use `getByRole`, `getByLabelText` instead of `testID`

## C. E2E Tests
- **Scope:** Full user journeys
- **Tool:** Maestro

## Rules
- Unit test all Zod schemas and pure transformation functions
- Component tests prefer accessibility queries over `testID`
- E2E covers critical paths only
