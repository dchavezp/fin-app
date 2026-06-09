# Symbol Detail Line Chart Plan

## Task 1: Save Spec Documentation

Create `docs/specs/2026-06-09-1725-symbol-detail-line-chart/` with:

- `plan.md` - full implementation plan
- `shape.md` - shaping notes and decisions
- `standards.md` - standards that apply to this work
- `references.md` - repo patterns studied during shaping
- `visuals/` - empty for now

## Task 2: Add Backend Stock History Support

- Add a stock history endpoint under the existing stocks module
- Support timeframe inputs for the symbol detail chart
- Fetch and normalize Finnhub historical series data for native chart consumption
- Keep response and error handling aligned with the existing stocks routes

## Task 3: Extend Native Stocks Data Layer

- Add chart and timeframe types inside `features/stocks/`
- Add a stock history fetch utility next to the existing stock API helpers
- Add a React Query hook for chart history loading and timeframe switching
- Keep transformations and request state out of the screen component

## Task 4: Build Symbol Detail Chart UI

- Add a line chart section to the existing stock detail screen
- Add timeframe tabs such as `1D`, `1W`, `1M`, and `1Y`
- Show loading, empty, and error states clearly within the detail flow

## Task 5: Refine Layout and Integration

- Fit the chart cleanly into the existing hero and stats layout
- Reuse FIN_DATA_THEME tokens and presentational patterns already used in the app
- Keep new feature code inside `apps/native/features/stocks/`

## Task 6: Verify

- Run type checks
- Run Biome
- Manually verify chart rendering, timeframe switching, loading states, and error states
- Document remaining testing gaps
