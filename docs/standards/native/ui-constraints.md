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
