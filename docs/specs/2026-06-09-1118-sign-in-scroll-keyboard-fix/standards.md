# Standards for Sign-In Scroll Keyboard Fix

The following standards apply to this work.

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

## global/quality-controls

# Monorepo Quality Controls

## Commit Hooks (Husky + lint-staged)
```json
// package.json
{
  "lint-staged": {
    "*.{js,ts,jsx,tsx,json,jsonc}": ["biome check --write ."]
  }
}
```

Pre-commit hook runs Biome on staged files — non-compliant code is blocked from commit.

## Biome Enforcement
Biome replaces Prettier + ESLint entirely. See `global/biome.md` for full config.

## Type Checking
```sh
pnpm check-types   # turbo check-types (all packages)
```

- `verbatimModuleSyntax` enforced — must use `import type` for type-only imports
- `noUnusedLocals`, `noUnusedParameters` — strict

## Build Pipeline
```sh
pnpm build         # turbo build
```

Package dependency order: `server -> auth -> db -> env` (turbo handles automatically).

## Rules
- Never skip lint-staged or commit hooks
- Fix all Biome errors before committing
- Fix all type errors before merging
