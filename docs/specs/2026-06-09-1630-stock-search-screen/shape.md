# Stock Search Screen - Shaping Notes

## Scope

Build a stock search flow for the native app that opens on a new screen outside tabs, supports back navigation, shows a search input at the top, shows a filter row below it, renders a list of stocks with a two-letter initials badge, and opens a stock detail screen when a row is tapped.

## Decisions

- Use a standalone authenticated screen outside `(tabs)` to satisfy the navigation requirement.
- Treat this as a real data feature, not a mock-only UI.
- Use `All`, `Gainers`, `Losers`, and `Most Active` as the initial search filters.
- Open a stock detail screen when a stock row is tapped.
- Create a new `stocks` feature area instead of extending dashboard-only files.

## Context

- **Visuals:** None provided.
- **References:** `apps/native/app/_layout.tsx`, `apps/native/app/(drawer)/_layout.tsx`, `apps/native/app/(drawer)/(tabs)/_layout.tsx`, `apps/native/features/dashboard/screens/home-screen.tsx`, `apps/native/features/dashboard/components/watchlist-section.tsx`, `apps/native/components/container.tsx`
- **Product alignment:** Matches the product mission and roadmap items for stock listing and stock information on mobile.

## Standards Applied

- `native/expo-router` - standalone non-tab screens belong at the drawer level.
- `native/hooks-architecture` - search, filter, navigation, and data logic should live in focused hooks.
- `native/ui-constraints` - use `StyleSheet.create`, `Pressable`, and proper React Native layout patterns.
- `native/theme-tokens` - use shared FinData theme tokens instead of local color objects.
- `global/directory-structure` - keep route files thin and place feature code in `apps/native/features/stocks/`.
- `global/testing` - verify hook logic and core user paths, while noting the repo does not yet have a test runner installed.
