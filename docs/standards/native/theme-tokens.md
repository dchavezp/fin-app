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
