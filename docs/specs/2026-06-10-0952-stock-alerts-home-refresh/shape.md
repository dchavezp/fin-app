# Stock Alerts Home Refresh - Shaping Notes

## Scope

Build a home alerts module that surfaces up to four stock alerts in a two-column layout and provides routes to manage alerts.

## Decisions

- Keep alert management local to the app for now.
- Use nested Expo Router routes under the Alerts tab.
- Defer real-time Firebase Cloud Messaging work to a later PR.
- Use an empty state when no alerts exist.

## Context

- **Visuals:** None
- **References:** Current home, alerts, and stocks routes in `apps/native/`
- **Product alignment:** Matches the mission and roadmap items for stock alerts

## Standards Applied

- `native/expo-router` - nested drawer/tab/stack routing
- `native/hooks-architecture` - keep state and transitions out of screen markup
- `native/ui-constraints` - follow existing RN styling patterns
- `native/performance` - keep the home preview light and limited to 4 items
