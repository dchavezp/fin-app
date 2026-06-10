# Rules And Notifications Home — Plan

## Task 1: Save Spec Documentation

Create `docs/specs/2026-06-10-1055-rules-notifications-home/` with:

- `plan.md` — This implementation plan.
- `shape.md` — Shaping notes, scope, product alignment, and decisions.
- `standards.md` — Confirmed native standards for the work.
- `references.md` — Current code references to follow.

## Task 2: Update Alerts Screen Wording

Keep the bottom tab label as `Alerts`, but change the Alerts screen header/title and supporting copy to frame the screen as rule management.

Acceptance criteria:

- The tab label remains `Alerts`.
- The screen title becomes `Rules`.
- Empty, summary, and helper copy explain that users create price rules.
- Existing create, edit, and delete behavior remains unchanged.

## Task 3: Add Home Notifications Preview

Add a compact Home section that previews recent notification events without creating a new notification tab.

Acceptance criteria:

- Home shows a `Recent notifications` or equivalent section.
- The section supports an empty state when no notifications have fired.
- The section previews recent in-app notification history, targeting 3 to 5 items.
- The section stays lightweight and does not become a full inbox.
- Notification preview cards can point to the related stock or alert rule when available.

## Task 4: Add Profile Notification Settings

Add notification configuration to the Profile screen so delivery preferences live outside rule creation.

Acceptance criteria:

- Profile includes a notification settings card or section.
- Users can see push permission status.
- Users can configure whether price alerts create push notifications.
- Settings leave room for quiet hours, sound, and vibration preferences.
- Screen components remain declarative; permission and settings behavior lives in hooks.

## Task 5: Define Shared Notification Data Flow

Define the product and data contract for both push delivery and in-app history.

Acceptance criteria:

- A price rule can create an in-app notification event.
- A triggered price rule can also send an FCM push notification.
- In-app notification history remains visible even if push permission is disabled or delivery fails.
- Notification events include enough data for symbol, target price, trigger price, direction, timestamp, read state, and related rule id.
- Future backend persistence can map cleanly to alerts/rules, device tokens, and notification events.

## Task 6: Verification

Verify the UX and architecture changes after implementation.

Acceptance criteria:

- Run `pnpm check-types` if implementation touches TypeScript code.
- Run `pnpm check` if implementation touches formatted source files.
- Manually inspect Home, Alerts, and Profile in the Expo app.
- Confirm the notification preview, settings copy, and `Rules` title work in light and dark modes.
