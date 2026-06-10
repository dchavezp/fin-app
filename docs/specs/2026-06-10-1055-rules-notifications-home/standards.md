# Standards for Rules And Notifications Home

The following standards apply to this work.

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

## native/hooks-architecture

# Custom Hooks Architecture

## Separation of Concerns

- Components are markup only — no business logic
- All state logic, API calls, and side effects go in custom hooks

## SOLID Hook Boundaries

- Prefer custom hooks when a component mixes rendering with state transitions, form orchestration, API calls, navigation decisions, subscriptions, or derived business rules
- Keep hooks single-purpose: one hook should own one coherent behavior, such as auth form state, keyboard behavior, session loading, or subscription cleanup
- Return a small, stable interface from hooks: values, status flags, and event handlers needed by the component; do not expose internal implementation details
- Keep components declarative: components should compose hooks and render UI, while hooks coordinate behavior and dependencies
- Do not extract tiny one-line state into hooks unless it reduces component responsibility or improves reuse/testability
- Keep schemas, constants, and pure utilities outside hooks when they can be reused or tested independently

## Performance Guards

- **Event cleanup:** Always remove listeners in `useEffect` return — mobile sessions run longer than web pages, leaked listeners crash the app

```ts
useEffect(() => {
  const sub = AppState.addEventListener("change", setState);
  return () => sub.remove();   // always clean up
}, []);
```

- **Stable references:** Wrap callbacks in `useCallback` to prevent expensive child re-renders

```ts
const handlePress = useCallback(() => { /* ... */ }, [deps]);
```

## State Storage Strategy

- **Server data** → `@tanstack/react-query` (never replicate API data in useState/Zustand)
- **UI client state** → Zustand (cross-cutting: theme, wizard index)
- **Persistent device storage** → `expo-secure-store` (for tokens), MMKV for other persisted data (faster than AsyncStorage)

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

```ts
export const COLORS = {
  light: { background: "#FFFFFF", textPrimary: "#111111" },
  dark: { background: "#121212", textPrimary: "#FFFFFF" },
} as const;
```

## Layout Rules

- **No raw text nodes** — Every string must be inside a `<Text>` component
- **No string percentages** — Use `flex: 1`, `alignItems: "center"` instead of `padding: "5%"`
- **StyleSheet.create outside components** — Define styles outside the render function; inline styles only for dynamic values (animations)

```tsx
// ✅ GOOD
const styles = StyleSheet.create({
  card: { padding: 16, backgroundColor: COLORS.light.surface },
});

export const Card = memo(function Card({ title }: { title: string }) {
  return (
    <View style={styles.card}>
      <Text>{title}</Text>
    </View>
  );
});
```

## Component Patterns

- Use `memo` for pure presentational components
- Use `Pressable` over `TouchableOpacity` for modern gesture handling
- Export named functions, not default exports
