# Rules And Notifications Home — Shaping Notes

## Scope

Shape a UX update for the current stock alerts flow:

- Keep the existing bottom tab labeled `Alerts`.
- Rename only the Alerts screen title to `Rules`.
- Add a lightweight Home section for recent in-app notification history.
- Add notification configuration to the Profile screen.
- Support both push notifications via Firebase Cloud Messaging and in-app notification history as product concepts.

## Decisions

- Alerts remain the tab/navigation label for now to avoid a larger navigation rename.
- `Rules` is the clearer screen-level concept because users are configuring price conditions, not reading delivered notifications.
- Notifications should not become a top-level tab in this iteration.
- Home should show only a preview of recent notification events.
- Profile should own notification settings because delivery preferences are account/device-level configuration.
- The app should support both push delivery and in-app history so users can review triggered events even if push delivery is unavailable.
- No visuals were provided for this spec.

## Context

- **Visuals:** None.
- **References:** Existing alerts, Home, and Profile screens in `apps/native/`.
- **Product alignment:** Product docs call for stock price alerts and Firebase Cloud Messaging push notifications when alert thresholds are hit.

## Product Notes

The product mission describes a mobile-first stock tracking app where users set price alerts and receive push notifications when targets are hit. The roadmap already lists Firebase Cloud Messaging push notifications as an MVP item after stock alerts, stock listings, and charts.

This spec keeps the current local alert UX direction but clarifies terminology and placement before push infrastructure is added.

## Standards Applied

- `native/expo-router` — Applies because the feature changes screen placement and tab behavior while avoiding a new top-level notifications tab.
- `native/hooks-architecture` — Applies because notification permission, settings, and delivery state should live outside presentational screen components.
- `native/theme-tokens` — Applies because new Home/Profile UI should reuse `FIN_DATA_THEME` and current theme mode helpers.
- `native/ui-constraints` — Applies because new React Native components must follow app layout and styling constraints.
