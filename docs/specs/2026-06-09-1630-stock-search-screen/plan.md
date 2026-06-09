# Stock Search Screen Plan

## Task 1: Save Spec Documentation

Create `docs/specs/2026-06-09-1630-stock-search-screen/` with:

- `plan.md` - full implementation plan
- `shape.md` - shaping notes and decisions
- `standards.md` - standards that apply to this work
- `references.md` - repo patterns studied during shaping
- `visuals/` - empty for now

## Task 2: Add Standalone Search Routing

- Add a new authenticated route outside tabs
- Keep back navigation available from search and detail screens
- Wire the home screen search affordance to open the new route

## Task 3: Build Stock Search UI

- Header with back button
- Search input below the header
- Filter row with `All`, `Gainers`, `Losers`, and `Most Active`
- Scrollable stock list using a two-letter initials badge instead of icons
- Loading, empty, and error states

## Task 4: Create Feature-Scoped Stocks Logic

- Add a `stocks` feature folder under `apps/native/features/`
- Keep route files thin
- Put search/filter orchestration in hooks
- Keep stock UI presentational where possible

## Task 5: Add Backend Stock Endpoints

- Add stock list/search and stock detail endpoints in the Hono server
- Integrate Finnhub-backed lookups through the backend
- Keep route/module structure aligned with repo standards

## Task 6: Connect Native Data Fetching

- Add native hooks for stock list/search/detail fetching
- Handle loading, empty, and error states cleanly
- Reuse shared stock transformations where possible

## Task 7: Add Stock Detail Screen

- Open the detail screen when a stock row is tapped
- Keep it outside tabs and navigable via back button
- Show backend-provided stock information

## Task 8: Verify

- Run type checks
- Run Biome formatting/linting
- Verify navigation and UI states manually
- Document remaining testing gaps
