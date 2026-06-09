# Dashboard Market Watch — Implementation Plan

## Task 1: Save Spec Documentation
- shape.md — Shaping decisions and scope
- plan.md — This plan
- standards.md — Relevant standards
- references.md — Pointers to Stitch design and auth feature
- visuals/ — Stitch screenshot reference

## Task 2: Install Chart Dependencies
- `react-native-gifted-charts` — Ring/donut chart
- `expo-linear-gradient` — Chart gradient fills
- `react-native-svg` — Gifted charts dependency

## Task 3: Create Dashboard Feature Structure
```
features/dashboard/
├── components/
│   ├── market-overview-card.tsx
│   ├── category-cards.tsx
│   ├── watchlist-section.tsx
│   ├── chart-section.tsx
│   └── report-button.tsx
├── hooks/
│   ├── use-market-overview.ts
│   ├── use-watchlist.ts
│   └── use-chart-data.ts
└── constants.ts
```

## Task 4: Build Components
- MarketOverviewCard — Value, gain %, open price
- CategoryCards — Row of 3 icon cards
- WatchlistSection — Stock cards with price/changes
- ChartSection — Ring/donut chart
- ReportButton — Full-width CTA

## Task 5: Wire Data Fetching Hooks
- useMarketOverview, useWatchlist, useChartData
- Mock data fallback, Finnhub API ready structure

## Task 6: Replace Home Screen
- Swap drawer/index.tsx to use DashboardScreen

## Task 7: Type Check and Biome
- pnpm check-types
- pnpm check
