# Standards for Dashboard Market Watch

The following standards apply to this work.

---

## native/hooks-architecture

Custom Hooks Architecture:

- Components are markup only — no business logic
- All state logic, API calls, and side effects go in custom hooks
- Keep hooks single-purpose: one hook should own one coherent behavior
- Return a small, stable interface from hooks
- Keep components declarative: components compose hooks and render UI
- Keep schemas, constants, and pure utilities outside hooks when they can be reused

## native/theme-tokens

- Use `FIN_DATA_THEME` from `lib/constants.ts` for product UI surfaces
- Uppercase 6-char hex — never `#FFF` or `#fff`
- Semantic names for colors, spacing, radii, sizes, and typography
- Tagged `as const` for strict typing
- Apply via `StyleSheet.create()` referencing theme tokens

## native/ui-constraints

- No raw text nodes — every string inside `<Text>` component
- No string percentages — use `flex: 1`, `alignItems: "center"`
- StyleSheet.create outside components
- Use `memo` for pure presentational components
- Use `Pressable` over `TouchableOpacity`
- Export named functions, not default exports

## native/performance

- FlashList for long watchlists (future scaling)
- Use `useCallback` for stable handler references
- Event cleanup in useEffect return

## global/directory-structure

- Features go in `apps/native/features/{feature-name}/`
- Components in `components/`, hooks in `hooks/`
- Constants and utilities at feature root
