# Stock Picker Integration — Shaping Notes

## Scope

Replace the plain `TextInput` for stock symbol in the alert creation form with a button that opens a stock picker screen. The picker uses the existing stock search infrastructure to let users browse and select stocks by name or symbol.

## Decisions

- **Dedicated picker screen** inside `features/alerts/` rather than modifying the existing `StockSearchScreen` — keeps feature boundaries clean, avoids coupling
- **Route params** (`symbol`, `name`) to pass selection back to the form — standard Expo Router pattern, works for both create and edit modes
- Reuses `useStockSearch` hook from `features/stocks/` — no duplication of search logic
- Reuses `StockSearchRow` component — consistent stock result rendering
- The picker is a Stack screen within the alerts layout (not a modal at root level) — follows the existing pattern of alerts sub-routes

## Context

- **Visuals:** None
- **References:** Existing `StockSearchScreen`, `useStockSearch` hook, `StockSearchRow` component
- **Product alignment:** Alerts roadmap — Phase 1 includes stock price alert creation form. This improves the UX of that form.

## Standards Applied

- `native/expo-router` — Stack screen added to alerts navigation
- `native/hooks-architecture` — Reuse existing hook, component stays declarative
- `native/ui-constraints` — StyleSheet.create, Pressable, memo, named exports
- `native/theme-tokens` — FIN_DATA_THEME for consistent styling
- `global/directory-structure` — Feature screen in `features/alerts/screens/`, route in `app/(drawer)/(tabs)/alerts/`
