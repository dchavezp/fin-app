# Dashboard — Market Watch (High-Precision)

## Scope

Replace the Home screen with a market overview dashboard featuring:
- Header branding and search/menu icons
- Market Overview card (portfolio value, gain %, open price)
- Category cards (Mutual Funds, Private Equity, Pre-IPO Angel)
- Watchlist section with stock cards (AAPL, TSLA, NVDA)
- Chart section with a ring/donut chart (32% allocation)
- "Download Comprehensive Report" CTA button

## Decisions

- Dashboard replaces `apps/native/app/(drawer)/index.tsx` (Home)
- Uses `react-native-gifted-charts` for the ring/donut chart
- Uses `expo-linear-gradient` for gradient chart styling
- Mock data initially, hooks structured for future Finnhub API integration
- Follows existing `FIN_DATA_THEME` token conventions from `lib/constants.ts`
- Feature folder pattern matching `features/auth/` conventions

## Context

- **Visuals:** Stitch project "Real-Time Stock Monitor" screen "Dashboard - Market Watch (High-Precision)" (ID: a311b583ab0b42e982df2551231a6c30)
- **References:** `features/auth/` for feature folder structure patterns
- **Product alignment:** Roadmap Phase 1 includes stock chart/graph visualization and stock listing view

## Standards Applied

- `native/hooks-architecture` — Extract dashboard logic into focused custom hooks
- `native/theme-tokens` — Use FIN_DATA_THEME for all styling
- `native/ui-constraints` — StyleSheet.create, Pressable, named exports, hex color rules
- `native/performance` — Consider FlashList for future watchlist scaling
- `global/directory-structure` — Feature folder in `features/dashboard/`
