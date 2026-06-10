# References for Notifications Tab and Rules Rename

## Similar Implementations

### Home Screen

- **Location:** `apps/native/features/dashboard/screens/home-screen.tsx`
- **Relevance:** Current Home screen renders the Recent notifications section.
- **Key patterns:** Remove notification history from the Home content list while preserving the existing dashboard sections and theme usage.

### Notification History Preview

- **Location:** `apps/native/features/notifications/components/notification-history-preview-section.tsx`
- **Relevance:** Existing compact notification list behavior to expand into a full tab screen.
- **Key patterns:** Reuse `useNotificationHistory`, `NotificationEventCard`, `NotificationEmptyState`, and mark-read-on-press behavior.

### Alerts Screen

- **Location:** `apps/native/features/alerts/screens/alerts-screen.tsx`
- **Relevance:** Current rule list screen already uses Rules copy and manages price rule navigation.
- **Key patterns:** Preserve existing rule list behavior and `/alerts` route navigation.

### Tab Layout

- **Location:** `apps/native/app/(drawer)/(tabs)/_layout.tsx`
- **Relevance:** Defines bottom tab names, labels, icons, and route matching.
- **Key patterns:** Add `notifications` as a tab, keep `alerts` route name, change visible title to Rules.
