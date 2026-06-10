# Plan: Stock Picker Integration in Alert Creation Form

## Background

- Wire notification settings on the profile screen — already done
- Stock search screen exists with full functionality (`useStockSearch`, `StockSearchRow`, backend integration)
- Alert creation form uses a plain `TextInput` for stock symbol — users must know tickers by heart

## Tasks

### Task 1: Save Spec Documentation
Create `docs/specs/2026-06-10-XXXX-stock-picker-alert-form/` with plan, shape, standards, and references docs.

### Task 2: Add Stock Picker Route
Create `apps/native/app/(drawer)/(tabs)/alerts/stock-picker.tsx` route file. Register in `alerts/_layout.tsx`.

### Task 3: Create Stock Picker Screen
Create `apps/native/features/alerts/screens/stock-picker-screen.tsx`. Reuses `useStockSearch` and `StockSearchRow`. When a stock is tapped, navigates back to the alert form with `symbol` and `name` params.

### Task 4: Update Alert Form Screen
Replace the symbol `TextInput` with a `Pressable` button. On press, navigates to stock picker. Reads returned symbol from route params.

### Task 5: Verify
Run `pnpm check-types` and `pnpm check`.
