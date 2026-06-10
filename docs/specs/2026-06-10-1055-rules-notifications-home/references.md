# References for Rules And Notifications Home

## Similar Implementations

### Alerts Screen

- **Location:** `apps/native/features/alerts/screens/alerts-screen.tsx`
- **Relevance:** Current screen that lists user-created stock alerts.
- **Key patterns:** Preserve the current tab route and list structure while changing screen-level copy from alert management to rule management.

### Alert Form Screen

- **Location:** `apps/native/features/alerts/screens/stock-alert-form-screen.tsx`
- **Relevance:** Current create/edit/delete flow for stock price conditions.
- **Key patterns:** Keep the existing rule inputs: symbol, target price, direction, and optional label.

### Alerts Context

- **Location:** `apps/native/features/alerts/stock-alerts-context.tsx`
- **Relevance:** Current local alert state and CRUD actions.
- **Key patterns:** Use this as the current local model; future notification history should be separated from rule configuration.

### Stock Alerts Preview Section

- **Location:** `apps/native/features/alerts/components/stock-alerts-preview-section.tsx`
- **Relevance:** Current Home preview for stock alerts.
- **Key patterns:** The new notification preview should follow a similarly compact Home module and empty-state pattern.

### Home Screen

- **Location:** `apps/native/features/dashboard/screens/home-screen.tsx`
- **Relevance:** Target placement for the new notification preview section.
- **Key patterns:** Home composes feature sections inside a scroll view; the notification preview should be another composed section.

### Profile Screen

- **Location:** `apps/native/features/profile/screens/profile-screen.tsx`
- **Relevance:** Target placement for notification settings.
- **Key patterns:** Existing card-based profile layout should be extended with a notification settings card or section.
