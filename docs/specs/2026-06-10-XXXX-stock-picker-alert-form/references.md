# References for Stock Picker Integration

## Similar Implementations

### Stock Search Screen

- **Location:** `apps/native/features/stocks/screens/stock-search-screen.tsx`
- **Relevance:** Reference UI layout — search bar, filter chips, FlatList results. The stock picker will follow the same visual pattern but with different navigation behavior.
- **Key patterns:** Full-screen search with `useStockSearch` hook, `StockSearchRow` component for results, filter chip row, state handling (loading, too-short, error, empty).

### Stock Search Hook

- **Location:** `apps/native/features/stocks/hooks/use-stock-search.ts`
- **Relevance:** Core search logic with 250ms debounce, TanStack Query integration, and filter management. Reused directly by the stock picker.
- **Key patterns:** Debounce via `useEffect` + `setTimeout`, query enabled condition, return interface with `stocks`, `isPending`, `isError`, `isQueryTooShort`.

### Stock Search Row Component

- **Location:** `apps/native/features/stocks/components/stock-search-row.tsx`
- **Relevance:** Reusable memoized row for stock results. Reused directly.
- **Key patterns:** `memo`, `Pressable`, theme tokens, stock information display (symbol, name, price, change).

### Stock Search API

- **Location:** `apps/native/features/stocks/utils/stock-api.ts`
- **Relevance:** Backend integration for stock search — already wired and working.

### Stock Types

- **Location:** `apps/native/features/stocks/types.ts`
- **Relevance:** `StockListItem` type used by the picker screen.

### Alerts Navigation Routes

- **Location:** `apps/native/app/(drawer)/(tabs)/alerts/_layout.tsx`
- **Relevance:** Existing stack layout for alerts sub-routes — the stock picker will be added as a new screen here.
