# Notifications Tab and Rules Rename - Shaping Notes

## Scope

Improve the alerts/notifications UX by moving Recent notifications out of Home into a dedicated Notifications tab, and renaming the Alerts tab to Rules. This reduces information density on Home and separates rule configuration from notification history.

## Decisions

- Keep `/alerts` as the internal route path for rule CRUD to avoid unnecessary navigation churn.
- Rename user-facing Alerts labels to Rules where they represent configurable price rules.
- Add a new Notifications tab for notification history instead of keeping a compact Home preview.
- Reuse existing notification history components and state instead of introducing a new data model.
- No visuals were provided.

## Context

- **Visuals:** None
- **References:** Home screen, notification preview, alerts/rules screen, notification history provider
- **Product alignment:** Matches the mobile-first stock alert product goal while keeping Home focused on dashboard content

## Product Context

The product mission describes a mobile stock tracking app where users set stock price alerts and receive notifications when targets are hit. The roadmap includes alert creation and Firebase Cloud Messaging notifications as MVP work. This spec clarifies the UX separation between rule setup and notification history before deeper push infrastructure is added.

## Standards Applied

- `native/expo-router` - new tab route must stay under the existing Stack > Drawer > Tabs hierarchy
- `native/hooks-architecture` - screen components should reuse focused providers/hooks instead of owning business logic
- `native/ui-constraints` - React Native layout, text, and styling rules apply
- `native/performance` - notification history should be list-conscious and avoid bloating Home
