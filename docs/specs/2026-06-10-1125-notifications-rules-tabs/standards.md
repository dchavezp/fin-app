# Standards for Notifications Tab and Rules Rename

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
// GOOD
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

---

## native/performance

# Performance — Recyclable Lists & Images

## Lists: FlashList over FlatList
- `FlatList` keeps all items in memory — use `@shopify/flash-list` for any scrollable list
- FlashList v2 handles item sizing internally; do not add v1-only sizing props that fail TypeScript

```tsx
import { FlashList } from "@shopify/flash-list";

<FlashList
  data={items}
  renderItem={renderRow}
  keyExtractor={(item) => item.id}
/>
```

## Images: expo-image over <Image>
- `expo-image` provides disk caching, fallback states, WebP/AVIF, and hardware-accelerated transitions
- Standard `<Image>` lacks reliable disk caching

## Rules
- Every scrollable list uses FlashList
- Every remote image uses `expo-image`
- Keep FlashList props aligned with the installed major version
