# Theme Tokens

Colors are uppercase 6-char hex codes in `theme/colors.ts` using a `COLORS` object with light/dark variants.

```ts
export const COLORS = {
  light: {
    background: "#FFFFFF",
    surface: "#F4F5F7",
    textPrimary: "#111111",
    textSecondary: "#666666",
    primary: "#007AFF",
    error: "#FF3B30",
  },
  dark: {
    background: "#121212",
    surface: "#1E1E1E",
    textPrimary: "#FFFFFF",
    textSecondary: "#A1A1A1",
    primary: "#0A84FF",
    error: "#FF453A",
  },
} as const;
```

## Rules
- Uppercase 6-char hex — never `#FFF` or `#fff`
- Semantic names (background, textPrimary, primary, error, etc.)
- Light and dark variants must both exist
- Tagged `as const` for strict typing
- Apply via `StyleSheet.create()` referencing `COLORS[scheme].tokenName`
