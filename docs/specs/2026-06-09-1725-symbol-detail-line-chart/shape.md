# Symbol Detail Line Chart - Shaping Notes

## Scope

Add a line chart to the existing symbol detail screen in the native app. The first version should use real backend historical price data and include timeframe tabs for switching between ranges such as `1D`, `1W`, `1M`, and `1Y`.

## Decisions

- Build on the existing stock detail screen instead of creating a new screen.
- Use real backend data in the first pass rather than mocked chart series.
- Add timeframe tabs in the first version instead of shipping a fixed single-range chart.
- Keep backend history fetching and native chart orchestration inside the existing stocks feature boundaries.

## Context

- **Visuals:** None
- **References:** `apps/native/features/stocks/screens/stock-detail-screen.tsx`, `apps/native/features/stocks/hooks/use-stock-detail.ts`, `apps/native/features/stocks/utils/stock-api.ts`, `apps/server/src/modules/stocks/stocks.routes.ts`, `apps/server/src/modules/stocks/stocks.service.ts`, `apps/native/features/dashboard/components/chart-section.tsx`
- **Product alignment:** Mobile-first stock tracking and stock chart visualization are explicit MVP goals in `docs/product/mission.md` and `docs/product/roadmap.md`

## Standards Applied

- `native/hooks-architecture` - Keep chart fetching and timeframe behavior in hooks and utilities rather than the screen component.
- `native/theme-tokens` - Reuse existing theme tokens for the chart, tabs, and states.
- `native/ui-constraints` - Follow existing React Native layout and component patterns.
- `global/directory-structure` - Add new stock chart files under `apps/native/features/stocks/` and keep routes thin.
- `global/testing` - Verify request, rendering, and interaction behavior and record the remaining test gaps.
