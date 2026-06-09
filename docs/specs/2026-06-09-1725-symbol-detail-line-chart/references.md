# References for Symbol Detail Line Chart

## Similar Implementations

### Stock Detail Screen

- **Location:** `apps/native/features/stocks/screens/stock-detail-screen.tsx`
- **Relevance:** Existing symbol detail UI that will host the new chart section
- **Key patterns:** Header and back navigation, hero card, stat grid, theme-based card styling

### Stocks Feature Data Hooks

- **Location:** `apps/native/features/stocks/hooks/use-stock-detail.ts`
- **Relevance:** Existing React Query pattern for loading symbol-specific data
- **Key patterns:** Feature-scoped data hook, request enablement by symbol, stable query keys

### Stocks Feature API Helpers

- **Location:** `apps/native/features/stocks/utils/stock-api.ts`
- **Relevance:** Existing authenticated fetch wrapper and stock endpoint helpers
- **Key patterns:** Shared JSON loader, server URL usage, cookie forwarding, API error normalization

### Stocks Server Module

- **Location:** `apps/server/src/modules/stocks/stocks.routes.ts`, `apps/server/src/modules/stocks/stocks.service.ts`
- **Relevance:** Existing Hono route structure and Finnhub integration to extend with history data
- **Key patterns:** Auth gate middleware, schema validation, `toApiError`, Finnhub fetch caching, normalized response shapes

### Dashboard Chart Section

- **Location:** `apps/native/features/dashboard/components/chart-section.tsx`
- **Relevance:** Existing use of `react-native-gifted-charts` already present in the app
- **Key patterns:** Theme-driven chart colors, lightweight presentational chart component
