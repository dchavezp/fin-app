# Standards for Stock Picker Integration

The following standards apply to this work.

---

## native/expo-router

Navigation structure: `Stack > Drawer > Tabs > Screens`

- **Stack** (`_layout.tsx`) — Root layout, wraps all navigation. Modals sit directly on the stack (bypass drawer/tabs).
- **Drawer** (`(drawer)/_layout.tsx`) — Main app shell with side menu. Contains tabs and standalone screens.
- **Tabs** (`(drawer)/(tabs)/_layout.tsx`) — Bottom tab navigation for primary sections.

### Rules
- Modals go at the Stack level, outside the Drawer
- Standalone screens (not in tabs) go at the Drawer level
- Screens within a tab section go inside `(tabs)/`
- This hierarchy prevents visual glitches and keeps navigation predictable

---

## native/hooks-architecture

### Separation of Concerns
- Components are markup only — no business logic
- All state logic, API calls, and side effects go in custom hooks

### SOLID Hook Boundaries
- Prefer custom hooks when a component mixes rendering with state transitions, form orchestration, API calls, navigation decisions, subscriptions, or derived business rules
- Keep hooks single-purpose: one hook should own one coherent behavior
- Return a small, stable interface from hooks: values, status flags, and event handlers
- Keep components declarative: components should compose hooks and render UI, while hooks coordinate behavior and dependencies
- Keep schemas, constants, and pure utilities outside hooks when they can be reused or tested independently

### Performance Guards
- Always remove listeners in `useEffect` return
- Wrap callbacks in `useCallback` to prevent expensive child re-renders

### State Storage Strategy
- Server data → `@tanstack/react-query`
- UI client state → Zustand
- Persistent device storage → `expo-secure-store` or MMKV

---

## native/ui-constraints

### Color Tokens
- Uppercase 6-char hex codes only: `#FFFFFF` not `#FFF` or `#fff`

### Layout Rules
- No raw text nodes — Every string must be inside a `<Text>` component
- No string percentages — Use `flex: 1`, `alignItems: "center"` instead of `padding: "5%"`
- `StyleSheet.create` outside components — inline styles only for dynamic values

### Component Patterns
- Use `memo` for pure presentational components
- Use `Pressable` over `TouchableOpacity`
- Export named functions, not default exports

---

## native/theme-tokens

Native UI must use shared theme objects from `apps/native/lib/constants.ts` instead of duplicating design literals inside components.

Use `NAV_THEME` for React Navigation shell colors. Use `FIN_DATA_THEME` for product UI surfaces.

### Rules
- Uppercase 6-char hex — never `#FFF` or `#fff`
- Semantic names for colors, spacing, radii, sizes, and typography
- Tagged `as const` for strict typing
- Apply via `StyleSheet.create()` referencing theme tokens
- Use `@expo/vector-icons` for iconography

---

## global/directory-structure

### Rules
- `app/` files = routing & navigation ONLY — no styling, no business logic
- `components/` is for app-wide reusable UI only; feature-specific components go under `features/{feature}/components/`
- Feature logic, schemas, constants, and utilities stay with the feature under `features/{feature}/`
- Business logic goes in custom hooks under `features/{feature}/hooks/`
- Theme tokens go in `theme/`
