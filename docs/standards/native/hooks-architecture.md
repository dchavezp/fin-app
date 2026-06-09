# Custom Hooks Architecture

## Separation of Concerns
- Components are markup only — no business logic
- All state logic, API calls, and side effects go in custom hooks

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
