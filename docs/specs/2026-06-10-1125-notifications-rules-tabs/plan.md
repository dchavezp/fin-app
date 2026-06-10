# Notifications Tab and Rules Rename Plan

## Scope

Move recent notifications out of the Home screen into a dedicated Notifications tab, and rename the visible Alerts tab experience to Rules while preserving the existing `/alerts` rule-management routes.

## Task 1: Save Spec Documentation

Create `docs/specs/2026-06-10-1125-notifications-rules-tabs/` with:

- `plan.md` - This full plan
- `shape.md` - Shaping notes and decisions
- `standards.md` - Relevant standards for this work
- `references.md` - Reference implementations reviewed
- `visuals/` - Mockups or screenshots, if provided

## Task 2: Add a Dedicated Notifications Tab

- Add a new `notifications` route under `apps/native/app/(drawer)/(tabs)/`.
- Create a full-screen notifications history screen under `apps/native/features/notifications/screens/`.
- Reuse the existing notification history provider, empty state, and event cards.
- Keep notification taps marking events as read and navigating to the related rule when a `ruleId` exists.

## Task 3: Rename Alerts to Rules

- Change visible tab title from Alerts to Rules.
- Keep the route folder and paths as `/alerts`, `/alerts/new`, and `/alerts/[alertId]` to avoid breaking existing navigation.
- Preserve existing create, edit, and delete rule behavior.
- Update screen-level copy where needed so the user-facing language is Rules.

## Task 4: Rewire Home and Navigation

- Remove the Recent notifications section from Home.
- Keep Home focused on market overview, rules preview, watchlist, chart, and report actions.
- Add the Notifications tab with a clear icon and label.
- Verify tab route names match Expo Router files.

## Task 5: Verify

- Run type checking for the affected native app or full workspace.
- Run Biome checks/formatting.
- Review for route regressions, unused imports, and navigation path breakage.
