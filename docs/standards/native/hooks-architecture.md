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
